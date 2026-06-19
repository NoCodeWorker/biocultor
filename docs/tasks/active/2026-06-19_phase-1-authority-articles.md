# Phase 1 authority articles

Date: 2026-06-19

## Objective

Complete the article layer requested in Phase 1 of `docs/gsc-organic-growth-roadmap-2026-06-18.md`: 8 evidence-led articles around purchase objections for the "té de humus" cluster.

## Context

GSC showed early impressions for "té de humus" queries but weak average positions. Phase 1 aims to move the cluster toward top 10-15 by answering objections that block purchase or service leads.

## Affected systems

- `scripts/seed-phase1-authority-posts.ts`
- `/aprende` curated article hub
- `app/sitemap.ts`
- Docker seed compilation and runtime deploy command
- `package.json` seed script

## Implementation plan

1. Create 8 ADR-002 compliant articles with visible sources, limitations and CTA.
2. Preserve DB upload edits by keeping `/uploads/` cover images.
3. Refresh only posts managed by `Equipo Biocultor`.
4. Add static discovery links in `/aprende`.
5. Add static sitemap routes to avoid relying on database availability during sitemap generation.

## Blockers

None.

## Decisions

- Keep content in `Post` via seed, not in legacy static article arrays.
- Use curated static route lists for discovery and duplicate filtering.
- Keep ecommerce CTA present in every article so service growth does not cannibalize product purchase.

## Risks

- Reusing a small set of institutional sources is safe but should be expanded with more primary studies in later editorial passes.
- Existing manually edited posts with a different author will be skipped by the seed and may need manual review.

## Validation checklist

- `npm run typecheck`
- `esbuild` bundling for the new seed
- Audit that 8 articles exist, are unique, include references, FAQ, product/service links, limitations and GEO/AIO signals
- `/aprende` and sitemap include all 8 slugs

## Rollback considerations

Revert the commit introducing the seed, sitemap entries, `/aprende` section and Docker command. Existing DB posts would remain unless explicitly removed by an operator.
