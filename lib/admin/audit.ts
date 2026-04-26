import prisma from '@/lib/db';

/**
 * Registra una acción del panel admin para tener trazabilidad.
 *
 * El panel usa Basic Auth con un solo usuario, así que no sabemos QUIÉN
 * ejecutó la acción — pero sí queda QUÉ, CUÁNDO y SOBRE QUÉ entidad. Es
 * suficiente para investigar incidencias ("¿por qué ese pedido se reembolsó
 * un martes a las 03:00?").
 *
 * Best-effort: si la inserción falla, no bloqueamos la acción de admin. El
 * audit log no debe ser nunca un bloqueador de la operación principal.
 */
export async function logAdminAction(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<void> {
  try {
    await prisma.adminAction.create({
      data: {
        action,
        payload: JSON.stringify(payload),
      },
    });
  } catch (err) {
    console.error(`[audit] Failed to log admin action "${action}":`, err);
  }
}
