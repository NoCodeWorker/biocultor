# Fase 6: medición y atribución SEO/CRO

## Objective

Cerrar el bucle entre tráfico orgánico, formularios, CRM y priorización editorial para que el roadmap SEO/GEO/AIO se gobierne con datos comerciales.

## Context

Las fases anteriores ampliaron landings, servicios, artículos, casos, comparativas, calculadoras y biblioteca. El siguiente riesgo no es falta de contenido, sino falta de atribución: no saber qué URL genera leads de servicio, qué consulta merece expansión y qué activo produce pipeline real.

## Affected systems

- `components/ContactForm.tsx`
- `app/(shop)/contacto/actions.ts`
- `app/admin/analytics/page.tsx`
- CRM interno: contactos, oportunidades, tareas y acciones administrativas
- Roadmap SEO en `docs/gsc-organic-growth-roadmap-2026-06-18.md`

## Implementation plan

1. Capturar URL, querystring, referrer, metros cuadrados y precio estimado como campos ocultos del formulario.
2. Mantener el envío de email como flujo principal del formulario.
3. Sincronizar cada formulario web con CRM como contacto, oportunidad y tarea de seguimiento.
4. Clasificar automáticamente leads de servicio frente a consultas de producto.
5. Exponer en Analytics los leads web de los últimos 30 días, leads de servicio, pipeline y URLs de origen.
6. Documentar la fase en el roadmap para que futuras ampliaciones se prioricen con evidencia.

## Blockers

- La atribución depende de los formularios existentes; no cubre todavía compras directas ni llamadas externas.
- GSC/GA4 no están integrados aún en el panel de Analytics.
- La deduplicación CRM es básica por email y puede crear varias oportunidades para contactos recurrentes.

## Decisions

- El CRM no debe bloquear el formulario: si falla la sincronización, el email puede seguir enviado.
- La primera taxonomía de fuente se mantiene simple: `Web Organic`, `Web Campaign` y `Web Direct`.
- Las oportunidades se crean con importe estimado cuando viene de calculadora; si no, quedan a cero para cualificación manual.
- El panel de Analytics mide los últimos 30 días para detectar señales recientes sin mezclar todo el histórico.

## Risks

- Si las URLs de origen se guardan solo en notas, la analítica avanzada requerirá normalización futura.
- Si se crean muchas oportunidades duplicadas, el CRM puede perder utilidad operativa.
- Si no se revisa GSC periódicamente, la fase 6 no corregirá por sí sola la priorización editorial.

## Validation checklist

- `npx tsc --noEmit`
- `npx eslint components/ContactForm.tsx 'app/(shop)/contacto/actions.ts' app/admin/analytics/page.tsx`
- `npm run build`
- Revisar que el formulario conserva envío, motivo y mensaje precargado por servicios.
- Revisar que Analytics no depende de datos externos para renderizar.

## Closure status

La atribución propia formulario-CRM-Analytics está implementada y desplegada. La integración directa de GSC/GA4, compras y llamadas externas permanece como una ampliación independiente que requiere fuentes y credenciales externas.

## Rollback considerations

Rollback seguro eliminando la sincronización CRM de `submitContactForm`, los campos ocultos de atribución y el bloque de atribución en Analytics. No hay migraciones ni cambios de esquema.
