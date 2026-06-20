# GSC JavaScript performance optimization

## Objective

Reduce the PageSpeed/GSC warnings for legacy JavaScript, render-blocking network hints and unused JavaScript without compromising ecommerce tracking quality after consent.

## Context

The report identified:

- 13 KiB of legacy JavaScript/polyfills for modern JavaScript features.
- Unused preconnects to Google Analytics origins.
- 108 KiB of unused JavaScript, mostly `gtag.js`.
- Render-blocking CSS remains reported by the framework build, but the actionable first step is reducing avoidable JavaScript and third-party pressure.

## Affected systems

- `app/layout.tsx`
- `components/GoogleAnalyticsLazy.tsx`
- `components/CookieConsent.tsx`
- `package.json` browserslist targets

## Implementation plan

1. Remove Google Analytics preconnect/dns-prefetch hints from the critical head because analytics is intentionally lazy.
2. Gate Google Analytics loading behind explicit analytics consent.
3. Load Google Analytics only after consent plus interaction, with an 8-second fallback outside the critical render path.
4. Notify same-tab consent changes through a local browser event.
5. Update browserslist to Baseline 2023-era modern browsers to reduce unnecessary polyfills/transforms.
6. Validate TypeScript and build.

## Decisions

- Keep Stripe dns-prefetch because checkout remains a critical ecommerce flow.
- Prefer consent-gated analytics over eager analytics because the performance report shows third-party JavaScript is the largest avoidable cost.
- Do not inline or manually split Next CSS yet; the reported CSS files are framework-generated and small enough that JavaScript/third-party work is the safer first change.

## Risks

- Analytics for users who do not accept optional cookies will no longer load, which is correct for consent but may reduce session counts.
- Users on Safari/iOS below 16.4 are no longer part of the explicit support target.

## Validation checklist

- [x] `npx tsc --noEmit`
- [x] Focused ESLint for edited files
- [x] `npm run build`
- [ ] Confirm production PageSpeed no longer reports unused GA preconnects after deploy.

## Validation notes

- TypeScript passed.
- Focused ESLint passed for `app/layout.tsx`, `components/GoogleAnalyticsLazy.tsx` and `components/CookieConsent.tsx`.
- Build passed. Existing warnings remain unrelated to this change: local DB unavailable at `db:5432` during static generation fallbacks, deprecated `middleware` convention, custom cache-control headers and Turbopack NFT trace warning.
- Local `.next/static` inspection still finds some framework polyfills from `next/dist/client/app-globals`; those are treated as residual framework cost, not project code to patch manually.

## Rollback considerations

Rollback is restoring the previous analytics loading behavior, preconnect hints and browserslist targets.
