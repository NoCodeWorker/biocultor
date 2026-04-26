import prisma from '@/lib/db';

export type RateLimitResult =
  | { ok: true; count: number }
  | { ok: false; count: number; retryAfterSeconds: number };

/**
 * Rate limit por clave + ventana deslizante simplificada (fixed-window con
 * reset on-read). Acepta hasta `max` requests por `windowMs`. Si se supera,
 * devuelve `{ ok: false, retryAfterSeconds }`.
 *
 * Trade-offs conocidos:
 *  - Race entre requests concurrentes: dos pueden incrementar a la vez y
 *    superar el límite por 1-N. Aceptable: el ataque sigue siendo bloqueado,
 *    sólo escapa un pequeño delta proporcional al paralelismo.
 *  - Persiste en DB para sobrevivir redeploy. Si tuviéramos Redis lo movería
 *    allí; con un único contenedor Postgres el coste es < 5 ms por request.
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = new Date();
  const windowCutoff = new Date(now.getTime() - windowMs);

  const bucket = await prisma.rateLimitBucket.upsert({
    where: { key },
    create: { key, count: 1, windowStart: now },
    update: { count: { increment: 1 } },
  });

  // Si el bucket viene de una ventana antigua, lo reseteamos a 1.
  if (bucket.windowStart.getTime() < windowCutoff.getTime()) {
    const fresh = await prisma.rateLimitBucket.update({
      where: { key },
      data: { count: 1, windowStart: now },
    });
    return { ok: true, count: fresh.count };
  }

  if (bucket.count > max) {
    const retryAfterMs = bucket.windowStart.getTime() + windowMs - now.getTime();
    return {
      ok: false,
      count: bucket.count,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  return { ok: true, count: bucket.count };
}

/**
 * Borra un bucket. Útil para resetear el contador de intentos de OTP cuando
 * el usuario acierta — si no, le penalizaríamos en el siguiente login por
 * los fallos previos.
 */
export async function resetRateLimit(key: string): Promise<void> {
  await prisma.rateLimitBucket.deleteMany({ where: { key } }).catch(() => {});
}

/**
 * Extrae la IP del cliente real respetando la cadena de proxies (Traefik en
 * nuestro caso pone X-Forwarded-For). El primer valor del header es el cliente
 * original según RFC 7239.
 */
export function getClientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return headers.get('x-real-ip') ?? 'unknown';
}
