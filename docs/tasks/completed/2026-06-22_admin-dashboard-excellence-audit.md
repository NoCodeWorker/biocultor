# Auditoría y mejora del dashboard administrador

## Objective

Elevar el dashboard administrador de Biocultor a un estándar superior de funcionalidad, UX y UI sin introducir deuda arquitectónica ni romper contratos de datos existentes.

## Context

El panel admin ya contenía módulos de ventas, catálogo, CRM, contenido editorial, SEO, analítica, operaciones y ajustes. La portada estaba orientada a mostrar métricas, pero no priorizaba con suficiente claridad qué debía resolver primero una persona operadora.

## Affected systems

- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `components/admin/Header.tsx`
- `components/admin/Sidebar.tsx`
- `components/admin/CommandPalette.tsx`
- `components/admin/nav-config.ts`

## Findings

- La navegación admin estaba duplicada entre sidebar y command palette, con riesgo de deriva funcional.
- En móvil no había una navegación admin suficiente porque la sidebar se oculta desde `md`.
- El primer viewport de la portada comunicaba métricas, pero no traducía señales de negocio a prioridades operativas.
- Los accesos principales no se adaptaban al riesgo real detectado: stock, contenido, refunds o caída de ingresos.
- Faltaban más estados de foco visibles y affordances consistentes en acciones de cabecera.

## Implementation

- Se centralizó la navegación admin en `components/admin/nav-config.ts`.
- `Sidebar`, `Header` y `CommandPalette` consumen la misma configuración.
- Se añadió navegación móvil horizontal con estado activo.
- Se reforzó el header con acceso a tienda, búsqueda siempre disponible y foco accesible.
- Se rediseñó la portada como cockpit ejecutivo con:
  - hero de centro de mando;
  - acción primaria derivada del mayor riesgo operativo;
  - tarjetas de riesgo, crecimiento y contenido;
  - panel de prioridades operativas;
  - pulso comercial resumido.

## Decisions

- No se añadieron dependencias.
- No se modificaron modelos de datos ni migraciones.
- Se mantuvo el stack actual de Next.js App Router, Tailwind v4 y componentes existentes.
- La lógica de priorización se derivó de datos ya consultados en la portada para evitar coste adicional de base de datos.

## Risks

- Las prioridades dependen de los datos disponibles en la portada, no de telemetría externa.
- El indicador de notificaciones es visual por ahora; no representa un sistema de alertas persistente.
- La navegación móvil prioriza rutas frecuentes para evitar saturación en pantallas pequeñas.

## Validation checklist

- Ejecutar `npm run typecheck`.
- Revisar que `/admin` renderiza sin errores.
- Revisar header y navegación móvil en viewport pequeño.
- Verificar que command palette mantiene rutas admin clave.

## Rollback considerations

Revertir `components/admin/nav-config.ts` y los cambios en `Header`, `Sidebar`, `CommandPalette` y `app/admin/page.tsx` devuelve el panel al estado anterior sin tocar base de datos ni infraestructura.
