import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { logAdminAction } from '@/lib/admin/audit';

export const dynamic = 'force-dynamic';

/**
 * Limpieza de tablas que crecen sin límite. Pensado para ejecutarse desde un
 * cron del VPS:
 *
 *   0 4 * * * curl -u $USER_ADMIN:$PASSWORD_ADMIN https://biocultor.com/api/admin/cleanup
 *
 * Está cubierto por la matcher de middleware (`/api/admin/:path*`), así que
 * requiere Basic Auth — no es un endpoint anónimo.
 */
export async function GET() {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [sessions, carts, attempts, buckets] = await Promise.all([
    // Sesiones expiradas (TTL 30 días, así que las que ya están < now van fuera)
    prisma.session.deleteMany({ where: { expiresAt: { lt: now } } }),
    // Carritos pendientes abandonados (cliente que inició checkout y no completó)
    prisma.pendingCart.deleteMany({ where: { createdAt: { lt: oneDayAgo } } }),
    // OTPs expirados sin verificar
    prisma.loginAttempt.deleteMany({ where: { expiresAt: { lt: now } } }),
    // Buckets de rate limit con ventana hace más de 30d (la mayoría son IPs únicas
    // que no volverán; para las que sí, el upsert siguiente las recrea sin coste)
    prisma.rateLimitBucket.deleteMany({ where: { windowStart: { lt: thirtyDaysAgo } } }),
  ]);

  const summary = {
    sessions: sessions.count,
    pendingCarts: carts.count,
    loginAttempts: attempts.count,
    rateLimitBuckets: buckets.count,
  };

  await logAdminAction('cleanup', summary);

  return NextResponse.json({ ok: true, ...summary, ranAt: now.toISOString() });
}
