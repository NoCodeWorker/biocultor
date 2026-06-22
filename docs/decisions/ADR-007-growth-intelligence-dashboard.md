# ADR-007: Growth Intelligence Dashboard

## Status

Accepted

## Context

Biocultor necesita auditar CRO, SEO, GEO, AIO y contrato visual de forma continua. Hasta ahora el dashboard mostraba inventario editorial y métricas comerciales, pero no traducía la calidad orgánica del contenido en señales operativas visibles.

El riesgo era convertir la auditoría en un documento externo: útil una vez, pero separado del flujo real de edición de imágenes, landings, servicios y artículos.

## Decision

Crear un módulo servidor de inteligencia editorial:

- `lib/admin/content-intelligence.ts`

El módulo calcula puntuaciones por pilar desde las fuentes persistentes:

- `Post` para artículos `/aprende`;
- `SeoPage` para landings, servicios y GEO;
- `payloadJson`, `faqJson` y `summaryJson` para señales AIO/GEO;
- campos de imagen y alt text para el contrato visual.

El resultado se muestra en:

- `/admin`: lectura ejecutiva con puntuaciones, contrato visual y cola priorizada;
- `/admin/seo`: lectura editorial dentro del editor donde se corrigen las piezas.

## Alternatives Considered

- Mantener la auditoría en documentación: descartado porque no guía la operación diaria.
- Crear una tabla nueva de métricas: descartado por complejidad prematura; las señales actuales se pueden derivar de contenido persistente.
- Usar solo GSC/PageSpeed: descartado como dependencia exclusiva porque puede fallar por credenciales, cuota o falta de datos.

## Tradeoffs

- Las puntuaciones son heurísticas internas, no métricas de Google ni garantía de ranking.
- El sistema favorece señales accionables sobre precisión estadística.
- Si cambian los contratos editoriales, las reglas del módulo deben actualizarse.

## Consequences

- CRO, SEO, GEO, AIO e imágenes quedan visibles en el dashboard.
- Los problemas de imagen genérica, alt débil, FAQ ausente o resumen semántico incompleto aparecen como trabajo operativo.
- La auditoría se puede mejorar incrementalmente sin cambiar esquema de base de datos.
- Las métricas externas siguen siendo deseables, pero ya no bloquean el control de calidad interno.
