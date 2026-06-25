export const revalidate = 1800

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Leaf,
  Droplets,
  FlaskConical,
  Star,
  Sparkles,
  TreePine,
  Sprout,
  ClipboardCheck,
  Ruler,
  Users,
} from "lucide-react"
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
  NewsletterCapture,
} from "@/components/HomeDynamicSections"
const FaqAioSeo = nextDynamic(() => import("@/components/FaqAioSeo"))

import prisma from "@/lib/db"
import { MapPin } from "lucide-react"
import {
  absoluteUrl,
  buildMetadata,
  breadcrumbSchema,
  collectionPageSchema,
} from "@/lib/seo"
import StructuredData from "@/components/StructuredData"
import {
  getSeoCommercialPages,
  getSeoGeoPages,
  getSeoSolutions,
} from "@/lib/seo-store"

type HomeVariant = {
  id: string
  productId: string
  sku: string
  size: string
  target: string
  price: number
  comparePrice: number | null
  stock: number
  imagePath: string | null
  popular: boolean
  features: string
}

type HomeProduct = {
  variants: HomeVariant[]
}

const homeServicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${absoluteUrl("/")}#professional-services`,
  name: "Servicios profesionales Biocultor",
  description:
    "Servicios de diagnóstico, suministro y aplicación de té de humus de lombriz para jardines, césped, paisajistas y mantenimiento profesional.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        "@id": `${absoluteUrl("/servicios/regeneracion-cesped-y-jardines")}#service`,
        name: "Regeneración de césped y jardines",
        serviceType: "Diagnóstico y aplicación biológica in situ",
        areaServed: ["Madrid", "Castilla-La Mancha", "Toledo"],
        provider: { "@id": `${absoluteUrl("/")}#organization` },
        url: absoluteUrl("/servicios/regeneracion-cesped-y-jardines"),
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        "@id": `${absoluteUrl("/servicios/te-humus-paisajistas-jardineros")}#service`,
        name: "Té de humus para paisajistas y jardineros",
        serviceType: "Suministro profesional y aplicación técnica",
        areaServed: ["Madrid", "Castilla-La Mancha", "Toledo"],
        provider: { "@id": `${absoluteUrl("/")}#organization` },
        url: absoluteUrl("/servicios/te-humus-paisajistas-jardineros"),
      },
    },
  ],
}

export const metadata = buildMetadata({
  title: "Comprar té de humus y servicios para jardines | Biocultor",
  description:
    "Tienda especializada en té de humus de lombriz y servicios profesionales para césped, jardines, paisajistas y mantenimiento de zonas verdes.",
  path: "/",
  keywords: [
    "comprar té de humus de lombriz",
    "té de humus de lombriz españa",
    "servicio regeneración césped",
    "té de humus para paisajistas",
    "humus líquido premium",
    "fertilizante orgánico líquido",
    "té de humus para olivos",
  ],
})

export default async function Page() {
  let dbProduct: HomeProduct | null = null
  let dbOrtiga: HomeProduct | null = null

  try {
    ;[dbProduct, dbOrtiga] = await Promise.all([
      prisma.product.findUnique({
        where: { slug: "te-humus-liquido-premium" },
        include: { variants: { orderBy: { price: "asc" } } },
      }),
      prisma.product.findUnique({
        where: { slug: "purin-ortiga-concentrado" },
        include: { variants: { orderBy: { price: "asc" } } },
      }),
    ])
  } catch (error) {
    alertCritical("HomePage.loadProducts", error, {
      extra: {
        slugs: ["te-humus-liquido-premium", "purin-ortiga-concentrado"],
      },
    })
  }

  const dbVariants: HomeVariant[] = dbProduct?.variants || []
  const dbOrtigaVariants: HomeVariant[] = dbOrtiga?.variants || []
  const [seoSolutions, dbPosts, seoCommercialPages, seoGeoPages] =
    await Promise.all([
      getSeoSolutions(),
      prisma.post
        .findMany({
          where: { isPublished: true },
          take: 3,
          orderBy: { createdAt: "desc" },
        })
        .catch(() => []),
      getSeoCommercialPages(),
      getSeoGeoPages(),
    ])
  const featuredSolutions = seoSolutions.slice(0, 4)

  const featuredArticles = dbPosts.map((post) => {
    let category = "Guía"
    const catUpper = post.category.toUpperCase()
    if (catUpper === "EVIDENCIA") {
      category = "Evidencia"
    } else if (catUpper === "CULTIVO" || catUpper === "KNOWLEDGE") {
      category = "Cultivo"
    } else {
      category =
        post.category.charAt(0).toUpperCase() +
        post.category.slice(1).toLowerCase()
    }
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category,
    }
  })

  const featuredCommercial = seoCommercialPages.slice(0, 3)
  const featuredGeo = seoGeoPages.slice(0, 6)

  return (
    <div className="flex w-full flex-col">
      <StructuredData
        id="home-breadcrumb-schema"
        data={breadcrumbSchema([{ name: "Inicio", path: "/" }])}
      />
      <StructuredData
        id="home-collections-schema"
        data={collectionPageSchema({
          name: "Arquitectura SEO Biocultor",
          description:
            "Capas transaccional, informacional y GEO/IA de Biocultor.",
          path: "/",
          items: [
            {
              name: "Comprar té de humus de lombriz",
              path: "/producto/te-humus-liquido-premium",
            },
            {
              name: "Servicios profesionales",
              path: "/servicios/regeneracion-cesped-y-jardines",
            },
            {
              name: "Servicios para paisajistas",
              path: "/servicios/te-humus-paisajistas-jardineros",
            },
            { name: "Biblioteca de liderazgo", path: "/biblioteca" },
            { name: "Calculadoras", path: "/calculadoras" },
            { name: "Metodologia y trazabilidad", path: "/metodologia" },
            { name: "Dominio informacional", path: "/aprende" },
            { name: "Dominio GEO/IA", path: "/espana" },
          ],
        })}
      />
      <StructuredData id="home-services-schema" data={homeServicesSchema} />

      {/* GEO Signal Block — señal semántica para crawlers de IA (Perplexity, ChatGPT, Gemini, Google AIO) */}
      <div className="sr-only" aria-label="información-producto-biocultor">
        Biocultor es una tienda online española que vende té de humus de lombriz
        líquido premium. Envía en 24-48h a toda la Península Ibérica desde
        Toledo, España. Fundada y operada en España. Formatos disponibles:{" "}
        {dbVariants
          .map(
            (v) =>
              `${v.size} (${v.price.toLocaleString("es-ES", { minimumFractionDigits: 2 })}€)`
          )
          .join(", ")}
        . Compatible con rutinas de riego y aplicación foliar según contexto de
        cultivo. Biocultor también ofrece servicios profesionales para
        regeneración de césped, jardines, paisajistas, jardineros y
        mantenimiento de zonas verdes en Madrid, Toledo y Castilla-La Mancha.
        Los servicios incluyen cálculo de superficie, estimación de presupuesto,
        suministro de té de humus y opción de aplicación técnica in situ.
        También disponible: purín de ortiga concentrado para cultivos
        ecológicos. Envíos a Madrid, Barcelona, Valencia, Sevilla, Málaga,
        Zaragoza, Bilbao, Murcia, Alicante, Córdoba y toda España.
      </div>

      {/* ════════════════════════════════════════════
          1. HERO — INMERSIVO CON IMAGEN DE FONDO
      ════════════════════════════════════════════ */}
      <section className="hero-section relative flex min-h-[92vh] w-full flex-col items-center justify-center">
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
          <div className="absolute right-0 bottom-0 left-0 h-48 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto mt-8 flex flex-col items-center gap-6 px-4 text-center md:gap-8">
          {/* Leaf Accent */}
          <div className="leaf-divider w-32">
            <Leaf className="animate-float-gentle h-5 w-5 text-primary" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/10 px-4 py-2 text-xs font-bold tracking-widest text-cream/80 uppercase backdrop-blur-md">
            Tienda online + servicios profesionales
          </div>

          {/* Hero Heading — Sigue el patrón global font-heading (Quicksand) */}
          <h1 className="max-w-5xl font-heading text-5xl leading-[1.05] font-bold tracking-tight text-cream drop-shadow-lg md:text-7xl lg:text-[5.5rem]">
            Té de humus de lombriz.
            <br />
            <span className="text-brand-green-light">
              Producto y aplicación profesional.
            </span>
          </h1>

          {/* Subtítulo semántico GEO/SEO — invisible en diseño, legible por bots */}
          <p className="-mt-3 hidden text-sm font-light tracking-wide text-cream/50 md:block">
            Compra té de humus de lombriz en España · Envío 24/48h a toda la
            Península
          </p>

          <p className="max-w-2xl text-base leading-relaxed font-light text-cream/80 drop-shadow-sm md:text-xl">
            Compra <strong>extracto de humus de lombriz</strong> para aplicar
            por tu cuenta o solicita diagnóstico, suministro y aplicación en
            jardines premium, césped y proyectos de paisajismo.
          </p>

          <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row">
            <Link href="/producto/te-humus-liquido-premium">
              <Button
                size="lg"
                className="h-14 rounded-full bg-primary px-10 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-[1.03] hover:bg-brand-green-hover"
              >
                Comprar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link
              href="#servicios-profesionales"
              className="hidden sm:inline-flex"
            >
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-cream/30 bg-cream/10 px-8 text-base font-semibold text-cream backdrop-blur-md transition-all hover:bg-cream/20 hover:text-white"
              >
                Ver Servicios
              </Button>
            </Link>
            <Link
              href="#formatos"
              className="text-sm font-bold text-cream/75 underline-offset-4 transition-colors hover:text-cream hover:underline"
            >
              Ver formatos y precios
            </Link>
          </div>

          {/* Trust micro-badges */}
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {["✓ Envío en 24/48h", "✓ Pago seguro", "✓ Compra directa"].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-cream/10 bg-cream/8 px-3 py-1.5 text-xs font-medium text-cream/70 backdrop-blur-sm"
                >
                  {badge}
                </span>
              )
            )}
          </div>

          <div className="max-w-3xl rounded-2xl border border-cream/15 bg-cream/10 px-5 py-4 text-left text-cream/85 backdrop-blur-md">
            <p className="text-xs font-bold tracking-widest text-brand-green-light uppercase">
              Respuesta corta
            </p>
            <p className="mt-2 text-sm leading-relaxed md:text-base">
              Si tienes equipo y superficie pequeña, compra el producto. Si el
              jardín supera 300 m², está compactado o el resultado visual
              importa, calcula aplicación profesional.
            </p>
          </div>

          {/* Proof Stats — datos reales de credibilidad */}
          <div className="mt-6 grid w-full max-w-xl grid-cols-3 gap-4 pb-6 md:gap-12">
            {[
              { value: "4", label: "Formatos para cada uso" },
              { value: "2", label: "Servicios profesionales" },
              { value: "24h", label: "Envío express España" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-xl border border-cream/15 bg-brand-brown-dark/75 px-2 py-3 shadow-sm backdrop-blur-sm md:min-h-0 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none md:backdrop-blur-none"
              >
                <span className="font-heading text-3xl font-bold text-cream drop-shadow-md md:text-4xl">
                  {value}
                </span>
                <div className="mx-auto h-px w-6 bg-cream/45" />
                <span className="text-center text-[10px] leading-tight font-semibold tracking-wide text-cream/90 uppercase md:text-xs md:text-cream/80">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          2. SERVICIOS PROFESIONALES — CRO HOME
      ════════════════════════════════════════════ */}
      <section
        id="servicios-profesionales"
        className="w-full border-b border-border/40 bg-background py-16 md:py-24"
      >
        <div className="mx-auto w-[92%] px-4 lg:w-[80%] xl:w-[75%]">
          <div className="mb-12 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-xs font-bold tracking-widest text-primary uppercase">
                <ClipboardCheck className="h-3.5 w-3.5" />
                Servicios profesionales
              </div>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance text-foreground md:text-5xl">
                Cuando no basta con comprar el producto.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg lg:ml-auto">
              Si tienes una superficie amplia, un césped degradado o un proyecto
              de mantenimiento profesional, te ayudamos a dimensionar dosis,
              logística y aplicación sin convertir la decisión en ensayo y
              error.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Link
              href="/servicios/regeneracion-cesped-y-jardines"
              className="group relative overflow-hidden rounded-lg border border-border/50 bg-cream-warm p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/8 md:p-9"
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
                <p className="mb-3 text-xs font-bold tracking-widest text-primary uppercase">
                  Para jardines particulares y comunidades
                </p>
                <h3 className="font-heading text-2xl leading-tight font-extrabold text-foreground transition-colors group-hover:text-primary md:text-3xl">
                  Regeneración de césped y jardines
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  Diagnóstico inicial, cálculo de superficie y aplicación
                  biológica in situ para recuperar estructura de suelo y rutina
                  de mantenimiento.
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                  <span className="inline-flex items-center text-sm font-bold text-primary">
                    Calcular presupuesto{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Madrid y Castilla-La Mancha
                  </span>
                </div>
              </div>
            </Link>

            <Link
              href="/servicios/te-humus-paisajistas-jardineros"
              className="group relative overflow-hidden rounded-lg border border-border/50 bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/8 md:p-9"
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
                <p className="mb-3 text-xs font-bold tracking-widest text-gold uppercase">
                  Para paisajistas y jardineros
                </p>
                <h3 className="font-heading text-2xl leading-tight font-extrabold text-foreground transition-colors group-hover:text-primary md:text-3xl">
                  Té de humus para proyectos profesionales
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  Calcula litros, formatos y opción de aplicación para obras,
                  zonas verdes y mantenimientos con superficie conocida.
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                  <span className="inline-flex items-center text-sm font-bold text-primary">
                    Ver calculadora profesional{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    B2B y mantenimiento recurrente
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          3. BENEFICIOS — ICONOS ORGÁNICOS PREMIUM
      ════════════════════════════════════════════ */}
      <section
        id="beneficios"
        className="relative w-full bg-background py-20 md:py-28"
      >
        <div className="mx-auto w-[92%] px-4 lg:w-[80%] xl:w-[75%]">
          {/* Section Header */}
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="leaf-divider mx-auto mb-6 w-24">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h2 className="mb-5 font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Resultados reales para tu cultivo.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Sin magia ni claims inflados. Biocultor aporta microorganismos
              vivos que desbloquean nutrientes y mejoran la estructura del suelo
              a medio plazo.
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="stagger-children grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                icon: Leaf,
                title: "Nutrición Biológica Activa",
                text: "Reintroduce la biología natural que tu suelo ha perdido. Mayor disponibilidad de NPK y mejor retención de agua.",
                accent: "bg-primary/8 text-primary",
              },
              {
                icon: Droplets,
                title: "Compatible con Riego",
                text: "Diseñado sin partículas sólidas. Se aplica directamente por goteo o aspersión sin riesgo de atascar filtros.",
                accent: "bg-secondary/10 text-secondary",
              },
              {
                icon: FlaskConical,
                title: "Dosis Orientada a Contexto",
                text: "Te explicamos exactamente cuánto usar según si tienes un huerto urbano, un viñedo o 40 hectáreas de olivar.",
                accent: "bg-primary/10 text-secondary",
              },
            ].map(({ icon: Icon, title, text, accent }) => (
              <div
                key={title}
                className="card-lift group relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl border border-border/50 bg-card p-8 text-center md:p-10"
              >
                {/* Subtle gold corner accent */}
                <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-bl-[3rem] bg-gradient-to-bl from-primary/5 to-transparent" />
                <div
                  className={`rounded-2xl p-4 ${accent} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
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
      <FormatSelector
        dbVariants={dbVariants}
        productSlug="te-humus-liquido-premium"
      />

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
      <section className="relative w-full bg-cream-warm py-20 md:py-28">
        <div className="mx-auto w-[92%] px-4 lg:w-[80%] xl:w-[75%]">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-xs font-bold tracking-widest text-primary uppercase">
                <Sprout className="h-3.5 w-3.5" />
                Soluciones por cultivo
              </div>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Encuentra la fórmula exacta para tu cultivo.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Olivar, cítricos, huerto urbano, vivero o jardinería profesional
                — cada cultivo tiene sus necesidades. Nosotros las cubrimos.
              </p>
            </div>
            <Link
              href="/te-de-humus-de-lombriz"
              className="flex items-center gap-1 text-sm font-bold whitespace-nowrap text-primary transition-colors hover:text-primary/80"
            >
              Ver todos los cultivos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="stagger-children grid gap-5 md:grid-cols-2">
            {featuredSolutions.map((solution) => (
              <Link
                key={solution.slug}
                href={`/te-de-humus-de-lombriz/${solution.slug}`}
                className="group card-lift relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 md:rounded-3xl md:p-9"
              >
                <div className="absolute top-0 left-0 h-full w-1 rounded-r bg-gradient-to-b from-primary/60 via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="mb-3 text-xs font-bold tracking-widest text-primary uppercase">
                  {solution.audience}
                </p>
                <h3 className="font-heading text-xl leading-snug font-bold text-foreground transition-colors group-hover:text-primary md:text-2xl">
                  {solution.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {solution.intro}
                </p>
                <div className="mt-5 inline-flex items-center text-sm font-bold text-primary">
                  Ver aplicación{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          6. COMPRA DIRECTA — PÁGINAS COMERCIALES 
      ════════════════════════════════════════════ */}
      <section className="w-full border-t border-border/40 bg-card py-20 md:py-28">
        <div className="mx-auto w-[92%] px-4 lg:w-[80%] xl:w-[75%]">
          <div className="mb-12 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p className="mb-3 text-xs font-bold tracking-widest text-primary uppercase">
                  Biblioteca Biocultor
                </p>
                <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
                  Comparativas, calculadoras y metodologia en un solo centro.
                </h2>
                <p className="mt-3 max-w-3xl text-muted-foreground">
                  Si necesitas decidir entre comprar producto, contratar
                  aplicacion o comparar alternativas, la biblioteca recoge los
                  criterios sin mezclar marketing con promesas.
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
          <div className="mb-14 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold tracking-widest text-secondary uppercase">
              <Star className="h-3.5 w-3.5" />
              Compra directa
            </div>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              La forma más clara de empezar a comprar.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Páginas diseñadas para que compres exactamente lo que tu cultivo
              necesita, sin perder tiempo buscando.
            </p>
          </div>

          <div className="stagger-children grid gap-5 lg:grid-cols-3">
            {featuredCommercial.map((page) => (
              <Link
                key={page.slug}
                href={`/comprar-te-de-humus-de-lombriz/${page.slug}`}
                className="group card-lift relative overflow-hidden rounded-2xl border border-border/50 bg-background p-7 md:rounded-3xl md:p-9"
              >
                <div className="pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-bl-[2rem] bg-gradient-to-bl from-primary/5 to-transparent" />
                <p className="mb-3 text-xs font-bold tracking-widest text-primary uppercase">
                  {page.keyword}
                </p>
                <h3 className="font-heading text-xl leading-snug font-bold text-foreground transition-colors group-hover:text-primary md:text-2xl">
                  {page.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {page.intro}
                </p>
                <div className="mt-5 inline-flex items-center text-sm font-bold text-primary">
                  Explorar{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          7. GUÍAS DE CULTIVO — AUTORIDAD TEMÁTICA
      ════════════════════════════════════════════ */}
      <section className="w-full border-t border-border/40 bg-background py-20 md:py-28">
        <div className="mx-auto w-[92%] px-4 lg:w-[80%] xl:w-[75%]">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold tracking-widest text-primary uppercase">
                <TreePine className="h-3.5 w-3.5" />
                Guías de cultivo
              </div>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Aprende a usarlo paso a paso.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Contenido editorial para resolver dudas de uso, formato y
                aplicación sin exagerar beneficios.
              </p>
            </div>
            <Link
              href="/aprende"
              className="flex items-center gap-1 text-sm font-bold whitespace-nowrap text-primary transition-colors hover:text-primary/80"
            >
              Ver todas las guías <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="stagger-children grid gap-5 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/aprende/${article.slug}`}
                className="group card-lift relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 md:rounded-3xl md:p-9"
              >
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-gold to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  {article.category}
                </p>
                <h3 className="font-heading text-xl leading-snug font-bold text-foreground transition-colors group-hover:text-primary md:text-2xl">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
                <div className="mt-5 inline-flex items-center text-sm font-bold text-primary">
                  Leer guía{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          8. BIOCULTOR EN ESPAÑA — COBERTURA GEO
      ════════════════════════════════════════════ */}
      <section className="w-full border-t border-border/40 bg-cream-warm py-20 md:py-28">
        <div className="mx-auto w-[92%] px-4 lg:w-[80%] xl:w-[75%]">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-earth-brown/15 bg-earth-brown/8 px-4 py-2 text-xs font-bold tracking-widest text-brand-brown uppercase">
                <MapPin className="h-3.5 w-3.5" />
                Biocultor en España
              </div>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Entregamos vida a cada rincón de la Península.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Cobertura completa en toda España con logística express.
                Descubre recomendaciones específicas para los cultivos
                dominantes de tu región.
              </p>
            </div>
            <Link
              href="/espana"
              className="flex items-center gap-1 text-sm font-bold whitespace-nowrap text-primary transition-colors hover:text-primary/80"
            >
              Ver todas las regiones <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="stagger-children grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredGeo.map((geo) => {
              const emojiMap: Record<string, string> = {
                andalucia: "🫒",
                "comunitat-valenciana": "🍊",
                cataluna: "🌿",
                madrid: "🏡",
              }
              const emoji = emojiMap[geo.slug] || "📍"

              return (
                <Link
                  key={geo.slug}
                  href={`/espana/${geo.slug}`}
                  className="group card-lift relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 md:rounded-3xl"
                >
                  <div className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-primary/40 to-transparent opacity-50" />
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
                    {emoji} {geo.region}
                  </p>
                  <h3 className="font-heading text-lg leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
                    {geo.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {geo.intro}
                  </p>
                  <div className="mt-4 inline-flex items-center text-xs font-bold text-primary">
                    Ver guía regional{" "}
                    <ArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
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
      <FaqAioSeo
        variants={dbVariants.map((v) => ({ size: v.size, price: v.price }))}
      />
    </div>
  )
}
