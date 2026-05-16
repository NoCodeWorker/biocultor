import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { alertCritical } from '@/lib/alert';

// Feed de productos en formato Google Merchant Center (RSS 2.0 + Google Shopping)
// URL pública: https://biocultor.com/api/feed.xml
// Actualizar en Merchant Center → Fuentes de datos → URL de la fuente
export const revalidate = 3600; // Regenerar cada hora

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://biocultor.com';
  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      include: { variants: { orderBy: { price: 'asc' } } },
    });
  } catch (error) {
    alertCritical('FeedRoute.generateProducts', error);
  }

  const items = products.flatMap((product: any) =>
    product.variants.map((variant: any) => {
      const imageUrl = variant.imagePath
        ? `${appUrl}${variant.imagePath}`
        : `${appUrl}/Logo.svg`;

      const availability = variant.stock && variant.stock > 0 ? 'in stock' : 'out of stock';
      const shippingCost = variant.price >= 50 ? '0.00' : '4.99';

      return `
    <item>
      <title><![CDATA[${product.name} — ${variant.size}]]></title>
      <link>${appUrl}/producto/${product.slug}</link>
      <description><![CDATA[${product.description}]]></description>
      <g:id>${variant.sku}</g:id>
      <g:mpn>${variant.sku}</g:mpn>
      <g:brand>Biocultor</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${variant.price.toFixed(2)} EUR</g:price>
      <g:sale_price_effective_date></g:sale_price_effective_date>
      <g:image_link>${imageUrl}</g:image_link>
      <g:product_type>Fertilizantes orgánicos &gt; Té de humus de lombriz</g:product_type>
      <g:google_product_category>2838</g:google_product_category>
      <g:item_group_id>${product.slug}</g:item_group_id>
      <g:shipping>
        <g:country>ES</g:country>
        <g:service>Estándar</g:service>
        <g:price>${shippingCost} EUR</g:price>
      </g:shipping>
      <g:return_policy_label>free-returns</g:return_policy_label>
      <g:custom_label_0>${variant.size}</g:custom_label_0>
      <g:custom_label_1>${variant.popular ? 'Más Vendido' : 'Estándar'}</g:custom_label_1>
    </item>`;
    })
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Biocultor — Tienda de Té de Humus de Lombriz</title>
    <link>${appUrl}</link>
    <description>Fertilizantes orgánicos líquidos premium para huerto, jardín y cultivo profesional.</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
