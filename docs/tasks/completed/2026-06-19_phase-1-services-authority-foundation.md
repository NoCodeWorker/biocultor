# Phase 1 services authority foundation

Date: 2026-06-19

## Objective

Start Phase 1 of `docs/gsc-organic-growth-roadmap-2026-06-18.md` by creating a clear services authority layer that supports SEO, GEO and AIO visibility without reducing ecommerce intent.

## Context

GSC showed early visibility for product queries around "té de humus", but services and garden-intent queries had no meaningful discovery. The previous phase reinforced sitemap and footer discovery. This phase adds a top-level `/servicios` hub and strengthens service schema/FAQ coverage.

## Affected systems

- Next.js App Router service routes.
- Main navigation.
- XML sitemap generation.
- Structured data for services, breadcrumbs, collection pages and FAQ.

## Implementation plan

1. Add `/servicios` as the upper service hub for biological garden services.
2. Link the hub from the existing Servicios navigation group.
3. Add `/servicios` to the sitemap with a stable `lastmod`.
4. Make service landing breadcrumbs point to the hub.
5. Ensure service FAQ schema always includes price, coverage, irrigation compatibility and safety for children/pets.

## Blockers

- None for the technical foundation.
- The main roadmap file and footer currently have pre-existing unstaged local edits and should not be staged blindly.

## Decisions

- Keep ecommerce CTAs visible from the services hub by linking to `/producto/te-humus-liquido-premium`.
- Do not create another product-like landing page; `/servicios` acts as a service taxonomy and decision page.
- Merge required FAQ entries at render time so DB-provided FAQ content cannot accidentally remove critical commercial answers.

## Risks

- If production DB overrides service FAQ with very long entries, the page may show more FAQ items than ideal. This is acceptable for SEO clarity, but should be reviewed after deploy.
- Google may need manual sitemap resubmission or URL inspection before indexing the new hub.

## Validation checklist

- TypeScript passes.
- Sitemap includes `/servicios`.
- Navigation exposes `/servicios`.
- Service pages render breadcrumbs through `/servicios`.
- FAQ schema contains required commercial/local answers.

## Closure status

Implemented and deployed. `/servicios` responds successfully in production and remains linked from navigation, footer and sitemap.

## Rollback considerations

Revert the commit that adds `/servicios` and related sitemap/navbar/schema changes. No database migration is involved.
