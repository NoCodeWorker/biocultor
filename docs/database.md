# Database

## Estado actual

La estrategia SEO ya introduce cambios de esquema en Prisma mediante una nueva entidad persistente para páginas SEO.

## Modelos relevantes

- `Product`: entidad comercial principal.
- `Variant`: formatos y precios usados para la ficha transaccional.
- `Post`: modelo existente para contenido, todavía no conectado a las nuevas landings estáticas.
- `SeoPage`: inventario persistente de páginas SEO con soporte para transaccional, programático, informacional y GEO/IA.
  Incluye además `targetKeyword`, `workflowStatus`, `priorityScore` y `notes` para gobierno editorial.

## Decisión

Se adopta un modelo híbrido:

- `lib/seo-content.ts` sigue siendo la fuente curada base.
- `SeoPage` permite overrides persistidos sin romper build ni rutas existentes.
- `lib/seo-store.ts` resuelve la combinación entre contenido base y base de datos.
- Prisma Client usa su output estándar en `node_modules/.prisma/client`; runtime, tipos y scripts lo consumen mediante `@prisma/client`.

## EcommerceEvent

`EcommerceEvent` registra eventos agregables del embudo ecommerce para análisis interno de CRO.

Campos principales:

- `eventName`: evento del embudo.
- `sessionId`: sesión anónima, no PII.
- `productSlug`, `variantSku`, `variantSize`: contexto comercial.
- `value`, `currency`, `quantity`: magnitudes agregables.
- `device`, `sourcePath`, `referrer`, `interactionSource`: contexto de navegación.
- `orderNumber`, `stripeSession`, `dedupeKey`: conexión idempotente con compra cuando el evento viene del webhook.
- `metadataJson`: payload complementario acotado.

Índices:

- `eventName + createdAt`
- `sessionId + createdAt`
- `productSlug + createdAt`
- `variantSku + createdAt`
- `createdAt`

La tabla está pensada para reporting operativo, no para almacenar datos personales ni sustituir pedidos, clientes o CRM.

## Próximo paso recomendado

Si Biocultor necesita escalar a decenas o cientos de URLs por cultivo, provincia o caso de uso, conviene:

1. Añadir una UI editorial para gestionar `SeoPage`.
2. Separar payloads complejos en tablas específicas si la edición se vuelve frecuente.
3. Añadir histórico o versionado editorial si varias personas van a tocar el inventario.
