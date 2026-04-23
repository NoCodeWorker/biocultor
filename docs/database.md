# Database

## Estado actual

La estrategia SEO ya introduce cambios de esquema en Prisma mediante una nueva entidad persistente para páginas SEO.

## Modelos relevantes

- `Product`: entidad comercial principal.
- `Variant`: formatos y precios usados para la ficha transaccional.
- `Post`: modelo existente para contenido, todavía no conectado a las nuevas landings estáticas.
- `SeoPage`: inventario persistente de páginas SEO con soporte para transaccional, programático, informacional y GEO/IA.
  Incluye además `targetKeyword`, `workflowStatus`, `priorityScore` y `notes` para gobierno editorial.

## Decisión

Se adopta un modelo híbrido:

- `lib/seo-content.ts` sigue siendo la fuente curada base.
- `SeoPage` permite overrides persistidos sin romper build ni rutas existentes.
- `lib/seo-store.ts` resuelve la combinación entre contenido base y base de datos.

## Próximo paso recomendado

Si Biocultor necesita escalar a decenas o cientos de URLs por cultivo, provincia o caso de uso, conviene:

1. Añadir una UI editorial para gestionar `SeoPage`.
2. Separar payloads complejos en tablas específicas si la edición se vuelve frecuente.
3. Añadir histórico o versionado editorial si varias personas van a tocar el inventario.
