import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'biocultor_session';

export async function setCustomerSession(customerId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, customerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
}

export async function getCustomerSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
