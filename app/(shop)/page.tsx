export const revalidate = 1800

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Leaf, Droplets, FlaskConical, Star, Sparkles, TreePine, Sprout, ClipboardCheck, Ruler, Users } from "lucide-react"
import FormatSelector from "@/components/FormatSelector"
import OrtIgaFormatSelector from "@/components/OrtIgaFormatSelector"
import nextDynamic from "next/dynamic"
import { alertCritical } from "@/lib/alert"

import {
  BuyerPersonaSelector,
  ScienceProof,
  SocialProof,
  CostCalculator,
  ResultsTimeline,
  RiskReversal,
  NewsletterCapture
} from "@/components/HomeDynamicSections";
const FaqAioSeo = nextDynamic(() => import("@/components/FaqAioSeo"))

import prisma from "@/lib/db"
import { MapPin } from "lucide-react"
import { absoluteUrl, buildMetadata, breadcrumbSchema, collectionPageSchema } from '@/lib/seo'
import StructuredData from '@/components/StructuredData'
import { getSeoCommercialPages, getSeoGeoPages, getSeoSolutions } from '@/lib/seo-store'

type HomeVariant = {
  id: string;
  productId: string;
  sku: string;
  size: string;
  target: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  imagePath: string | null;
  popular: boolean;
  features: string;
};

type HomeProduct = {
  variants: HomeVariant[];
};

const homeServicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${absoluteUrl('/')}#professional-services`,
  name: 'Servicios profesionales Biocultor',
  description:
    'Servicios de diagnóstico, suministro y aplicación de té de humus de lombriz para jardines, césped, paisajistas y mantenimiento profesional.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        '@id': `${absoluteUrl('/servicios/regeneracion-cesped-y-jardines')}#service`,
        name: 'Regeneración de césped y jardines',
        serviceType: 'Diagnóstico y aplicación biológica in situ',
        areaServed: ['Madrid', 'Castilla-La Mancha', 'Toledo'],
        provider: { '@id': `${absoluteUrl('/')}#organization` },
        url: absoluteUrl('/servicios/regeneracion-cesped-y-jardines'),
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Service',
        '@id': `${absoluteUrl('/servicios/te-humus-paisajistas-jardineros')}#service`,
        name: 'Té de humus para paisajistas y jardineros',
        serviceType: 'Suministro profesional y aplicación técnica',
        areaServed: ['Madrid', 'Castilla-La Mancha', 'Toledo'],
        provider: { '@id': `${absoluteUrl('/')}#organization` },
        url: absoluteUrl('/servicios/te-humus-paisajistas-jardineros'),
      },
    },
  ],
};

export const metadata = buildMetadata({
  title: 'Comprar té de humus y servicios para jardines | Biocultor',
  description:
    'Tienda especializada en té de humus de lombriz y servicios profesionales para césped, jardines, paisajistas y mantenimiento de zonas verdes.',
  path: '/',
  keywords: [
    'comprar té de humus de lombriz',
    'té de humus de lombriz españa',
    'servicio regeneración césped',
    'té de humus para paisajistas',
    'humus líquido premium',
    'fertilizante orgánico líquido',
    'té de humus para olivos',
  ],
})

export default async function Page() {
  let dbProduct: HomeProduct | null = null;
  let dbOrtiga: HomeProduct | null = null;
  
  try {
    [dbProduct, dbOrtiga] = await Promise.all([
      prisma.product.findUnique({
        where: { slug: "te-humus-liquido-premium" },
        include: { variants: { orderBy: { price: 'asc' } } }
      }),
      prisma.product.findUnique({
        where: { slug: "purin-ortiga-concentrado" },
        include: { variants: { orderBy: { price: 'asc' } } }
      }),
    ]);
  } catch (error) {
    alertCritical('HomePage.loadProducts', error, { extra: { slugs: ['te-humus-liquido-premium', 'purin-ortiga-concentrado'] } });
  }

  const dbVariants: HomeVariant[] = dbProduct?.variants || [];
  const dbOrtigaVariants: HomeVariant[] = dbOrtiga?.variants || [];
  const [seoSolutions, dbPosts, seoCommercialPages, seoGeoPages] = await Promise.all([
    getSeoSolutions(),
    prisma.post.findMany({
      where: { isPublished: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
    }).catch(() => []),
    getSeoCommercialPages(),
    getSeoGeoPages(),
  ]);
  const featuredSolutions = seoSolutions.slice(0, 4);
  
  const featuredArticles = dbPosts.map((post) => {
    let category = 'Guía';
    const catUpper = post.category.toUpperCase();
    if (catUpper === 'EVIDENCIA') {
      category = 'Evidencia';
    } else if (catUpper === 'CULTIVO' || catUpper === 'KNOWLEDGE') {
      category = 'Cultivo';
    } else {
      category = post.category.charAt(0).toUpperCase() + post.category.slice(1).toLowerCase();
    }
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category,
    };
  });

  const featuredCommercial = seoCommercialPages.slice(0, 3);
  const featuredGeo = seoGeoPages.slice(0, 6);

  return (
    <div className="flex flex-col w-full">
      <StructuredData
        id="home-breadcrumb-schema"
        data={breadcrumbSchema([{ name: 'Inicio', path: '/' }])}
      />
      <StructuredData
        id="home-collections-schema"
        data={collectionPageSchema({
          name: 'Arquitectura SEO Biocultor',
          description: 'Capas transaccional, informacional y GEO/IA de Biocultor.',
          path: '/',
          items: [
            { name: 'Dominio transaccional', path: '/comprar-te-de-humus-de-lombriz' },
            { name: 'Servicios profesionales', path: '/servicios/regeneracion-cesped-y-jardines' },
            { name: 'Servicios para paisajistas', path: '/servicios/te-humus-paisajistas-jardineros' },
            { name: 'Biblioteca de liderazgo', path: '/biblioteca' },
            { name: 'Calculadoras', path: '/calculadoras' },
            { name: 'Metodologia y trazabilidad', path: '/metodologia' },
            { name: 'Dominio informacional', path: '/aprende' },
            { name: 'Dominio GEO/IA', path: '/espana' },
          ],
        })}
      />
      <StructuredData id="home-services-schema" data={homeServicesSchema} />

      {/* GEO Signal Block — señal semántica para crawlers de IA (Perplexity, ChatGPT, Gemini, Google AIO) */}
      <div className="sr-only" aria-label="información-producto-biocultor">
        Biocultor es una tienda online española que vende té de humus de lombriz líquido premium.
        Envía en 24-48h a toda la Península Ibérica desde Toledo, España. Fundada y operada en España.
        Formatos disponibles: {dbVariants.map((v) => `${v.size} (${v.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€)`).join(', ')}.
        Compatible con rutinas de riego y aplicación foliar según contexto de cultivo.
        Biocultor también ofrece servicios profesionales para regeneración de césped, jardines, paisajistas, jardineros y mantenimiento de zonas verdes en Madrid, Toledo y Castilla-La Mancha.
        Los servicios incluyen cálculo de superficie, estimación de presupuesto, suministro de té de humus y opción de aplicación técnica in situ.
        También disponible: purín de ortiga concentrado para cultivos ecológicos.
        Envíos a Madrid, Barcelona, Valencia, Sevilla, Málaga, Zaragoza, Bilbao, Murcia, Alicante, Córdoba y toda España.
      </div>

      {/* ════════════════════════════════════════════
          1. HERO — INMERSIVO CON IMAGEN DE FONDO
      ════════════════════════════════════════════ */}
      <section className="hero-section relative w-full min-h-[92vh] flex flex-col items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/te-de-humus-de-lombriz-biocultor.avif"
            alt="Campo de cultivo al amanecer con riego orgánico"
            fill
            className="object-cover object-center"
            priority
            fetchPriority="high"
            quality={35}
            sizes="100vw"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-brown-dark/75 via-brand-brown-dark/55 to-brand-brown-dark/92" />
          {/* Bottom fade to background */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center gap-6 md:gap-8 mt-8">
          {/* Leaf Accent */}
          <div className="leaf-divider w-32">
            <Leaf className="w-5 h-5 text-primary animate-float-gentle" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cream/80 backdrop-blur-md">
            Tienda online + servicios profesionales
          </div>

          {/* Hero Heading — Sigue el patrón global font-heading (Quicksand) */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight max-w-5xl text-cream leading-[1.05] drop-shadow-lg">
            Té de humus de lombriz.
            <br />
            <span className="text-brand-green-light">Producto y aplicación profesional.</span>
          </h1>

          {/* Subtítulo semántico GEO/SEO — invisible en diseño, legible por bots */}
          <p className="text-sm text-cream/50 font-light tracking-wide -mt-3 hidden md:block">
            Compra té de humus de lombriz en España · Envío 24/48h a toda la Península
          </p>

          <p className="text-base md:text-xl text-cream/80 max-w-2xl leading-relaxed font-light drop-shadow-sm">
            Compra <strong>extracto de humus de lombriz</strong> para aplicar por tu cuenta o solicita diagnóstico, suministro y aplicación en jardines premium, césped y proyectos de paisajismo.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link href="/producto/te-humus-liquido-premium">
              <Button
                size="lg"
                className="rounded-full px-10 h-14 text-base font-bold bg-primary hover:bg-brand-green-hover text-white shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all duration-300"
              >
                Comprar Ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#servicios-profesionales">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-14 text-base font-semibold border-cream/30 text-cream bg-cream/10 backdrop-blur-md hover:bg-cream/20 hover:text-white transition-all"
              >
                Ver Servicios
              </Button>
            </Link>
            <Link href="#formatos" className="text-sm font-bold text-cream/75 underline-offset-4 hover:text-cream hover:underline transition-colors">
              Ver formatos y precios
            </Link>
          </div>

          {/* Trust micro-badges */}
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mt-1">
            {['✓ Envío en 24/48h', '✓ Pago seguro', '✓ Compra directa'].map((badge) => (
              <span key={badge} className="text-cream/70 text-xs font-medium px-3 py-1.5 rounded-full bg-cream/8 backdrop-blur-sm border border-cream/10">
                {badge}
              </span>
            ))}
          </div>

          <div className="max-w-3xl rounded-2xl border border-cream/15 bg-cream/10 px-5 py-4 text-left text-cream/85 backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-green-light">Respuesta corta</p>
            <p className="mt-2 text-sm md:text-base leading-relaxed">
              Si tienes equipo y superficie pequeña, compra el producto. Si el jardín supera 300 m², está compactado o el resultado visual importa, calcula aplicación profesional.
            </p>
          </div>

          {/* Proof Stats — datos reales de credibilidad */}
          <div className="mt-6 grid grid-cols-3 gap-4 md:gap-12 w-full max-w-xl pb-6">
            {[
              { value: '4', label: 'Formatos para cada uso' },
              { value: '2', label: 'Servicios profesionales' },
              { value: '24h', label: 'Envío express España' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <span className="text-3xl md:text-4xl font-heading font-bold text-cream drop-shadow-md">{value}</span>
                <div className="w-6 h-px bg-cream/25 mx-auto" />
                <span className="text-cream/55 text-[10px] md:text-xs leading-tight text-center uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          2. SERVICIOS PROFESIONALES — CRO HOME
      ════════════════════════════════════════════ */}
      <section id="servicios-profesionales" className="w-full py-16 md:py-24 bg-background border-b border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/15">
                <ClipboardCheck className="w-3.5 h-3.5" />
                Servicios profesionales
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground text-balance">
                Cuando no basta con comprar el producto.
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl lg:ml-auto">
              Si tienes una superficie amplia, un césped degradado o un proyecto de mantenimiento profesional, te ayudamos a dimensionar dosis, logística y aplicación sin convertir la decisión en ensayo y error.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Link
              href="/servicios/regeneracion-cesped-y-jardines"
              className="group relative overflow-hidden rounded-lg bg-cream-warm p-7 md:p-9 border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/8"
            >
              <div className="relative flex min-h-[300px] flex-col">
                <div className="mb-7 flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Ruler className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-bold text-primary">
                    Desde 195 €
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  Para jardines particulares y comunidades
                </p>
                <h3 className="text-2xl md:text-3xl font-heading font-extrabold leading-tight text-foreground group-hover:text-primary transition-colors">
                  Regeneración de césped y jardines
                </h3>
                <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                  Diagnóstico inicial, cálculo de superficie y aplicación biológica in situ para recuperar estructura de suelo y rutina de mantenimiento.
                </p>
                <div className="mt-auto pt-8 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center text-sm font-bold text-primary">
                    Calcular presupuesto <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </span>
                  <span className="text-xs text-muted-foreground">Madrid y Castilla-La Mancha</span>
                </div>
              </div>
            </Link>

            <Link
              href="/servicios/te-humus-paisajistas-jardineros"
              className="group relative overflow-hidden rounded-lg bg-card p-7 md:p-9 border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/8"
            >
              <div className="relative flex min-h-[300px] flex-col">
                <div className="mb-7 flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gold-bg text-gold">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-gold/20 bg-background/70 px-3 py-1 text-xs font-bold text-gold">
                    Suministro o aplicación
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold mb-3">
                  Para paisajistas y jardineros
                </p>
                <h3 className="text-2xl md:text-3xl font-heading font-extrabold leading-tight text-foreground group-hover:text-primary transition-colors">
                  Té de humus para proyectos profesionales
                </h3>
                <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                  Calcula litros, formatos y opción de aplicación para obras, zonas verdes y mantenimientos con superficie conocida.
                </p>
                <div className="mt-auto pt-8 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center text-sm font-bold text-primary">
                    Ver calculadora profesional <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </span>
                  <span className="text-xs text-muted-foreground">B2B y mantenimiento recurrente</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          3. BENEFICIOS — ICONOS ORGÁNICOS PREMIUM
      ════════════════════════════════════════════ */}
      <section id="beneficios" className="w-full py-20 md:py-28 bg-background relative">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="leaf-divider w-24 mx-auto mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-5">
              Resultados reales para tu cultivo.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sin magia ni claims inflados. Biocultor aporta microorganismos vivos que 
              desbloquean nutrientes y mejoran la estructura del suelo a medio plazo.
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 stagger-children">
            {[
              {
                icon: Leaf,
                title: 'Nutrición Biológica Activa',
                text: 'Reintroduce la biología natural que tu suelo ha perdido. Mayor disponibilidad de NPK y mejor retención de agua.',
                accent: 'bg-primary/8 text-primary',
              },
              {
                icon: Droplets,
                title: 'Compatible con Riego',
                text: 'Diseñado sin partículas sólidas. Se aplica directamente por goteo o aspersión sin riesgo de atascar filtros.',
                accent: 'bg-secondary/10 text-secondary',
              },
              {
                icon: FlaskConical,
                title: 'Dosis Orientada a Contexto',
                text: 'Te explicamos exactamente cuánto usar según si tienes un huerto urbano, un viñedo o 40 hectáreas de olivar.',
                accent: 'bg-primary/10 text-secondary',
              },
            ].map(({ icon: Icon, title, text, accent }) => (
              <div
                key={title}
                className="card-lift p-8 md:p-10 rounded-3xl bg-card border border-border/50 flex flex-col items-center text-center gap-5 relative overflow-hidden group"
              >
                {/* Subtle gold corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[3rem] pointer-events-none" />
                <div className={`p-4 rounded-2xl ${accent} transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          3. BUYER PERSONA — ¿Cuál es tu situación?
      ════════════════════════════════════════════ */}
      <BuyerPersonaSelector />

      {/* ════════════════════════════════════════════
          4. FORMAT SELECTOR — SELECTOR DE FORMATOS
      ════════════════════════════════════════════ */}
      <FormatSelector dbVariants={dbVariants} productSlug="te-humus-liquido-premium" />

      {/* OrtIgaFormatSelector movido al final — ver sección upsell tras GEO */}

      {/* ════════════════════════════════════════════
          5. SCIENCE & PROOF — AUTORIDAD CIENTÍFICA
          (Ciencia antes que testimonios: crea el marco
          de credibilidad antes de mostrar las pruebas)
      ════════════════════════════════════════════ */}
      <ScienceProof />

      {/* ════════════════════════════════════════════
          6. PRUEBAS SOCIALES — Testimonios geolocalizados
          (Testimonios después de la ciencia: refuerzan
          la autoridad con prueba social real)
      ════════════════════════════════════════════ */}
      <SocialProof />

      {/* ════════════════════════════════════════════
          7. CALCULADORA DE AHORRO — Argumento racional
          (Calculadora cuando ya hay deseo: convierte
          interés en decisión con argumento económico)
      ════════════════════════════════════════════ */}
      <CostCalculator />

      {/* ════════════════════════════════════════════
          8. MÉTODO DE USO — El proceso honesto
          (Timeline al final: el usuario ya quiere comprar,
          ahora le explicamos el método, no antes)
      ════════════════════════════════════════════ */}
      <ResultsTimeline />

      {/* ════════════════════════════════════════════
          5. SOLUCIONES POR CULTIVO
      ════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 bg-cream-warm relative">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/15">
                <Sprout className="w-3.5 h-3.5" />
                Soluciones por cultivo
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Encuentra la fórmula exacta para tu cultivo.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Olivar, cítricos, huerto urbano, vivero o jardinería profesional — cada cultivo 
                tiene sus necesidades. Nosotros las cubrimos.
              </p>
            </div>
            <Link href="/te-de-humus-de-lombriz" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors whitespace-nowrap flex items-center gap-1">
              Ver todos los cultivos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 stagger-children">
            {featuredSolutions.map((solution) => (
              <Link
                key={solution.slug}
                href={`/te-de-humus-de-lombriz/${solution.slug}`}
                className="group card-lift rounded-2xl md:rounded-3xl border border-border/50 bg-card p-7 md:p-9 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/60 via-primary to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  {solution.audience}
                </p>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {solution.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">{solution.intro}</p>
                <div className="mt-5 inline-flex items-center text-sm font-bold text-primary">
                  Ver aplicación <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          6. COMPRA DIRECTA — PÁGINAS COMERCIALES 
      ════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 bg-card border-t border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="mb-12 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
                  Biblioteca Biocultor
                </p>
                <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
                  Comparativas, calculadoras y metodologia en un solo centro.
                </h2>
                <p className="mt-3 max-w-3xl text-muted-foreground">
                  Si necesitas decidir entre comprar producto, contratar aplicacion o comparar alternativas, la biblioteca recoge los criterios sin mezclar marketing con promesas.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link
                  href="/biblioteca"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-green-hover"
                >
                  Abrir biblioteca
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/20">
              <Star className="w-3.5 h-3.5" />
              Compra directa
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              La forma más clara de empezar a comprar.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Páginas diseñadas para que compres exactamente lo que tu cultivo necesita, 
              sin perder tiempo buscando.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3 stagger-children">
            {featuredCommercial.map((page) => (
              <Link
                key={page.slug}
                href={`/comprar-te-de-humus-de-lombriz/${page.slug}`}
                className="group card-lift rounded-2xl md:rounded-3xl border border-border/50 bg-background p-7 md:p-9 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[2rem] pointer-events-none" />
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  {page.keyword}
                </p>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {page.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">{page.intro}</p>
                <div className="mt-5 inline-flex items-center text-sm font-bold text-primary">
                  Explorar <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          7. GUÍAS DE CULTIVO — AUTORIDAD TEMÁTICA
      ════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 bg-background border-t border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/20">
                <TreePine className="w-3.5 h-3.5" />
                Guías de cultivo
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Aprende a usarlo paso a paso.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Contenido editorial para resolver dudas de uso, formato y aplicación sin exagerar beneficios.
              </p>
            </div>
            <Link href="/aprende" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors whitespace-nowrap flex items-center gap-1">
              Ver todas las guías <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3 stagger-children">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/aprende/${article.slug}`}
                className="group card-lift rounded-2xl md:rounded-3xl border border-border/50 bg-card p-7 md:p-9 relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  {article.category}
                </p>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">{article.excerpt}</p>
                <div className="mt-5 inline-flex items-center text-sm font-bold text-primary">
                  Leer guía <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          8. BIOCULTOR EN ESPAÑA — COBERTURA GEO
      ════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 bg-cream-warm border-t border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth-brown/8 text-brand-brown text-xs font-bold uppercase tracking-widest mb-5 border border-earth-brown/15">
                <MapPin className="w-3.5 h-3.5" />
                Biocultor en España
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Entregamos vida a cada rincón de la Península.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Cobertura completa en toda España con logística express. Descubre recomendaciones 
                específicas para los cultivos dominantes de tu región.
              </p>
            </div>
            <Link href="/espana" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors whitespace-nowrap flex items-center gap-1">
              Ver todas las regiones <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 stagger-children">
            {featuredGeo.map((geo) => {
              const emojiMap: Record<string, string> = {
                'andalucia': '🫒',
                'comunitat-valenciana': '🍊',
                'cataluna': '🌿',
                'madrid': '🏡',
              };
              const emoji = emojiMap[geo.slug] || '📍';
              
              return (
                <Link
                  key={geo.slug}
                  href={`/espana/${geo.slug}`}
                  className="group card-lift rounded-2xl md:rounded-3xl border border-border/50 bg-card p-7 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/40 to-transparent opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                    {emoji} {geo.region}
                  </p>
                  <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {geo.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed text-sm line-clamp-3">{geo.intro}</p>
                  <div className="mt-4 inline-flex items-center text-xs font-bold text-primary">
                    Ver guía regional <ArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CATÁLOGO SECUNDARIO — Purín de ortiga
          (posicionado aquí como upsell, no como distracción del funnel principal)
      ════════════════════════════════════════════ */}
      <OrtIgaFormatSelector dbVariants={dbOrtigaVariants} />

      {/* ════════════════════════════════════════════
          9. GARANTÍA — Destruye la última objeción
      ════════════════════════════════════════════ */}
      <RiskReversal />

      {/* ════════════════════════════════════════════
          9b. NEWSLETTER — RETENCIÓN DE LEADS
      ════════════════════════════════════════════ */}
      <NewsletterCapture />

      {/* ════════════════════════════════════════════
          10. FAQ & AIO SEO  
      ════════════════════════════════════════════ */}
      <FaqAioSeo variants={dbVariants.map((v) => ({ size: v.size, price: v.price }))} />
    </div>
  )
}
