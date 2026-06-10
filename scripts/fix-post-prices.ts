/**
 * fix-post-prices.ts
 * Elimina los precios hardcodeados de los CTAs en el contenido de los posts
 * de la base de datos de producción.
 * 
 * Patrón de precios a eliminar del markdown de los posts:
 *   (9.95 €), (19.95 €), (49.95 €) → scripts seed-6-posts
 *   (16.90 €), (49.90 €), (149.90 €) → scripts inject-6-more-posts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRICE_PATTERNS = [
  / \(149\.90 €\)/g,
  / \(49\.90 €\)/g,
  / \(16\.90 €\)/g,
  / \(9\.95 €\)/g,
  / \(19\.95 €\)/g,
  / \(49\.95 €\)/g,
];

async function stripPricesFromPosts() {
  const posts = await prisma.post.findMany({
    select: { id: true, slug: true, content: true }
  });

  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    let newContent = post.content;
    let changed = false;

    for (const pattern of PRICE_PATTERNS) {
      const before = newContent;
      newContent = newContent.replace(pattern, '');
      if (newContent !== before) changed = true;
    }

    if (changed) {
      await prisma.post.update({
        where: { id: post.id },
        data: { content: newContent }
      });
      console.log(`✅ Updated: ${post.slug}`);
      updated++;
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Resultados: ${updated} posts actualizados, ${skipped} sin cambios`);
}

stripPricesFromPosts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
