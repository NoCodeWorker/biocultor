import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const geoLandings = [
  {
    title: "Prevención de Clorosis Férrica en Cítricos en la Comunidad Valenciana",
    slug: "clorosis-ferrica-citricos-valencia",
    category: "GEO_LANDING",
    excerpt: "Los suelos calcáreos de Valencia y Alicante bloquean el hierro en naranjos y limoneros. Descubre cómo el té de humus líquido actúa como quelatante natural para devolver el verdor y aumentar el calibre.",
    content: `
## El Bloqueo del Hierro en Suelos Calizos

La Comunidad Valenciana es el motor cítrico de Europa, pero sus suelos presentan un reto agronómico histórico: **el alto contenido en cal activa**. 

Cuando el pH del suelo supera el 7.5, el hierro (esencial para la fotosíntesis y el color de la hoja) se oxida y forma compuestos insolubles. Puedes aplicar sacos enteros de fertilizantes férricos, pero si el suelo es calizo, el árbol simplemente no podrá absorberlos. El resultado es el temido amarilleo de las hojas nuevas con nervios verdes (clorosis férrica), lo que se traduce en una caída drástica del calibre de la naranja, el limón o la mandarina, y una pérdida económica directa en campaña.

## La Solución Biológica: Rizobacterias y Quelatos Húmicos

Tradicionalmente, el agricultor recurre a los quelatos de hierro sintéticos (EDDHA). Son efectivos a corto plazo, pero extremadamente caros y se lavan con las lluvias o riegos intensos.

El **Té de Humus Líquido Biocultor** aborda el problema de raíz mediante dos mecanismos de acción probados científicamente:

1. **Ácidos Fúlvicos como Quelatantes Naturales:** Los ácidos fúlvicos presentes en nuestro extracto líquido en frío atrapan las moléculas de hierro bloqueadas en el suelo, protegiéndolas de la reacción con la cal y transportándolas directamente al interior del sistema radicular del cítrico.
2. **Rizobacterias Promotoras del Crecimiento (PGPR):** El inóculo microbiológico del té coloniza la rizosfera (la zona pegada a la raíz). Estas bacterias segregan *sideróforos*, compuestos que "secuestran" el hierro del suelo y lo hacen biodisponible para el naranjo de forma constante.

## Aplicación Eficiente por Riego Localizado (Goteo)

A diferencia de enmiendas sólidas que requieren enterrado y mano de obra extensiva, el té de humus está diseñado para **fertirrigación**.

*   **Dosis recomendada:** Dilución entre el 5% y el 10% en el caudal de riego, según el grado de bloqueo del suelo.
*   **Compatibilidad:** Se inyecta fácilmente a través del sistema Venturi sin obturar goteros (producto microfiltrado).
*   **Tiempos:** Recomendamos una aplicación fuerte al inicio de la brotación primaveral, y una de mantenimiento previa al engorde del fruto.

### Impacto Directo en la Rentabilidad de tu Explotación

Al reintroducir la vida en suelos castigados por décadas de salinización química, no solo curas la clorosis. Estás aumentando la **Capacidad de Intercambio Catiónico (CIC)**, lo que significa que necesitarás gastar mucho menos dinero en NPK tradicional, porque tu suelo retendrá y entregará los nutrientes de manera mucho más eficiente.
`
  },
  {
    title: "Té de Humus para Olivar en Andalucía: Resistencia al Estrés Hídrico",
    slug: "estres-hidrico-olivar-andalucia",
    category: "GEO_LANDING",
    excerpt: "Andalucía afronta sequías cíclicas severas. Aprende cómo el extracto líquido de humus multiplica la retención de agua en el suelo y salva la floración de tu olivar en secano y regadío.",
    content: `
## La Amenaza de la Sequía en el Olivar Andaluz

Ya sea en Jaén, Córdoba, Granada o Sevilla, el olivarero andaluz se enfrenta al mismo enemigo año tras año: **el estrés hídrico extremo y las olas de calor durante etapas críticas**. 

Cuando el olivo entra en estrés por falta de agua y temperaturas que superan los 40ºC, la planta cierra sus estomas para evitar la deshidratación. Esto paraliza la fotosíntesis, detiene el engorde de la aceituna, provoca un secado prematuro de la trama (aborto floral) y hunde el rendimiento graso de la cosecha. Echar más nitrógeno o potasio en este estado solo quema la raíz y agrava el problema.

## La Respuesta Agrobiológica: Microbiología y Materia Orgánica Líquida

El **Té de Humus Líquido Biocultor** no es un abono NPK convencional. Es un concentrado de microbiología activa y ácidos húmicos diseñado para modificar la estructura física del suelo y activar el sistema inmunológico del árbol.

### 1. Efecto Esponja: Retención Hídrica Multiplicada
Los ácidos húmicos actúan aglutinando las partículas del suelo (arcillas y limos) formando un complejo arcillo-húmico. Esta "arquitectura" crea macroporos que **retienen hasta 5 veces su peso en agua**, evitando la evaporación superficial y permitiendo que cada gota de lluvia (o del escaso riego de apoyo) quede secuestrada en la zona radicular del olivo.

### 2. Resistencia Sistémica y Osmo-Regulación
Las bacterias benéficas (Bacillus spp, Pseudomonas) que colonizan la raíz a través del té de humus inducen en el olivo la producción de osmolitos (como la prolina). Estas sustancias funcionan como "anticongelantes" internos, pero contra el calor. Permiten que la célula retenga su agua interior sin colapsar bajo temperaturas extremas, manteniendo los estomas abiertos por más tiempo.

## Aplicación Práctica: Foliar y Radicular

El formato líquido microfiltrado permite intervenciones de rescate de bajo coste y alta eficacia:

*   **Tratamiento Foliar de Primavera (Pre-floración):** Una aplicación foliar diluida al 5% con tu equipo de atomización fortalece la cutícula de la hoja y asegura el cuajado antes de que apriete el calor del verano.
*   **Inyección en Riego (Olivar Superintensivo):** En fincas con goteo, inyectar el té (10-20 litros por hectárea) desbloquea los abonos químicos precipitados alrededor del bulbo húmedo y regenera la vida de la rizosfera.

El manejo ecológico no es una moda, es la única herramienta de supervivencia para el olivar frente a ciclos de sequía severa. Restaura la microbiología de tu finca y asegura tu cosecha.
`
  }
];

async function main() {
  console.log("Iniciando inyección de Landing Pages GEO en la base de datos...");
  for (const landing of geoLandings) {
    try {
      await prisma.seoPage.upsert({
        where: { slug: landing.slug },
        update: {
          title: landing.title,
          kind: landing.category === "GEO_LANDING" ? "LANDING" : landing.category,
          excerpt: landing.excerpt,
          payloadJson: JSON.stringify({ markdownContent: landing.content }),
          isPublished: true,
        },
        create: {
          title: landing.title,
          slug: landing.slug,
          kind: landing.category === "GEO_LANDING" ? "LANDING" : landing.category,
          excerpt: landing.excerpt,
          payloadJson: JSON.stringify({ markdownContent: landing.content }),
          isPublished: true,
          targetKeyword: landing.title.toLowerCase(),
        },
      });
      console.log(`✅ GEO Landing: ${landing.title}`);
    } catch (error) {
      console.error(`❌ Error insertando: ${landing.title}`, error);
    }
  }
  console.log("Inyección GEO completada.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
