import type { Metadata } from 'next';
import { getBaseUrl, siteConfig } from '@/lib/site-config';

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
};

// ── Product-specific OG metadata input ──────────────────────────────────────
// image must point to a .webp file (1200×1200 for 1:1 SERP thumbnails).
// Passing multiple webpImages lets Google pick the best one for the carousel.
type ProductOgInput = MetadataInput & {
  /** Primary product WebP image (absolute or relative path). */
  primaryWebpImage: string;
  /** Optional extra WebP images for Google image carousel (up to 6). */
  extraWebpImages?: string[];
  price: string;
  currency?: string;
  availability?: 'instock' | 'outofstock' | 'preorder';
};

export function absoluteUrl(path = '/') {
  const baseUrl = getBaseUrl();
  return new URL(path, baseUrl).toString();
}

export function buildMetadata({
  title,
  description,
  path = '/',
  keywords = [],
  image = '/Logo.svg',
}: MetadataInput): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(getBaseUrl()),
    alternates: {
      canonical,
      languages: {
        'es-ES': canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.legalName,
      locale: 'es_ES',
      type: 'website',
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(image)],
    },
    category: 'ecommerce',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/Favicon.svg', type: 'image/svg+xml' },
        { url: '/media/favicon-48.png', sizes: '48x48', type: 'image/png' },
        { url: '/media/favicon-96.png', sizes: '96x96', type: 'image/png' },
        { url: '/media/favicon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [
        { url: '/media/favicon-180.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    brand: siteConfig.name,
    url: getBaseUrl(),
    logo: absoluteUrl('/Logo.svg'),
    email: siteConfig.supportEmail,
    telephone: siteConfig.supportPhone,
    sameAs: siteConfig.socials,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.country,
    },
    areaServed: {
      '@type': 'Country',
      name: 'España',
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.legalName,
    url: getBaseUrl(),
    inLanguage: siteConfig.locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getBaseUrl()}/te-de-humus-de-lombriz/{query}`,
      'query-input': 'required name=query',
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faq: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function collectionPageSchema({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: Array<{ name: string; path: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    hasPart: items.map((item) => ({
      '@type': 'WebPage',
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 2 — Open Graph optimizado para página de producto con WebP
// Objetivo: activar las tres señales visuales en Google:
//   • Miniaturas 1:1 en SERPs orgánicas  (og:image 1200×1200, og:image:type=image/webp)
//   • Rich Snippet de producto           (og:type=product + og:price:*)
//   • Carrusel de imágenes               (se refuerza con el JSON-LD @graph, ver bloque 1)
//
// Next.js 14+ serializa el objeto Metadata en <head>. Las propiedades "other"
// permiten inyectar cualquier meta tag que Next no soporte nativamente, como
// og:image:type, og:availability y og:price:amount.
// ─────────────────────────────────────────────────────────────────────────────
export function buildProductOgMetadata({
  title,
  description,
  path = '/',
  keywords = [],
  primaryWebpImage,
  extraWebpImages = [],
  price,
  currency = 'EUR',
  availability = 'instock',
}: ProductOgInput): Metadata {
  const canonical = absoluteUrl(path);
  // Garantiza URL absoluta tanto si se pasa una ruta relativa como absoluta
  const primaryAbsolute = primaryWebpImage.startsWith('http')
    ? primaryWebpImage
    : absoluteUrl(primaryWebpImage);

  // Hasta 6 imágenes en total: la principal + las adicionales.
  // Google utiliza el array para construir el carrusel de producto en Imágenes.
  const allWebpImages = [primaryAbsolute, ...extraWebpImages.map((u) =>
    u.startsWith('http') ? u : absoluteUrl(u)
  )].slice(0, 6);

  // og:image objects para Next.js (nativo) — priorizamos 1200×1200 (ratio 1:1)
  // porque Google Lens y los snippets de texto usan miniaturas cuadradas.
  const ogImages = allWebpImages.map((url, i) => ({
    url,
    width: 1200,
    height: 1200,
    alt: i === 0 ? title : `${title} — vista ${i + 1}`,
    // Next.js 14.2+ renderiza type como og:image:type cuando se pasa aquí
    type: 'image/webp' as const,
  }));

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(getBaseUrl()),
    alternates: {
      canonical,
      languages: { 'es-ES': canonical },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.legalName,
      locale: 'es_ES',
      // og:type=product activa el rich snippet de producto en Facebook/WhatsApp
      // y es leído por algunos parsers de Google Shopping
      type: 'website', // Next.js Metadata solo acepta tipos estándar aquí; el
      // og:type=product real se inyecta vía "other" más abajo
      images: ogImages,
    },
    twitter: {
      // summary_large_image usa la primera imagen como thumbnail 1:1
      card: 'summary_large_image',
      title,
      description,
      images: [primaryAbsolute],
    },
    // "other" → meta tags arbitrarios que Next.js serializa directamente en <head>
    // Esto es lo que activa:
    //   • og:type=product (sobrescribe el og:type=website de openGraph arriba)
    //   • og:image:type=image/webp → fuerza procesamiento WebP en crawlers legacy
    //   • og:price:amount + og:price:currency → Rich Snippet de precio
    //   • og:availability → estado de stock en parsers de shopping
    //   • product:price:amount + product:price:currency → formato Open Graph Commerce
    other: {
      // Tipo semántico de página: activa el rich card de producto
      'og:type': 'product',
      // MIME type explícito — imprescindible para Googlebot Image y bots legacy
      // que no infieren el tipo por extensión (.webp aún no es universal)
      'og:image:type': 'image/webp',
      // Dimensiones explícitas de la imagen principal (refuerzo del objeto OG)
      'og:image:width': '1200',
      'og:image:height': '1200',
      // Precio y moneda en formato Open Graph Product
      'og:price:amount': price,
      'og:price:currency': currency,
      // Disponibilidad de stock
      'og:availability': availability,
      // Protocolo Open Graph Commerce (Facebook Shops / Instagram Shopping)
      'product:price:amount': price,
      'product:price:currency': currency,
      // Marca del producto
      'product:brand': siteConfig.name,
      'product:condition': 'new',
    },
    category: 'ecommerce',
    icons: {
      icon: '/Favicon.svg',
      apple: '/Favicon.svg',
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 1-B — Schema.org ImageObject array para el carrusel de Google Images
//
// Google exige que el nodo Product tenga la propiedad "image" con MÚLTIPLES
// objetos ImageObject (no solo URLs strings) para habilitar el carrusel visual
// en las SERPs de imágenes y en Google Shopping.
//
// Se usa en el @graph del JSON-LD de la página de producto (ver page.tsx).
// ─────────────────────────────────────────────────────────────────────────────
export function productImageSchema({
  webpUrls,     // Array de URLs absolutas .webp
  jpgFallbackUrls, // Array de URLs absolutas .jpg (mismo orden que webpUrls)
  productName,
  width = 1200,
  height = 1200,
}: {
  webpUrls: string[];
  jpgFallbackUrls: string[];
  productName: string;
  width?: number;
  height?: number;
}) {
  // Construimos un ImageObject por cada imagen WebP, declarando también
  // el fallback JPG mediante la propiedad "thumbnail"
  return webpUrls.map((webpUrl, i) => ({
    '@type': 'ImageObject',
    // contentUrl es la URL canónica de la imagen — Google la usa para el índice
    contentUrl: webpUrl,
    // url es la URL de la página en la que se encuentra la imagen (para el
    // bloque visual de Google y Google Shopping)
    url: webpUrl,
    // encodingFormat explícito: imprescindible para que Google clasifique como WebP
    encodingFormat: 'image/webp',
    width,
    height,
    // caption describe el contenido para Google Lens y búsqueda por imagen
    caption: `${productName}${i > 0 ? ` — vista ${i + 1}` : ''}`,
    // name actúa como título de la imagen en los resultados de búsqueda
    name: `${productName}${i > 0 ? ` — imagen ${i + 1}` : ' — imagen principal'}`,
    // El fallback JPG se declara como thumbnail para crawlers sin soporte WebP
    ...(jpgFallbackUrls[i]
      ? {
          thumbnail: {
            '@type': 'ImageObject',
            contentUrl: jpgFallbackUrls[i],
            encodingFormat: 'image/jpeg',
            width,
            height,
          },
        }
      : {}),
  }));
}

