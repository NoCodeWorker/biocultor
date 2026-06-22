# CRO SEO GEO AIO dashboard audit

## Objective

Reflejar en el dashboard una auditoría profesional y accionable de CRO, SEO, GEO, AIO y contrato visual para que el inventario editorial de Biocultor pueda mejorarse desde una sola superficie operativa.

## Context

El proyecto ya tenía contrato editorial, sincronización con dashboard y roadmap de imágenes. Faltaba una capa de lectura ejecutiva que convirtiera esas reglas en métricas visibles y cola de trabajo priorizada.

## Affected Systems

- `lib/admin/content-intelligence.ts`
- `components/admin/GrowthIntelligencePanel.tsx`
- `/admin`
- `/admin/seo`
- `Post`
- `SeoPage`
- contrato editorial de imágenes y payloads semánticos
- `docs/decisions/ADR-007-growth-intelligence-dashboard.md`

## Implementation Plan

1. Crear un motor servidor de auditoría que derive señales desde `Post` y `SeoPage`.
2. Puntuar cinco pilares: CRO, SEO, GEO, AIO e imagen.
3. Medir contrato visual: imagen asignada, WebP, uploads manuales, alt débil e imágenes genéricas.
4. Centralizar la presentación en `GrowthIntelligencePanel`.
5. Mostrar la lectura ejecutiva en `/admin`.
6. Mostrar la lectura editorial en `/admin/seo`.
7. Documentar la decisión en ADR.
8. Validar TypeScript.

## Decisions

- No se crea tabla nueva: las señales se calculan desde contenido persistente.
- La puntuación es heurística interna, útil para operación y priorización.
- Las herramientas externas como GSC o PageSpeed complementan, pero no bloquean la auditoría interna.
- Los enlaces de la cola priorizada abren los editores existentes para evitar inventarios paralelos.

## Risks

- Las puntuaciones no sustituyen análisis humano ni datos reales de conversión.
- Las reglas deben revisarse si cambia el contrato editorial.
- El análisis de imagen detecta asignación, formato y genericidad, pero no valida calidad visual real.

## Validation Checklist

- `npx tsc --noEmit` debe pasar.
- `/admin` debe mostrar CRO, SEO, GEO, AIO e Imagen.
- `/admin` debe mostrar el resumen de contrato visual.
- `/admin/seo` debe mostrar puntuaciones por pilar junto al editor.
- La cola priorizada debe enlazar a `/admin/blog` o `/admin/seo`.
- No se modifica esquema de base de datos.

## Rollback Considerations

Rollback simple:

- eliminar `lib/admin/content-intelligence.ts`;
- revertir los bloques añadidos en `/admin` y `/admin/seo`;
- eliminar ADR-007 y este task.

No hay migraciones ni cambios de datos.
