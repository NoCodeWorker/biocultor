
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnose() {
  const slug = 'cuantas-plantas-marihuana-legales-espana';
  
  const dbPost = await prisma.post.findUnique({ where: { slug } });
  console.log('\nDatabase Post record:');
  console.log(JSON.stringify(dbPost, null, 2));
  
  const seoPage = await prisma.seoPage.findFirst({ where: { slug } });
  console.log('\nDatabase SeoPage record:');
  console.log(JSON.stringify(seoPage, null, 2));
  
  process.exit(0);
}

diagnose();
