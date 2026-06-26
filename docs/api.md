# API

## Impacto de esta iteración

La estrategia sigue apoyándose en rutas App Router renderizadas en servidor y metadata nativa de Next.js, pero ahora añade un endpoint operativo de seed SEO.

## Endpoints existentes ajustados

- `app/api/checkout/route.ts`
- `app/api/seed-seo/route.ts`
- `app/api/webhook/route.ts`

## Cambio aplicado

Se actualizó la versión tipada de Stripe API a `2026-03-25.dahlia` para mantener compatibilidad con el SDK instalado y permitir validación TypeScript del proyecto.

## Notas

El SEO comercial sigue desacoplado de checkout y webhook. Esta separación evita que la capa de adquisición dependa de lógica transaccional.

El seed SEO también puede ejecutarse localmente mediante `npm run seed:seo`.

## Ecommerce analytics

### `POST /api/events/ecommerce`

Endpoint interno para persistir eventos críticos del embudo ecommerce sin depender exclusivamente de GA4.

Eventos admitidos:

- `view_item`
- `select_item`
- `add_to_cart`
- `begin_checkout`
- `checkout_error`
- `purchase`
- `select_promotion`
- `contact_click`
- `newsletter_signup`
- `newsletter_confirmed`

Contrato mínimo:

- `eventName`: nombre de evento permitido.
- `sessionId`: identificador anónimo de sesión.
- `items`: hasta 8 items con `item_id`, `item_name`, `item_variant`, `price`, `quantity`.
- `value`: valor monetario opcional.
- `currency`: actualmente `EUR`.
- `productSlug`, `device`, `sourcePath`, `referrer`, `interactionSource`: contexto operativo opcional.

Reglas:

- El endpoint valida schema y tamaños máximos.
- Aplica rate limit por IP.
- No requiere ni debe recibir PII.
- El frontend lo llama de forma no bloqueante mediante `sendBeacon` o `fetch keepalive`.
- El webhook de Stripe registra `purchase` server-side con `dedupeKey` idempotente.
