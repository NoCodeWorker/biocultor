# Fase 4: autoridad externa y prueba

## Objective

Crear la base pública de autoridad para casos, metodología y recursos descargables sin inventar casos reales ni prometer resultados cerrados.

## Context

El roadmap SEO/GEO/AIO pide pasar de publicar landings a construir prueba y autoridad externa. ADR-002 obliga a trabajar con evidencia identificable, límites honestos y trazabilidad.

## Affected systems

- `lib/authority-assets.ts`
- `/casos`
- `/casos/[slug]`
- `/recursos/[slug]`
- `/servicios`
- `app/sitemap.ts`
- `components/Navbar.tsx`
- `components/Footer.tsx`

## Implementation plan

1. Crear datos tipados para casos documentables, descargables y referencias.
2. Publicar hub `/casos`.
3. Publicar fichas de caso por segmento premium.
4. Publicar recursos operativos reutilizables.
5. Enlazar desde navegación, footer, servicios y sitemap.
6. Documentar límites y pendientes de datos reales.

## Blockers

- No hay todavía fotos, fechas ni mediciones reales de casos de cliente.
- No se deben fabricar "antes/después" ni resultados observacionales.

## Decisions

- Las fichas se publican como casos documentables o en captación, no como casos cerrados.
- Cada ficha exige evidencia a recoger antes de convertirse en prueba comercial.
- Los recursos se publican como páginas HTML indexables en lugar de PDFs para facilitar SEO, GEO y AIO.

## Risks

- Publicar casos sin datos reales degradaría confianza y violaría ADR-002.
- Recursos demasiado genéricos podrían no generar leads si no se conectan con servicios.
- Falta de imágenes reales limita el impacto CRO hasta que existan proyectos documentados.

## Validation checklist

- `npx tsc --noEmit`
- ESLint focalizado en rutas y componentes tocados.
- Confirmar que sitemap incluye `/casos` y `/recursos/*`.
- Confirmar que `/servicios` enlaza el hub de casos.

## Rollback considerations

El rollback es simple: retirar rutas `/casos`, `/recursos`, enlaces públicos y entradas del sitemap. No hay migraciones ni cambios de base de datos.
