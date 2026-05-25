/**
 * article-to-md.ts
 * Convierte un SeoArticle a Markdown limpio para almacenar en la tabla Post.
 * Compartido entre:
 *   - scripts/seed-blog-posts.ts  (seed en deploy)
 *   - app/admin/blog/page.tsx     (auto-sync en dashboard)
 */

import type { SeoArticle } from './seo-content';

export function articleToMarkdown(article: SeoArticle): string {
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

export function mapCategory(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('evidencia') || c.includes('evidence')) return 'EVIDENCE';
  if (c.includes('técnico') || c.includes('technical')) return 'TECHNICAL';
  if (c.includes('editorial')) return 'EDITORIAL';
  return 'KNOWLEDGE';
}
