import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('=== TRATANDO DUPLICADOS EN TABLA POST ===');
  
  const landings = await prisma.seoPage.findMany({
    where: { kind: 'LANDING' },
    select: { slug: true, title: true }
  });
  
  console.log(`Landings especiales registradas en SeoPage: ${landings.length}`);
  for (const landing of landings) {
    console.log(`- ${landing.slug}: ${landing.title}`);
  }

  const landingSlugs = landings.map(l => l.slug);
  
  if (landingSlugs.length === 0) {
    console.log('No se encontraron landings en SeoPage.');
    return;
  }

  const duplicatePosts = await prisma.post.findMany({
    where: {
      slug: { in: landingSlugs }
    },
    select: { id: true, slug: true, title: true }
  });

  console.log(`\nPosts duplicados encontrados en la tabla Post: ${duplicatePosts.length}`);
  for (const post of duplicatePosts) {
    console.log(`- POST ID: ${post.id} | Slug: ${post.slug} | Título: ${post.title}`);
  }

  if (duplicatePosts.length > 0) {
    const deleteResult = await prisma.post.deleteMany({
      where: {
        slug: { in: landingSlugs }
      }
    });
    console.log(`\nEliminados ${deleteResult.count} posts obsoletos/duplicados de la tabla Post.`);
  } else {
    console.log('\nNo hay posts duplicados para eliminar.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
