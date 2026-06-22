# Ecommerce CRO and checkout foundation

## Objective

Improve the public ecommerce purchase flow with low-risk changes that increase reliability, recoverability and measurement before deeper visual QA.

## Context

The ecommerce already had product pages, cart, Stripe Checkout, cross-sell modules and free-shipping logic. The first audit pass found conversion risk in cart persistence, checkout error handling, stock validation and funnel measurement.

## Affected systems

- `components/Cart.tsx`
- `store/cartStore.ts`
- `app/api/checkout/route.ts`
- `app/success/page.tsx`
- `app/success/ClearCartOnSuccess.tsx`
- `components/FormatSelector.tsx`
- `components/ProductFunnel.tsx`
- `components/StickyCartBar.tsx`
- `lib/ecommerce-events.ts`

## Implementation

- Persist cart items in browser storage so users do not lose intent after refresh/navigation.
- Replace checkout `alert()` calls with inline, accessible error states inside the cart.
- Add Escape-to-close and body scroll lock while the cart drawer is open.
- Clear cart after successful checkout return.
- Improve success copy so it reflects a real order confirmation instead of demo wording.
- Add server-side stock validation before creating Stripe sessions.
- Add lightweight ecommerce events for `add_to_cart`, `begin_checkout` and `checkout_error`.
- Use `next/link` for internal product links in the format selector.

## Decisions

- No new dependency was added.
- Tracking is fail-open: events dispatch internally and call `window.gtag` only if GA is loaded.
- Stock remains validated server-side in checkout; client stock UI is treated as advisory.

## Validation

- `npm run typecheck`
- Scoped ESLint for touched ecommerce files
- Scoped Prettier check
- `npm run build`
- Production HTTP status spot-check from VPS for key ecommerce routes before this change set

## Risks

- Browser automation screenshots were not available in the current environment.
- GA event delivery depends on cookie consent and the existing lazy GA loader.
- Stripe end-to-end payment was not executed in this pass.

## Rollback

Revert this change set to restore previous cart, checkout and tracking behavior. No database migration is involved.
