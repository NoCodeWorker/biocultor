export const revalidate = 3600

import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import {
  getSeoArticles,
  getSeoArticlesOrtiga,
  getSeoCommercialPages,
  getSeoCommercialPagesOrtiga,
  getSeoGeoPages,
  getSeoSolutions,
  getSeoSolutionsOrtiga,
} from '@/lib/seo-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [
    seoArticles,
    seoArticlesOrtiga,
    seoCommercialPages,
    seoCommercialPagesOrtiga,
    seoGeoPages,
    seoSolutions,
    seoSolutionsOrtiga,
  ] = await Promise.all([
    getSeoArticles(),
    getSeoArticlesOrtiga(),
    getSeoCommercialPages(),
    getSeoCommercialPagesOrtiga(),
    getSeoGeoPages(),
    getSeoSolutions(),
    getSeoSolutionsOrtiga(),
  ]);

  const staticRoutes = [
    '/',
    '/aprende',
    '/comprar-te-de-humus-de-lombriz',
    '/comprar-purin-de-ortiga',
    '/contacto',
    '/cookies',
    '/espana',
    '/envios',
    '/privacidad',
    '/producto/te-humus-liquido-premium',
    '/producto/purin-ortiga-concentrado',
    '/te-de-humus-de-lombriz',
    '/purin-de-ortiga',
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
    ...seoArticlesOrtiga.map((article) => ({
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
    ...seoCommercialPagesOrtiga.map((page) => ({
      url: absoluteUrl(`/comprar-purin-de-ortiga/${page.slug}`),
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
    ...seoSolutionsOrtiga.map((solution) => ({
      url: absoluteUrl(`/purin-de-ortiga/${solution.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
