# Editorial Content Generation Contract

## Purpose

Este contrato evita que Biocultor vuelva a generar contenido parcial: páginas publicadas sin dashboard, imágenes sin asignar, estilos incoherentes, claims arriesgados o métricas editoriales ambiguas.

Aplica a:

- artículos `/aprende`;
- landings `/servicios/[slug]`;
- landings GEO;
- recursos, comparativas, hubs y calculadoras;
- cualquier página con intención SEO, GEO, AIO o CRO.

## Non-negotiable Rules

1. Every page must have one canonical content owner.
2. Every editable page must appear in the correct dashboard surface.
3. Every generated visual must be assigned to the page, not only saved in `public/`.
4. Every visual must include specific `alt` text and a descriptive WebP filename.
5. Manual `/uploads/...` dashboard images are never overwritten without explicit approval.
6. Infographic text must be deterministic and reviewed, not trusted to raw image generation.
7. Quicksand typography and Biocultor visual cues are the default for final overlays.
8. Claims must follow ADR-002; fake before/after proof is forbidden.
9. Blog counts articles only; total editable content belongs to the main dashboard.
10. A content batch is not complete until render, dashboard, image and validation checks pass.

## Required Inputs

For every item in a content batch, define:

- `type`: `post`, `service`, `geo`, `landing`, `resource`, `comparison`, `hub` or `calculator`;
- `slug`;
- `title`;
- `primaryIntent`: ecommerce, service lead, local service, authority, comparison or calculator;
- `canonicalSource`: script, static library or database model;
- `dashboardSurface`: Blog, Landings & SEO, Services or Dashboard overview;
- `imagePath`;
- `imageAlt`;
- `evidenceNotes`;
- `ctaTarget`.

## Execution Checklist

### 1. Content

- Title and H1 match intent without clickbait.
- Copy includes a clear buyer or lead path.
- Technical claims are source-backed or written as cautious guidance.
- Service copy prioritizes affluent garden owners, chalets, landscapers, communities and companies with maintained gardens when relevant.
- Ecommerce copy remains visible when service conversion is added.

### 2. Visual

- Post visual: 16:9 cover with title and compact infographic.
- Service visual: 16:9 conversion proof scene with segment, zone, process or benefit.
- WebP exported to a stable public path.
- Filename is lowercase, descriptive and slug-aligned.
- Final overlay uses Quicksand-style hierarchy, dark green accents and cream panels.
- Text is checked for Spanish spelling and claim safety.

### 3. Data Assignment

- `Post.coverImage` and `Post.coverImageAlt` are set for articles.
- `SeoPage.image` and payload visuals are set for landings/services when applicable.
- Public route reads persisted overrides.
- Metadata/Open Graph/schema image fields are aligned where supported.

### 4. Dashboard

- `/admin` shows the page in total editable inventory.
- `/admin/blog` shows only posts.
- `/admin/seo` shows landings and SEO resources.
- `/admin/servicios` shows service pages.
- Dashboard sync preserves manual `/uploads/...` images.

### 5. Validation

- `npx tsc --noEmit` passes when TypeScript changed.
- Focused ESLint passes for edited code paths.
- `npm run build` passes when routes, metadata or generated content sources changed.
- At least one representative post and one representative service landing are visually inspected after image changes.

## Failure Handling

If any rule fails:

- stop the batch;
- record the failed item and reason in the active task;
- fix the source of truth, not only the visible symptom;
- re-run the smallest validation that proves the fix;
- do not push/deploy until the contract is satisfied.

## Related Decisions

- ADR-002: Editorial Evidence Policy
- ADR-003: Blog Database Integrity
- ADR-004: Editorial Dashboard Sync Contract
- ADR-005: Editorial Visual Generation Policy
- ADR-006: Editorial Content Generation Contract
