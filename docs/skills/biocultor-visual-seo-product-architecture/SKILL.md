---
name: biocultor-visual-seo-product-architecture
description: >-
  Enforces visual SEO and AIO (AI search optimization) architecture on new and modified product pages of Biocultor. Covers 1200x1200px square WebP image generation, dynamic route mappings, JSON-LD @graph structure with ID-linking, Open Graph metadata, and GSC indexing/sitemap validation.
---

# Biocultor Visual SEO & AIO Product Architecture

## Overview
This skill establishes and enforces the technical standard of gold-level Visual SEO and AI Search Optimization (AIO) for product pages in the Biocultor e-commerce platform. It ensures that any newly created or modified product satisfies the visual and structural requirements of both Google (organic 1:1 thumbnails, review snippets, merchant listings, product image carousels) and AI crawlers (Perplexity, ChatGPT Search, Gemini).

---

## Dependencies
1. **mcp-search-console:** Used in Step 6 to automate sitemap submissions (`submit_sitemap`) and perform live indexing audits (`inspect_url_enhanced`).

---

## Quick Start

When asked to create a new product or modify an existing product page:
1. Generate the optimized square WebP assets: `npm run generate:webp`.
2. Add the dynamic images map to `app/(shop)/producto/[slug]/page.tsx`'s `PRODUCT_IMAGES_MAP` dictionary.
3. Integrate the JSON-LD `@graph` structure with proper ID-linking connecting `WebPage`, `Product`, dynamic `Offer` variants, and `ImageObject` elements.
4. Set Open Graph attributes with `buildProductOgMetadata` in `generateMetadata()`.
5. Implement HTML picture tags using the `<ProductImageGallery>` component.
6. Push to production VPS and notify Google via GSC.

---

## Utility Scripts

### WebP Generation & Optimization
The repository contains a custom script to batch-process original JPG images into SEO-compliant square WebPs:
*   **Path:** `scripts/generate-product-webp.mjs`
*   **Command:** `npm run generate:webp`
*   **Operation:**
    1. Read original JPG source images from `public/`.
    2. Convert them to highly optimized, square **1200×1200px (1:1 ratio)** WebP images.
    3. Save outputs in `public/media/` with descriptive names (e.g., `media/slug-format.webp`).
    4. Size matches exactly the dimensions required for Google's SERP Thumbnails and Merchant Listings.

---

## Workflow

### 1. Step 1: WebP Asset Generation
Ensure every product has distinct, high-quality images.
- Google indexes images based on URL. Separate products **MUST** have unique image URLs even if they use the same physical formats (e.g., `media/te-humus-5l.webp` vs `media/purin-ortiga-5l.webp`).
- Add new conversions inside `scripts/generate-product-webp.mjs`.
- Execute `npm run generate:webp` to output WebPs (~6 KB each).

### 2. Step 2: Dynamic Image Map Integration
- Add the product's slug and image mapping inside the `PRODUCT_IMAGES_MAP` dictionary in `app/(shop)/producto/[slug]/page.tsx`.
- Example entry:
```typescript
'slug-del-producto': [
  {
    webpSrc: 'https://biocultor.com/media/slug-del-producto-5l.webp',
    jpgFallbackSrc: 'https://biocultor.com/5%20litros.jpg',
    alt: 'Nombre oficial del producto - Formato 5 Litros',
    width: 1200,
    height: 1200,
  },
  ...
]
```

### 3. Step 3: Implement JSON-LD `@graph`
To support Google Product Carousel and Rich Snippets, the structured data must use the `@graph` pattern.
- **Node inter-connectivity:**
  - `WebPage` references the primary image via `primaryImageOfPage: { '@id': '...#image-1' }`.
  - `Product` references the array of image objects via `image: imageObjects.map(img => ({ '@id': img['@id'] }))`.
  - `ImageObject` elements declare the absolute `contentUrl` (using the WebP image) and `encodingFormat: 'image/webp'`, linked using `#image-1`, `#image-2`, etc.
  - `Offer` elements declare individual product variants (1L, 5L, 10L, 25L) with unique SKU, price, stock availability, and exact **shipping details** & **return policies** (crucial for Google Merchant Center / Shopping).

### 4. Step 4: Open Graph & WPO
Configure dynamic metadata in `generateMetadata()`:
- Use `buildProductOgMetadata` returning:
  * `og:type=product`
  * `og:image` with 1200×1200px dimensions.
  * `og:image:type=image/webp`
  * Dynamic price and availability based on active DB variants.
  * Dynamically mapped `keywords` based on the product.

### 5. Step 5: HTML Picture Gallery Integration
- Use the `<ProductImageGallery>` component in the main render function:
```typescript
const productImages = getProductImages(resolvedParams.slug);

<ProductImageGallery
  images={productImages}
  productName={product.name}
  className="mb-2"
/>
```
- This ensures HTML picture tags are rendered matching the exact URLs in JSON-LD. The first image must load with `eager` (LCP optimization) and secondary thumbnails with lazy load.
- Ensure the **semantic signal block** is present for AI engines:
```html
<div className="sr-only" aria-label={`Información técnica detallada de ${product.name}`}>
  {product.name} es un... [datos estructurados de precios, dosis, formatos]
</div>
```

### 6. Step 6: Deploy & Google Search Console Verification
- Commit the code, push to `main` and deploy on the VPS via `docker compose up -d --build web`.
- Access the `mcp-search-console` server:
  - Submit the sitemap using `submit_sitemap` for `https://biocultor.com/sitemap.xml`.
  - Use `inspect_url_enhanced` on the product URL to check index status and confirm all 5 Rich Result categories are present and error-free:
    1. `Product snippets`
    2. `Merchant listings`
    3. `Breadcrumbs`
    4. `FAQ`
    5. `Review snippets`

---

## Reference Templates
See templates in the `./resources/` directory for raw code blocks:
- [page_template.tsx.txt](file:///d:/BIOCULTOR/BIOCULTOR%20SHOP/biocultor/docs/skills/biocultor-visual-seo-product-architecture/resources/page_template.tsx.txt)
- [og_template.ts.txt](file:///d:/BIOCULTOR/BIOCULTOR%20SHOP/biocultor/docs/skills/biocultor-visual-seo-product-architecture/resources/og_template.ts.txt)

---

## Common Mistakes
*   **Duplicate Image URLs across Products:** Sharing WebP URLs between Humus and Ortiga will cause Google to merge them into a single visual listing, penalizing individual search relevance. **Always generate unique WebP filenames per product.**
*   **Missing Shipping or Return Policies:** Leaving out return window, return fees, or region-defined shipping rates in the `Offer` schema will result in warnings inside Google Merchant Center, disabling advanced Google Shopping listings.
*   **Undefined PRODUCT_IMAGES usage:** Ensure that the dynamic component uses `images={productImages}` (resolved via helper) instead of any legacy static array references.
