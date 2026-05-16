
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const post = await prisma.post.findUnique({
    where: { slug: 'cuantas-plantas-marihuana-legales-espana' }
  });
  console.log('--- POST DATA ---');
  console.log(JSON.stringify(post, null, 2));
  
  const seoPage = await prisma.seoPage.findUnique({
    where: { slug: 'cuantas-plantas-marihuana-legales-espana' }
  });
  console.log('--- SEO PAGE DATA ---');
  console.log(JSON.stringify(seoPage, null, 2));
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
