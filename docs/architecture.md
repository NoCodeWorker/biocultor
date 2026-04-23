# Architecture

## Resumen

Biocultor opera sobre Next.js App Router con renderizado server-first. La capa SEO se resuelve en servidor mediante metadata nativa, JSON-LD embebido y rutas indexables explícitas.

## Componentes

- `app/layout.tsx`: metadata global y structured data de organización y website.
- `lib/site-config.ts`: configuración central de marca, país, contacto y URL base.
- `lib/seo.ts`: generador de metadata, URLs absolutas y schemas reutilizables.
- `lib/seo-content.ts`: matriz tipada de dominios transaccional, programático, informacional y GEO/IA.
- `lib/seo-store.ts`: capa de resolución que mezcla contenido curado con overrides persistidos en base de datos.
- `components/Breadcrumbs.tsx`: patrón visual único para breadcrumbs públicos, alineado con los `BreadcrumbList` JSON-LD de cada ruta SSR.
- `app/(shop)/producto/[slug]/page.tsx`: ficha transaccional del producto.
- `app/(shop)/comprar-te-de-humus-de-lombriz/*`: dominio transaccional por intención explícita de compra.
- `app/(shop)/te-de-humus-de-lombriz/*`: landings programáticas por intención/cultivo.
- `app/(shop)/aprende/*`: guías editoriales para autoridad temática.
- `app/(shop)/espana/*`: cobertura territorial para España y recuperación en motores de IA.
- `app/admin/seo/page.tsx`: interfaz editorial para gestionar `SeoPage`.
- `SeoPage.targetKeyword`, `workflowStatus` y `priorityScore`: capa de gobierno para decidir el orden real de ejecución SEO.
- `app/api/seed-seo/route.ts` y `scripts/seed-seo.mts`: sincronización inicial del inventario SEO persistente.
- `app/sitemap.ts` y `app/robots.ts`: publicación técnica para rastreo.
- `docs/editorial.md`: guía operativa para convertir estudios y papers en artículos editoriales conectados con intención de compra.

## Decisión estructural

El SEO no se implementa como textos aislados en componentes, sino como una capa de sistema compuesta por:

1. Configuración central.
2. Generadores reutilizables.
3. Matrices de intención.
4. Tres dominios enlazados:
   transaccional, informacional y GEO/IA.
5. Rutas server-rendered.
6. Persistencia opcional mediante `SeoPage` para overrides.

Esto evita duplicidad, facilita escalado y mantiene separación de concerns entre contenido, metadata y UI.

## Navegación contextual

Las breadcrumbs públicas forman parte del sistema SEO y de orientación del usuario. Regla operativa:

- toda ruta SSR pública de `app/(shop)` excepto la home debe exponer breadcrumb visual
- el breadcrumb visual debe derivar de la misma jerarquía que el `breadcrumbSchema`
- no se permite mantener variantes manuales por plantilla cuando exista componente compartido

## Política editorial

La capa editorial de `app/(shop)/aprende/*` no debe funcionar como blog opinativo ni como relleno SEO. Su función es traducir evidencia externa reconocible a una lectura útil para compra.

Reglas operativas:

- cada artículo debe partir de una fuente identificable: universidad, paper, journal o institución técnica
- la fuente debe citarse de forma visible en el artículo
- el contenido debe explicar qué aporta esa evidencia al criterio de compra: uso, formato, compatibilidad o contexto
- no se permite convertir una fuente en promesa comercial cerrada
- si no hay evidencia primaria clara, el artículo no debe presentarse como “demostrado”
- la UI editorial debe mostrar `Fuente base` y `Referencias` cuando el artículo incluya evidencia documentada
- el hub `/aprende` debe priorizar una portada editorial gobernada por intención: bloque evidence-led, bloque de guías prácticas y accesos por sistema de aplicación o cultivo
