# Roadmap editorial and landing images

## Objective

Generate and assign branded WebP images for the 14 `/aprende` posts and the implemented service landings covered by the GSC organic growth roadmap.

## Context

The current roadmap posts appear in the Blog dashboard, but many still use generic service/product images. The implemented service landings also reuse generic visual proof assets. The desired visual standard is a realistic Biocultor scene plus infographic based on each post or landing title, similar to the existing post images supplied by the owner.

## Affected systems

- `prisma.post.coverImage`
- `prisma.post.coverImageAlt`
- `seoPage.image`
- `seoPage.payload` visual fields for services (`beforeImage`, `afterImage`, `heroImage` where applicable)
- Blog dashboard image editor
- Landings & SEO dashboard
- Services dashboard
- `/aprende`
- `/aprende/[slug]`
- `/servicios/[slug]`
- Seed scripts for roadmap posts
- `lib/premium-service-pages.ts`
- Public/uploaded WebP assets

## Implementation plan

1. Define the target post slugs from the roadmap:
   - 6 service application posts from Fase 0.
   - 8 authority objection posts from Fase 1.
2. Define the target landing slugs from the roadmap:
   - 8 premium service landings from Fase 2.
   - 8 premium GEO service landings from Fase 3.
3. Optional expansion after the core batch:
   - 3 case pages from Fase 4.
   - 3 resource pages from Fase 4.
   - 3 comparison pages plus `/biblioteca`, `/calculadoras` and `/metodologia` from Fase 5.
4. Generate one hyperrealistic scene per post or landing using the best available OpenAI image generator.
5. Compose deterministic infographic overlays with exact Spanish text.
6. Export optimized `.webp` assets:
   - posts: default `16:9`;
   - service landings: default `16:9` hero/after image, with optional second before/diagnostic asset if the page uses comparison visuals.
7. Update `coverImage`, `coverImageAlt`, `seoPage.image` and service visual payloads without overwriting manual `/uploads/...` images unless explicitly approved.
8. Validate dashboards, `/aprende`, `/servicios/[slug]`, individual pages and build.

## Decisions

- Follow ADR-005 for hybrid visual generation.
- Use `16:9` as the default ratio for posts and service landing hero assets.
- Keep manual dashboard images authoritative over generated defaults.
- For service landings, prioritize one strong hero/after asset per landing before generating before/after pairs for every page.
- Avoid overpromising agronomic outcomes in visual copy.

## Risks

- Raw AI-generated text can contain spelling errors if not composed programmatically.
- Large images can hurt performance if not optimized.
- Replacing manual uploaded images without approval would violate ADR-003.
- Generating before/after visuals without real evidence can create misleading claims; when there is no real case, use "diagnóstico/aplicación/metodología" visuals instead of fake outcomes.

## Validation checklist

- Confirm all 14 slugs have a non-generic `coverImage`.
- Confirm the 16 service landing slugs have non-generic `image` or visual payload assets.
- Confirm all 14 images are `.webp`.
- Confirm landing assets are `.webp`.
- Confirm final text is readable and spelled correctly.
- Confirm `/admin/blog` shows the images as editable.
- Confirm `/admin/seo` and `/admin/servicios` show landing/service images as editable.
- Run `npx tsc --noEmit`.
- Run `npm run build` if code or route behavior changes.

## Rollback considerations

Rollback is replacing `coverImage` values with the previous paths or restoring the previous commit. No database schema changes are required.
