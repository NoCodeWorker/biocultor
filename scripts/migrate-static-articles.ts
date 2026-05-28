import { PrismaClient } from '../generated/prisma/index.js';
import { seoArticles, seoArticlesOrtiga, type SeoArticle } from '../lib/seo-content.js';

const prisma = new PrismaClient();

// Lista de palabras vacías (stop words) comunes para extraer palabras clave representativas del slug
const STOP_WORDS = new Set([
  'de', 'la', 'el', 'en', 'y', 'a', 'para', 'con', 'un', 'una', 'los', 'las', 'del', 'al', 'por', 'sobre', 'frente', 'vs', 'como', 'sobre', 'que', 'quien', 'donde', 'cuando', 'como', 'sin', 'mas', 'menos'
]);

function extractKeywordsFromSlug(slug: string): string[] {
  return slug
    .split('-')
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

// Compila la estructura compleja de un SeoArticle estático a un cuerpo limpio en Markdown
function compileArticleToMarkdown(art: SeoArticle): string {
  let md = '';

  // 1. Resumen Ejecutivo
  if (art.summary && art.summary.length > 0) {
    md += `## Resumen Ejecutivo\n\n`;
    art.summary.forEach((point, idx) => {
      md += `${idx + 1}.  ${point}\n`;
    });
    md += `\n`;
  }

  // 2. Fundamento Científico (si existe)
  if (art.sourceNote) {
    md += `> **PÍLDORA DE CIENCIA: Fundamento Científico**\n`;
    md += `> *${art.sourceNote}*\n\n`;
  }

  // 3. Secciones del Artículo
  if (art.sections && art.sections.length > 0) {
    art.sections.forEach(section => {
      md += `## ${section.heading}\n\n`;
      if (Array.isArray(section.body)) {
        section.body.forEach(paragraph => {
          md += `${paragraph}\n\n`;
        });
      }
    });
  }

  // 4. Preguntas Frecuentes (FAQs)
  if (art.faq && art.faq.length > 0) {
    md += `## Preguntas Frecuentes\n\n`;
    art.faq.forEach(item => {
      md += `**¿${item.question}?**\n`;
      md += `${item.answer}\n\n`;
    });
  }

  // 5. Referencias y Bibliografía (si existen)
  if (art.references && art.references.length > 0) {
    md += `---\n\n`;
    md += `## Referencias Científicas y Bibliografía\n\n`;
    art.references.forEach((ref, idx) => {
      md += `${idx + 1}.  **${ref.title}** | *${ref.authority}* (${ref.year}). [Ver enlace original](${ref.url})\n`;
    });
    md += `\n`;
  }

  return md.trim();
}

async function migrateArticles() {
  console.log('🚀 Iniciando compilación y migración masiva de artículos estáticos a la Base de Datos...');
  
  const allStaticArticles = [...seoArticles, ...seoArticlesOrtiga];
  console.log(`Encontrados ${allStaticArticles.length} artículos estáticos históricos en la base de código.`);

  let migratedCount = 0;
  let updatedCount = 0;

  try {
    for (const art of allStaticArticles) {
      const compiledContent = compileArticleToMarkdown(art);
      const keywordsList = extractKeywordsFromSlug(art.slug);
      
      // FASE 2: Chequeo inteligente de Similitud Semántica
      // Buscamos si ya existe un post que comparta palabras clave principales en su slug
      let matchedSlug = art.slug;
      let matchedPost = null;

      const existingPosts = await prisma.post.findMany({
        select: { id: true, slug: true, title: true }
      });

      for (const ep of existingPosts) {
        // Si el slug es idéntico exacto, es un match perfecto
        if (ep.slug === art.slug) {
          matchedPost = ep;
          matchedSlug = ep.slug;
          break;
        }

        // Si no, evaluamos si el slug es semánticamente similar (comparten más del 65% de palabras clave)
        const epKeywords = extractKeywordsFromSlug(ep.slug);
        const commonWords = keywordsList.filter(word => epKeywords.includes(word));
        const similarityRatio = commonWords.length / Math.max(keywordsList.length, epKeywords.length);

        if (similarityRatio >= 0.65) {
          console.log(`⚠️ Detectada alta similitud semántica (ratio: ${(similarityRatio * 100).toFixed(0)}%):`);
          console.log(`   - Nuevo Artículo:  "${art.title}" (slug: ${art.slug})`);
          console.log(`   - Post Existente:  "${ep.title}" (slug: ${ep.slug})`);
          console.log(`   -> FUSIONANDO de forma segura bajo el slug original: "${ep.slug}"`);
          
          matchedPost = ep;
          matchedSlug = ep.slug;
          break;
        }
      }

      // Upsert atómico utilizando el slug mapeado (para proteger indexaciones previas de Google)
      const result = await prisma.post.upsert({
        where: { slug: matchedSlug },
        update: {
          title: art.title,
          excerpt: art.excerpt,
          content: compiledContent,
          category: art.category.toUpperCase(),
          metaTitle: art.metaTitle,
          metaDesc: art.metaDescription,
          keywords: keywordsList.join(', '),
          isPublished: true,
          coverImage: art.image || undefined,
          updatedAt: new Date(),
        },
        create: {
          title: art.title,
          slug: matchedSlug,
          excerpt: art.excerpt,
          content: compiledContent,
          category: art.category.toUpperCase(),
          metaTitle: art.metaTitle,
          metaDesc: art.metaDescription,
          keywords: keywordsList.join(', '),
          isPublished: true,
          coverImage: art.image || undefined,
          author: 'Equipo Agrónomo Biocultor',
        },
      });

      if (matchedPost) {
        console.log(`✅ Post actualizado y enriquecido: /aprende/${result.slug} (ID: ${result.id})`);
        updatedCount++;
      } else {
        console.log(`✅ Nuevo post migrado y creado: /aprende/${result.slug} (ID: ${result.id})`);
        migratedCount++;
      }
    }

    console.log(`\n🎉 MIGRACIÓN COMPLETADA CON ÉXITO:`);
    console.log(`   - Nuevos posts creados: ${migratedCount}`);
    console.log(`   - Posts actualizados/fusionados: ${updatedCount}`);
    console.log(`   - Total procesado: ${allStaticArticles.length}`);

  } catch (error) {
    console.error('❌ Error crítico durante la migración de artículos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateArticles();
