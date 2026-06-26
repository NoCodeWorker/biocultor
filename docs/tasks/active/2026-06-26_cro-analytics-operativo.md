# CRO Analytics Operativo

## Objective

Implementar una capa interna de medición ecommerce que convierta los eventos críticos de compra en datos operativos visibles en admin, para detectar fricción, priorizar mejoras CRO y evitar decisiones basadas solo en percepción visual.

## Context

El sistema de compra ya tiene sincronización crítica entre ficha, sticky cart, carrito y checkout, además de smoke E2E móvil. El siguiente salto de calidad es cerrar el ciclo de aprendizaje: capturar eventos propios, agregarlos y mostrarlos en un panel de embudo accionable.

La prioridad no es añadir más elementos comerciales, sino medir dónde se pierde intención de compra:

- ficha vista
- formato seleccionado
- add to cart
- inicio checkout
- error checkout
- compra completada
- clics de contacto
- interacción con envío gratuito
- fricción por stock/formato/dispositivo

## Affected systems

- `lib/ecommerce-events.ts`
- componentes de compra y contacto
- `app/api/...` para ingestión de eventos
- Prisma schema y migraciones
- `/admin/analytics` o `/admin/marketing`
- checkout/webhook Stripe
- privacidad/cookies si se captura información persistente
- tests E2E y validaciones de producción

## Implementation plan

### Phase 1 — Event contract

- [x] Definir contrato único `EcommerceTrackingEvent`.
- [x] Definir lista cerrada inicial de eventos:
  - [x] `view_item`
  - [x] `select_item`
  - [x] `add_to_cart`
  - [x] `begin_checkout`
  - [x] `checkout_error`
  - [x] `purchase`
  - [x] `select_promotion`
  - [x] `contact_click`
  - [x] `newsletter_signup`
- [x] Definir payload mínimo:
  - [x] `eventName`
  - [x] `sessionId`
  - [x] `productSlug`
  - [x] `variantSku`
  - [x] `variantSize`
  - [x] `value`
  - [x] `currency`
  - [x] `device`
  - [x] `sourcePath`
  - [x] `referrer`
  - [x] `interactionSource`
  - [x] `createdAt`
- [x] Separar datos permitidos de datos prohibidos.
- [x] Evitar capturar PII salvo que sea estrictamente necesario.
- [x] Documentar el contrato en `docs/api.md` o task final.

### Phase 2 — Persistence model

- [x] Añadir modelo Prisma `EcommerceEvent`.
- [x] Añadir índices:
  - [x] `eventName + createdAt`
  - [x] `sessionId + createdAt`
  - [x] `productSlug + createdAt`
  - [x] `variantSku + createdAt`
- [x] Crear migración incremental.
- [ ] Definir retención de datos.
- [ ] Confirmar que la migración no bloquea producción.
- [ ] Validar rollback de migración.

### Phase 3 — Ingestion API

- [x] Crear endpoint `POST /api/events/ecommerce`.
- [x] Validar body con schema estricto.
- [x] Añadir rate limit por IP/session.
- [x] Sanitizar strings y tamaños máximos.
- [x] Ignorar eventos inválidos sin romper UX.
- [x] Devolver respuesta rápida y estable.
- [x] Añadir logging estructurado solo para errores relevantes.
- [x] Evitar dependencia de cookies no necesarias si el usuario rechaza analítica.

### Phase 4 — Client tracking bridge

- [x] Extender `trackEcommerceEvent` para enviar evento al backend.
- [x] Mantener compatibilidad con `window.gtag`.
- [x] Mantener `CustomEvent` local para E2E.
- [x] Implementar envío no bloqueante:
  - [x] preferir `navigator.sendBeacon` cuando aplique
  - [x] fallback a `fetch` con `keepalive`
- [x] No bloquear navegación a Stripe.
- [x] No romper si el endpoint falla.
- [x] Añadir `sessionId` anónimo persistente.
- [x] Respetar consentimiento de cookies/analítica.

### Phase 5 — Purchase event from Stripe/webhook

- [x] Emitir/persistir `purchase` desde webhook cuando `checkout.session.completed`.
- [x] Relacionar compra con `pendingCartId` cuando exista.
- [x] Guardar `orderNumber` si está disponible.
- [x] Guardar valor total y variantes compradas.
- [x] Mantener idempotencia: no duplicar purchase si Stripe reintenta.
- [x] Validar que no se rompe creación de pedido.

### Phase 6 — Admin funnel panel

- [x] Diseñar módulo en `/admin/analytics` o `/admin/marketing`.
- [x] Mostrar rango temporal:
  - [x] 24h
  - [x] 7 días
  - [x] 30 días
- [x] Mostrar KPIs:
  - [x] vistas de producto
  - [x] selección de formato
  - [x] add to cart
  - [x] begin checkout
  - [x] purchases
  - [x] checkout errors
- [x] Mostrar tasas:
  - [x] vista → selección
  - [x] selección → carrito
  - [x] carrito → checkout
  - [x] checkout → compra
- [x] Desglosar por producto.
- [x] Desglosar por formato.
- [x] Desglosar por dispositivo.
- [x] Mostrar top fricciones:
  - [x] formatos con muchas selecciones y bajo add-to-cart
  - [x] alto checkout_error
  - [ ] productos con mucho tráfico y baja conversión
  - [ ] demanda en formatos sin stock
- [x] Mantener UI simple, no convertirlo en dashboard ruidoso.

### Phase 7 — CRO alerts

- [x] Definir reglas iniciales:
  - [x] `checkout_error_rate > threshold`
  - [x] `select_item alto + add_to_cart bajo`
  - [ ] `stock 0 + selecciones recientes`
  - [x] `mobile_conversion << desktop_conversion`
- [x] Mostrar alertas en admin.
- [x] No enviar emails/externos en primera iteración salvo necesidad real.
- [ ] Documentar umbrales como ajustables.

### Phase 8 — E2E and smoke coverage

- [ ] Extender smoke móvil existente para confirmar que se dispara `select_item`.
- [x] Confirmar que `add_to_cart` llega al backend en entorno controlado.
- [x] Confirmar que checkout interceptado no bloquea tracking.
- [x] Añadir test unitario de contrato de ingestión válido.
- [x] Añadir test unitario de rechazo de eventos inválidos.
- [x] Añadir test unitario de dedupe para `purchase`.
- [x] Añadir test de consentimiento:
  - [x] con analítica permitida
  - [x] con analítica rechazada
- [ ] No probar pago real en E2E automático.

### Phase 9 — Documentation and operations

- [x] Actualizar `docs/architecture.md` con el flujo de eventos.
- [x] Actualizar `docs/database.md` con modelo e índices.
- [x] Actualizar `docs/api.md` con endpoint de ingestión.
- [ ] Crear task completada al terminar implementación.
- [ ] Añadir rollback claro.
- [ ] Registrar limitaciones conocidas.

## Acceptance criteria

- [ ] Los eventos críticos se capturan sin bloquear UX.
- [ ] GA4 sigue funcionando igual.
- [ ] El backend guarda eventos válidos y rechaza payloads inválidos.
- [ ] El panel admin muestra embudo por rango temporal.
- [ ] El panel permite identificar al menos tres fricciones reales:
  - [ ] por producto
  - [ ] por formato
  - [ ] por dispositivo
- [ ] El webhook registra `purchase` de forma idempotente.
- [ ] No se captura PII innecesaria.
- [x] Lint pasa.
- [x] Typecheck pasa.
- [x] Build pasa.
- [ ] Smoke E2E móvil pasa contra producción tras deploy.

## Risks

- [ ] Exceso de tracking puede generar ruido operativo.
- [ ] Captura de datos sin respetar consentimiento puede crear riesgo legal.
- [ ] Guardar demasiados eventos sin retención puede crecer en coste.
- [ ] Enviar tracking de forma síncrona puede degradar conversión.
- [ ] Mal modelado de `sessionId` puede producir métricas engañosas.
- [ ] Purchase desde webhook debe ser idempotente para evitar ventas duplicadas en métricas.

## Decisions

- [ ] Usar tracking interno como complemento de GA4, no como sustituto inicial.
- [ ] Mantener schema cerrado y pequeño.
- [ ] Preferir eventos agregables sobre datos personales.
- [ ] No introducir herramientas externas nuevas en primera iteración.
- [ ] No bloquear navegación a Stripe por fallo de tracking.
- [ ] Priorizar visibilidad accionable frente a dashboard complejo.

## Validation checklist

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm run test:unit`
- [ ] `npm run test:e2e:mobile-purchase` contra producción tras deploy
- [ ] Verificar `POST /api/events/ecommerce` con payload válido.
- [ ] Verificar `POST /api/events/ecommerce` con payload inválido.
- [ ] Verificar panel admin con datos reales o semilla controlada.
- [ ] Verificar logs del VPS tras deploy.
- [ ] Verificar smoke móvil contra `https://biocultor.com`.

## Rollback considerations

- [ ] Revertir commit de frontend tracking bridge si genera errores UX.
- [ ] Desactivar ingestión con flag si el endpoint genera carga.
- [ ] Mantener migración reversible o no destructiva.
- [ ] Si el panel falla, ocultar solo el módulo admin sin afectar compra.
- [ ] Si el webhook falla por tracking, aislar `purchase` analytics para que la creación de pedido siga siendo prioritaria.

## Out of scope for first iteration

- [ ] A/B testing automático.
- [ ] Integración con herramientas externas de heatmaps.
- [ ] Modelos predictivos.
- [ ] Automatización de campañas.
- [ ] Cambios de pricing.
- [ ] Pago real automatizado en tests.
