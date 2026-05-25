/**
 * seed-blog-posts.ts
 * Crea en la tabla Post los artículos estáticos de seo-content.ts que aún no existan.
 * 
 * POLÍTICA: Solo INSERT (skip si el slug ya existe en BD).
 * Las ediciones manuales del Dashboard nunca se sobreescriben.
 *
 * Ejecutado automáticamente en cada deploy (docker-compose command).
 * También ejecutable a mano: npx tsx scripts/seed-blog-posts.ts
 */

import { PrismaClient } from '../generated/prisma';
import { seoArticles, seoArticlesOrtiga } from '../lib/seo-content';
import { articleToMarkdown, mapCategory } from '../lib/article-to-md';

const prisma = new PrismaClient();

async function main() {
  const all = [...seoArticles, ...seoArticlesOrtiga];

  console.log(`\n📦 Verificando ${all.length} artículos en BD...\n`);

  // Cargamos todos los slugs existentes de una sola query (eficiente)
  const existing = await prisma.post.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existing.map((p) => p.slug));

  const toCreate = all.filter((a) => !existingSlugs.has(a.slug));

  if (toCreate.length === 0) {
    console.log('✅ Todos los artículos ya están en BD. Nada que crear.\n');
    return;
  }

  console.log(`➕ Creando ${toCreate.length} artículos nuevos...\n`);

  let created = 0;
  let errors = 0;

  for (const article of toCreate) {
    try {
      const content = articleToMarkdown(article);
      await prisma.post.create({
        data: {
          title:       article.title,
          slug:        article.slug,
          excerpt:     article.excerpt,
          content,
          category:    mapCategory(article.category),
          metaTitle:   article.metaTitle,
          metaDesc:    article.metaDescription,
          keywords:    [article.title, article.category, 'biocultor'].join(', '),
          coverImage:  article.image ?? null,
          isPublished: true,
          author:      'Equipo Biocultor',
        },
      });
      console.log(`  ✅ Creado: ${article.slug}`);
      created++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ Error en ${article.slug}: ${msg}`);
      errors++;
    }
  }

  console.log(`\n🎉 Seed terminado:`);
  console.log(`   ✅ Creados: ${created}`);
  if (errors > 0) console.log(`   ❌ Errores: ${errors}`);
  console.log();
}

main()
  .catch((e) => {
    console.error('❌ Error fatal en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
