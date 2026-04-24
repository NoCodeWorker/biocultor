import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// Seed idempotente para el producto "Purín Concentrado de Ortiga".
// Crea el Product si no existe; si existe, lo deja intacto para no pisar
// cambios manuales hechos desde admin. Las variantes se upsertan por SKU.
export async function GET() {
  try {
    const slug = 'purin-ortiga-concentrado';

    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: 'Purín Concentrado de Ortiga Biocultor',
        slug,
        description:
          'Purín concentrado de ortiga elaborado en España para huerto urbano, jardín, rosales y pequeñas explotaciones. Enfocado a uso foliar y riego localizado dentro de un manejo orgánico definido.',
        benefits:
          'Extracto vegetal concentrado,Enfoque de uso en manejo orgánico,Formatos proporcionados a la escala real de uso',
      },
    });

    // Mismos tramos de precio, target y features que el té (decisión comercial
    // del equipo: facilita comparación y simplifica la elección de formato).
    const variants = [
      {
        sku: 'ORT-1L',
        size: '1 Litro',
        target: 'Jardinero Urbano',
        price: 16.9,
        comparePrice: null,
        stock: 100,
        imagePath: '/1 litro.jpg',
        popular: false,
        features:
          'Para prueba y huerto doméstico,Aplicación foliar y radicular,Formato inicial manejable',
      },
      {
        sku: 'ORT-5L',
        size: '5 Litros',
        target: 'Huerto Familiar',
        price: 49.9,
        comparePrice: 84.5,
        stock: 50,
        imagePath: '/5 litros.jpg',
        popular: true,
        features:
          'Para bancales y jardín productivo,Rutina periódica foliar/riego,Ahorro frente a compra por litro',
      },
      {
        sku: 'ORT-10L',
        size: '10 Litros',
        target: 'Cultivador PRO',
        price: 79.9,
        comparePrice: 169.0,
        stock: 30,
        imagePath: '/10 litros.jpg',
        popular: false,
        features:
          'Para continuidad en pequeña explotación,Compra de reposición ordenada,Ahorro significativo por litro',
      },
      {
        sku: 'ORT-25L',
        size: '25 Litros',
        target: 'Finca Ecológica',
        price: 149.9,
        comparePrice: 422.5,
        stock: 10,
        imagePath: '/25 litros.jpg',
        popular: false,
        features:
          'Para uso agrícola a mayor escala,Rutina orgánica con volumen,Mejor precio por litro del catálogo',
      },
    ];

    for (const v of variants) {
      await prisma.variant.upsert({
        where: { sku: v.sku },
        update: {
          size: v.size,
          target: v.target,
          price: v.price,
          comparePrice: v.comparePrice,
          stock: v.stock,
          imagePath: v.imagePath,
          popular: v.popular,
          features: v.features,
        },
        create: {
          ...v,
          productId: product.id,
        },
      });
    }

    const refreshed = await prisma.product.findUnique({
      where: { slug },
      include: { variants: { orderBy: { price: 'asc' } } },
    });

    return NextResponse.json({
      success: true,
      message: 'Producto Purín de Ortiga y variantes sincronizados.',
      producto: refreshed,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
