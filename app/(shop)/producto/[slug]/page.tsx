export const revalidate = 300

import prisma from "@/lib/db"
import { alertCritical } from "@/lib/alert"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { testimonials } from "@/lib/testimonials"

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({ select: { slug: true } });
    return products.map((p) => ({ slug: p.slug }));
  } catch (error) {
    alertCritical('ProductPage.generateStaticParams', error);
    return [];
  }
}
import ProductFunnel from "@/components/ProductFunnel"

import ScienceProof from "@/components/ScienceProof"
import FaqAioSeo from "@/components/FaqAioSeo"
import StickyCartBar from "@/components/StickyCartBar"

import ResultsTimeline from "@/components/ResultsTimeline"
import RiskReversal from "@/components/RiskReversal"
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import {
  breadcrumbSchema,
  buildProductOgMetadata,
  faqSchema,
} from '@/lib/seo'
import { ShieldCheck, Truck, RefreshCw, Leaf } from 'lucide-react'
import Link from 'next/link'

// ── Construye el array de imágenes SEO directamente desde las variantes de BD ──
// Las fotos del admin ya se suben en WebP y su URL vive en variant.imagePath.
// De esta forma, cualquier cambio de imagen en el panel de administración se
// propaga automáticamente al JSON-LD @graph, OG tags y carrusel de Google —
// sin necesidad de ejecutar ningún script adicional ni tocar el código.
function buildProductImagesFromVariants(
  variants: { size: string; imagePath: string | null }[],
  productName: string,
  appUrl: string,
): { url: string; alt: string }[] {
  return variants
    .filter(v => v.imagePath)
    .map(v => ({
      url: `${appUrl}${v.imagePath}`,
      alt: `${productName} — Formato ${v.size}`,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug: resolvedParams.slug },
      include: { variants: { orderBy: { price: 'asc' } } },
    })
  } catch (error) {
    alertCritical('ProductPage.generateMetadata', error, { extra: { slug: resolvedParams.slug } });
  }

  if (!product) return { title: 'Producto Biocultor' }

  // Precio mínimo de las variantes para og:price:amount
  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const hasStock = product.variants.some(v => (v.stock ?? 0) > 0);

  // ── BLOQUE 2: Open Graph con WebP optimizado ────────────────────────────
  // buildProductOgMetadata emite:
  //   • og:type=product         → Rich Snippet de producto
  //   • og:image[].type=image/webp → fuerza procesamiento WebP
  //   • og:image=1200×1200     → miniatura cuadrada en SERPs
  //   • og:price:amount/currency → precio en parsers de shopping
  //   • og:availability         → stock en tiempo real
  const metaAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://biocultor.com';
  // Imágenes SEO directamente desde la BD — se actualizan solas al cambiar fotos en el admin
  const productImages = buildProductImagesFromVariants(product.variants, product.name, metaAppUrl);

  // Keywords dinámicas por producto
  const keywordsMap: Record<string, string[]> = {
    'te-humus-liquido-premium': [
      product.name,
      'comprar té de humus de lombriz',
      'humus líquido españa',
      'abono orgánico líquido premium',
    ],
    'purin-ortiga-concentrado': [
      product.name,
      'comprar purín de ortiga',
      'purín ortiga concentrado españa',
      'extracto ortiga plántas orgánico',
    ],
  };
  const keywords = keywordsMap[resolvedParams.slug] ?? [product.name];

  return buildProductOgMetadata({
    title: `${product.name} | Comprar online en España`,
    description: product.description,
    path: `/producto/${product.slug}`,
    keywords,
    // Imagen principal: primera variante con foto (normalmente 1L o la más pequeña)
    primaryWebpImage: productImages[0]?.url ?? '',
    // Imágenes adicionales para el carrusel de Google
    extraWebpImages: productImages.slice(1).map(img => img.url),
    price: lowestPrice.toFixed(2),
    currency: 'EUR',
    availability: hasStock ? 'instock' : 'outofstock',
  })
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug: resolvedParams.slug },
      include: { variants: { orderBy: { price: 'asc' } } }
    })
  } catch (error) {
    alertCritical('ProductPage.render', error, { extra: { slug: resolvedParams.slug } });
  }

  if (!product) notFound();

  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const highestPrice = Math.max(...product.variants.map(v => v.price));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://biocultor.com';

  // ── BLOQUE 1: JSON-LD con @graph — Product + ImageObject (carrusel Google) ─
  //
  // Por qué @graph en lugar de un solo objeto Product:
  //   • Permite separar Product e ImageObject como nodos de primer nivel
  //   • Google puede indexar cada ImageObject independientemente para el carrusel
  //   • WebPage declara el contexto de la página para el Knowledge Panel
  //   • Todos los nodos se relacionan entre sí mediante @id (@id-linking)
  //
  // Para el carrusel de imágenes de Google Shopping, los requisitos son:
  //   1. El nodo Product debe referenciar los nodos ImageObject en su propiedad "image"
  //   2. Cada ImageObject debe tener contentUrl, encodingFormat, width y height
  //   3. Las URLs deben coincidir con las del <picture> en el HTML (señal de congruencia)

  // Imágenes dinámicas desde la BD — se sincronizan automáticamente con el admin
  const productImages = buildProductImagesFromVariants(product.variants, product.name, appUrl);

  // Construye los nodos ImageObject con @id para el @id-linking del @graph
  // Usamos la URL de uploads directamente (ya es WebP) para máxima coherencia
  const imageObjects = productImages.map((img, i) => ({
    '@type': 'ImageObject',
    '@id': `${appUrl}/producto/${product.slug}#image-${i + 1}`,
    contentUrl: img.url,
    url: img.url,
    name: img.alt,
    description: img.alt,
    encodingFormat: 'image/webp',
    width: 1200,
    height: 1200,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    // @graph: múltiples nodos en un único script → Google los procesa juntos
    '@graph': [
      {
        // ── Nodo WebPage: contexto de la página ────────────────────────────
        '@type': 'WebPage',
        '@id': `${appUrl}/producto/${product.slug}#webpage`,
        url: `${appUrl}/producto/${product.slug}`,
        name: `${product.name} | Comprar online en España`,
        description: product.description,
        inLanguage: 'es-ES',
        isPartOf: { '@id': `${appUrl}/#website` },
        primaryImageOfPage: { '@id': `${appUrl}/producto/${product.slug}#image-1` },
      },
      {
        // ── Nodo Product: núcleo del Rich Snippet ──────────────────────────
        '@type': 'Product',
        '@id': `${appUrl}/producto/${product.slug}#product`,
        name: product.name,
        description: product.description,
        url: `${appUrl}/producto/${product.slug}`,
        brand: { '@type': 'Brand', name: 'Biocultor' },
        sku: product.variants[0]?.sku,
        // CLAVE PARA EL CARRUSEL: array de referencias @id a los nodos ImageObject
        // Google sigue estos @id para construir el carrusel de imágenes de producto
        image: imageObjects.map(img => ({ '@id': img['@id'] })),
        itemCondition: 'https://schema.org/NewCondition',
        countryOfOrigin: { '@type': 'Country', name: 'España' },
        areaServed: { '@type': 'Country', name: 'España' },
        // ── Rich Snippet: estrellas (aggregateRating) ──────────────────────
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: testimonials.length.toString(),
          bestRating: '5',
          worstRating: '1',
        },
        // ── Rich Snippet: reseñas individuales ────────────────────────────
        review: testimonials.map((t) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: t.name },
          datePublished: t.date,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: t.rating.toString(),
            bestRating: '5',
            worstRating: '1',
          },
          reviewBody: t.text,
          name: t.highlight,
        })),
        // ── Ofertas por variante: clave para Google Shopping ──────────────
        // Google Shopping indexa cada Offer por separado si tiene sku único
        offers: product.variants.map(v => ({
          '@type': 'Offer',
          name: `${product.name} — ${v.size}`,
          url: `${appUrl}/producto/${product.slug}`,
          sku: v.sku,
          price: v.price.toFixed(2),
          priceCurrency: 'EUR',
          // priceValidUntil: 30 días desde el deploy — actualiza con cada build
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          itemCondition: 'https://schema.org/NewCondition',
          availability: v.stock && v.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'Biocultor' },
          // ── Shipping: gratis ≥50€, sino 4.99€ ──────────────────────────
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: v.price >= 50 ? '0.00' : '4.99',
              currency: 'EUR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'ES',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 0,
                maxValue: 1,
                unitCode: 'DAY',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 3,
                unitCode: 'DAY',
              },
            },
          },
          // ── Return policy: requerido por Merchant Center ───────────────
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'ES',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
        })),
      },
      // ── Nodos ImageObject: carrusel de imágenes de producto ─────────────
      // Google indexa cada ImageObject y los asocia al Product mediante @id-linking
      ...imageObjects,
    ],
  }

  const commercialFaq = [
    {
      question: '¿Hacéis envíos de té de humus de lombriz a toda España?',
      answer: 'Sí. Biocultor opera para toda España peninsular con logística 24/48h y soporte técnico incluido.',
    },
    {
      question: '¿Qué formato de Biocultor conviene comprar?',
      answer: 'Depende del volumen de cultivo. Los formatos pequeños sirven para huerto doméstico; los superiores, para uso continuo y profesional.',
    },
    {
      question: '¿Puedo mezclar Biocultor con otros fertilizantes o pesticidas?',
      answer: 'Depende de la mezcla concreta y del sistema de aplicación. Antes de combinarlo con otros insumos conviene revisar compatibilidad, hacer una prueba pequeña y evitar asumir mezclas universales.',
    },
    {
      question: '¿Cuánto tiempo tarda en verse un resultado real?',
      answer: 'No hay un plazo fijo para todos los casos. La respuesta depende del cultivo, el estado del suelo, el manejo y la continuidad de uso, así que conviene evaluar en contexto y no por promesas cerradas.',
    },
  ];

  const dbVariants = product.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    target: v.target,
    price: v.price,
    comparePrice: v.comparePrice,
    popular: v.popular,
    stock: v.stock ?? 12,
    features: v.features.split(','),
    imagePath: v.imagePath
  }));

  return (
    <article className="w-full relative z-10 antialiased">
      <StructuredData id="product-schema" data={jsonLd} />
      <StructuredData
        id="product-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: product.name, path: `/producto/${product.slug}` },
        ])}
      />

      {/* Semantic Signal Block para Crawlers de IA (Perplexity, ChatGPT, Gemini) */}
      {/* Al ser un Server Component, este texto está en el HTML inicial bruto sin necesidad de JS */}
      <div className="sr-only" aria-label={`Información técnica detallada de ${product.name}`}>
        {product.name} es un {product.slug.includes('ortiga') ? 'purín concentrado' : 'fertilizante orgánico líquido (té de humus)'} fabricado en España por Biocultor.
        Descripción oficial: {product.description}.
        Formatos disponibles y precios:
        {dbVariants.map(v => `${v.size} (${v.price}€) para ${v.target}. `).join(' ')}
        Uso recomendado: Dilución en agua sin cloro para riego por goteo o aplicación foliar.
        Envíos en 24/48h a toda la Península (España) desde nuestras instalaciones.
      </div>

      {/* FAQ schema unificado: preguntas comerciales + preguntas técnicas del componente FaqAioSeo */}
      <StructuredData id="product-faq-schema" data={faqSchema([
        ...commercialFaq,
        { question: '¿El extracto de humus huele mal?', answer: 'Suele presentar un olor orgánico y terroso propio del producto. Si notas un cambio acusado de olor o estado, conviene revisar conservación, temperatura y tiempo de almacenamiento.' },
        { question: '¿Puedo quemar las raíces si me paso de dosis?', answer: 'Conviene respetar la dosis de uso recomendada. Aunque se trata de un producto orientado a manejo orgánico, una aplicación poco controlada nunca es la mejor práctica para suelo, riego o cultivo.' },
        { question: '¿Obstruirá mis sistemas de riego por goteo?', answer: 'Está pensado para aplicarse en sistemas de riego, pero la compatibilidad real depende del estado de la instalación, el filtrado del equipo y la forma de preparación. Si trabajas con goteo, conviene revisar la ficha técnica y hacer una primera prueba controlada.' },
        { question: '¿Cuánto tiempo tarda en hacer efecto?', answer: 'No hay un plazo universal. La respuesta depende del cultivo, el estado del suelo, la frecuencia de uso y el manejo general. Lo razonable es observar evolución dentro de una rutina de aplicación, no esperar un efecto instantáneo y aislado.' },
      ])} />

      {/* ① STICKY CART BAR — Siempre visible al hacer scroll */}
      <StickyCartBar variants={dbVariants} productName={product.name} />

      {/* ② BREADCRUMB ─────────────────────────────── */}
      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 pt-6 pb-2">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: product.name }]} className="mb-0" />
      </div>

      {/* ④ FUNNEL PRINCIPAL — Selector + Precio + CTA */}
      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 py-6 pb-20 md:pb-10">
        <ProductFunnel product={product} dbVariants={dbVariants} />
      </div>

      {/* ⑤ TRUST BAR — Micro-garantías post-CTA */}
      <div className="w-full bg-cream-warm border-y border-border/40 py-8">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, label: 'Pago seguro', sub: 'Checkout protegido' },
            { icon: Truck, label: 'Envío en 24/48h', sub: 'Toda España' },
            { icon: RefreshCw, label: 'Devolución 14 días', sub: 'Sin preguntas' },
            { icon: Leaf, label: 'Uso orgánico', sub: 'Revisar ficha técnica' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⑥ TIMELINE DE RESULTADOS — "¿Cuándo veo resultados?" */}
      <ResultsTimeline />

      {/* ⑦ PRUEBA SOCIAL — Ciencia + Testimonios */}
      <ScienceProof />

      {/* ⑧ RISK REVERSAL — Destruye objeciones de compra */}
      <RiskReversal />

      {/* ⑨ FAQ — Responde las dudas finales */}
      {/* ⑨ FAQ — suppressSchema=true porque el schema ya está unificado arriba */}
      <FaqAioSeo suppressSchema={true} />

      {/* ⑩ CROSS-SELL / EXPERTOS — Captura los indecisos*/}
      <section className="w-full py-16 bg-cream-warm border-t border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-2">¿Tienes dudas técnicas?</p>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Nuestros expertos te guían gratis.
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
              Consulta con nuestro equipo agronómico la dosis, método de aplicación y frecuencia 
              recomendada para tu tipo de cultivo. Servicio orientado a resolver dudas de uso y formato.
            </p>
          </div>
          <Link
            href="/contacto"
            className="shrink-0 inline-flex items-center gap-2 bg-brand-brown-dark hover:bg-brand-brown text-cream font-bold px-8 py-4 rounded-full shadow-xl transition-all hover:scale-[1.02] whitespace-nowrap border border-cream/15"
          >
            Hablar con un Experto
          </Link>
        </div>
      </section>
    </article>
  )
}
