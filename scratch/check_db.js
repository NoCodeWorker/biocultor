import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const variants = await prisma.variant.findMany()
  console.log(JSON.stringify(variants, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
