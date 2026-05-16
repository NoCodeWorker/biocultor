
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function fix() {
  console.log('--- FIXING DATABASE RECORDS ---');
  
  const PLACEHOLDER = 'Artículo sincronizado automáticamente desde el sistema SEO. Edita aquí para gestionar su imagen y metadatos.';

  // 1. Asegurar que 'cuantas-plantas-marihuana-legales-espana' existe en Post
  const marihuanaSlug = 'cuantas-plantas-marihuana-legales-espana';
  const post = await prisma.post.findUnique({ where: { slug: marihuanaSlug } });
  if (!post) {
    console.log('Creating missing Post: ' + marihuanaSlug);
    await prisma.post.create({
      data: {
        slug: marihuanaSlug,
        title: '¿Cuántas plantas de marihuana son legales en España para autoconsumo?',
        excerpt: 'No hay un número mágico de plantas legales. La Ley Orgánica 4/2015 sanciona la visibilidad, mientras la jurisprudencia evalúa el autoconsumo privado.',
        content: PLACEHOLDER,
        category: 'EVIDENCE',
        isPublished: true,
        keywords: 'cuantas plantas marihuana legales españa',
        coverImage: '/5 litros.jpg'
      }
    });
  } else {
    console.log('Post already exists: ' + marihuanaSlug);
  }

  // 2. Asegurar que la landing existe en SeoPage
  const landingSlug = 'protocolo-cultivo-biologico-profesional';
  const landing = await prisma.seoPage.findUnique({ where: { slug: landingSlug } });
  if (!landing) {
    console.log('Creating missing SeoPage landing: ' + landingSlug);
    await prisma.seoPage.create({
      data: {
        kind: 'LANDING',
        slug: landingSlug,
        title: 'Protocolo de Cultivo Biológico Profesional',
        metaTitle: 'Protocolo de Cultivo Biológico Profesional | Biocultor',
        metaDescription: 'La guía definitiva paso a paso para maximizar biomasa, cannabinoides y prevenir patógenos en el cultivo de cannabis.',
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

  console.log('--- DONE ---');
}

fix().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
