# ADR-004: Contrato de sincronización editorial con dashboard

## Status

Accepted

## Context

Biocultor publica contenido desde varias fuentes:

- Artículos estáticos en `lib/seo-content.ts`.
- Artículos curados de servicios y autoridad en scripts de seed.
- Landings y servicios estáticos en rutas de Next.js.
- Overrides editoriales persistidos en `Post` y `SeoPage`.

El fallo recurrente era que nuevas landings o artículos quedaban visibles en la web o sitemap, pero no aparecían en el dashboard para editar imágenes. La causa era deuda técnica: cada dashboard tenía su propio listado manual de sincronización.

## Decision

Todo contenido editorial nuevo que deba editar imágenes desde el dashboard debe entrar en el contrato de sincronización central:

- `lib/admin/editorial-dashboard-sync.ts`

Ese módulo es responsable de crear en base de datos los registros que falten antes de renderizar:

- `/admin` sincroniza el inventario editorial y muestra el resumen global de artículos, landings, servicios y total editable.
- `/admin/blog` sincroniza y lista solo `Post`.
- `/admin/seo` sincroniza y lista `SeoPage`, incluidas landings y servicios con edición visual avanzada.
- `/admin/servicios` sincroniza y edita de forma especializada `SeoPage` de tipo `SERVICIO`.

El dashboard principal, no Blog, es la superficie de descubrimiento transversal. Blog debe permanecer enfocado en artículos para evitar solapamiento conceptual y operativo.

Los scripts de seed curados deben exportar sus arrays de contenido y solo ejecutar `main()` cuando se lanzan como script, no cuando se importan desde el dashboard.

### Fallos que este ADR debe impedir

- Crear posts o landings visibles en la web, sitemap o navegación sin registro editable en `Post` o `SeoPage`.
- Mezclar landings y servicios dentro del listado operativo de Blog, generando duplicidad conceptual y métricas confusas.
- Contabilizar landings o servicios como "artículos" en `/admin/blog`.
- Crear un nuevo inventario editorial fuera de `editorial-dashboard-sync.ts` sin registrarlo en el dashboard principal.
- Importar scripts de seed desde el dashboard si esos scripts ejecutan efectos laterales al importarse.
- Perder imágenes manuales subidas desde dashboard por sobrescritura automática de seeds.
- Publicar imágenes por defecto en código sin que el dashboard pueda reemplazarlas y sin que la página pública lea el override.
- Añadir rutas nuevas con payload visual sin validar `/admin`, `/admin/blog`, `/admin/seo` y `/admin/servicios`.

### Checklist obligatorio para contenido nuevo

Todo lote de contenido debe cerrar con estas comprobaciones antes de commit:

- Si es artículo `/aprende`, existe registro `Post` con `coverImage` y `coverImageAlt`.
- Si es landing o servicio, existe registro `SeoPage` con `image` y payload visual cuando aplique.
- Si la imagen procede de `public/`, el sync puede refrescarla sin pisar `/uploads/...`.
- El dashboard principal contabiliza el total editable, pero Blog contabiliza solo artículos.
- La ruta pública usa el override persistido cuando existe.
- El sitemap solo expone contenido publicado y coherente con el inventario editable.
- El task activo documenta qué dashboards fueron verificados.

## Alternatives considered

- Mantener sincronizaciones manuales por dashboard: descartado porque ya provocó omisiones repetidas.
- Crear registros solo durante deploy: descartado porque impide editar imágenes antes o durante el desarrollo local.
- Mover todo el contenido a base de datos inmediatamente: demasiado invasivo para el estado actual del producto.

## Tradeoffs

- El dashboard importa inventarios de contenido estático, lo que aumenta el acoplamiento editorial controlado.
- El sistema evita sobreescribir registros existentes desde el dashboard sync; los seeds de deploy siguen siendo responsables de refrescar contenido gestionado por seed.
- Las landings estáticas deben leer overrides de `SeoPage` cuando existan para que las imágenes editadas tengan efecto real.

## Consequences

- Nuevos artículos y landings aparecen automáticamente en los dashboards de edición de imágenes si se añaden al inventario correcto.
- El dashboard principal funciona como superficie unificada de descubrimiento: artículos, landings y servicios quedan localizables sin mezclar sus editores.
- Añadir una nueva fuente editorial exige actualizar `editorial-dashboard-sync.ts`.
- La revisión de PR/commit debe comprobar que cualquier ruta nueva con imágenes editables tiene registro en `Post` o `SeoPage`.
