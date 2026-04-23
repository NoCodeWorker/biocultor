# SEO programático, transaccional y GEO/IA para España

- Status: completed
- Date: 2026-04-21
- Owner: Codex

## Contexto

La ecommerce tenía base SEO mínima en home y producto, pero sin capa compartida, sin sitemap ni robots, sin clusters de intención y sin documentación de sistema. La estrategia no estaba preparada para motores tradicionales ni para motores de respuesta por IA.

## Objetivo

Construir una capa SEO escalable para España alrededor del té de humus de lombriz, con foco transaccional, editorial, GEO/IA y programático, manteniendo arquitectura headless y server-first.

## Plan ejecutado

1. Centralizar metadata, canonicals y structured data.
2. Reforzar home y producto con señales SEO de compra.
3. Crear dominio transaccional por intención de compra explícita.
4. Crear dominio programático por aplicación/cultivo.
5. Crear dominio informacional de apoyo para intención media.
6. Crear dominio GEO/IA por regiones relevantes de España.
7. Publicar sitemap y robots.
8. Documentar la decisión arquitectónica y el estado del sistema.

## Progreso real

- Completado: utilidades SEO compartidas en `lib/seo.ts` y `lib/site-config.ts`.
- Completado: dominio transaccional en `/comprar-te-de-humus-de-lombriz/*`.
- Completado: cluster programático en `/te-de-humus-de-lombriz/*`.
- Completado: cluster editorial en `/aprende/*`.
- Completado: dominio GEO/IA en `/espana/*`.
- Completado: persistencia SEO en `SeoPage` con lectura por overrides desde DB.
- Completado: seed SEO idempotente en `/api/seed-seo` y `npm run seed:seo`.
- Completado: UI editorial en `/admin/seo` para editar inventario SEO persistente.
- Completado: priorización editorial con `targetKeyword`, `workflowStatus`, `priorityScore` y cola de ejecución en admin.
- Completado: refinado inicial de las landings transaccionales prioritarias y resincronización del inventario persistente.
- Completado: mejora de metadata y JSON-LD en layout, home y producto.
- Completado: `app/sitemap.ts` y `app/robots.ts`.
- Completado: corrección de tipado Stripe y corrección funcional de selección de modo de uso por variante.
- Completado: documentación base y ADR.

## Riesgos y seguimiento

- El dominio canónico fijado para fallback es `https://biocultor.com`; conviene reflejarlo también en `NEXT_PUBLIC_APP_URL` en producción.
- Las tres capas ya pueden recibir overrides desde DB y editarse desde `/admin/seo`, pero aún falta control de versiones/editorial workflow.
- Falta integrar analítica de rendimiento orgánico para priorizar expansión por intención.
