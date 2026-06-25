# Prisma build trace debt

## Objective

Eliminar el warning de Turbopack/NFT que ampliaba involuntariamente el trace de una ruta API al proyecto completo.

## Context

El cliente Prisma se generaba en `generated/prisma`. Prisma incluye fallbacks de resolución basados en `process.cwd()` y Turbopack interpretaba esa ruta interna al proyecto como un acceso potencialmente no acotado. El warning aparecía en la ruta `app/api/admin/orders/export/route.ts` a través de `lib/db.ts`.

## Affected systems

- `prisma/schema.prisma`
- `lib/db.ts`
- Tipos y scripts que importan Prisma
- `Dockerfile`
- Build standalone de Next.js

## Implementation plan

1. Volver al output estándar de `prisma-client-js`.
2. Importar runtime y tipos desde `@prisma/client`.
3. Mantener en Docker únicamente `node_modules/.prisma`, `node_modules/@prisma` y el schema/migraciones.
4. Regenerar el cliente.
5. Validar TypeScript, ESLint y build.

## Decisions

- No silenciar el warning mediante comentarios de ignore ni exclusiones globales.
- No mantener dos clientes Prisma generados.
- Usar el layout estándar soportado por Prisma porque acota el fallback a `node_modules/.prisma/client` y reduce configuración propia.

## Risks

- Los scripts operativos que conservaran imports al output antiguo fallarían después de limpiar `generated/prisma`; por eso la migración incluye todos los consumidores encontrados.
- El runner Docker debe conservar tanto el runtime de `@prisma` como el cliente generado en `.prisma`.

## Validation checklist

- [x] `npx prisma generate`
- [x] `npm run typecheck`
- [x] `npm run lint` global
- [x] ESLint focalizado en `lib/db.ts`, tipos y query de pedidos
- [x] `npm run build`
- [x] Confirmar que el warning `Encountered unexpected file in NFT list` desaparece
- [x] Confirmar que el NFT de exportación no incluye `next.config.mjs` ni `generated/prisma`

## Validation notes

- Prisma Client 5.22.0 se generó correctamente en el output estándar.
- TypeScript pasó sin errores.
- El build de Next.js 16.2.6 pasó y dejó de emitir el warning de trace global.
- El trace de `app/api/admin/orders/export` queda acotado a `node_modules/.prisma/client`, `@prisma/client` y dependencias runtime.
- El lint focalizado pasó.
- El lint global pasa sin errores ni warnings después del saneamiento posterior documentado en `2026-06-25_eslint-global-gate.md`.
- El build local sigue registrando los fallbacks esperados porque `db:5432` no está disponible fuera de la red de Docker; no impide completar el build.

## Rollback considerations

Restaurar el `output` personalizado, los imports a `generated/prisma` y la copia de `/app/generated` en Docker.
