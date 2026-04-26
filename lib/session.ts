import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import prisma from '@/lib/db';

const SESSION_COOKIE_NAME = 'biocultor_session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

// La cookie guarda un token aleatorio de 256 bits, no el customerId. El token
// se valida contra la tabla Session en cada request: si el registro no existe
// o ha expirado, no hay sesión. Así, aunque un customerId se filtre por logs,
// CSV, error pages, etc., no es suficiente para suplantar a nadie.

export async function setCustomerSession(customerId: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: { token, customerId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function getCustomerSession(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return undefined;

  const session = await prisma.session.findUnique({
    where: { token },
    select: { customerId: true, expiresAt: true },
  });
  if (!session) return undefined;

  if (session.expiresAt.getTime() < Date.now()) {
    // Limpieza best-effort. Ignoramos el error si otra request la borró antes.
    prisma.session.deleteMany({ where: { token } }).catch(() => {});
    return undefined;
  }

  return session.customerId;
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } }).catch(() => {});
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
