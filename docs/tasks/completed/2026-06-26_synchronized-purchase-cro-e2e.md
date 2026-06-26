# Synchronized purchase flow, CRO tracking and mobile E2E smoke

## Objective

Make the product purchase flow harder to desynchronize across format selection, sticky cart, cart drawer, checkout payload and CRO events.

## Context

The mobile product page previously exposed a real synchronization risk: the user could select one product format in the page while the sticky purchase bar still showed another format. The first fix introduced shared variant selection state. This pass turns that behavior into an explicit critical-flow contract.

## Affected systems

- Product variant selection context
- Product funnel format selector
- Sticky cart bar
- Cart drawer checkout flow
- Ecommerce event tracking
- Mobile Playwright smoke tests

## Implementation plan

1. Keep one selected variant ID shared by product funnel and sticky cart.
2. Guard the selection provider against stale variant IDs.
3. Emit CRO events for view item, select item, add to cart, begin checkout and checkout errors.
4. Add stable `data-testid` selectors only to critical purchase-flow controls.
5. Add a mobile E2E smoke that verifies 25 L selection synchronization and checkout payload creation without creating a real Stripe Checkout session.

## Decisions

- Checkout remains server-authoritative: the browser sends only variant ID and quantity; price, product name, SKU and stock are read again from the database.
- The E2E test intercepts `/api/checkout` to avoid payment side effects while still validating the frontend payload.
- `data-testid` attributes are limited to purchase-critical controls to avoid turning the UI into a testing-only surface.

## Risks

- Local E2E execution needs a running Next.js server and Playwright browser availability.
- Production checkout is not charged or completed by this smoke; Stripe webhook/payment completion remains covered by operational smoke/manual verification only.

## Validation checklist

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `E2E_BASE_URL=<url> npm run test:e2e:mobile-purchase`

## Rollback considerations

Revert the changes in `components/ProductVariantSelectionContext.tsx`, `components/ProductFunnel.tsx`, `components/StickyCartBar.tsx`, `components/Cart.tsx`, `lib/ecommerce-events.ts`, `package.json` and `tests/e2e/mobile-purchase-sync.spec.mjs`.
