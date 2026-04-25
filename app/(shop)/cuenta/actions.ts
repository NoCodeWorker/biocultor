'use server';

import prisma from '@/lib/db';
import { sendLoginCodeEmail } from '@/lib/resend';
import { setCustomerSession, clearCustomerSession } from '@/lib/session';

export type ActionState = {
  success?: boolean;
  error?: string;
  step?: 'EMAIL' | 'CODE';
  email?: string;
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

export async function requestLoginCode(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  
  if (!email || !email.includes('@')) {
    return { error: 'Por favor, introduce un correo electrónico válido.', step: 'EMAIL' };
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

  return { success: true, step: 'CODE', email };
}

export async function verifyLoginCode(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get('email') as string;
  const code = formData.get('code') as string;

  if (!email || !code) return { error: 'Falta código o email', step: 'CODE', email };

  const customer = await prisma.customer.findUnique({ where: { email } });

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

  // Establecer sesión
  await setCustomerSession(customer.id);

  return { success: true, step: 'LOGGED_IN' };
}

export async function logout(): Promise<void> {
  await clearCustomerSession();
}
