# Fase 3: landings GEO premium de servicios

## Objective

Crear landings locales de servicio para búsquedas de alto valor en municipios premium, sin convertirlas en plantillas clonadas ni diluir la ecommerce.

## Context

El roadmap orgánico 2026-06-18 define una Fase 3 GEO premium para dominar búsquedas locales: Pozuelo, La Moraleja, Las Rozas, Boadilla del Monte, Majadahonda, Aravaca, Toledo e Illescas/Seseña.

## Affected systems

- `lib/premium-service-pages.ts`
- `app/(shop)/servicios/[slug]/page.tsx`
- `app/(shop)/servicios/page.tsx`
- `app/sitemap.ts`
- `docs/gsc-organic-growth-roadmap-2026-06-18.md`

## Implementation plan

1. Añadir `premiumGeoServicePages` con ocho landings locales.
2. Mantener las landings dentro de `/servicios/[slug]` para preservar intención de lead.
3. Añadir justificación local no duplicada por zona.
4. Exponer las rutas desde una sección específica en `/servicios`.
5. Reutilizar sitemap dinámico basado en `premiumServicePages`.
6. Validar contenido mínimo, tipos, lint, build y HTTP local.

## Blockers

- Ninguno localmente.
- Push y deploy requieren autorización explícita del usuario.

## Decisions

- No se usa `/espana` porque las páginas no son regionales de producto, sino landings locales de servicio.
- Cada página conserva CTA principal a presupuesto y CTA secundario a producto para no canibalizar ecommerce.
- Las afirmaciones locales se formulan como contexto operativo, no como promesas absolutas.

## Risks

- La indexación local requerirá señales externas y casos reales por zona en Fase 4.
- Algunas zonas pueden necesitar fotos propias para mejorar conversión y autoridad.
- Si Google interpreta exceso de similitud, convendrá enriquecer cada landing con casos y datos reales antes de escalar a 20-30 páginas.

## Validation checklist

- `npm run typecheck`
- `npx eslint "app/(shop)/servicios/page.tsx" "app/(shop)/servicios/[slug]/page.tsx" "app/sitemap.ts" "lib/premium-service-pages.ts"`
- `npm run build`
- Verificar que existen 8 landings GEO y todas tienen `localJustification`.
- Verificar que `/servicios` enlaza las landings GEO en sección propia.
- Verificar que `/sitemap.xml` incluye las rutas GEO.

## Rollback considerations

- Revertir el commit de Fase 3.
- Si solo se quiere pausar indexación local, retirar `premiumGeoServicePages` del array exportado `premiumServicePages` y ocultar la sección GEO del hub.
