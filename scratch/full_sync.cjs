
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { seoArticles, seoArticlesOrtiga } = require('../lib/seo-content');

async function sync() {
  console.log('--- SYNCING POSTS ---');
  const allStatic = [...seoArticles, ...seoArticlesOrtiga];
  const existingPosts = await prisma.post.findMany({ select: { slug: true } });
  const dbSlugs = new Set(existingPosts.map(p => p.slug));

  const missing = allStatic.filter(s => !dbSlugs.has(s.slug));
  console.log(`Missing articles: ${missing.length}`);

  for (const art of missing) {
    console.log(`Creating Post for: ${art.slug}`);
    await prisma.post.create({
      data: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt || '',
        content: 'Artículo sincronizado automáticamente desde el sistema SEO. Edita aquí para gestionar su imagen y metadatos.',
        category: art.category === 'Evidencia' ? 'EVIDENCE' : 'KNOWLEDGE',
        isPublished: true,
        keywords: art.slug.replace(/-/g, ' '),
        coverImage: art.image || null, // Usar la imagen estática como inicial
      }
    });
  }

  console.log('--- SYNCING LANDING ---');
  const landingSlug = 'protocolo-cultivo-biologico-profesional';
  const existingLanding = await prisma.seoPage.findUnique({ where: { slug: landingSlug } });
  if (!existingLanding) {
    console.log(`Creating SeoPage for: ${landingSlug}`);
    await prisma.seoPage.create({
      data: {
        kind: 'LANDING',
        slug: landingSlug,
        title: 'Protocolo de Cultivo Biológico Profesional',
        metaTitle: 'Protocolo de Cultivo Biológico Profesional | Biocultor',
        metaDescription: 'La guía definitiva paso a paso para maximizar biomasa, cannabinoides y prevenir patógenos en el cultivo de cannabis mediante Té de Humus y Purín de Ortiga.',
        workflowStatus: 'READY',
        priorityScore: 90,
        payloadJson: JSON.stringify({
          heroImage: '/10 litros.jpg',
          section1Image: '/5 litros.jpg',
          section2Image: '/1 litro.jpg',
          section3Image: '/10 litros.jpg'
        }),
      }
    });
  } else {
    console.log('Landing already exists in SeoPage.');
  }

  console.log('--- SYNC COMPLETE ---');
}

sync().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
