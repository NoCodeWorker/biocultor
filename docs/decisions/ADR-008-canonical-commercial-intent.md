# ADR-008: Canonical commercial intent for tea humus

## Status

Approved

## Context

The product page, a generic commercial hub and a duplicated child route targeted the same query: buying tea made from worm humus. Search Console showed impressions split across these URLs, including the redundant path `/comprar-te-de-humus-de-lombriz/comprar-te-de-humus-de-lombriz`.

## Decision

- `/producto/te-humus-liquido-premium` is the only canonical page for the generic purchase intent.
- `/comprar-te-de-humus-de-lombriz` and its duplicated child permanently redirect to the product page.
- Commercial child pages remain indexable only when they target a differentiated intent such as drip irrigation or professional formats.
- `/te-de-humus-de-lombriz` and its children target informational use by crop, not the generic purchase query.
- Editorial articles link contextually to the canonical product page and keep application guides as secondary navigation.

## Alternatives considered

1. Keep every existing URL self-canonical.
   - Rejected because it preserves keyword and link-equity fragmentation.
2. Canonicalize duplicate pages without redirects.
   - Rejected because users and crawlers could continue discovering redundant URLs.
3. Redirect every commercial and application page to the product.
   - Rejected because differentiated long-tail intent would be lost.

## Tradeoffs

- The generic commercial hub is removed as a browsable collection.
- Historical signals need time to consolidate after Google processes the redirects.
- Remaining landing pages require disciplined metadata so they do not drift back toward the generic purchase intent.

## Consequences

- Internal links, sitemap priority and commercial metadata reinforce one product URL.
- Duplicate URLs return permanent redirects and leave the sitemap.
- Application guides can grow informational visibility without competing directly with the product page.
