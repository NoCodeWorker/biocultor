# CRO and Organic Excellence Funnel

## Objective

Increase qualified ecommerce and service conversions without weakening the existing SEO architecture.

## Context

The site already has product pages, service hubs, calculators, cases and attribution. The highest-value gap was not more URLs, but better routing of intent: product buyers should still reach checkout quickly, while garden owners, communities and professionals should convert into service leads before leaving the page.

## Affected Systems

- Home hero and above-the-fold SEO copy.
- Product funnel decision path.
- Service calculators.
- Contact form and CRM attribution.
- Product review schema policy.
- Admin analytics attribution.

## Implementation

- Home H1 now states product plus professional application intent.
- Product pages include a near-price decision module for users who should calculate service instead of only buying product.
- Service calculators capture leads inline with name, phone and optional email.
- Contact submissions accept phone-first service leads and persist structured attribution fields.
- CRM stores `sourcePath`, `sourceQuery`, `sourceReferrer`, `serviceSlug`, `leadIntent`, `estimatedM2` and `estimatedPrice`.
- Analytics reads structured attribution first and falls back to historical note parsing.
- Product review JSON-LD is gated behind `ENABLE_PRODUCT_REVIEW_SCHEMA=true` so review schema is emitted only when evidence is operationally verifiable.

## Risks

- The Prisma migration must run in production before code that writes the new CRM fields receives live leads.
- If review schema is disabled, GSC may show non-critical missing `review` or `aggregateRating` suggestions again, but this is preferable to publishing unverifiable review data.

## Validation

- `npx prisma generate`
- `npx tsc --noEmit`
- Focused `npx eslint` on modified files
- `git diff --check`
- `npm run build` passed once with network access. A later repeat was blocked by sandbox network access to Google Fonts, not by code.

## Rollback

- Revert this change set and rollback migration `20260620160000_add_crm_attribution_fields` if deployment causes CRM write issues.
- The migration only adds nullable columns and indexes, so existing CRM data remains intact.
