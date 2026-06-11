import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const altMapping: Record<string, string> = {
  // --- ARTÍCULOS LEGADOS (ANTIGUOS) ---
  'meta-analisis-fatiga-suelo-microbioma':
    'Esquema de restauración biológica de la microbiota en suelos agrícolas fatigados e intensivos.',
  'meta-analisis-vermicompost-horticultura':
    'Estudio comparativo de germinación y enraizamiento en horticultura orgánica usando vermicompost.',
  'estudio-vermicompost-semilleros-tomate':
    'Semillero de tomate cultivado con mezcla de turba y humus de lombriz ecológico.',
  'estudio-vermicompost-tomate-contexto-compra':
    'Tomates sanos cultivados en huerto utilizando enmienda orgánica de humus.',
  'estudio-vermicompost-tea-concentracion-tomate':
    'Aplicación de té de humus líquido microfiltrado para mejorar la asimilación foliar en tomates.',
  'revision-vermicompost-hortalizas-compra':
    'Hortalizas y verduras de hoja verde cultivadas con fertilización orgánica activa.',
  'estudio-vermicompost-lechuga-contexto-uso':
    'Cultivo de lechugas bajo estrés por salinidad corregido mediante la microbiología del humus.',
  'estudio-vermicompost-fresa-calidad':
    'Fresas en producción intensiva fertilizadas de forma foliar con té de humus de lombriz.',
  'meta-analisis-fertirrigacion-goteo-contexto-compra':
    'Detalle de sistema de riego por goteo inyectando humus líquido libre de partículas sólidas.',
  'como-aplicar-te-de-humus-de-lombriz':
    'Dilución de té de humus líquido en agua sin cloro para riego radicular doméstico.',
  'te-de-humus-de-lombriz-para-olivos':
    'Olivares en secano de España tratados con fertirrigación biológica para mitigar el estrés hídrico.',
  'te-de-humus-de-lombriz-vs-abono-liquido':
    'Comparativa entre abono mineral convencional y té de humus biológicamente activo en el desarrollo radicular.',
  'cuando-usar-humus-liquido-en-huerto':
    'Calendario de aplicación del té de humus en macetas de terraza durante primavera y verano.',
  'como-mejorar-suelo-cansado-de-forma-organica':
    'Estructura interna del suelo mejorada mediante la cohesión de microagregados con ácidos húmicos.',
  'te-de-humus-de-lombriz-para-citricos':
    'Naranjo en Valencia con hojas de color verde intenso libre de clorosis férrica gracias al abono de humus.',
  'humus-de-lombriz-liquido-para-plantas':
    'Plantas decorativas de interior nutridas de forma segura y suave con humus líquido.',
  'te-de-humus-de-lombriz-beneficios-y-uso':
    'Infografía explicativa de los beneficios físicos y biológicos del té de humus de lombriz.',
  'humus-de-lombriz-liquido-vs-solido':
    'Diferencias visuales entre humus de lombriz sólido para sustrato y extracto líquido para riego.',
  'te-humus-lombriz-frutales-maceta':
    'Árbol frutal cultivado en maceta en un balcón con frutos en maduración usando té de humus.',
  'te-humus-lombriz-fertirriegacion-compatibilidad':
    'Tanque de fertirrigación profesional compatible con té de humus líquido microfiltrado.',
  'te-humus-lombriz-cannabis-resina-floracion':
    'Resistencia sistémica inducida (ISR) para aumentar tricomas y resina mediante bacterias del humus.',
  'dosis-te-humus-tomate-maceta-huerto':
    'Tomateras con frutos vigorosos abonadas con una dilución de humus líquido al 10% en maceta.',
  'rentabilidad-te-humus-vs-quimicos-parques':
    'Mantenimiento de praderas de césped en zonas verdes con abono biológico inodoro.',

  // --- ARTÍCULOS DE ORTIGA (LEGADOS) ---
  'evidencia-extracto-ortiga-aplicaciones-agricolas':
    'Hortalizas con cutícula foliar engrosada y protegidas por pulverización de purín de ortiga.',
  'extracto-ortiga-manejo-organico-revisiones':
    'Revisión científica de extractos botánicos ecológicos utilizados en el manejo fitosanitario.',
  'extracto-ortiga-defensa-planta-estudio':
    'Activación inmunológica de las células de la planta mediante compuestos activos de la ortiga.',
  'purin-de-ortiga-para-plantas-evidencia':
    'Tratamiento de choque foliar con purín de ortiga para repeler pulgón y araña roja.',
  'purin-de-ortiga-casero-vs-concentrado-compra':
    'Purín de ortiga estabilizado de fermentación controlada para evitar patógenos anaeróbicos.',
  'purin-de-ortiga-para-tomates-y-hortalizas':
    'Hojas de tomateras sanas y libres de hongos fúngicos gracias al purín de ortiga.',
  'purin-ortiga-dosis-frecuencia-aplicacion':
    'Esquema gráfico de dosis y dilución correcta de purín de ortiga concentrado en agua.',
  'purin-ortiga-rosales-proteccion-foliar':
    'Rosales con capullos sanos protegidos de plagas mediante pulverización de extracto de ortiga.',
  'purin-ortiga-frutales-brotacion-estres':
    'Hojas nuevas de árboles frutales estimuladas con nitrógeno orgánico foliar de ortiga.',
  'sinergia-te-humus-purin-ortiga-huerto':
    'Huerto familiar combinando nutrición radicular de humus con defensa foliar de purín de ortiga.',

  // --- NUEVOS ARTÍCULOS GEO-MADRID-CLM (SIEMBRA COMPLETA) ---
  'optimizar-suelos-arcillosos-calizos-madrid-toledo-humus':
    'Aplicación de té de humus de lombriz líquido para estructurar y airear suelos arcillosos y calizos compactados en Toledo y el sur de Madrid.',
  'aumento-grado-brix-estres-hidrico-vinedos-castilla-la-mancha':
    'Riego por goteo de té de humus biológico en viñedos de secano de Castilla-La Mancha para potenciar la acumulación de azúcares y el grado Brix.',
  'prevencion-phytophthora-setos-cipres-madrid-humus':
    'Seto perimetral de cipreses en una urbanización de Pozuelo de Alarcón protegido de la Phytophthora mediante el riego foliar y radicular con té de humus.',
  'acelerar-crecimiento-pistacho-almendro-joven-castilla-la-mancha':
    'Plantación joven de pistachos y almendros en Ciudad Real inoculados biológicamente con té de humus para acelerar el arraigo radicular.',
  'mantenimiento-sostenible-parques-madrid-ahorro-agua-microbiologia':
    'Mantenimiento técnico de césped verde en parques empresariales de Madrid mediante inyección de microorganismos del humus para reducir un 20% el consumo de agua.',
  'evitar-clorosis-ferrica-tomates-hortalizas-toledo-guadalajara':
    'Hojas de tomateras sanas de un huerto familiar en Guadalajara libres de clorosis férrica gracias a la quelatación natural de hierro con ácidos húmicos.'
};

async function main() {
  console.log('🌱 Iniciando inyección y optimización de coverImageAlt para posts legados y nuevos...');

  let successCount = 0;
  let notFoundCount = 0;

  for (const [slug, altText] of Object.entries(altMapping)) {
    try {
      const post = await prisma.post.findUnique({
        where: { slug }
      });

      if (!post) {
        console.log(`⚠️ Post no encontrado en BD (se omite): aprende/${slug}`);
        notFoundCount++;
        continue;
      }

      await prisma.post.update({
        where: { slug },
        data: {
          coverImageAlt: altText,
          updatedAt: new Date()
        }
      });

      console.log(`✅ Alt text actualizado para: /aprende/${slug}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error al actualizar el post con slug "${slug}":`, error);
    }
  }

  console.log('\n🎉 Resumen del sembrado de Alt Texts:');
  console.log(`   - Exitosos: ${successCount}`);
  console.log(`   - No encontrados en BD: ${notFoundCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error fatal en el script de inyección de alts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
