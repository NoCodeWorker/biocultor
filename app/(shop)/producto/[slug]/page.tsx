export const dynamic = 'force-dynamic'

import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import ProductFunnel from "@/components/ProductFunnel"
import ScienceProof from "@/components/ScienceProof"
import FaqAioSeo from "@/components/FaqAioSeo"
import StickyCartBar from "@/components/StickyCartBar"

import ResultsTimeline from "@/components/ResultsTimeline"
import RiskReversal from "@/components/RiskReversal"
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import { absoluteUrl, breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo'
import { ShieldCheck, Truck, RefreshCw, Leaf } from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { variants: true }
  })
  if (!product) return { title: 'Producto No Encontrado' }
  return buildMetadata({
    title: `${product.name} | Comprar online en España`,
    description: product.description,
    path: `/producto/${product.slug}`,
    keywords: [
      product.name,
      'comprar té de humus de lombriz',
      'humus líquido españa',
      'abono orgánico líquido premium',
    ],
    image: product.variants[1]?.imagePath || product.variants[0]?.imagePath || '/Logo.svg',
  })
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { variants: { orderBy: { price: 'asc' } } }
  })
  if (!product) notFound();

  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const highestPrice = Math.max(...product.variants.map(v => v.price));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.variants.map(v => absoluteUrl(v.imagePath || '/Logo.svg')),
    url: absoluteUrl(`/producto/${product.slug}`),
    sku: product.variants.map((variant) => variant.sku).join(','),
    offers: {
      '@type': 'AggregateOffer',
      offerCount: product.variants.length,
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    brand: { '@type': 'Brand', name: 'Biocultor' },
    areaServed: 'ES',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '124',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Carlos M.' },
        datePublished: '2026-01-14',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' },
        reviewBody: 'Excelente producto. Lo uso en mis cítricos y se nota la evolución del cultivo. La aplicación es muy limpia.',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Ana Gómez' },
        datePublished: '2026-03-05',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' },
        reviewBody: 'Perfecto para mi huerto urbano. Llevo un par de campañas aplicándolo y el suelo responde mucho mejor.',
      }
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
      <StructuredData id="product-faq-schema" data={faqSchema(commercialFaq)} />

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
      <FaqAioSeo />

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
