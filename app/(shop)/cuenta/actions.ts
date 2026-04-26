'use server';

import { randomInt } from 'crypto';
import { headers } from 'next/headers';
import prisma from '@/lib/db';
import { sendLoginCodeEmail } from '@/lib/resend';
import { setCustomerSession, clearCustomerSession } from '@/lib/session';
import { checkRateLimit, getClientIp, resetRateLimit } from '@/lib/rate-limit';

export type ActionState = {
  success?: boolean;
  error?: string;
  step?: 'EMAIL' | 'CODE' | 'LOGGED_IN';
  email?: string;
};

// `Math.random()` no es criptográficamente seguro — su salida es predecible
// si un atacante ve suficientes muestras (mismo seed PRNG). Para un OTP
// usamos `crypto.randomInt`, que tira de la fuente CSPRNG del SO.
function generateOTP() {
  return randomInt(100_000, 1_000_000).toString();
}

function minutesFromSeconds(s: number) {
  return Math.max(1, Math.ceil(s / 60));
}

export async function requestLoginCode(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return { error: 'Por favor, introduce un correo electrónico válido.', step: 'EMAIL' };
  }

  // Rate limit por IP: 5 peticiones cada 15 min. Bloquea atacante que intenta
  // spam masivo cambiando emails desde la misma máquina.
  const ip = getClientIp(await headers());
  const ipLimit = await checkRateLimit(`otp-req:ip:${ip}`, 5, 15 * 60_000);
  if (!ipLimit.ok) {
    return {
      error: `Demasiadas peticiones desde tu red. Inténtalo en ${minutesFromSeconds(ipLimit.retryAfterSeconds)} min.`,
      step: 'EMAIL',
    };
  }

  // Rate limit por email: 3 códigos cada 15 min. Evita que alguien pida códigos
  // a tu email constantemente — Resend cobra por envío y la reputación cae.
  const emailLimit = await checkRateLimit(`otp-req:email:${email}`, 3, 15 * 60_000);
  if (!emailLimit.ok) {
    return {
      error: `Has pedido varios códigos seguidos. Espera ${minutesFromSeconds(emailLimit.retryAfterSeconds)} min antes de pedir otro.`,
      step: 'EMAIL',
    };
  }

  // Verificar si el cliente existe. Si no, le podemos dar error o crearlo?
  // Normalmente solo clientes que ya han comprado deberían entrar, pero podemos crearlo por si acaso
  // O podemos decir: "Si tienes pedidos, te llegará un código".

  let customer = await prisma.customer.findUnique({ where: { email } });

  // Si no existe, podemos detenerlo o simplemente hacer un "upsert" sin nombre
  // Pero para evitar spam, solo enviamos si existe o lo creamos vacío
  if (!customer) {
    // Lo creamos vacío para poder guardar el OTP
    customer = await prisma.customer.create({
      data: {
        email,
        name: 'Cliente',
      }
    });
  }

  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      loginCode: code,
      loginCodeExpiresAt: expiresAt,
    }
  });

  await sendLoginCodeEmail(email, code);

  // Cuando se pide un código nuevo, reseteamos el bucket de verify para que
  // el usuario legítimo no arrastre intentos fallidos del código viejo.
  await resetRateLimit(`otp-verify:email:${email}`);

  return { success: true, step: 'CODE', email };
}

export async function verifyLoginCode(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get('email') as string;
  const code = formData.get('code') as string;

  if (!email || !code) return { error: 'Falta código o email', step: 'CODE', email };

  const normalizedEmail = email.trim().toLowerCase();

  // Rate limit por email: máx 5 intentos de OTP cada 15 min. 6 dígitos = 10⁶
  // posibilidades: con este límite, brute force tarda años. Reseteamos al
  // pedir un código nuevo (en requestLoginCode) y al acertar (más abajo).
  const verifyLimit = await checkRateLimit(`otp-verify:email:${normalizedEmail}`, 5, 15 * 60_000);
  if (!verifyLimit.ok) {
    return {
      error: `Demasiados intentos. Espera ${minutesFromSeconds(verifyLimit.retryAfterSeconds)} min y pide un código nuevo.`,
      step: 'EMAIL',
    };
  }

  const customer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });

  if (!customer || !customer.loginCode || customer.loginCode !== code.trim()) {
    return { error: 'Código incorrecto. Por favor, inténtalo de nuevo.', step: 'CODE', email };
  }

  if (customer.loginCodeExpiresAt && new Date() > customer.loginCodeExpiresAt) {
    return { error: 'El código ha caducado. Vuelve a solicitar uno nuevo.', step: 'EMAIL' };
  }

  // OTP válido
  // Limpiar el código
  await prisma.customer.update({
    where: { id: customer.id },
    data: { loginCode: null, loginCodeExpiresAt: null },
  });

  // Reset de buckets: el usuario ya entró, no queremos que mañana le bloqueen
  // por intentos fallidos de hoy.
  await resetRateLimit(`otp-verify:email:${normalizedEmail}`);

  // Establecer sesión
  await setCustomerSession(customer.id);

  return { success: true, step: 'LOGGED_IN' };
}

export async function logout(): Promise<void> {
  await clearCustomerSession();
}
