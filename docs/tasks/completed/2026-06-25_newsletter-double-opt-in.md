# Newsletter con doble opt-in

## Objective

Convertir la captación de newsletter en un canal funcional, medible y conforme con consentimiento explícito.

## Context

La ecommerce tenía Resend para correos transaccionales y un placeholder de campañas en administración, pero no existían formulario, persistencia ni flujos de confirmación y baja.

## Affected systems

- Footer público y páginas de confirmación/baja.
- API de newsletter.
- Prisma y migraciones.
- Resend.
- Rate limiting persistente.
- GA4 y panel de marketing.
- Política de privacidad y teléfono corporativo.

## Implementation

- Captación responsive desde el footer.
- Consentimiento explícito y doble opt-in.
- Estados `PENDING`, `ACTIVE` y `UNSUBSCRIBED`.
- Tokens aleatorios almacenados únicamente como hash SHA-256.
- Confirmación y correo de bienvenida mediante Resend.
- Baja explícita para evitar activación accidental por scanners de correo.
- Rate limiting por IP y email, honeypot y respuesta anti-enumeración.
- Atribución de URL, query y referrer.
- Eventos `newsletter_signup` y `newsletter_confirmed`.
- Métricas agregadas en el panel de marketing.
- Teléfono corporativo centralizado en `+34 601 144 399`.

## Risks

- Las campañas masivas no se implementan todavía; requieren calendario, segmentos y política editorial.
- La entrega de correo depende de la configuración y reputación del dominio en Resend.

## Validation checklist

- Prisma Client generado y migración revisada.
- ESLint y TypeScript sin errores.
- Build de producción correcto.
- Flujo de alta, confirmación y baja probado.
- Migración aplicada automáticamente con `prisma migrate deploy`.

## Rollback considerations

Retirar formulario, rutas y correos. La tabla puede conservarse sin uso para no destruir consentimientos ni trazabilidad; eliminarla requeriría una migración destructiva separada.
