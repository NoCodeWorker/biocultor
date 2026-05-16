import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const slug = 'protocolo-cultivo-biologico-profesional';
  console.log(`Buscando registro erróneo en tabla Post para slug: ${slug}`);
  
  const deleted = await prisma.post.deleteMany({
    where: { slug }
  });
  
  console.log(`Registros eliminados de Post: ${deleted.count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
