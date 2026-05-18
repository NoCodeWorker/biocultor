import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const posts = [
  {
    title: "Cómo Recuperar el Césped Amarillo: Por qué el Té de Humus Líquido Supera al Abono Químico",
    slug: "como-recuperar-el-cesped-amarillo-por-que-el-te-de-humus-liquido-supera-al-abono-quimico",
    excerpt: "Si tu césped amarillea a pesar del riego, el problema rara vez es la falta de agua; suele ser un suelo compactado, carente de microbiología...",
    content: `Si tu césped amarillea a pesar del riego, el problema rara vez es la falta de agua; suele ser un suelo compactado, carente de microbiología, que no permite a la raíz absorber nutrientes. Especialmente en zonas con veranos duros como Madrid, Andalucía o el Levante español, el estrés térmico bloquea el desarrollo de la pradera.

Frente a la clásica aplicación de nitrógeno en forma de urea (que proporciona un verdor rápido pero fugaz y quema la raíz si te excedes), el **té de humus de lombriz líquido** actúa desde la base: restaura la rizosfera.

#### ¿Qué hace el Té de Humus en tu Césped?
1. **Desbloqueo de nutrientes:** Su alta carga microbiana solubiliza el fósforo y el potasio que ya están en tu suelo pero que la raíz no puede tomar.
2. **Estimulación radicular:** Los ácidos húmicos y fúlvicos fomentan una raíz más profunda, haciendo al césped más resistente a las olas de calor y reduciendo la necesidad de riego.
3. **Absorción foliar inmediata:** Al aplicarse pulverizado o en el agua de riego, la hoja absorbe directamente parte de los nutrientes biológicos.

#### Dosificación para Césped (Dosis de Choque y Mantenimiento)
Para praderas dañadas, en Biocultor recomendamos una aplicación foliar (o mediante fertirrigación si dispones de sistema inyector). 
* **Tratamiento de choque (Césped amarillo):** Diluir al 10-15% (1 a 1.5 litros de té por cada 10 litros de agua). Aplicar a primera hora de la mañana o última de la tarde.
* **Mantenimiento mensual:** Dilución al 5%. 

**¿Qué formato comprar?** Para jardines pequeños o adosados, el formato de 1 Litro o 5 Litros de Biocultor es suficiente para cubrir las necesidades de toda la temporada. Si gestionas superficies grandes o eres jardinero profesional, el formato de 25 Litros ofrece el mejor coste por aplicación.

*Comprar té de humus de lombriz puro, fabricado en España y sin intermediarios asegura que la microbiología llega viva a tu jardín. Evita productos que han pasado meses en estanterías a altas temperaturas.*`,
    keywords: "té de humus de lombriz para césped, recuperar césped amarillo",
    metaTitle: "Cómo Recuperar el Césped Amarillo: Por qué el Té de Humus Líquido Supera al Abono Químico",
    metaDesc: "Descubre cómo el té de humus de lombriz líquido puede recuperar tu césped amarillo y mejorar la salud de tu pradera.",
    isPublished: false
  },
  {
    title: "Comprar Té de Humus para el Jardín: Dosis, Aplicación y Dónde Encontrar Calidad Profesional",
    slug: "comprar-te-de-humus-para-el-jardin-dosis-aplicacion-y-donde-encontrar-calidad-profesional",
    excerpt: "Cuando buscas un fertilizante ecológico para tus plantas ornamentales, rosales o setos, el mercado está lleno de opciones diluidas. El té de humus...",
    content: `Cuando buscas un fertilizante ecológico para tus plantas ornamentales, rosales o setos, el mercado está lleno de opciones diluidas. El té de humus de lombriz no es un simple lixiviado (el agua que escurre de las lombrices); es un extracto elaborado de forma aeróbica que multiplica exponencialmente los microorganismos beneficiosos.

Si has decidido **comprar té de humus líquido para tu jardín**, la clave del éxito está en dos factores: la concentración del producto y la frescura de la carga microbiana.

#### ¿Cómo aplicarlo en Plantas de Jardín y Macetas?
En Biocultor no vendemos milagros, vendemos biología activa. La aplicación en el jardín es sencilla y no tiene riesgo de sobredosis (no quema las raíces):
* **Riego de macetas y jardineras:** Diluye 50 ml de Té de Humus Biocultor por cada litro de agua de riego. Aplica cada 15 días en primavera y verano.
* **Plantación de nuevos arbustos/árboles:** Un riego con dilución al 10% en el momento del trasplante reduce drásticamente el estrés post-plantación.
* **Aplicación foliar en ornamentales:** Pulveriza las hojas (diluido al 5%) al atardecer para fortalecer la planta frente a plagas como el pulgón y enfermedades fúngicas.

#### Por qué elegir Biocultor para tu Jardín
Producimos nuestro té de humus en Toledo, controlando todo el proceso sin intermediarios. Al enviarlo directamente desde nuestras instalaciones a toda la Península en 24/48h, garantizamos que el producto no pierde viabilidad térmica en almacenes de terceros. 

Para aficionados a la jardinería, recomendamos el **formato de 5 Litros**, que permite un tratamiento continuado durante toda la temporada a un precio muy competitivo (apenas unos céntimos por aplicación).`,
    keywords: "comprar té de humus para jardín, dosis humus líquido jardín, abono ecológico plantas",
    metaTitle: "Comprar Té de Humus para el Jardín: Dosis, Aplicación y Calidad",
    metaDesc: "Guía de dosis y aplicación del té de humus de lombriz para tu jardín. Dónde comprar calidad profesional con envío directo.",
    isPublished: false
  },
  {
    title: "Guía Definitiva del Té de Humus Líquido en Jardinería: Preguntas Frecuentes",
    slug: "guia-definitiva-del-te-de-humus-liquido-en-jardineria-preguntas-frecuentes",
    excerpt: "Los motores de búsqueda y asistentes de voz reciben cada día miles de preguntas sobre el cuidado del huerto y jardín. Hemos recopilado las respuestas...",
    content: `Los motores de búsqueda y asistentes de voz reciben cada día miles de preguntas sobre el cuidado del huerto y jardín. Hemos recopilado las respuestas técnicas y directas sobre el uso del té de humus de lombriz.

#### ¿Cuál es la diferencia entre el humus sólido y el té de humus líquido?
El humus sólido actúa como un enmendante estructural a largo plazo, mejorando la esponjosidad y retención de agua del suelo. El té de humus líquido es una inyección inmediata de microbiología y nutrientes solubles. Mientras que el sólido tarda meses en descomponerse totalmente, el líquido entra por la raíz y la hoja en cuestión de horas. En jardinería, lo ideal es combinar ambos.

#### ¿El té de humus líquido huele mal?
No. Un té de humus de lombriz bien elaborado de forma aeróbica (con oxígeno) tiene un olor suave a "tierra mojada" o bosque húmedo. Si un fertilizante líquido huele a putrefacción o cloaca, indica que se ha producido en condiciones anaeróbicas y puede contener patógenos dañinos para tu jardín. El té de Biocultor es 100% aeróbico e inodoro una vez diluido, perfecto para jardines urbanos o patios interiores.

#### ¿Puedo usar té de humus líquido en césped artificial?
Evidentemente no. El té de humus requiere un suelo vivo y materia orgánica para actuar. Sin embargo, si tienes maceteros perimetrales o arriates bordeando tu césped artificial, es la herramienta perfecta para mantenerlos vigorosos sin manchar las superficies sintéticas.

#### ¿Dónde comprar humus de lombriz líquido puro en España?
Para garantizar que adquieres un extracto biológico activo y no agua tintada, es fundamental comprar directamente al productor. En **Biocultor**, elaboramos nuestro té bajo estrictos estándares agronómicos. Disponemos de envío a toda España en formatos adaptados a jardinería: desde garrafas de 1 Litro hasta bidones de 25 Litros para fincas más extensas.`,
    keywords: "qué es el té de humus, para qué sirve el humus líquido, humus líquido vs sólido",
    metaTitle: "Té de Humus Líquido en Jardinería: Preguntas Frecuentes",
    metaDesc: "Respuestas directas y técnicas sobre el uso del té de humus líquido en jardinería. Diferencias, olores y aplicación.",
    isPublished: false
  },
  {
    title: "Té de Humus Líquido en Mantenimiento de Zonas Verdes: Reducción de Costes y Tiempos de Aplicación",
    slug: "te-de-humus-liquido-en-mantenimiento-de-zonas-verdes-reduccion-de-costes-y-tiempos-de-aplicacion",
    excerpt: "La gestión de grandes superficies ornamentales y parques empresariales exige un equilibrio difícil: mantener una estética impecable cumpliendo con...",
    content: `La gestión de grandes superficies ornamentales y parques empresariales exige un equilibrio difícil: mantener una estética impecable cumpliendo con normativas medioambientales cada vez más estrictas sobre el uso de químicos. Sin embargo, la transición a abonos orgánicos sólidos a menudo dispara los costes de mano de obra debido al tiempo requerido para su distribución e incorporación al suelo.

La respuesta técnica a este cuello de botella logístico es el paso a formatos biológicos solubles.

#### 🔬 Píldora de Ciencia: Eficiencia de Asimilación
> Diversos ensayos agronómicos (como los documentados en el *Journal of Plant Nutrition*) evidencian que la aplicación foliar y vía fertirrigación de extractos ricos en ácidos húmicos y fúlvicos reduce el tiempo de asimilación de nutrientes de semanas a horas. Mientras que el abono sólido depende de la humedad y temperatura para mineralizarse, el té de humus entra directamente al sistema vascular de la planta o estabiliza la rizosfera de forma inmediata.

#### Beneficios Operativos Reales para Empresas de Paisajismo
1. **Reducción de horas-hombre (Mano de obra):** Aplicar el té de humus a través de pulverizadores de mochila o inyectándolo directamente en la red de riego por goteo elimina la necesidad de esparcir, cavar y enterrar enmiendas sólidas.
2. **Cero impacto visual y olfativo:** A diferencia de los purines o estiércoles tradicionales, el té de humus de lombriz aeróbico es inodoro. Esto es crítico cuando se realizan labores de mantenimiento en hoteles, residenciales premium o zonas urbanas transitadas.
3. **No obstruye los sistemas de riego:** Nuestro proceso de filtrado avanzado asegura que el producto fluya perfectamente por emisores y goteros.

**Prueba en tu próximo mantenimiento:** Para cuadrillas profesionales y contratos recurrentes, el **formato de 25 Litros** ofrece el mejor coste por aplicación (hasta un 60% más económico por litro frente al formato pequeño).`,
    keywords: "té de humus líquido paisajismo, fertilizante líquido para grandes superficies, mantenimiento zonas verdes",
    metaTitle: "Mantenimiento Zonas Verdes: Reducción de Costes con Humus",
    metaDesc: "Descubre cómo el té de humus líquido reduce costes y tiempos de aplicación en el mantenimiento de zonas verdes y paisajismo urbano.",
    isPublished: false
  },
  {
    title: "Cómo Mitigar el Shock de Trasplante en Proyectos de Paisajismo con Té de Humus",
    slug: "como-mitigar-el-shock-de-trasplante-en-proyectos-de-paisajismo-con-te-de-humus",
    excerpt: "El momento de la plantación es la fase de mayor riesgo financiero en la ejecución de un proyecto paisajístico. La reposición de arbolado o arbustivas...",
    content: `El momento de la plantación es la fase de mayor riesgo financiero en la ejecución de un proyecto paisajístico. La reposición de arbolado o arbustivas muertas por shock de trasplante destruye los márgenes de beneficio, especialmente en zonas de clima cálido como Andalucía o la costa levantina.

El estrés post-plantación no se soluciona únicamente con agua; un exceso de riego en una raíz dañada o inactiva provoca asfixia radicular y pudrición. Lo que la planta necesita es un estímulo biológico que reactive el crecimiento de los pelos absorbentes.

#### 🔬 Píldora de Ciencia: Rizogénesis y Ácidos Fúlvicos
> Investigaciones publicadas por centros de edafología demuestran que la carga microbiológica (bacterias PGPR) y los ácidos fúlvicos presentes en los lixiviados y tés de vermicompost estimulan la rizogénesis (creación de nuevas raíces secundarias). Esto mejora exponencialmente la arquitectura radicular, permitiendo a la planta explorar el suelo y captar agua de forma autónoma mucho antes.

#### Protocolo de Plantación Biocultor
En campo, hemos observado que integrar biología activa en el momento del trasplante eleva significativamente las tasas de supervivencia:
* **Hoyo de plantación:** Aplicar un riego de asiento con una dilución de Té de Humus al 10% (1 litro de producto por cada 10 litros de agua).
* **Mantenimiento del primer mes:** Pulverización foliar quincenal al 5% para reducir el estrés oxidativo en las hojas mientras el sistema radicular se establece.

**Asegura tus plantaciones:** No dejes el éxito de tu proyecto al azar ni a fertilizantes de asimilación lenta. Mantén garrafas del **formato de 10 Litros** en los vehículos de tus operarios para uso inmediato en cada nueva plantación.`,
    keywords: "shock de trasplante árboles, bioestimulante enraizamiento paisajismo, supervivencia trasplantes verano",
    metaTitle: "Mitigar Shock de Trasplante en Paisajismo con Té de Humus",
    metaDesc: "Soluciones biológicas para asegurar la supervivencia en trasplantes de árboles y arbustivas con humus de lombriz.",
    isPublished: false
  },
  {
    title: "Uso Profesional del Té de Humus Líquido: Preguntas Técnicas y Compatibilidad",
    slug: "uso-profesional-del-te-de-humus-liquido-preguntas-tecnicas-y-compatibilidad",
    excerpt: "Los gestores de parques y jardineros profesionales manejan presupuestos ajustados y no pueden arriesgarse a usar insumos incompatibles con su...",
    content: `Los gestores de parques y jardineros profesionales manejan presupuestos ajustados y no pueden arriesgarse a usar insumos incompatibles con su maquinaria o sus protocolos. Aquí resolvemos con transparencia las dudas técnicas más habituales sobre nuestro Té de Humus de Lombriz.

#### ¿El té de humus obstruye los emisores o el riego por goteo?
No. El problema de obstrucción ocurre cuando se intentan disolver humus sólido o se utilizan tés caseros sin microfiltrado. En Biocultor, el proceso industrial incluye un filtrado micrométrico final que retiene la materia orgánica gruesa, permitiendo el paso de la microbiología y los ácidos húmicos/fúlvicos líquidos. Es 100% compatible con sistemas de fertirrigación estándar y pulverizadores.

#### ¿Es compatible mezclarlo con tratamientos fitosanitarios químicos?
Aquí hay que ser muy claros agronómicamente: **No recomendamos la mezcla en tanque con fungicidas o bactericidas de síntesis química**. El gran valor del té de humus es su carga microbiana viva. Si lo mezclas con un producto diseñado para matar hongos o bacterias, destruirás gran parte de su efectividad. Se debe aplicar siempre por separado, dejando un margen de al menos 4-5 días tras un tratamiento biocida.

#### ¿Cuánto dura el producto almacenado en el almacén de la empresa?
A diferencia de los químicos inertes, este es un producto biológicamente activo. Para garantizar su máxima viabilidad microbiana, recomendamos su uso dentro de los primeros 6 a 8 meses tras la compra. Debe almacenarse en un lugar fresco, protegido de la luz solar directa y de temperaturas extremas. Por ello, enviamos desde fábrica directamente a tus instalaciones, sin estancias prolongadas en distribuidores intermediarios.

#### ¿Cómo acceder a formatos de gran volumen para empresas?
Si gestionas grandes superficies y requieres reposición constante, el formato de garrafa de 25 Litros está diseñado para uso profesional intensivo. Nuestro modelo de venta directa asegura un stock rotativo fresco y envío en 24/48h a cualquier punto de la Península.`,
    keywords: "compatibilidad humus líquido fitosanitarios, conservación té de humus, obstrucción goteros humus",
    metaTitle: "Té de Humus Profesional: Dudas y Compatibilidad",
    metaDesc: "Respuestas para paisajistas: obstrucción de goteros, compatibilidad con fitosanitarios y almacenamiento del humus líquido.",
    isPublished: false
  }
];

async function main() {
  console.log("Iniciando inyección forzada de los 6 posts en la base de datos...");
  for (const post of posts) {
    try {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: post,
        create: post,
      });
      console.log(`✅ ${post.title}`);
    } catch (e) {
      console.error(`❌ Error insertando: ${post.title}`, e);
    }
  }
  console.log("Inyección completada.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
