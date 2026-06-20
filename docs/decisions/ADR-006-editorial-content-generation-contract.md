# ADR-006: Editorial Content Generation Contract

## Status

Accepted

## Context

El roadmap orgánico de Biocultor ha creado artículos, landings de servicios, landings GEO, hubs, comparativas y recursos. En varias iteraciones aparecieron fallos recurrentes de flujo:

- contenido nuevo publicado sin aparecer en el dashboard de edición de imágenes;
- landings y servicios mezclados conceptualmente con Blog;
- totales del dashboard interpretados de forma ambigua;
- imágenes generadas pero no asignadas de forma end-to-end;
- `alt` text, slug visual y payload visual incompletos;
- riesgo de sobrescribir imágenes manuales subidas desde dashboard;
- texto generado por IA dentro de imágenes con riesgo de erratas;
- claims visuales de antes/después sin evidencia real;
- estilo visual no siempre alineado con Biocultor, Quicksand y la estética web.

Estos fallos no se resuelven solo con más atención manual. Deben quedar convertidos en contrato operativo.

## Decision

Todo contenido editorial nuevo de Biocultor debe pasar por un flujo único de publicación end-to-end antes de considerarse terminado:

1. **Inventario canónico**
   - Artículos: `Post` y fuente de seed/import correspondiente.
   - Landings, servicios, GEO y recursos SEO: `SeoPage` y fuente estática correspondiente.
   - Toda fuente nueva debe registrarse en `lib/admin/editorial-dashboard-sync.ts`.

2. **Evidencia y copy**
   - Aplicar ADR-002: fuentes identificables, claims prudentes, limitaciones honestas y CTA contextual.
   - Evitar promesas absolutas y lenguaje pseudocientífico.
   - El copy debe diferenciar intención: compra ecommerce, contratación de servicio, investigación técnica o búsqueda local.

3. **Visual**
   - Aplicar ADR-005: escena hiperrealista, overlay determinista, WebP optimizado, estilo Biocultor, Quicksand y copy visual revisable.
   - Post: portada 16:9 con título y mini infografía.
   - Landing de servicio: hero/proof 16:9 orientado a conversión, con escena del segmento o zona y panel corto de propuesta, proceso o beneficio.
   - Antes/después: solo con evidencia real; si no existe, usar diagnóstico, metodología, intervención o protocolo.

4. **Asignación SEO/GEO/AIO**
   - El slug del archivo debe describir la intención principal.
   - El `alt` debe ser específico, natural y coherente con el título.
   - La imagen debe alimentar metadata, Open Graph o schema cuando la página lo soporte.
   - No usar keyword stuffing ni imágenes genéricas que rompan la relevancia semántica.

5. **Dashboard**
   - Blog gestiona solo artículos.
   - Landings & SEO gestiona landings, recursos y páginas SEO.
   - Servicios gestiona servicios y landings de servicio.
   - El dashboard principal es la vista transversal de descubrimiento.
   - Los contadores deben expresar su alcance: artículos, páginas SEO editables y total editable.

6. **Preservación de edición manual**
   - Cualquier `/uploads/...` existente es autoridad editorial.
   - Seeds y sincronizaciones solo pueden refrescar valores generados si no pisan uploads manuales.

7. **Validación antes de commit**
   - Verificar render público.
   - Verificar dashboard correcto.
   - Verificar imagen, `alt`, slug y payload visual.
   - Ejecutar typecheck y lint enfocado cuando haya cambios de código.
   - Ejecutar build cuando cambien rutas, metadata, generación estática o composición visual.

## Alternatives Considered

- Resolver cada fallo como parche aislado.
  - Rechazado porque ya produjo regresiones repetidas.
- Centralizar todo el contenido en base de datos inmediatamente.
  - Rechazado por coste operativo y riesgo de migración innecesario ahora.
- Mantener solo ADR visual y ADR dashboard separados.
  - Rechazado porque el fallo real está en la unión entre contenido, visual, dashboard y validación.

## Tradeoffs

- Aumenta el trabajo mínimo para publicar contenido.
- Reduce velocidad de lotes pequeños si no se automatiza.
- A cambio, reduce regresiones, conserva edición manual y mantiene coherencia SEO, GEO, AIO, CRO y visual.

## Consequences

- Ningún contenido nuevo se considera terminado si no aparece en su dashboard correcto.
- Ninguna imagen se considera implementada si no tiene ruta WebP, alt, asignación de datos y render público.
- El agente editorial local debe usar este ADR como contrato principal.
- Los futuros roadmaps deben incluir validación de dashboard e imagen como parte del Definition of Done.
