# Mobile CRO QA for product and home

## Objective

Improve mobile conversion clarity on the home page and product detail page by reducing above-the-fold friction and prioritizing purchase decisions earlier in the viewport.

## Context

Visual QA on a 390 x 844 mobile viewport showed that the product detail page placed the product gallery, thumbnails, and audio player before the title, format selector, price, and add-to-cart action. The home hero also exposed three competing actions in the first mobile viewport.

## Affected Systems

- Home hero CTA hierarchy
- Product detail mobile layout
- Product purchase funnel and sticky cart behavior

## Decisions

- Reorder the product funnel on mobile so the conversion column renders before the media gallery while preserving the desktop two-column layout.
- Keep the product gallery and audio player available, but move them below the mobile purchase decision path.
- Move contextual proof cards and urgency messaging after format, quantity, price, add-to-cart, and checkout trust signals so they support the decision instead of delaying it.
- Hide the services CTA in the home mobile hero, leaving the primary purchase CTA and formats/pricing link visible.

## Risks

- Product imagery is no longer the first visual block on mobile product pages.
- Users seeking services from the home hero need to scroll further or use navigation on mobile.

## Validation

- `npm run typecheck`
- `npx eslint "components/ProductFunnel.tsx" "app/(shop)/page.tsx"`
- `npm run build`
- Production visual QA after VPS deploy with mobile screenshots.

## Rollback

Revert the mobile order classes in `components/ProductFunnel.tsx` and remove the mobile visibility class from the services CTA in `app/(shop)/page.tsx`.
