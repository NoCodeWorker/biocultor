export const revalidate = 1800

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Leaf, Droplets, FlaskConical, Star, Sparkles, TreePine, Sprout } from "lucide-react"
import FormatSelector from "@/components/FormatSelector"
import nextDynamic from "next/dynamic"

const ScienceProof = nextDynamic(() => import("@/components/ScienceProof"))
const FaqAioSeo = nextDynamic(() => import("@/components/FaqAioSeo"))
const BuyerPersonaSelector = nextDynamic(() => import("@/components/BuyerPersonaSelector"))
const ResultsTimeline = nextDynamic(() => import("@/components/ResultsTimeline"))
const CostCalculator = nextDynamic(() => import("@/components/CostCalculator"))
const RiskReversal = nextDynamic(() => import("@/components/RiskReversal"))

import prisma from "@/lib/db"
import { buildMetadata, breadcrumbSchema, collectionPageSchema } from '@/lib/seo'
import StructuredData from '@/components/StructuredData'
import { getSeoArticles, getSeoCommercialPages, getSeoGeoPages, getSeoSolutions } from '@/lib/seo-store'

export const metadata = buildMetadata({
  title: 'Comprar té de humus de lombriz en España | Biocultor',
  description:
    'Tienda especializada en té de humus de lombriz para España, con formatos para huerto urbano, olivar, cítricos y jardinería profesional.',
  path: '/',
  keywords: [
    'comprar té de humus de lombriz',
    'té de humus de lombriz españa',
    'humus líquido premium',
    'fertilizante orgánico líquido',
    'té de humus para olivos',
  ],
})

export default async function Page() {
  const dbProduct = await prisma.product.findUnique({
    where: { slug: "te-humus-liquido-premium" },
    include: { 
      variants: {
        orderBy: { price: 'asc' }
      } 
    }
  });

  const dbVariants = dbProduct?.variants || [];
  const [seoSolutions, seoArticles, seoCommercialPages, seoGeoPages] = await Promise.all([
    getSeoSolutions(),
    getSeoArticles(),
    getSeoCommercialPages(),
    getSeoGeoPages(),
  ]);
  const featuredSolutions = seoSolutions.slice(0, 4);
  const featuredArticles = seoArticles.slice(0, 3);
  const featuredCommercial = seoCommercialPages.slice(0, 3);
  const featuredGeo = seoGeoPages.slice(0, 4);

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
            { name: 'Dominio informacional', path: '/aprende' },
            { name: 'Dominio GEO/IA', path: '/espana' },
          ],
        })}
      />

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
            quality={90}
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

          {/* Hero Heading — Sigue el patrón global font-heading (Quicksand) */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight max-w-5xl text-cream leading-[1.05] drop-shadow-lg">
            La Esencia de la Tierra.
            <br />
            <span className="text-brand-green-light">Té de Humus Premium.</span>
          </h1>

          <p className="text-base md:text-xl text-cream/80 max-w-2xl leading-relaxed font-light drop-shadow-sm">
            Té de humus de lombriz elaborado en España para huerto, jardín y cultivo profesional,
            explicado con una lógica de uso clara y sin promesas infladas.
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
            <Link href="#formatos">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-14 text-base font-semibold border-cream/30 text-cream bg-cream/10 backdrop-blur-md hover:bg-cream/20 hover:text-white transition-all"
              >
                Ver Formatos y Precios
              </Button>
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

          {/* Proof Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 md:gap-12 w-full max-w-xl pb-6">
            {[
              { value: '4', label: 'Formatos principales' },
              { value: 'ES', label: 'Cobertura nacional' },
              { value: 'SSR', label: 'Contenido server-first' },
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
          2. BENEFICIOS — ICONOS ORGÁNICOS PREMIUM  
      ════════════════════════════════════════════ */}
      <section id="beneficios" className="w-full py-20 md:py-28 bg-background relative">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="leaf-divider w-24 mx-auto mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-5">
              ¿Por qué Biocultor es diferente?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Biocultor no se presenta como una promesa milagrosa. Explica formato, aplicación y
              contexto de uso para que la compra tenga sentido técnico y comercial.
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 stagger-children">
            {[
              {
                icon: Leaf,
                title: 'Nutrición Orgánica',
                text: 'Pensado para quien busca una alternativa orgánica con una explicación de uso comprensible y sin retórica pseudo-científica.',
                accent: 'bg-primary/8 text-primary',
              },
              {
                icon: Droplets,
                title: 'Cuidado del Suelo',
                text: 'La compatibilidad con riego debe leerse desde la instalación y la forma de uso, no desde garantías absolutas escritas en una landing.',
                accent: 'bg-secondary/10 text-secondary',
              },
              {
                icon: FlaskConical,
                title: 'Uso controlado',
                text: 'El valor del producto está en su encaje dentro de una rutina de cultivo ordenada, no en cifras o efectos que no se puedan sostener.',
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
      <FormatSelector dbVariants={dbVariants} />

      {/* ════════════════════════════════════════════
          4bis. CATÁLOGO SECUNDARIO — Purín de ortiga
      ════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-24 bg-background border-t border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="rounded-[2rem] border border-border/50 bg-cream-warm/60 overflow-hidden grid md:grid-cols-5 gap-0">
            <div className="md:col-span-3 p-8 md:p-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/15">
                <Leaf className="w-3.5 h-3.5" />
                También en catálogo
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Purín concentrado de ortiga.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
                Extracto vegetal concentrado pensado para huerto urbano, rosales, frutales y pequeñas
                explotaciones con manejo orgánico. Mismos formatos que el té de humus (1 L, 5 L, 10 L, 25 L)
                para que la elección por escala siga siendo sencilla.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/producto/purin-ortiga-concentrado"
                  className="inline-flex items-center rounded-full px-7 h-12 font-bold bg-primary text-white shadow-lg shadow-primary/15 text-sm hover:bg-brand-green-hover transition-colors"
                >
                  Ver producto
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="/purin-de-ortiga"
                  className="inline-flex items-center rounded-full px-7 h-12 font-bold bg-background border border-border/60 text-foreground text-sm hover:border-primary/40 transition-colors"
                >
                  Aplicaciones por cultivo
                </Link>
              </div>
              <p className="mt-6 text-xs text-muted-foreground leading-relaxed max-w-md">
                Editorial alineada con ADR-002: las guías de ortiga citan fuentes institucionales y
                revisiones científicas sin convertir la investigación en promesa comercial.
              </p>
            </div>
            <div className="md:col-span-2 relative min-h-[260px] md:min-h-full">
              <Image
                src="/5 litros.jpg"
                alt="Formato de 5 litros del catálogo Biocultor"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-cream-warm/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          5. TIMELINE DE RESULTADOS — ¿Cuándo actúa?
      ════════════════════════════════════════════ */}
      <ResultsTimeline />

      {/* ════════════════════════════════════════════
          6. SCIENCE & PROOF — TESTIMONIOS + CIENCIA
      ════════════════════════════════════════════ */}
      <ScienceProof />

      {/* ════════════════════════════════════════════
          7. CALCULADORA DE AHORRO — Argumento racional
      ════════════════════════════════════════════ */}
      <CostCalculator />

      {/* ════════════════════════════════════════════
          5. SOLUCIONES POR CULTIVO
      ════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 bg-cream-warm relative">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="max-w-3xl mb-14">
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
                <p className="text-xs font-bold uppercase tracking-widest text-sage mb-3">
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
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth-brown/8 text-brand-brown text-xs font-bold uppercase tracking-widest mb-5 border border-earth-brown/15">
              <MapPinIcon />
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

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 stagger-children">
            {featuredGeo.map((geo) => (
              <Link
                key={geo.slug}
                href={`/espana/${geo.slug}`}
                className="group card-lift rounded-2xl md:rounded-3xl border border-border/50 bg-card p-7 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/40 to-transparent opacity-50" />
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  {geo.region}
                </p>
                <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {geo.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm line-clamp-3">{geo.intro}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          9. GARANTÍA — Destruye la última objeción
      ════════════════════════════════════════════ */}
      <RiskReversal />

      {/* ════════════════════════════════════════════
          10. FAQ & AIO SEO  
      ════════════════════════════════════════════ */}
      <FaqAioSeo />
    </div>
  )
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

