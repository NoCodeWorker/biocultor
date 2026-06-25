# ESLint global gate cleanup

## Objective

Sanear el gate global de ESLint por bloques de reglas coherentes, empezando por errores de React Hooks y pureza.

## Context

El baseline global contenía 48 errores y 45 warnings. Mezclar todas las categorías en una sola intervención aumentaría el riesgo de regresión y dificultaría atribuir los cambios.

## Affected systems

- Formularios cliente con hooks
- Páginas server-rendered con cálculos temporales
- Renderizado de contenido JSON dinámico
- Filtros sincronizados con search params
- Acciones administrativas y rutas API
- Webhook Stripe, feed comercial y respuesta Packlink

## Implementation plan

1. Corregir `react-hooks/static-components`.
2. Corregir `react-hooks/error-boundaries`.
3. Corregir `react-hooks/purity`.
4. Corregir `react-hooks/set-state-in-effect`.
5. Medir el nuevo baseline global.
6. Eliminar `no-explicit-any` mediante contratos Prisma, Stripe y validadores de datos externos.
7. Corregir el marcado JSX bloqueante restante.

## Decisions

- Extraer componentes declarados dentro del render.
- Parsear y validar JSON antes de construir JSX.
- Capturar una referencia temporal una sola vez por request.
- Reinicializar el borrador de búsqueda mediante una key explícita del servidor, no mediante un efecto de sincronización.
- Tratar errores capturados como `unknown` y normalizarlos con `getErrorMessage`.
- Validar payloads editoriales y respuestas Packlink antes de consumir propiedades.
- Reutilizar tipos Prisma y Stripe en vez de duplicar estructuras.

## Risks

- El remount del filtro de pedidos debe depender únicamente del query de búsqueda para no perder borradores por cambios de otros filtros.
- Los JSON de FAQ inválidos deben degradar a lista vacía sin romper render.

## Validation checklist

- [x] ESLint focalizado sin reglas `react-hooks/*`
- [x] ESLint global sin errores `react-hooks/*`
- [x] ESLint global sin `no-explicit-any`
- [x] `npm run lint`
- [x] TypeScript
- [x] Build
- [x] Registrar nuevo baseline global

## Validation notes

- Baseline inicial: 48 errores y 45 warnings.
- Después del bloque React Hooks: 38 errores y 43 warnings.
- Reglas `react-hooks/*`: 10 incidencias iniciales, 0 restantes.
- Después del bloque de tipos: 11 errores y 41 warnings.
- Regla `@typescript-eslint/no-explicit-any`: 27 incidencias iniciales, 0 restantes.
- Los 11 errores finales correspondían a marcado JSX: comillas sin escapar y un enlace interno con `<a>`.
- Baseline tras cerrar errores: 0 errores y 37 warnings no bloqueantes.
- `npm run lint` completó con código de salida 0.
- `npm run build` completó correctamente; los mensajes de `db:5432` son los fallbacks locales ya conocidos.

## Warning cleanup

- Se eliminaron imports, variables, parámetros y props sin uso.
- Las imágenes públicas y previews administrativas migraron a `next/image`.
- `ProductImageGallery` mantiene `<picture>` y `<img>` deliberadamente para ofrecer WebP con fallback JPG rastreable; las excepciones ESLint están localizadas y documentadas.
- Baseline final: 0 errores y 0 warnings.
- `npm run lint`, `npm run typecheck` y `npm run build` pasan.

## Rollback considerations

Cada cambio puede revertirse de forma independiente por archivo. No hay migraciones de datos ni cambios de contratos externos.
