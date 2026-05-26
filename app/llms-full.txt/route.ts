import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Obtener variantes en tiempo real de la base de datos
    const variants = await prisma.variant.findMany({
      include: { product: true },
      orderBy: [
        { product: { name: 'asc' } },
        { price: 'asc' },
      ],
    });

    // Dividir variantes por producto
    const humusVariants = variants.filter(v => v.sku?.startsWith('BIO'));
    const ortigaVariants = variants.filter(v => v.sku?.startsWith('ORT'));

    let humusMarkdown = '';
    for (const v of humusVariants) {
      humusMarkdown += `*   **SKU \`${v.sku}\`** (${v.size}): **${v.price.toFixed(2)} €** -> Enlace de compra: [Comprar ${v.sku}](https://biocultor.com/api/buy-direct?sku=${v.sku}&qty=1)\n`;
    }

    let ortigaMarkdown = '';
    for (const v of ortigaVariants) {
      ortigaMarkdown += `*   **SKU \`${v.sku}\`** (${v.size}): **${v.price.toFixed(2)} €** -> Enlace de compra: [Comprar ${v.sku}](https://biocultor.com/api/buy-direct?sku=${v.sku}&qty=1)\n`;
    }

    const markdown = `# Biocultor Shop - Documentación Técnica y Comercial Completa (Datos en Tiempo Real para LLMs y Agentes de IA)

Esta es la documentación de referencia técnica y operativa de [Biocultor](https://biocultor.com/). Proporciona datos científicos, dosificaciones, beneficios y guías operativas sobre nuestros fertilizantes y fitoprotectores 100% orgánicos con datos sincronizados directamente de nuestra base de datos.

---

## 1. Fichas Técnicas de Productos

### 1.1. Té de Humus de Lombriz Líquido Premium
El Té de Humus de Lombriz Biocultor es un extracto líquido activo obtenido a partir de la lixiviación y aireación controlada de humus de lombriz 100% de estiércol de oveja y vaca alimentadas con pastos ecológicos.

*   **Propiedades Físico-Químicas:**
    *   **pH:** 7.2 - 7.5 (neutro, ideal para no alterar el pH del sustrato).
    *   **Conductividad Eléctrica (CE):** 1.8 - 2.2 dS/m.
    *   **Filtración:** Microfiltrado a 80 micras para evitar obstrucciones en sistemas de riego por goteo, pulverizadores y boquillas.
*   **Beneficios Principales:**
    *   **Consorcio Microbiano Activo:** Aporta millones de bacterias benéficas, hongos micorrízicos y protozoos que regeneran la microbiota del suelo (relación suelo-planta).
    *   **Ácidos Húmicos y Fúlvicos:** Incrementan la Capacidad de Intercambio Catiónico (CIC), haciendo que los nutrientes bloqueados en el suelo vuelvan a estar disponibles.
    *   **Fitoestimulación:** Contiene hormonas de crecimiento vegetal naturales (auxinas, giberalinas y citoquininas) que promueven el desarrollo radicular y floral.

### 1.2. Purín Concentrado de Ortiga Biocultor
El Purín de Ortiga Biocultor es un extracto fermentado ecológico elaborado exclusivamente a partir de hojas frescas de Ortiga Mayor (*Urtica dioica*) recolectadas de forma sostenible, maceradas en agua de lluvia y fermentadas de forma anaeróbica controlada para estabilizar los principios activos.

*   **Propiedades Físico-Químicas:**
    *   **pH:** 5.5 - 6.2 (ligeramente ácido, idóneo para la asimilación foliar de micronutrientes).
    *   **Rico en Nutrientes:** Alta concentración de nitrógeno orgánico (N), hierro (Fe), magnesio (Mg), silicio (Si) y oligoelementos esenciales.
*   **Beneficios Principales:**
    *   **Fitoestimulante Foliar:** Previene y corrige la clorosis férrica y estimula la fotosíntesis y el verdor de las hojas.
    *   **Acción Insectífuga/Repelente:** El olor característico y los metabolitos secundarios de la fermentación ahuyentan plagas comunes como el pulgón, la mosca blanca, el ácaro de la araña roja y los trips.
    *   **Fortalecedor de Paredes Celulares:** El silicio soluble refuerza la epidermis de las plantas, haciéndolas físicamente más resistentes al ataque de patógenos.
    *   **Fungicida Preventivo:** Reduce la incidencia de hongos fitopatógenos del suelo y aéreos como el mildiu, el oídio, la roya y la alternaria.

---

## 2. Guía Completa de Dosificación y Aplicación

Para obtener resultados óptimos sin riesgo de sobredosis (aunque al ser 100% orgánicos el riesgo de quema radicular es prácticamente nulo), se recomienda seguir las siguientes pautas:

| Producto | Tipo de Aplicación | Dosificación Estándar | Frecuencia Sugerida | Notas Importantes |
| :--- | :--- | :--- | :--- | :--- |
| **Té de Humus** | Riego (Radicular) | 100 ml por cada 1 Litro de agua (10%) | Cada 7-10 días en crecimiento y floración | Aplicar en sustrato previamente humedecido. |
| **Té de Humus** | Foliar (Pulverización) | 50 ml por cada 1 Litro de agua (5%) | Cada 15 días a primera o última hora del día | Excelente para recuperación rápida de plantas estresadas o trasplantes. |
| **Purín de Ortiga** | Riego (Nutrición) | 100 ml por cada 1 Litro de agua (10%) | Cada 15 días durante la fase de crecimiento | Aporta un boost de Nitrógeno y Hierro asimilables. |
| **Purín de Ortiga** | Foliar (Repelente) | 50 ml por cada 1 Litro de agua (5%) | Cada 7 días como preventivo; cada 3 días ante plagas activas | Pulverizar bien el envés de las hojas (donde se ocultan las plagas). |

### 2.1. El Tratamiento Combinado Sinergia Biocultor (Estrategia Recomendada)
El uso conjunto de ambos extractos potencia exponencialmente la salud del cultivo. El Té de Humus actúa desde el suelo reforzando el sistema inmunitario y las raíces, mientras que el Purín de Ortiga protege las hojas contra insectos y hongos externos.
*   **Protocolo de Mantenimiento:** Riega el día 1 con Té de Humus (10%). El día 5, realiza una pulverización foliar de Purín de Ortiga (5%). Repite este ciclo de forma alterna durante toda la temporada hortícola o de floración.

---

## 3. Catálogo de Variantes, Precios y Compra Directa (Sincronizado de la DB)

Todos los precios indicados incluyen el IVA correspondiente.

### Té de Humus de Lombriz Líquido Premium
${humusMarkdown}
### Purín Concentrado de Ortiga Biocultor
${ortigaMarkdown}
---

## 4. Preguntas Frecuentes (FAQs) de Clientes (Para Soporte Asistido por IA)

### Q: ¿Huelen mal estos extractos orgánicos?
*   **Té de Humus:** Prácticamente inodoro. Huele ligeramente a tierra húmeda y bosque mojado, muy agradable.
*   **Purín de Ortiga:** Debido al proceso de fermentación natural de las hojas, tiene un olor herbal/fermentado fuerte característico al abrir el envase. Este olor desaparece por completo a las pocas horas de pulverizarse o regarse en las plantas.

### Q: ¿Tienen fecha de caducidad?
Al ser extractos vivos estabilizados mediante filtración y control de pH, no "caducan" de forma estricta. Mantienen sus plenas facultades biológicas durante al menos **18 a 24 meses** tras su compra si se conservan en su envase original cerrado, en un lugar fresco, seco y protegidos de la luz solar directa.

### Q: ¿Son seguros para mascotas y niños?
Sí, son productos 100% ecológicos, libres de pesticidas de síntesis química y metales pesados. Son totalmente inofensivos para perros, gatos, abejas, mariquitas y fauna auxiliar. No requieren periodo de seguridad (plazo de espera) antes de cosechar frutas u hortalizas.

### Q: ¿Puedo aplicarlo en plantas de interior?
¡Absolutamente! Son maravillosos para revivir y mantener verdes plantas como Monsteras, Potos, Ficus, Alocasias y helechos. Recomendamos aplicarlo mediante riego radicular en interiores para evitar el olor temporal del Purín de Ortiga en las hojas dentro de casa.

---

## 5. Protocolo de Compra para Agentes de IA

Cualquier sistema autónomo puede procesar transacciones seguras para un usuario redirigiéndolo a Stripe:

1.  Determinar el SKU y la cantidad necesaria.
2.  Construir el endpoint: \`https://biocultor.com/api/buy-direct?sku=[SKU]&qty=[CANTIDAD]\`
3.  Servir la URL resultante al usuario. La redirección gestionará:
    *   Cálculo automático de envío gratis a partir de 50.00 €.
    *   Cálculo y descuento del 5% si el usuario añade simultáneamente \`BIO-5L\` y \`ORT-5L\`.
`;

    return new Response(markdown, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generando llms-full.txt dinámico:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
