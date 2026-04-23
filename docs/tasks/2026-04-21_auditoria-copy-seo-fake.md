# Auditoría de contrato SEO y copy artificial en ecommerce

- Status: completed
- Date: 2026-04-21
- Owner: Codex

## Contexto

Se revisó el contrato SEO documentado en `docs/` y se contrastó con el copy publicado en la ecommerce para detectar contenido artificial, claims no verificables y texto escrito para el sistema SEO en lugar de para el usuario final.

## Alcance

1. `docs/architecture.md`
2. `docs/api.md`
3. `docs/database.md`
4. `docs/ai-system.md`
5. `docs/decisions.md`
6. `docs/decisions/ADR-001-programmatic-seo-content-system.md`
7. `docs/tasks/2026-04-21_seo-programatico-espana.md`
8. Capa de contenido en `lib/seo-content.ts`
9. Rutas SSR en `app/(shop)/comprar-te-de-humus-de-lombriz/*`, `app/(shop)/aprende/*`, `app/(shop)/espana/*`, `app/(shop)/te-de-humus-de-lombriz/*`
10. Componentes comerciales visibles en home y ficha de producto

## Criterio de revisión

- El contrato SEO exige sistema, coherencia y contenido auditable.
- La documentación promete evitar páginas sin gobierno y contenido verificable.
- Se considera copy artificial cualquier texto que:
  - hace promesas absolutas o científicas no demostradas
  - describe la estrategia SEO en la página pública
  - usa lenguaje inflado, genérico o manifiestamente inventado
  - convierte una landing editorial en metacomentario sobre embudos, conversión o motores de IA

## Hallazgos

### Críticos

- `lib/seo-content.ts` mezcla contenido comercial con metacopy SEO interno. Hay frases orientadas a explicar la estrategia de captación en lugar de ayudar al usuario final.
- `app/(shop)/aprende/[slug]/page.tsx`, `app/(shop)/espana/[slug]/page.tsx` y `app/(shop)/comprar-te-de-humus-de-lombriz/[slug]/page.tsx` renderizan ese contenido sin filtro, por lo que el problema está sistematizado y no aislado.
- `components/FaqAioSeo.tsx` y `components/ScienceProof.tsx` contienen claims absolutos, cifras sin fuente y testimonios que parecen inventados.

### Principales incumplimientos detectados

- Metacopy SEO visible para usuario:
  - `lib/seo-content.ts:395`
  - `lib/seo-content.ts:414`
  - `lib/seo-content.ts:473`
  - `lib/seo-content.ts:605`
  - `lib/seo-content.ts:679`
  - `app/(shop)/espana/[slug]/page.tsx:84`

- Claims absolutos o de difícil verificación:
  - `components/FaqAioSeo.tsx:11`
  - `components/FaqAioSeo.tsx:15`
  - `components/FaqAioSeo.tsx:19`
  - `components/FaqAioSeo.tsx:23`
  - `components/ScienceProof.tsx:15`
  - `components/ScienceProof.tsx:21`
  - `components/ScienceProof.tsx:44`
  - `components/ScienceProof.tsx:52`
  - `components/ScienceProof.tsx:56`
  - `lib/seo-content.ts:261`
  - `lib/seo-content.ts:289`
  - `lib/seo-content.ts:293`
  - `lib/seo-content.ts:294`
  - `lib/seo-content.ts:321`
  - `lib/seo-content.ts:324`
  - `lib/seo-content.ts:337`

- Lenguaje artificial o de venta exagerada:
  - `lib/seo-content.ts:257`
  - `lib/seo-content.ts:353`
  - `app/(shop)/comprar-te-de-humus-de-lombriz/[slug]/page.tsx:124`
  - `app/(shop)/comprar-te-de-humus-de-lombriz/[slug]/page.tsx:127`
  - `app/(shop)/page.tsx:107`
  - `app/(shop)/page.tsx:172`
  - `app/(shop)/page.tsx:183`

## Conclusión

La ecommerce sí contiene copy fake o, como mínimo, copy no confiable en varias capas:

1. Capa sistémica SEO en `lib/seo-content.ts`.
2. Componentes de conversión en home y producto.
3. FAQs y testimonios con afirmaciones cerradas y no verificadas.

El mayor problema no es una frase concreta, sino que el sistema actual publica texto de estrategia SEO y claims comerciales como si fueran contenido editorial fiable.

## Recomendación operativa

1. Limpiar primero `lib/seo-content.ts` para eliminar metacopy sobre SEO, IA, conversión y embudo.
2. Sustituir claims absolutos por lenguaje observacional y condicional.
3. Eliminar o rehacer testimonios y FAQs que no estén respaldados.
4. Revisar después home y ficha de producto para alinear tono, evidencia y cumplimiento.

## Estado final

- Revisión del contrato SEO: completada
- Auditoría de copy fake: completada
- Corrección inicial de textos: completada

## Correcciones ejecutadas

- Limpieza de copy sistémico en `lib/seo-content.ts`.
- Reescritura de FAQs públicas con lenguaje no absoluto en `components/FaqAioSeo.tsx`.
- Sustitución de testimonios/claims inventados por notas editoriales de uso en `components/ScienceProof.tsx`.
- Revisión de promesas temporales y métricas de resultado en `components/ResultsTimeline.tsx`.
- Ajuste de perfiles de compra en `components/BuyerPersonaSelector.tsx`.
- Eliminación de prueba social simulada y urgencias ficticias en `components/SocialProofTicker.tsx` y `components/UrgencyModule.tsx`.
- Limpieza de garantías, reseñas y refuerzos comerciales no verificables en `components/RiskReversal.tsx` y `components/ProductFunnel.tsx`.
- Limpieza de home y ficha de producto para retirar métricas, garantías y structured data no verificables.
- Ajuste de copy operativo en `app/(shop)/envios/page.tsx`.
- Eliminación de referencias a certificaciones oficiales, normativa UE, producción ecológica y badges regulatorios en `components/Footer.tsx`, `lib/site-config.ts`, `app/(shop)/terminos/page.tsx`, `app/(shop)/privacidad/page.tsx` y `lib/seo-content.ts`.
- Segunda ronda de limpieza editorial para retirar claims agronómicos no verificables en `lib/seo-content.ts`, hubs editoriales y componentes de compra/comparativa.
- Documentación de la nueva línea editorial del blog: artículos apoyados en estudios, universidades o papers citados para reforzar intención de compra sin claims no verificables.
- Creación de `docs/editorial.md` como plantilla operativa para producir artículos del blog basados en evidencia con estructura repetible.
- Implementación inicial en la UI editorial de `aprende`: soporte visible para `Fuente base` y `Referencias`, más un primer artículo basado en un meta-análisis primario.
- Ampliación del inventario editorial evidence-led con tres artículos adicionales apoyados en fuentes primarias sobre semillero de tomate, uso de vermicompost en tomate y lectura práctica de estudios sobre vermicompost tea.
- Nueva ampliación del clúster evidence-led con piezas basadas en revisión científica de horticultura, ensayo en lechuga, ensayo en fresa y meta-análisis de fertirrigación por goteo para reforzar intención de compra por cultivo y sistema de aplicación.
- Reestructuración del hub `app/(shop)/aprende/page.tsx` para priorizar enlazado interno por intención: bloque de evidencia, bloque de guías de compra y accesos rápidos a cultivo, producto y aplicación.
- Implementación de breadcrumbs visuales y reutilizables en toda la ecommerce pública con alineación entre UI y `breadcrumbSchema`, incluyendo hubs, fichas dinámicas, soporte y páginas legales.
