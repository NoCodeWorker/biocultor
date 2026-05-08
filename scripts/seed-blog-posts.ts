/**
 * seed-blog-posts.ts
 * Migra todos los artículos estáticos de seo-content.ts a la tabla Post de Prisma.
 * Ejecutar en el servidor: npx tsx scripts/seed-blog-posts.ts
 *
 * - Si el slug ya existe en BD → lo actualiza (upsert).
 * - Convierte sections[], summary[], faq[], references[] a Markdown limpio.
 * - El markdown generado es compatible con react-markdown + MarkdownContent.tsx
 */

import { PrismaClient } from '../generated/prisma';
import { seoArticles, seoArticlesOrtiga, type SeoArticle } from '../lib/seo-content';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Mapeo de categoría
// ---------------------------------------------------------------------------

function mapCategory(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('evidencia') || c.includes('evidence')) return 'EVIDENCE';
  if (c.includes('técnico') || c.includes('technical')) return 'TECHNICAL';
  if (c.includes('editorial')) return 'EDITORIAL';
  return 'KNOWLEDGE';
}

// ---------------------------------------------------------------------------
// Conversión a Markdown limpio
// ---------------------------------------------------------------------------

function articleToMarkdown(article: SeoArticle): string {
  const parts: string[] = [];

  // Fuente base (con icono claro)
  if (article.sourceNote) {
    parts.push(`> 📚 **Fuente base:** ${article.sourceNote}`);
  }

  // Resumen rápido como lista
  if (article.summary?.length) {
    parts.push(`## Resumen rápido\n\n${article.summary.map((s) => `- ${s}`).join('\n')}`);
  }

  // Secciones principales
  for (const section of article.sections ?? []) {
    const body = section.body.join('\n\n');
    parts.push(`## ${section.heading}\n\n${body}`);
  }

  // FAQ
  if (article.faq?.length) {
    parts.push('## Preguntas frecuentes');
    for (const f of article.faq) {
      parts.push(`### ${f.question}\n\n${f.answer}`);
    }
  }

  // Referencias
  if (article.references?.length) {
    parts.push('## Referencias científicas');
    for (const r of article.references) {
      parts.push(
        `- **${r.title}** — _${r.authority}_ (${r.year})  \n  [Ver fuente →](${r.url})`
      );
    }
  }

  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const all: SeoArticle[] = [...seoArticles, ...seoArticlesOrtiga];

  console.log(`\n📦 Total artículos a procesar: ${all.length}\n`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const article of all) {
    try {
      const content = articleToMarkdown(article);
      const data = {
        title:       article.title,
        excerpt:     article.excerpt,
        content,
        category:    mapCategory(article.category),
        metaTitle:   article.metaTitle,
        metaDesc:    article.metaDescription,
        keywords:    [article.title, article.category, 'biocultor'].join(', '),
        coverImage:  article.image ?? null,
        isPublished: true,
        author:      'Equipo Biocultor',
      };

      const existing = await prisma.post.findUnique({ where: { slug: article.slug } });

      if (existing) {
        await prisma.post.update({ where: { slug: article.slug }, data });
        console.log(`  🔄 Actualizado: ${article.slug}`);
        updated++;
      } else {
        await prisma.post.create({ data: { ...data, slug: article.slug } });
        console.log(`  ✅ Creado: ${article.slug}`);
        created++;
      }
    } catch (err: any) {
      console.error(`  ❌ Error en ${article.slug}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n🎉 Proceso terminado:`);
  console.log(`   ✅ Creados:     ${created}`);
  console.log(`   🔄 Actualizados: ${updated}`);
  console.log(`   ❌ Errores:     ${errors}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
