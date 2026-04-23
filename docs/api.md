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
