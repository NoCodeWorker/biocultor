import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { seoArticles, seoArticlesOrtiga, type SeoArticle } from '@/lib/seo-content';

// Protección básica: solo se puede llamar con la clave de admin
const SEED_KEY = process.env.ADMIN_SECRET ?? 'biocultor-seed-2025';

function mapCategory(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('evidencia') || c.includes('evidence')) return 'EVIDENCE';
  if (c.includes('técnico') || c.includes('technical')) return 'TECHNICAL';
  if (c.includes('editorial')) return 'EDITORIAL';
  return 'KNOWLEDGE';
}

function articleToMarkdown(article: SeoArticle): string {
  const parts: string[] = [];

  if (article.sourceNote) {
    parts.push(`> 📚 **Fuente base:** ${article.sourceNote}`);
  }

  if (article.summary?.length) {
    parts.push(`## Resumen rápido\n\n${article.summary.map((s) => `- ${s}`).join('\n')}`);
  }

  for (const section of article.sections ?? []) {
    parts.push(`## ${section.heading}\n\n${section.body.join('\n\n')}`);
  }

  if (article.faq?.length) {
    parts.push('## Preguntas frecuentes');
    for (const f of article.faq) {
      parts.push(`### ${f.question}\n\n${f.answer}`);
    }
  }

  if (article.references?.length) {
    parts.push('## Referencias científicas');
    for (const r of article.references) {
      parts.push(`- **${r.title}** — _${r.authority}_ (${r.year})  \n  [Ver fuente →](${r.url})`);
    }
  }

  return parts.join('\n\n');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (key !== SEED_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const all: SeoArticle[] = [...seoArticles, ...seoArticlesOrtiga];
  const results = { created: 0, updated: 0, errors: 0, log: [] as string[] };

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
        results.updated++;
        results.log.push(`🔄 updated: ${article.slug}`);
      } else {
        await prisma.post.create({ data: { ...data, slug: article.slug } });
        results.created++;
        results.log.push(`✅ created: ${article.slug}`);
      }
    } catch (err: any) {
      results.errors++;
      results.log.push(`❌ error ${article.slug}: ${err.message}`);
    }
  }

  return NextResponse.json({
    total: all.length,
    ...results,
  });
}
