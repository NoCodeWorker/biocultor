import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slug = 'protocolo-cultivo-biologico-profesional';
  const page = await prisma.seoPage.findUnique({
    where: { slug }
  });

  if (!page) {
    console.log('Record not found for slug:', slug);
    return;
  }

  console.log('--- SEO PAGE INFO ---');
  console.log('ID:', page.id);
  console.log('Kind:', page.kind);
  console.log('Title:', page.title);
  console.log('Payload JSON:', page.payloadJson);
  console.log('Is Published:', page.isPublished);
  console.log('---------------------');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
