import prisma from '@/lib/db';
import { articleToMarkdown, mapCategory } from '@/lib/article-to-md';
import { premiumServicePages } from '@/lib/premium-service-pages';
import { seoArticles, seoArticlesOrtiga } from '@/lib/seo-content';
import { phase1AuthorityPosts } from '@/scripts/seed-phase1-authority-posts';
import { serviceApplicationPosts } from '@/scripts/seed-service-application-posts';

const SEED_AUTHOR = 'Equipo Biocultor';

type DashboardSeoPageSeed = {
  kind: string;
  slug: string;
  title: string;
  targetKeyword?: string | null;
  workflowStatus?: string;
  priorityScore?: number;
  label?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  intro?: string | null;
  excerpt?: string | null;
  image?: string | null;
  payloadJson?: string;
  faqJson?: string;
  summaryJson?: string;
  isPublished?: boolean;
};

type SeedPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string;
  coverImage: string;
  coverImageAlt?: string;
};

const protocolLandingSeed: DashboardSeoPageSeed = {
  kind: 'LANDING',
  slug: 'protocolo-cultivo-biologico-profesional',
  title: 'Protocolo de Cultivo Biológico Profesional',
  metaTitle: 'Protocolo de Cultivo Biológico Profesional | Biocultor',
  metaDescription:
    'La guía definitiva paso a paso para maximizar biomasa, cannabinoides y prevenir patógenos en el cultivo de cannabis mediante Té de Humus y Purín de Ortiga.',
  workflowStatus: 'READY',
  priorityScore: 90,
  payloadJson: JSON.stringify({
    heroImage: '/10 litros.jpg',
    section1Image: '/5 litros.jpg',
    section2Image: '/1 litro.jpg',
    section3Image: '/10 litros.jpg',
  }),
};

const legacyServiceSeoSeeds: DashboardSeoPageSeed[] = [
  {
    kind: 'SERVICIO',
    slug: 'regeneracion-cesped-y-jardines',
    title: 'Regeneración de Césped y Jardines',
    targetKeyword: 'regeneracion cesped y jardines',
    workflowStatus: 'READY',
    priorityScore: 90,
    label: 'Servicios',
    metaTitle: 'Regeneración de Césped y Jardines con Té de Humus | Biocultor',
    metaDescription:
      'Servicio profesional de inoculación biológica in-situ para recuperar la salud y el verde de tu césped. Tratamiento 100% ecológico desde 195€.',
    payloadJson: JSON.stringify({
      beforeImage: '/servicios-cesped-antes.webp',
      afterImage: '/servicios-cesped-despues.webp',
      price: '195',
      areaLimit: '500',
      additionalRate: '0.2',
      trustBadge1_title: 'Biología Activa y Fresca',
      trustBadge1_desc:
        'El té de humus se extrae y oxigena pocas horas antes de la aplicación, asegurando millones de microorganismos vivos.',
      trustBadge2_title: 'Avalado por la Ciencia',
      trustBadge2_desc:
        'Estudios científicos corroboran que las enmiendas biológicas líquidas son el mejor tratamiento a medio y largo plazo.',
      trustBadge3_title: 'Cero Plazos de Seguridad',
      trustBadge3_desc:
        'Seguridad total inmediata para tus hijos y mascotas. Sin metales pesados ni químicos de síntesis artificial.',
    }),
    faqJson: JSON.stringify([
      {
        question: '¿Qué es exactamente la inoculación regenerativa?',
        answer:
          'Es la aplicación pulverizada in-situ de un concentrado líquido activo y denso en microorganismos benéficos extraídos del humus de lombriz premium.',
      },
      {
        question: '¿Cuánto tiempo tardan en verse los resultados?',
        answer:
          'Los primeros cambios en vigor de raíz ocurren bajo tierra. Estéticamente, el césped suele evaluarse entre la semana 4 y 8 según estado inicial.',
      },
      {
        question: '¿Es seguro para niños y mascotas?',
        answer:
          'Es un tratamiento biológico sin herbicidas, fungicidas ni fertilizantes químicos de síntesis.',
      },
    ]),
  },
  {
    kind: 'SERVICIO',
    slug: 'te-humus-paisajistas-jardineros',
    title: 'Té de Humus para Paisajistas y Jardineros',
    targetKeyword: 'te de humus paisajistas jardineros',
    workflowStatus: 'READY',
    priorityScore: 95,
    label: 'Servicios',
    metaTitle: 'Té de Humus de Lombriz para Paisajistas y Jardineros | Biocultor',
    metaDescription:
      'Suministro y aplicación profesional de té de humus fresco en Madrid y Castilla-La Mancha. Optimiza suelos arcillosos y calizos con residuo cero.',
    payloadJson: JSON.stringify({
      beforeImage: '/servicios-cesped-antes.webp',
      afterImage: '/servicios-cesped-despues.webp',
      price: '195',
      areaLimit: '500',
      additionalRate: '0.2',
      trustBadge1_title: 'Microbiología Profesional Activa',
      trustBadge1_desc:
        'Extraído en frío y entregado en menos de 24 horas para garantizar la viabilidad biológica.',
      trustBadge2_title: 'Suelos de la Meseta Optimizados',
      trustBadge2_desc:
        'Formulación que rompe las arcillas compactadas y reactiva la nutrición en suelos calizos secos.',
      trustBadge3_title: 'Garantía Ecológica CAAE',
      trustBadge3_desc:
        'Insumo 100% certificado, idóneo para proyectos de paisajismo sostenible y residuo cero.',
    }),
    faqJson: JSON.stringify([
      {
        question: '¿Qué caducidad tiene el Té de Humus de Lombriz?',
        answer:
          'Su efectividad máxima está en las primeras 24-48 horas tras extracción y oxigenación.',
      },
      {
        question: '¿Es compatible con mi equipo de pulverización o cuba de riego?',
        answer:
          'Sí, si se revisa filtrado, presión y método de aplicación antes de operar.',
      },
      {
        question: '¿Se puede mezclar con tratamientos fitosanitarios?',
        answer:
          'No se recomienda mezclar directamente con fungicidas o bactericidas.',
      },
    ]),
  },
];

function buildPremiumServiceSeoSeeds(): DashboardSeoPageSeed[] {
  return premiumServicePages.map((page) => ({
    kind: 'SERVICIO',
    slug: page.slug,
    title: page.title,
    targetKeyword: page.targetKeyword,
    workflowStatus: 'READY',
    priorityScore: page.kind === 'geo' ? 82 : 86,
    label: page.kind === 'geo' ? 'Servicios GEO premium' : 'Servicios premium',
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    intro: page.intent,
    excerpt: page.problem,
    image: page.visualProof.after,
    payloadJson: JSON.stringify({
      beforeImage: page.visualProof.before,
      afterImage: page.visualProof.after,
      visualCaption: page.visualProof.caption,
      source: 'lib/premium-service-pages.ts',
    }),
    faqJson: JSON.stringify(page.faqs),
    summaryJson: JSON.stringify({
      segment: page.segment,
      zone: page.zone,
      serviceRecommended: page.serviceRecommended,
      reference: page.reference,
      localJustification: page.localJustification ?? null,
    }),
    isPublished: true,
  }));
}

function buildStaticArticleSeeds(): SeedPost[] {
  const seoContentSeeds: SeedPost[] = [...seoArticles, ...seoArticlesOrtiga].map((article) => ({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: articleToMarkdown(article),
    category: mapCategory(article.category),
    metaTitle: article.metaTitle,
    metaDesc: article.metaDescription,
    keywords: [article.title, article.category, 'biocultor'].join(', '),
    coverImage: article.image ?? '',
    coverImageAlt: article.title,
  }));

  return [
    ...seoContentSeeds,
    ...serviceApplicationPosts.map((post) => ({
      ...post,
      content: post.content.trim(),
    })),
    ...phase1AuthorityPosts.map((post) => ({
      ...post,
      content: post.content.trim(),
    })),
  ];
}

export async function syncDashboardSeoPages() {
  const seeds = [protocolLandingSeed, ...legacyServiceSeoSeeds, ...buildPremiumServiceSeoSeeds()];
  const existing = await prisma.seoPage.findMany({
    where: { slug: { in: seeds.map((seed) => seed.slug) } },
    select: { id: true, slug: true, image: true, payloadJson: true },
  });
  const existingBySlug = new Map(existing.map((item) => [item.slug, item]));
  const existingSlugs = new Set(existing.map((item) => item.slug));
  const missing = seeds.filter((seed) => !existingSlugs.has(seed.slug));

  if (missing.length > 0) {
    await prisma.seoPage.createMany({
      data: missing.map((seed) => ({
        kind: seed.kind,
        slug: seed.slug,
        title: seed.title,
        targetKeyword: seed.targetKeyword ?? null,
        workflowStatus: seed.workflowStatus ?? 'READY',
        priorityScore: seed.priorityScore ?? 50,
        label: seed.label ?? null,
        metaTitle: seed.metaTitle ?? null,
        metaDescription: seed.metaDescription ?? null,
        intro: seed.intro ?? null,
        excerpt: seed.excerpt ?? null,
        image: seed.image ?? null,
        payloadJson: seed.payloadJson ?? '{}',
        faqJson: seed.faqJson ?? '[]',
        summaryJson: seed.summaryJson ?? '[]',
        isPublished: seed.isPublished ?? true,
      })),
    });
  }

  let refreshedImages = 0;
  for (const seed of seeds) {
    const current = existingBySlug.get(seed.slug);
    if (!current || !seed.image) continue;

    const hasManualImage = current.image?.startsWith('/uploads/');
    const nextPayloadJson = mergeVisualPayload(current.payloadJson, seed.payloadJson);
    const shouldUpdateImage = !hasManualImage && current.image !== seed.image;
    const shouldUpdatePayload = nextPayloadJson !== current.payloadJson;

    if (!shouldUpdateImage && !shouldUpdatePayload) continue;

    await prisma.seoPage.update({
      where: { id: current.id },
      data: {
        ...(shouldUpdateImage ? { image: seed.image } : {}),
        ...(shouldUpdatePayload ? { payloadJson: nextPayloadJson } : {}),
      },
    });
    refreshedImages++;
  }

  return { created: missing.length, refreshedImages };
}

export async function syncDashboardBlogPosts() {
  const seeds = buildStaticArticleSeeds();
  const existing = await prisma.post.findMany({
    where: { slug: { in: seeds.map((seed) => seed.slug) } },
    select: { id: true, slug: true, author: true, coverImage: true, coverImageAlt: true },
  });
  const existingBySlug = new Map(existing.map((item) => [item.slug, item]));
  const existingSlugs = new Set(existing.map((item) => item.slug));
  const missing = seeds.filter((seed) => !existingSlugs.has(seed.slug));

  if (missing.length > 0) {
    await prisma.post.createMany({
      data: missing.map((seed) => ({
        title: seed.title,
        slug: seed.slug,
        excerpt: seed.excerpt,
        content: seed.content,
        category: seed.category,
        metaTitle: seed.metaTitle,
        metaDesc: seed.metaDesc,
        keywords: seed.keywords,
        coverImage: seed.coverImage || null,
        coverImageAlt: seed.coverImageAlt ?? seed.title,
        isPublished: true,
        author: SEED_AUTHOR,
      })),
    });
  }

  let refreshedImages = 0;
  for (const seed of seeds) {
    const current = existingBySlug.get(seed.slug);
    if (!current || current.author !== SEED_AUTHOR || current.coverImage?.startsWith('/uploads/')) {
      continue;
    }

    const nextCoverImage = seed.coverImage || null;
    const nextCoverImageAlt = seed.coverImageAlt ?? seed.title;
    if (
      current.coverImage === nextCoverImage &&
      current.coverImageAlt === nextCoverImageAlt
    ) {
      continue;
    }

    await prisma.post.update({
      where: { id: current.id },
      data: {
        coverImage: nextCoverImage,
        coverImageAlt: nextCoverImageAlt,
      },
    });
    refreshedImages++;
  }

  return { created: missing.length, refreshedImages };
}

function mergeVisualPayload(currentPayloadJson: string | null, seedPayloadJson?: string) {
  if (!seedPayloadJson) return currentPayloadJson ?? '{}';

  let currentPayload: Record<string, unknown> = {};
  let seedPayload: Record<string, unknown> = {};

  try {
    currentPayload = currentPayloadJson ? JSON.parse(currentPayloadJson) : {};
  } catch {
    currentPayload = {};
  }

  try {
    seedPayload = JSON.parse(seedPayloadJson);
  } catch {
    return currentPayloadJson ?? '{}';
  }

  const nextPayload = { ...currentPayload };
  for (const field of ['beforeImage', 'afterImage', 'heroImage', 'visualCaption']) {
    const currentValue = currentPayload[field];
    const seedValue = seedPayload[field];
    if (typeof seedValue !== 'string' || !seedValue.trim()) continue;
    if (typeof currentValue === 'string' && currentValue.startsWith('/uploads/')) continue;
    nextPayload[field] = seedValue;
  }

  return JSON.stringify(nextPayload);
}
