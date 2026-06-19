# Fase 2: landings premium de servicios

## Objective

Crear ocho landings transaccionales de servicios premium para captar búsquedas de alto valor sin reducir el foco ecommerce de Biocultor.

## Context

El roadmap orgánico 2026-06-18 define la Fase 2 como dominio de servicios premium: chalets, comunidades, empresas, hoteles/restaurantes, césped amarillo, paisajistas, parques empresariales y zonas verdes sin abonos químicos agresivos.

## Affected systems

- `app/(shop)/servicios/[slug]/page.tsx`
- `app/(shop)/servicios/page.tsx`
- `app/sitemap.ts`
- `lib/premium-service-pages.ts`
- `docs/gsc-organic-growth-roadmap-2026-06-18.md`

## Implementation plan

1. Centralizar contenido, metadatos, FAQs, referencias y límites en `lib/premium-service-pages.ts`.
2. Renderizar landings estáticas con `generateStaticParams`.
3. Añadir schema `Service`, `FAQPage`, `BreadcrumbList`, `Organization` y `WebSite`.
4. Enlazar las landings desde el hub `/servicios`.
5. Declarar rutas en sitemap con `lastmod` estable.
6. Validar tipos, lint, build y cobertura mínima del contenido.

## Blockers

- Ninguno localmente.
- El push y deploy requieren autorización explícita del usuario.

## Decisions

- Las landings serán estáticas y tipadas, no dependientes de base de datos, para reducir riesgo operativo y acelerar indexación.
- Cada landing mantiene doble conversión: presupuesto como CTA primario y compra de producto como CTA secundario.
- Las promesas comerciales se formulan con límites honestos para respetar ADR-002 y reducir riesgo de claims no sustentados.

## Risks

- Las imágenes antes/después son genéricas hasta disponer de casos reales documentados.
- El tráfico de servicios puede necesitar prueba visual propia por segmento en Fase 4.
- Las referencias técnicas externas pueden cambiar de URL y deben revisarse en futuras auditorías.

## Validation checklist

- `npm run typecheck`
- `npx eslint "app/(shop)/servicios/page.tsx" "app/(shop)/servicios/[slug]/page.tsx" "app/sitemap.ts" "lib/premium-service-pages.ts"`
- `npm run build`
- Verificar que existen 8 landings y todas incluyen CTA, FAQ, metodología, límites, referencia y prueba visual.
- Verificar que `/servicios` enlaza las 8 landings.
- Verificar que `/sitemap.xml` incluye las 8 rutas.

## Rollback considerations

- Revertir el commit de Fase 2.
- Alternativamente, retirar las rutas del sitemap y ocultar el bloque premium en `/servicios` manteniendo `lib/premium-service-pages.ts` sin exposición pública.
