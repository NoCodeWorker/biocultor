import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import StructuredData from "@/components/StructuredData";
import Breadcrumbs from "@/components/Breadcrumbs";
import Markdown from "react-markdown";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
  BookOpen,
  Leaf,
  Shield,
  TestTube,
  Sparkles,
  Award,
  Clock,
  Coins,
  ChevronDown
} from "lucide-react";

// Forzar revalidación de las landings
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const page = await prisma.seoPage.findFirst({
    where: { 
      slug: resolvedParams.slug,
      kind: 'LANDING',
      isPublished: true
    }
  });

  if (!page) return { title: 'Solución Agronómica | Biocultor' };

  let payload: any = {};
  try { payload = JSON.parse(page.payloadJson || '{}'); } catch (e) {}

  return buildMetadata({
    title: page.metaTitle || `${page.title} | Biocultor`,
    description: page.metaDescription || page.excerpt || '',
    path: `/solucion-humus/${page.slug}`,
    image: payload.heroImage || page.image || '/product-showcase.png'
  });
}

export default async function GeoLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const page = await prisma.seoPage.findFirst({
    where: { 
      slug,
      kind: 'LANDING',
      isPublished: true
    }
  });

  if (!page) notFound();

  let payload: any = {};
  try { payload = JSON.parse(page.payloadJson || '{}'); } catch (e) {}

  // ───────────────────────────────────────────────────────────────────────────
  // A) CASO ESPECIAL: PROTOCOLO DE CULTIVO BIOLÓGICO PROFESIONAL (Restaurado)
  // ───────────────────────────────────────────────────────────────────────────
  if (slug === "protocolo-cultivo-biologico-profesional") {
    const images = {
      hero: payload.heroImage || '/10 litros.jpg',
      section1: payload.section1Image || '/5 litros.jpg',
      section2: payload.section2Image || '/1 litro.jpg',
      section3: payload.section3Image || '/10 litros.jpg'
    };

    let faqList: Array<{ question: string; answer: string }> = [];
    try {
      faqList = JSON.parse(page.faqJson || '[]');
    } catch (e) {}

    return (
      <main className="flex flex-col w-full antialiased bg-background min-h-screen relative z-10">
        <StructuredData
          id="protocolo-schema"
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `https://biocultor.com/solucion-humus/${page.slug}`,
                "url": `https://biocultor.com/solucion-humus/${page.slug}`,
                "name": page.metaTitle || page.title,
                "description": page.metaDescription || page.excerpt || '',
                "image": images.hero,
                "inLanguage": "es-ES",
                "publisher": {
                  "@type": "Organization",
                  "name": "Biocultor",
                  "url": "https://biocultor.com"
                }
              },
              {
                "@type": "TechArticle",
                "@id": `https://biocultor.com/solucion-humus/${page.slug}#article`,
                "isPartOf": `https://biocultor.com/solucion-humus/${page.slug}`,
                "headline": page.title,
                "description": page.metaDescription || page.excerpt || "Protocolo de cultivo ecológico profesional paso a paso.",
                "image": images.hero,
                "author": { "@type": "Organization", "name": "Biocultor" },
                "publisher": {
                  "@type": "Organization",
                  "name": "Biocultor",
                  "url": "https://biocultor.com"
                }
              },
              ...((() => {
                try {
                  const faq = JSON.parse(page.faqJson || '[]');
                  if (!Array.isArray(faq) || faq.length === 0) return [];
                  return [{
                    "@type": "FAQPage",
                    "mainEntity": faq.map((item: { question: string; answer: string }) => ({
                      "@type": "Question",
                      "name": item.question,
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer
                      }
                    }))
                  }];
                } catch { return []; }
              })())
            ]
          }}
        />

        {/* ── Hero Section (16:9 Aspect Ratio Premium) ── */}
        <section className="relative w-full aspect-video min-h-[480px] md:min-h-[580px] max-h-[85vh] overflow-hidden flex items-center texture-grain">
          <div className="absolute inset-0 z-0">
            <Image
              src={images.hero}
              alt="Cultivo Biológico Profesional"
              fill
              priority
              className="object-cover opacity-85 scale-100 transition-transform duration-1000"
            />
            {/* Overlay sofisticado para legibilidad WCAG AA */}
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4">
            <div className="max-w-4xl">
              <Breadcrumbs
                items={[
                  { label: 'Inicio', href: '/' },
                  { label: 'Aprende', href: '/aprende' },
                  { label: 'Protocolo Profesional' },
                ]}
                className="text-cream-warm/95 drop-shadow-sm mb-6"
              />
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 text-white font-bold text-xs uppercase tracking-widest mb-6 border border-white/20 backdrop-blur-md shadow-xl">
                <Shield className="w-4 h-4 text-brand-green" /> La Guía Definitiva de Biocultor
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-cream mb-6 tracking-tight leading-[1.05] drop-shadow-2xl">
                {page.title}
              </h1>
              
              <p className="text-lg md:text-2xl text-cream-warm/95 leading-relaxed max-w-2xl font-medium drop-shadow-lg">
                {page.intro || 'Cómo integrar Té de Humus de Lombriz y Purín de Ortiga para prevenir patógenos radiculares, acelerar el crecimiento vegetativo e inducir una floración explosiva y rica en resina.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── Trust Bar ── */}
        <div className="w-full bg-cream-warm border-b border-border/40 py-6">
          <div className="w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-bold text-foreground/80">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 100% Ecológico y Certificado</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Fabricación en España</div>
            <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Envíos 24/48h</div>
          </div>
        </div>

        {/* ── Introducción y Pilares ── */}
        <section className="w-full py-20 bg-background border-b border-border/30">
          <div className="w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80 mb-2">Fundamento Científico</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6 leading-tight">
                El fin de los cultivos estériles.
              </h2>
              <div className="prose prose-lg text-muted-foreground leading-relaxed max-w-none">
                <p className="mb-4">
                  Durante años, la industria ha empujado a los cultivadores hacia entornos completamente estériles. El problema es que un medio estéril es un lienzo en blanco para patógenos oportunistas como el <em>Pythium</em>.
                </p>
                <p>
                  Este protocolo cambia el paradigma. Al inocular el sustrato con microbiología viva, construimos un ecosistema supresor que además dispara la producción de tricomas y cannabinoides.
                </p>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-cream-warm p-8 rounded-3xl border border-border/50 shadow-sm glass">
                <h3 className="font-heading font-bold text-xl text-foreground flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-primary" /> Pilares del Protocolo
                </h3>
                <ul className="space-y-6 text-sm text-muted-foreground font-medium">
                  <li className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Microbiología activa:</strong> Exclusión competitiva y colonización protectora de la rizosfera.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Bioestimulación:</strong> Aceleración metabólica e incremento de biomasa con Nitrógeno orgánico.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Elicitación (ISR):</strong> Activación de defensas sistémicas para maximizar terpenos y resina.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── FASE 1: Raíz ── */}
        <section className="w-full py-24 bg-cream-warm border-b border-border/40 relative overflow-hidden texture-grain">
          <div className="w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-bold text-2xl shadow-md">
                1
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">FASE DE ENRAIZAMIENTO</span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
                  Protección y expansión radicular.
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Utilizando el <strong className="text-foreground">Té de Humus de Lombriz Premium</strong> en riego, saturamos el sustrato con bacterias aeróbicas que colonizan el espacio físico alrededor de las raíces.
                </p>
                <p className="text-base text-muted-foreground">
                  Esta barrera microscópica no solo asiste en la asimilación del alimento, sino que ejerce exclusión competitiva frente a hongos destructores del sustrato.
                </p>
                <div className="pt-4">
                  <Link href="/aprende/prevencion-pythium-fusarium-cannabis-te-humus" className="group flex items-center gap-4 p-5 bg-background rounded-2xl border border-border hover:border-primary transition-all shadow-sm hover:shadow-md card-lift">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Prevención de Patógenos</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Lee la evidencia sobre microbiología supresora.</p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl aspect-[16/10] w-full bg-muted min-h-[250px]">
                <Image 
                  src={images.section1} 
                  alt="Protección radicular" 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <span className="bg-primary text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full shadow-md">
                    Producto Recomendado
                  </span>
                  <p className="text-white font-bold text-sm drop-shadow-sm">Té de Humus Líquido</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FASE 2: Vegetativo ── */}
        <section className="w-full py-24 bg-background border-b border-border/40">
          <div className="w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-bold text-2xl shadow-md">
                2
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">FASE DE CRECIMIENTO</span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
                  Aceleración vegetativa orgánica.
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden border border-border shadow-2xl aspect-[16/10] w-full bg-muted min-h-[250px]">
                <Image 
                  src={images.section2} 
                  alt="Crecimiento acelerado" 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <span className="bg-primary text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full shadow-md">
                    Bioestimulación Foliar
                  </span>
                  <p className="text-white font-bold text-sm drop-shadow-sm">Purín de Ortiga</p>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  El <strong className="text-foreground">Purín de Ortiga Concentrado</strong> actúa como bioestimulante foliar y radicular para acortar la fase de crecimiento sin sales químicas.
                </p>
                <p className="text-base text-muted-foreground">
                  Su alta concentración de nitrógeno orgánico y microelementos activa la clorofila de forma inmediata, logrando plantas robustas, tallos gruesos y hojas verdes en pocas horas.
                </p>
                <div className="pt-4">
                  <Link href="/aprende/purin-ortiga-crecimiento-vegetativo-cannabis-biostimulante" className="group flex items-center gap-4 p-5 bg-cream-warm rounded-2xl border border-border hover:border-primary transition-all shadow-sm hover:shadow-md card-lift">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Bioestimulación Directa</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Reverdece hojas en 48h y engrosa los tallos.</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FASE 3: Floración ── */}
        <section className="w-full py-24 bg-brand-brown-dark text-cream relative overflow-hidden texture-grain">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-bold text-2xl shadow-md">
                3
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">FASE DE PRE-FLORACIÓN Y FLORACIÓN</span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-cream tracking-tight">
                  El arte de la elicitación.
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <p className="text-xl text-cream-warm/90 leading-relaxed">
                  Al pulverizar Purín de Ortiga en etapas tempranas, sus fitoquímicos actúan como <strong className="text-white">elicitores naturales</strong>. Engañan al sistema inmunitario de la planta simulando un ataque benigno.
                </p>
                <p className="text-base text-cream-warm/80 leading-relaxed">
                  Esto fuerza a la planta a segregar metabolitos secundarios y resina protectora como autodefensa natural, incrementando sustancialmente el porcentaje de cannabinoides y terpenos aromáticos.
                </p>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md mt-6">
                  <h3 className="text-2xl font-bold text-primary mb-3">¿Qué es la ISR?</h3>
                  <p className="text-cream-warm/80 mb-6 leading-relaxed text-sm md:text-base">
                    La Resistencia Sistémica Inducida activa los mecanismos de defensa antes de que llegue el ataque, forzando una mayor concentración de terpenos.
                  </p>
                  <Link
                    href="/aprende/purin-ortiga-elicitor-resina-defensas-cannabis"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition-all group"
                  >
                    Leer estudio completo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-white/10 shadow-3xl aspect-[4/5] bg-earth min-h-[300px]">
                <Image 
                  src={images.section3} 
                  alt="Elicitación de resina" 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-750"
                  sizes="(max-width: 1024px) 100vw, 30vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Preguntas Frecuentes (FAQs) de la Landing ── */}
        {faqList.length > 0 && (
          <section className="w-full py-20 bg-background border-t border-border/20 relative z-10">
            <div className="w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4 max-w-4xl">
              <div className="text-center mb-12">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80 mb-2 block">Resolución de Dudas</span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
                  Preguntas Frecuentes
                </h2>
                <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-lg mx-auto">
                  Respuestas técnicas para cultivadores profesionales sobre el protocolo.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {faqList.map((faq, index) => (
                  <details 
                    key={index} 
                    className="group border border-border/50 rounded-2xl bg-background overflow-hidden transition-all duration-300 open:shadow-lg open:shadow-primary/5 open:border-primary/25"
                  >
                    <summary className="flex items-center justify-between font-heading font-bold text-base md:text-lg px-6 py-5 md:py-6 cursor-pointer list-none select-none text-foreground hover:text-primary transition-colors">
                      <span>{faq.question}</span>
                      <div className="p-2 rounded-full bg-muted/60 text-muted-foreground group-open:rotate-180 group-open:bg-primary/10 group-open:text-primary transition-all duration-300 shrink-0 ml-4">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed text-sm md:text-base border-t border-border/10 pt-4 bg-muted/10">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Footer / CTA Final ── */}
        <section className="w-full py-24 bg-background text-center relative z-10 border-t border-border/30">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">INOCULA TU SUSTRATO</span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground tracking-tight">
              Empieza tu protocolo hoy.
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Consigue el máximo vigor, una floración espectacular y protección inmunológica con nuestros formatos profesionales directos de fábrica.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/producto/te-humus-liquido-premium"
                className="w-full sm:w-auto bg-primary hover:bg-brand-green-hover text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:scale-[1.02] text-center"
              >
                Comprar Té de Humus
              </Link>
              <Link
                href="/producto/purin-ortiga-concentrado"
                className="w-full sm:w-auto bg-background border-2 border-primary text-primary hover:bg-primary/5 font-bold px-10 py-5 rounded-2xl transition-all hover:-translate-y-1 hover:scale-[1.02] text-center"
              >
                Comprar Purín de Ortiga
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // B) CASO GENERAL: LANDINGS PROGRAMÁTICAS GEO (Clorosis, Estrés Hídrico)
  // ───────────────────────────────────────────────────────────────────────────
  const heroImage = payload.heroImage || page.image || (
    slug === 'clorosis-ferrica-citricos-valencia' 
      ? '/10 litros.jpg' 
      : slug === 'estres-hidrico-olivar-andalucia'
      ? '/5 litros.jpg'
      : '/hero-bg.png'
  );

  const markdownContent = payload.markdownContent || '';

  // Parsear secciones basadas en H2 "## "
  const rawSections = markdownContent.split(/\n##\s+/);
  const introParagraphs = rawSections[0].trim().split('\n').map((p: string) => p.trim()).filter(Boolean);
  
  const parsedSections: { title: string; paragraphs: string[] }[] = [];
  for (let i = 1; i < rawSections.length; i++) {
    const lines = rawSections[i].split('\n');
    const title = lines[0].trim();
    const paragraphs = lines.slice(1).map((p: string) => p.trim()).filter(Boolean);
    parsedSections.push({ title, paragraphs });
  }

  return (
    <article className="w-full bg-background relative z-10 antialiased pb-20 flex flex-col min-h-screen">
      {/* ─── Schema.org: WebPage + FAQPage Graph ─── */}
      <StructuredData
        id="geo-schema"
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `https://biocultor.com/solucion-humus/${page.slug}`,
              "url": `https://biocultor.com/solucion-humus/${page.slug}`,
              "name": page.metaTitle || page.title,
              "description": page.metaDescription || page.excerpt || '',
              "image": heroImage,
              "inLanguage": "es-ES",
              "publisher": {
                "@type": "Organization",
                "name": "Biocultor",
                "url": "https://biocultor.com"
              }
            },
            ...((() => {
              try {
                const faq = JSON.parse(page.faqJson || '[]');
                if (!Array.isArray(faq) || faq.length === 0) return [];
                return [{
                  "@type": "FAQPage",
                  "mainEntity": faq.map((item: { question: string; answer: string }) => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": item.answer
                    }
                  }))
                }];
              } catch { return []; }
            })())
          ]
        }}
      />

      {/* ── Hero Transaccional GEO (16:9 Aspect Ratio Premium) ── */}
      <section className="relative w-full aspect-video min-h-[460px] md:min-h-[560px] max-h-[85vh] overflow-hidden flex items-center texture-grain">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={page.title}
            fill
            priority
            className="object-cover opacity-85 transition-transform duration-1000 scale-100"
          />
          {/* Overlay oscuro sofisticado */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4 flex flex-col justify-center">
          <div className="max-w-4xl">
            <Breadcrumbs
              items={[
                { label: 'Inicio', href: '/' },
                { label: 'Soluciones', href: '/te-de-humus-de-lombriz' },
                { label: page.label || 'Uso Regional' },
              ]}
              className="text-cream-warm/95 drop-shadow-sm mb-6"
            />

            <span className="text-primary-foreground/90 font-bold tracking-widest uppercase text-xs md:text-sm mb-4 inline-block bg-primary px-4 py-2 rounded-full border border-primary/20 shadow-md">
              Solución Agronómica Biocultor
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-cream leading-[1.05] mb-6 tracking-tight drop-shadow-2xl">
              {page.title}
            </h1>
            
            <p className="text-lg md:text-xl text-cream-warm/95 max-w-3xl leading-relaxed mb-8 font-medium drop-shadow-lg bg-black/25 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
              {page.excerpt}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/producto/te-humus-liquido-premium"
                className="bg-primary hover:bg-brand-green-hover text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                Ver Formatos Profesionales <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <div className="w-full bg-cream-warm border-b border-border/40 py-6">
        <div className="w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-bold text-foreground/80">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 100% Ecológico y Certificado</div>
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Fabricación en España</div>
          <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Envíos 24/48h</div>
        </div>
      </div>

      {/* ── Maquetación Dinámica Elevada ── */}
      <div className="w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4 py-16 space-y-24">
        
        {/* Renderizado de Secciones */}
        {parsedSections.map((section, index) => {
          // Bloque 1: El Diagnóstico Agronómico (Reto / Problema)
          if (index === 0) {
            return (
              <section key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Diagnóstico de Suelo</span>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight">
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed space-y-4 text-base md:text-lg">
                    {section.paragraphs.map((p, pi) => (
                      <p key={pi}><Markdown>{p}</Markdown></p>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <div className="bg-cream-warm p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-between min-h-[320px] relative overflow-hidden texture-grain">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase mb-6">
                        <Award className="w-3.5 h-3.5" /> Reto Agronómico
                      </div>
                      <h4 className="text-xl font-heading font-black text-foreground mb-4">Parámetros Críticos Detectados</h4>
                      <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
                        {slug.includes("citricos") ? (
                          <>
                            <li className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border/40"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /> Alta concentración de cal activa (&gt;7.5 pH)</li>
                            <li className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border/40"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /> Bloqueo e insolubilidad del hierro libre</li>
                            <li className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border/40"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" /> Clorosis férrica foliar y hundimiento de calibre</li>
                          </>
                        ) : slug.includes("olivar") ? (
                          <>
                            <li className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border/40"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /> Estrés térmico extremo en etapas clave</li>
                            <li className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border/40"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /> Cierre de estomas y parada fotosintética</li>
                            <li className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border/40"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" /> Aborto floral y desplome de rendimiento graso</li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border/40"><span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" /> Pérdida de biodiversidad biológica del suelo</li>
                            <li className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border/40"><span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" /> Desequilibrio nutricional e insolubilidad</li>
                            <li className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border/40"><span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" /> Reducción del vigor radicular y vegetativo</li>
                          </>
                        )}
                      </ul>
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-6 pt-4 border-t border-border/40">
                      *El aporte químico tradicional no consigue asimilarse en estas condiciones del entorno.
                    </p>
                  </div>
                </div>
              </section>
            );
          }

          // Bloque 2: La Solución Agrobiológica (Ciencia en Tarjetas)
          if (index === 1) {
            // Extraer posibles puntos numerados
            const points = section.paragraphs.filter(p => p.startsWith('1.') || p.startsWith('2.'));
            const generalText = section.paragraphs.filter(p => !p.startsWith('1.') && !p.startsWith('2.'));

            return (
              <section key={index} className="space-y-10 py-12 bg-cream-warm rounded-[2.5rem] border border-border px-6 md:px-12 relative overflow-hidden texture-grain">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                <div className="max-w-3xl space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Estrategia Orgánica</span>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight">
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {generalText.map((p, pi) => (
                      <p key={pi}><Markdown>{p}</Markdown></p>
                    ))}
                  </div>
                </div>

                {points.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {points.map((point, pi) => {
                      const cleanPoint = point.replace(/^\d+\.\s+\*\*(.*?)\*\*:\s*/, '');
                      const title = point.match(/^\d+\.\s+\*\*(.*?)\*\*/)?.[1] || 'Sinergia Activa';
                      return (
                        <div key={pi} className="bg-background p-8 rounded-3xl border border-border/40 shadow-sm flex flex-col justify-between card-lift">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                              {pi === 0 ? <TestTube className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                            </div>
                            <h4 className="text-xl font-heading font-bold text-foreground mb-3">{title}</h4>
                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                              <Markdown>{cleanPoint}</Markdown>
                            </p>
                          </div>
                          <span className="text-xs font-bold text-primary/60 uppercase tracking-widest mt-6 block">Mecanismo Validado ✓</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          }

          // Bloque 3: Aplicación Práctica (Ficha de Dosificación)
          if (index === 2) {
            return (
              <section key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 order-2 lg:order-1">
                  <div className="bg-brand-brown-dark text-cream p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between min-h-[340px] relative overflow-hidden texture-grain">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/20 text-cream font-bold text-xs uppercase mb-6 border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-brand-green-light" /> Ficha Técnica de Fertilidad
                      </div>
                      <h4 className="text-xl font-heading font-bold text-cream mb-6">Especificaciones de Uso</h4>
                      <div className="space-y-4">
                        {slug.includes("citricos") ? (
                          <>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-sm">
                              <span className="text-cream-warm/75 font-semibold">Método principal</span>
                              <span className="font-bold">Fertirrigación / Venturi</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-sm">
                              <span className="text-cream-warm/75 font-semibold">Dosificación</span>
                              <span className="font-bold text-brand-green-light">5% al 10% en riego</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-sm">
                              <span className="text-cream-warm/75 font-semibold">Época recomendada</span>
                              <span className="font-bold">Brotación y engorde de fruto</span>
                            </div>
                          </>
                        ) : slug.includes("olivar") ? (
                          <>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-sm">
                              <span className="text-cream-warm/75 font-semibold">Método recomendado</span>
                              <span className="font-bold">Foliar (atomizador) o riego</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-sm">
                              <span className="text-cream-warm/75 font-semibold">Dosificación</span>
                              <span className="font-bold text-brand-green-light">Foliar 5% | Riego 10-20L/Ha</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-sm">
                              <span className="text-cream-warm/75 font-semibold">Época recomendada</span>
                              <span className="font-bold">Pre-floración e inyección estival</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-sm">
                              <span className="text-cream-warm/75 font-semibold">Método principal</span>
                              <span className="font-bold">Inyección / Fertirriego / Riego</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-sm">
                              <span className="text-cream-warm/75 font-semibold">Dosificación</span>
                              <span className="font-bold text-brand-green-light">5% al 10% diluido</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-sm">
                              <span className="text-cream-warm/75 font-semibold">Frecuencia</span>
                              <span className="font-bold">Cada 15 - 20 días</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between items-center py-2.5 text-sm">
                          <span className="text-cream-warm/75 font-semibold">Sustentabilidad</span>
                          <span className="font-bold text-brand-green-light">✓ 100% Ecológico (Residuo Cero)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Plan de Trabajo</span>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight">
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed space-y-4 text-base md:text-lg">
                    {section.paragraphs.map((p, pi) => {
                      if (p.startsWith('*')) {
                        // Extraer el título limpio (strip de colons finales: ":" o "::") 
                        const rawTitle = p.match(/^\*\s+\*\*(.*?)\*\*/)?.[1] || 'Guía';
                        const itemTitle = rawTitle.replace(/:+$/, '').trim();
                        // Eliminar el prefijo completo "* **Título::" incluyendo cualquier número de ":" y espacio posterior
                        const cleanListItem = p.replace(/^\*\s+\*\*.*?\*\*:*\s*/, '').trim();
                        return (
                          <div key={pi} className="flex gap-3 items-start bg-muted/40 p-4 rounded-xl border border-border/20 text-sm md:text-base">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-foreground/80"><strong>{itemTitle}:</strong> <Markdown>{cleanListItem}</Markdown></p>
                          </div>
                        );
                      }
                      return <p key={pi}><Markdown>{p}</Markdown></p>;
                    })}
                  </div>
                </div>
              </section>
            );
          }

          // Otras secciones genéricas si existieran
          return (
            <section key={index} className="space-y-6">
              <h2 className="text-3xl font-heading font-bold tracking-tight border-l-4 border-primary pl-4">
                {section.title}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4 text-base md:text-lg">
                {section.paragraphs.map((p, pi) => (
                  <p key={pi}><Markdown>{p}</Markdown></p>
                ))}
              </div>
            </section>
          );
        })}

      </div>

    {/* ── Preguntas Frecuentes (FAQs) de la Landing GEO ── */}
    {(() => {
      try {
        const faqList = JSON.parse(page.faqJson || '[]');
        if (!Array.isArray(faqList) || faqList.length === 0) return null;
        return (
          <section className="w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4 pb-16 max-w-4xl relative z-10">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80 mb-2 block">Dudas Frecuentes</span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
                Preguntas y Respuestas Técnicas
              </h2>
              <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-lg mx-auto">
                Información clave sobre la aplicación, dosis y compatibilidad en tu región.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqList.map((faq: { question: string; answer: string }, index: number) => (
                <details 
                  key={index} 
                  className="group border border-border/50 rounded-2xl bg-background overflow-hidden transition-all duration-300 open:shadow-lg open:shadow-primary/5 open:border-primary/25"
                >
                  <summary className="flex items-center justify-between font-heading font-bold text-base md:text-lg px-6 py-5 md:py-6 cursor-pointer list-none select-none text-foreground hover:text-primary transition-colors">
                    <span>{faq.question}</span>
                    <div className="p-2 rounded-full bg-muted/60 text-muted-foreground group-open:rotate-180 group-open:bg-primary/10 group-open:text-primary transition-all duration-300 shrink-0 ml-4">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed text-sm md:text-base border-t border-border/10 pt-4 bg-muted/10">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        );
      } catch { return null; }
    })()}

      {/* ── CTA Final de Compra Directa ── */}
      <section className="w-[92%] lg:w-[80%] xl:w-[70%] mx-auto px-4 py-16 bg-cream-warm rounded-[2.5rem] border border-border text-center relative z-10 overflow-hidden texture-grain">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">COMPRA DIRECTA DE FABRICANTE</span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight leading-none">
            ¿Preparado para regenerar tu cultivo?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Adquiere el Té de Humus Líquido directamente desde nuestras instalaciones. Formatos desde 1L hasta IBC industriales de 1000L.
          </p>
          <div className="pt-4">
            <Link 
              href="/producto/te-humus-liquido-premium"
              className="inline-flex bg-primary hover:bg-brand-green-hover text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:-translate-y-0.5"
            >
              Comprar Té de Humus Líquido
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
