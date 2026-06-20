# ADR-005: Editorial Visual Generation Policy

## Status

Approved

## Context

Biocultor uses blog and landing visuals that combine a realistic agricultural/product scene with a clear infographic based on the page title. These assets influence CTR, perceived authority, CRO and visual consistency across `/aprende`, service landings and SEO pages.

Generating the complete asset as a single AI image is risky because image models can introduce misspellings, distorted icons or incorrect Spanish text. The system needs a repeatable workflow that keeps photorealism high while making the infographic layer deterministic and editable.

## Decision

### 1. Hybrid Generation Workflow

Future editorial images must use a hybrid workflow:

1. Generate the hyperrealistic visual scene with the best available OpenAI image generator.
2. Compose the infographic layer programmatically after generation.
3. Export the final asset as optimized `.webp`.
4. Assign the image to the post or landing through the existing `coverImage` / `image` fields.

The image generator may create the scene, lighting, product context and environmental realism. It must not be the only source of final readable text.

### 2. Text Accuracy Rule

All final visible Spanish text, titles, bullets, labels, dosage notes and CTA strips must be rendered by code, not trusted to raw image generation. This prevents typos in SEO-critical assets.

Allowed generated text inside the photographic scene is limited to decorative product labels when non-critical. Critical titles and infographics must be deterministic.

### 3. Default Aspect Ratios

- Blog posts: `16:9`, recommended `1792x1024` source and final WebP around `1600x900` or `1200x675`.
- SERP/OG variants: optional `1.91:1` or `1200x630`.
- Service/landing hero assets: `16:9` by default, with optional vertical/mobile crop when the page layout requires it.
- Product SERP thumbnails remain governed by the product WebP policy.

### 4. Biocultor Visual Style

Editorial images must preserve these brand cues:

- warm natural light;
- realistic Spanish garden, huerto, chalet, community garden or professional landscaping setting;
- dark green Biocultor accents;
- cream infographic panels;
- simple agronomic line icons;
- readable hierarchy with large title, short benefit blocks and one practical takeaway;
- no generic stock-photo look;
- no exaggerated scientific claims beyond ADR-002 evidence limits.

### 5. Database and Dashboard Preservation

This policy does not supersede ADR-003. If a post already has a manually uploaded `/uploads/...` image, batch scripts must preserve it unless the user explicitly approves replacement.

For generated roadmap assets stored in `public/`, future seed scripts may set them as default `coverImage`, but must still preserve dashboard uploads.

## Alternatives Considered

1. Full AI-generated infographics only.
   - Rejected because text accuracy is not reliable enough for SEO and brand trust.
2. Manual design in an external editor for every post.
   - Rejected as too slow and inconsistent for scalable editorial production.
3. Generic photographic covers without infographic overlays.
   - Rejected because it weakens CTR, topical clarity and perceived expertise.

## Tradeoffs

- The hybrid workflow is slower than one-shot image generation.
- It requires a small composition script or design template.
- It produces more reliable Spanish text and a more maintainable visual system.

## Consequences

- Future posts and landings can ship with realistic, branded, SEO-friendly WebP covers.
- The dashboard remains the final editing surface for manual replacement.
- Generated images become part of the editorial workflow, not an ad hoc afterthought.
