import type { Metadata } from 'next';
import { getBaseUrl, siteConfig } from '@/lib/site-config';

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
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
