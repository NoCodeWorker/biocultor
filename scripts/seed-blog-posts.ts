/**
 * seed-blog-posts.ts
 * Migra todos los artículos estáticos de seo-content.ts a la tabla Post de Prisma.
 * Ejecutar en el servidor: npx tsx scripts/seed-blog-posts.ts
 *
 * - Si el slug ya existe en BD → lo salta (no duplica).
 * - Convierte sections[], summary[], faq[], references[] a Markdown en el campo `content`.
 * - Mapea la categoría estática al enum del admin (EVIDENCE, KNOWLEDGE, etc.).
 */

import { PrismaClient } from '../generated/prisma';
import { seoArticles, seoArticlesOrtiga, type SeoArticle } from '../lib/seo-content';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Utilidades de conversión
// ---------------------------------------------------------------------------

function mapCategory(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('evidencia') || c.includes('evidence')) return 'EVIDENCE';
  if (c.includes('técnico') || c.includes('technical')) return 'TECHNICAL';
  if (c.includes('editorial')) return 'EDITORIAL';
  return 'KNOWLEDGE';
}

function articleToMarkdown(article: SeoArticle): string {
  const parts: string[] = [];

  // Extracto como intro
  if (article.excerpt) {
    parts.push(`> ${article.excerpt}\n`);
  }

  // Nota de fuente
  if (article.sourceNote) {
    parts.push(`---\n\n**📚 Fuente base**\n\n${article.sourceNote}\n\n---`);
  }

  // Resumen rápido
  if (article.summary?.length) {
    parts.push(`## Resumen rápido\n\n${article.summary.map((s) => `- ${s}`).join('\n')}`);
  }

  // Secciones principales
  for (const section of article.sections ?? []) {
    parts.push(`## ${section.heading}\n\n${section.body.join('\n\n')}`);
  }

  // FAQ
  if (article.faq?.length) {
    parts.push(
      `## Preguntas frecuentes\n\n${article.faq
        .map((f) => `**${f.question}**\n\n${f.answer}`)
        .join('\n\n')}`
    );
  }

  // Referencias
  if (article.references?.length) {
    parts.push(
      `## Referencias\n\n${article.references
        .map((r) => `- **${r.title}** — ${r.authority} (${r.year})\n  [Ver fuente](${r.url})`)
        .join('\n\n')}`
    );
  }

  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const all: SeoArticle[] = [...seoArticles, ...seoArticlesOrtiga];

  console.log(`\n📦 Total artículos estáticos a procesar: ${all.length}\n`);

  let created = 0;
  let skipped = 0;

  for (const article of all) {
    const exists = await prisma.post.findUnique({ where: { slug: article.slug } });

    if (exists) {
      console.log(`  ⏭️  Saltado (ya existe): ${article.slug}`);
      skipped++;
      continue;
    }

    const content = articleToMarkdown(article);

    await prisma.post.create({
      data: {
        title:      article.title,
        slug:       article.slug,
        excerpt:    article.excerpt,
        content,
        category:   mapCategory(article.category),
        metaTitle:  article.metaTitle,
        metaDesc:   article.metaDescription,
        keywords:   [article.title, article.category, 'biocultor'].join(', '),
        coverImage: article.image ?? null,
        isPublished: true,
        author:     'Equipo Biocultor',
      },
    });

    console.log(`  ✅ Creado: ${article.slug}`);
    created++;
  }

  console.log(`\n🎉 Proceso terminado: ${created} creados, ${skipped} saltados.\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
