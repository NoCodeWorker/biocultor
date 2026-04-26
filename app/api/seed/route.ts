import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const existing = await prisma.product.count();
    
    if (existing > 0) {
      return NextResponse.json({ message: "La base de datos ya está inicializada con los productos." });
    }

    // Sweet Spot Pricing & Storytelling Seed
    const productoBase = await prisma.product.create({
      data: {
        name: "Té de Humus de Lombriz Biocultor",
        slug: "te-humus-liquido-premium",
        description: "El extracto de humus de lombriz más potente y vivo del mercado. Extraído en frío para preservar millones de microorganismos beneficiosos por cada gota.",
        benefits: "Regenera microbiota,Absorción foliar inmediata,Reduce necesidades hídricas un 40%",
        
        variants: {
          create: [
            {
              sku: "BIO-1L",
              size: "1 Litro",
              target: "Jardinero Urbano",
              price: 16.90,
              stock: 100,
              imagePath: "/1 litro.jpg",
              popular: false,
              features: "Para 100L de riego,Aplicación foliar y radicular,Perfecto para probar"
            },
            {
              sku: "BIO-5L",
              size: "5 Litros",
              target: "Huerto Familiar",
              price: 49.90, // Punto dulce
              comparePrice: 84.50, // 5 x 16.90 = 84.5
              stock: 50,
              imagePath: "/5 litros.jpg",
              popular: true,
              features: "Para 500L de riego,Tratamiento de choque,40% más barato por litro vs formato 1 L"
            },
            {
              sku: "BIO-10L",
              size: "10 Litros",
              target: "Cultivador PRO",
              price: 79.90,
              comparePrice: 169.00,
              stock: 30,
              imagePath: "/10 litros.jpg",
              popular: false,
              features: "Para 1000L de riego,Regeneración intensiva,52% más barato por litro vs formato 1 L"
            },
            {
              sku: "BIO-25L",
              size: "25 Litros",
              target: "Finca Ecológica",
              price: 149.90,
              comparePrice: 422.50,
              stock: 10,
              imagePath: "/25 litros.jpg",
              popular: false,
              features: "Para 2500L de riego,Uso agrícola a gran escala,64% más barato por litro vs formato 1 L"
            }
          ]
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Biocultor Seed completado exitosamente con estrategia Sweet Spot.",
      producto: productoBase 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
