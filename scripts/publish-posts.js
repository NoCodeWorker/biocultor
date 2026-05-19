const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
  const slugs = [
    "como-recuperar-el-cesped-amarillo-por-que-el-te-de-humus-liquido-supera-al-abono-quimico",
    "comprar-te-de-humus-para-el-jardin-dosis-aplicacion-y-donde-encontrar-calidad-profesional",
    "guia-definitiva-del-te-de-humus-liquido-en-jardineria-preguntas-frecuentes",
    "te-de-humus-liquido-en-mantenimiento-de-zonas-verdes-reduccion-de-costes-y-tiempos-de-aplicacion",
    "como-mitigar-el-shock-de-trasplante-en-proyectos-de-paisajismo-con-te-de-humus",
    "uso-profesional-del-te-de-humus-liquido-preguntas-tecnicas-y-compatibilidad"
  ];

  await prisma.post.updateMany({
    where: { slug: { in: slugs } },
    data: { isPublished: true }
  });
  console.log("Posts publicados exitosamente.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
