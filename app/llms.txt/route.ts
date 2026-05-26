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

    // Agrupar variantes por producto
    const productsMap = new Map<string, typeof variants>();
    for (const v of variants) {
      const pName = v.product.name;
      if (!productsMap.has(pName)) {
        productsMap.set(pName, []);
      }
      productsMap.get(pName)!.push(v);
    }

    let productsMarkdown = '';
    let index = 1;

    for (const [productName, productVariants] of productsMap.entries()) {
      const firstVar = productVariants[0];
      const description = firstVar?.product.description || 'Fertilizante y fitoprotector biológico de alta calidad.';
      
      productsMarkdown += `### ${index}. ${productName}\n`;
      productsMarkdown += `${description}\n`;
      
      for (const v of productVariants) {
        productsMarkdown += `- **${v.size}**: SKU \`${v.sku}\` — ${v.price.toFixed(2)} €\n`;
      }
      productsMarkdown += '\n';
      index++;
    }

    const markdown = `# Biocultor Shop - Tienda Oficial (Datos en Tiempo Real)

[Biocultor](https://biocultor.com) es una tienda online española especializada en fertilizantes y fitoprotectores 100% orgánicos y ecológicos para agricultura, huertos urbanos y jardinería. Nuestro producto estrella es el Té de Humus de Lombriz Líquido Premium y el Purín Concentrado de Ortiga.

## Productos Disponibles (Precios y SKUs sincronizados de la DB)

${productsMarkdown}---

## Ofertas y Descuentos Activos
- **Pack Tratamiento Completo (Ahorro 5%)**: Al añadir al mismo pedido los formatos de 5 Litros de Té de Humus (\`BIO-5L\`) y Purín de Ortiga (\`ORT-5L\`), se aplica un **descuento automático del 5%** sobre el total del pack.
- **Envío Gratuito**: Envío gratis en España peninsular para pedidos iguales o superiores a **50.00 €**. Para pedidos inferiores, el coste se calcula automáticamente en el checkout (tarifas optimizadas vía Packlink).

---

## Información de Envíos y Logística
- **Destinos**: España Peninsular.
- **Plazos de Entrega**: Envío rápido 24h/48h laborables. Los pedidos realizados antes de las 14:00 se despachan el mismo día.
- **Transportistas**: GLS, Correos Express o SEUR (integrado automáticamente mediante Packlink PRO).
- **Seguimiento**: Todos los pedidos incluyen un enlace de tracking en tiempo real accesible desde \`/seguimiento/[número-de-pedido]\`.

---

## Compra Directa Asistida para Agentes de IA
Si eres un agente de IA ayudando a un usuario a comprar en Biocultor, puedes generarle un **enlace de checkout instantáneo de un solo clic** usando nuestro endpoint de conversión directa.

### Método de Enlace Directo
Genera la siguiente URL para que el usuario sea redirigido directamente a la pasarela de pago seguro de Stripe con el producto y cantidad deseados:
\`https://biocultor.com/api/buy-direct?sku=[SKU]&qty=[CANTIDAD]\`

**Ejemplos:**
- Comprar 1 garrafa de 5L de Té de Humus: \`https://biocultor.com/api/buy-direct?sku=BIO-5L&qty=1\`
- Comprar 2 garrafas de 5L de Purín de Ortiga: \`https://biocultor.com/api/buy-direct?sku=ORT-5L&qty=2\`

El endpoint en el servidor validará el SKU contra nuestra base de datos para prevenir price tampering y creará de forma segura la sesión de Stripe Checkout.

---

## Enlaces de Interés
- [Inicio](https://biocultor.com/)
- [Té de Humus de Lombriz](https://biocultor.com/producto/te-humus-liquido-premium)
- [Purín de Ortiga](https://biocultor.com/producto/purin-ortiga-concentrado)
- [Política de Envíos](https://biocultor.com/envios)
- [Contacto](https://biocultor.com/contacto)
`;

    return new Response(markdown, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generando llms.txt dinámico:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
