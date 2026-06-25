# Fase 5: liderazgo sectorial

## Objective

Crear la primera capa pública de liderazgo sectorial: biblioteca, comparativas, calculadoras y metodología E-E-A-T.

## Context

El roadmap define Fase 5 como el paso hacia ser el sitio más completo y confiable del nicho en España. No se puede completar todo el hito en un sprint, pero sí establecer la arquitectura de liderazgo para escalar contenido, herramientas y prueba real.

## Affected systems

- `lib/leadership-assets.ts`
- `/biblioteca`
- `/comparativas/[slug]`
- `/calculadoras`
- `/metodologia`
- `app/sitemap.ts`
- `components/Navbar.tsx`
- `components/Footer.tsx`
- Home pública

## Implementation plan

1. Crear datos tipados de comparativas y secciones de biblioteca.
2. Publicar hub `/biblioteca`.
3. Publicar comparativas contra alternativas prioritarias.
4. Publicar página pública de calculadoras.
5. Publicar metodología E-E-A-T operativa.
6. Enlazar desde navegación, footer, home y sitemap.

## Blockers

- Falta medición GSC posterior de Fases 1-4 para priorizar la ampliación exacta.
- Falta persistencia CRM/lead tracking para calculadoras.
- Falta evidencia de casos reales para alimentar métricas y resultados observacionales.

## Decisions

- La biblioteca no sustituye a `/aprende`; organiza activos de decisión, comparativas y herramientas.
- Las comparativas declaran cuándo Biocultor encaja y cuándo la alternativa puede tener sentido.
- Las calculadoras se publican como páginas HTML indexables, no solo componentes embebidos.

## Risks

- Si se amplían comparativas sin fuentes ni límites, se incumple ADR-002.
- Si las calculadoras prometen exactitud, pueden generar expectativas comerciales incorrectas.
- Si no se mide en GSC, la biblioteca puede crecer por intuición y no por demanda real.

## Validation checklist

- `npx tsc --noEmit`
- ESLint focalizado en rutas y componentes tocados.
- `npm run build` con red si hay cambios de rutas.
- Confirmar que sitemap incluye `/biblioteca`, `/calculadoras`, `/metodologia` y `/comparativas/*`.

## Closure status

La arquitectura inicial de liderazgo sectorial está implementada y desplegada. Biblioteca, comparativas, calculadoras y metodología forman parte del build y sitemap públicos. La ampliación futura se priorizará con datos de rendimiento.

## Rollback considerations

El rollback es retirar rutas de biblioteca, comparativas, calculadoras, metodología, enlaces públicos y sitemap. No hay migraciones ni cambios de base de datos.
