export const dynamic = 'force-dynamic'

import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { getSeoArticles, getSeoCommercialPages, getSeoGeoPages, getSeoSolutions } from '@/lib/seo-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [seoArticles, seoCommercialPages, seoGeoPages, seoSolutions] = await Promise.all([
    getSeoArticles(),
    getSeoCommercialPages(),
    getSeoGeoPages(),
    getSeoSolutions(),
  ]);

  const staticRoutes = [
    '/',
    '/aprende',
    '/comprar-te-de-humus-de-lombriz',
    '/contacto',
    '/cookies',
    '/espana',
    '/envios',
    '/privacidad',
    '/producto/te-humus-liquido-premium',
    '/te-de-humus-de-lombriz',
    '/terminos',
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: (path === '/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: path === '/' ? 1 : 0.7,
    })),
    ...seoArticles.map((article) => ({
      url: absoluteUrl(`/aprende/${article.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...seoCommercialPages.map((page) => ({
      url: absoluteUrl(`/comprar-te-de-humus-de-lombriz/${page.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.82,
    })),
    ...seoGeoPages.map((page) => ({
      url: absoluteUrl(`/espana/${page.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.78,
    })),
    ...seoSolutions.map((solution) => ({
      url: absoluteUrl(`/te-de-humus-de-lombriz/${solution.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
