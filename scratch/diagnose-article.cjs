
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnose() {
  const { seoArticles, seoArticlesOrtiga } = require('./lib/seo-content');
  
  const slug = 'cuantas-plantas-marihuana-legales-espana';
  const article = [...seoArticles, ...seoArticlesOrtiga].find(a => a.slug === slug);
  
  console.log('Static article definition:');
  console.log(JSON.stringify(article, null, 2));
  
  const dbPost = await prisma.post.findUnique({ where: { slug } });
  console.log('\nDatabase Post record:');
  console.log(JSON.stringify(dbPost, null, 2));
  
  const seoPage = await prisma.seoPage.findFirst({ where: { slug } });
  console.log('\nDatabase SeoPage record:');
  console.log(JSON.stringify(seoPage, null, 2));
  
  process.exit(0);
}

diagnose();
