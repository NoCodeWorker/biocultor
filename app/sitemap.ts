export const revalidate = 3600

import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { premiumServicePages } from '@/lib/premium-service-pages';
import {
  getSeoCommercialPages,
  getSeoCommercialPagesOrtiga,
  getSeoGeoPages,
  getSeoSolutions,
  getSeoSolutionsOrtiga,
} from '@/lib/seo-store';
import prisma from '@/lib/db';

const serviceApplicationArticleRoutes = [
  {
    path: '/aprende/servicio-aplicacion-te-humus-cuando-contratar',
    lastmod: '2026-06-18',
  },
  {
    path: '/aprende/regeneracion-cesped-servicio-aplicacion-humus',
    lastmod: '2026-06-18',
  },
  {
    path: '/aprende/calcular-litros-coste-m2-te-humus-paisajistas',
    lastmod: '2026-06-18',
  },
  {
    path: '/aprende/aplicacion-humus-comunidades-jardines-madrid-toledo',
    lastmod: '2026-06-18',
  },
  {
    path: '/aprende/servicio-aplicacion-humus-zonas-verdes-mantenimiento',
    lastmod: '2026-06-18',
  },
  {
    path: '/aprende/servicio-aplicacion-humus-madrid-toledo-castilla-la-mancha',
    lastmod: '2026-06-18',
  },
];

const phase1AuthorityArticleRoutes = [
  {
    path: '/aprende/te-humus-liquido-vs-humus-solido-jardines-premium',
    lastmod: '2026-06-19',
  },
  {
    path: '/aprende/aplicar-te-humus-cesped-sin-quemarlo',
    lastmod: '2026-06-19',
  },
  {
    path: '/aprende/cuando-contratar-aplicacion-profesional-te-humus-jardin',
    lastmod: '2026-06-19',
  },
  {
    path: '/aprende/humus-liquido-suelos-compactados-jardines',
    lastmod: '2026-06-19',
  },
  {
    path: '/aprende/humus-lombriz-jardines-mascotas-ninos',
    lastmod: '2026-06-19',
  },
  {
    path: '/aprende/mantenimiento-jardines-bajo-residuo-visible',
    lastmod: '2026-06-19',
  },
  {
    path: '/aprende/riego-goteo-jardines-ornamentales-te-humus',
    lastmod: '2026-06-19',
  },
  {
    path: '/aprende/coste-m2-aplicar-humus-liquido-jardin',
    lastmod: '2026-06-19',
  },
];

const curatedArticleRoutes = [
  ...serviceApplicationArticleRoutes,
  ...phase1AuthorityArticleRoutes,
];

const curatedArticleSlugs = new Set(
  curatedArticleRoutes.map((route) => route.path.split('/').at(-1))
);

const premiumServiceRoutes = premiumServicePages.map((page) => ({
  path: `/servicios/${page.slug}`,
  lastmod: '2026-06-19',
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [
    seoCommercialPages,
    seoCommercialPagesOrtiga,
    seoGeoPages,
    seoSolutions,
    seoSolutionsOrtiga,
  ] = await Promise.all([
    getSeoCommercialPages(),
    getSeoCommercialPagesOrtiga(),
    getSeoGeoPages(),
    getSeoSolutions(),
    getSeoSolutionsOrtiga(),
  ]);

  let dynamicPosts: Array<{ slug: string; updatedAt: Date; createdAt: Date }> = [];
  let dynamicLandings: Array<{ slug: string; updatedAt: Date; createdAt: Date }> = [];
  try {
    const [posts, landings] = await Promise.all([
      prisma.post.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true, createdAt: true },
      }),
      prisma.seoPage.findMany({
        where: { kind: 'LANDING', isPublished: true },
        select: { slug: true, updatedAt: true, createdAt: true },
      })
    ]);
    dynamicPosts = posts.filter((post) => !curatedArticleSlugs.has(post.slug));
    dynamicLandings = landings;
  } catch {
    console.warn("DB no disponible para obtener dynamicPages en sitemap.ts, usando fallback vacío.");
  }

  // Fechas de última modificación real por ruta estática.
  // IMPORTANTE: No usar new Date() para rutas estáticas — Google ignora sitemaps
  // donde todos los lastmod son idénticos, interpretándolo como una señal falsa.
  const staticRoutesMeta: Array<{ path: string; lastmod: string; priority: number; changeFrequency: 'weekly' | 'monthly' }> = [
    { path: '/',                                              lastmod: '2026-06-09', priority: 1,    changeFrequency: 'weekly'  },
    { path: '/producto/te-humus-liquido-premium',             lastmod: '2026-06-09', priority: 0.95, changeFrequency: 'weekly'  },
    { path: '/producto/purin-ortiga-concentrado',             lastmod: '2026-06-09', priority: 0.95, changeFrequency: 'weekly'  },
    { path: '/comprar-te-de-humus-de-lombriz',                lastmod: '2026-06-01', priority: 0.85, changeFrequency: 'weekly'  },
    { path: '/comprar-purin-de-ortiga',                       lastmod: '2026-06-01', priority: 0.85, changeFrequency: 'weekly'  },
    { path: '/te-de-humus-de-lombriz',                        lastmod: '2026-06-01', priority: 0.82, changeFrequency: 'weekly'  },
    { path: '/purin-de-ortiga',                               lastmod: '2026-06-01', priority: 0.82, changeFrequency: 'weekly'  },
    { path: '/espana',                                        lastmod: '2026-06-01', priority: 0.8,  changeFrequency: 'weekly'  },
    { path: '/aprende',                                       lastmod: '2026-06-01', priority: 0.78, changeFrequency: 'weekly'  },
    { path: '/aprende/protocolo-cultivo-biologico-profesional', lastmod: '2026-05-28', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/servicios',                                     lastmod: '2026-06-19', priority: 0.88, changeFrequency: 'weekly'  },
    { path: '/servicios/regeneracion-cesped-y-jardines',        lastmod: '2026-06-09', priority: 0.9,  changeFrequency: 'monthly' },
    { path: '/servicios/te-humus-paisajistas-jardineros',       lastmod: '2026-06-09', priority: 0.9,  changeFrequency: 'monthly' },
    { path: '/contacto',                                      lastmod: '2026-05-01', priority: 0.6,  changeFrequency: 'monthly' },
    { path: '/envios',                                        lastmod: '2026-05-01', priority: 0.5,  changeFrequency: 'monthly' },
    { path: '/privacidad',                                    lastmod: '2026-05-01', priority: 0.3,  changeFrequency: 'monthly' },
    { path: '/terminos',                                      lastmod: '2026-05-01', priority: 0.3,  changeFrequency: 'monthly' },
    { path: '/cookies',                                       lastmod: '2026-05-01', priority: 0.3,  changeFrequency: 'monthly' },
  ];

  return [
    ...staticRoutesMeta.map(({ path, lastmod, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      lastModified: new Date(lastmod),
      changeFrequency,
      priority,
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
    ...serviceApplicationArticleRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: new Date(route.lastmod),
      changeFrequency: 'monthly' as const,
      priority: 0.76,
    })),
    ...phase1AuthorityArticleRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: new Date(route.lastmod),
      changeFrequency: 'monthly' as const,
      priority: 0.77,
    })),
    ...premiumServiceRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: new Date(route.lastmod),
      changeFrequency: 'monthly' as const,
      priority: 0.84,
    })),
    ...dynamicPosts.map((post) => ({
      url: absoluteUrl(`/aprende/${post.slug}`),
      lastModified: post.updatedAt || post.createdAt || now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...dynamicLandings.map((landing) => ({
      url: absoluteUrl(`/solucion-humus/${landing.slug}`),
      lastModified: landing.updatedAt || landing.createdAt || now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
