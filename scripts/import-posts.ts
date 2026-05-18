import { PrismaClient } from '../generated/prisma/index.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Expresión regular robusta para extraer las partes del post (soporta \r\n de Windows y variables de Estructura)
const POST_REGEX = /## POST \d:.*?\r?\n\*\*Palabra Clave Principal:\*\* (.*?)\r?\n\*\*GEO Objetivo:\*\*.*?\r?\n\*\*(?:Estructura AI|Estructura ADR-002):\*\*.*?\r?\n+### Título \(H1\): (.*?)\r?\n\r?\n([\s\S]*?)(?=\r?\n---|\r?\n## POST \d|$)/g;

async function importPostsFromFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let match;
  
  while ((match = POST_REGEX.exec(content)) !== null) {
    const keywords = match[1].trim();
    const title = match[2].trim();
    const bodyContent = match[3].trim();
    
    // Generar slug
    const slug = title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Generar extracto (primer párrafo)
    const excerptMatch = bodyContent.split('\n\n')[0];
    const excerpt = excerptMatch ? excerptMatch.substring(0, 150) + '...' : 'Extracto del post';

    console.log(`Importando: ${title}`);

    try {
      await prisma.post.upsert({
        where: { slug },
        update: {
          title,
          content: bodyContent,
          excerpt,
          keywords,
          metaTitle: title,
          metaDesc: excerpt
        },
        create: {
          title,
          slug,
          content: bodyContent,
          excerpt,
          keywords,
          metaTitle: title,
          metaDesc: excerpt,
          isPublished: false // Para que puedan revisarlo y añadir imagen en el Dashboard
        }
      });
      console.log(`✅ Post importado: ${slug}`);
    } catch (e) {
      console.error(`❌ Error importando ${slug}:`, e);
    }
  }
}

async function main() {
  const docsDir = path.join(__dirname, '../docs');
  const files = ['blog-posts-jardin-cesped.md', 'blog-posts-paisajismo.md'];

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`\nProcesando archivo: ${file}`);
      await importPostsFromFile(filePath);
    } else {
      console.log(`Archivo no encontrado: ${filePath}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
