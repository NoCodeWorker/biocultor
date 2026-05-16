/**
 * lib/alert.ts
 *
 * Helper centralizado de alertas críticas.
 *
 * Propósito:
 *   Sustituir los `console.error` silenciosos en los bloques try-catch de
 *   producción por un sistema que:
 *   1. Loguea con contexto enriquecido (timestamp, contexto, error code).
 *   2. Puede extenderse a Sentry / Better Stack / Slack sin tocar los call-sites.
 *
 * Uso:
 *   import { alertCritical } from '@/lib/alert';
 *   try { ... } catch (error) { alertCritical('ProductPage.generateMetadata', error); }
 *
 * Para integrar Sentry en el futuro, añadir aquí:
 *   import * as Sentry from '@sentry/nextjs';
 *   Sentry.captureException(error, { tags: { context } });
 */

type AlertSeverity = 'critical' | 'warning' | 'info';

interface AlertOptions {
  /** Datos adicionales para incluir en el log (ids, slugs, etc.) */
  extra?: Record<string, unknown>;
  severity?: AlertSeverity;
}

/**
 * Reporta un error crítico de producción.
 * En el futuro, aquí se integrará Sentry o un webhook externo.
 */
export function alertCritical(
  context: string,
  error: unknown,
  options: AlertOptions = {}
): void {
  const { extra = {}, severity = 'critical' } = options;

  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = (error as any)?.code ?? 'UNKNOWN';

  // Structured log — legible en cualquier sistema de logs (PM2, Docker, Railway)
  console.error(
    JSON.stringify({
      level: severity,
      timestamp,
      context,
      message: errorMessage,
      errorCode,
      ...extra,
    })
  );

  // ── Extensión futura: Sentry ────────────────────────────────────────────
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureException(error, { tags: { context, errorCode }, extra });
  // }

  // ── Extensión futura: Slack webhook ────────────────────────────────────
  // if (process.env.SLACK_ALERT_WEBHOOK && severity === 'critical') {
  //   fetch(process.env.SLACK_ALERT_WEBHOOK, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       text: `🔴 *${context}*\n${errorMessage}\n_${timestamp}_`,
  //     }),
  //   }).catch(() => {}); // fire-and-forget, no bloquear el response
  // }
}

/**
 * Reporta una advertencia no crítica (DB no disponible, fallback activado, etc.)
 */
export function alertWarning(
  context: string,
  message: string,
  extra?: Record<string, unknown>
): void {
  console.warn(
    JSON.stringify({
      level: 'warning',
      timestamp: new Date().toISOString(),
      context,
      message,
      ...extra,
    })
  );
}
