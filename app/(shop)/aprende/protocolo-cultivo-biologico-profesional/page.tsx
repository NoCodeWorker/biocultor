import { BookOpen, Leaf, Shield, TestTube, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import prisma from '@/lib/db';
import type { Metadata } from 'next';

// Forzamos revalidación en cada petición sin usar force-dynamic directamente si da problemas
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Protocolo de Cultivo Biológico Profesional | Biocultor',
    description:
      'La guía definitiva paso a paso para maximizar biomasa, cannabinoides y prevenir patógenos en el cultivo de cannabis mediante Té de Humus y Purín de Ortiga.',
    path: '/aprende/protocolo-cultivo-biologico-profesional',
    keywords: [
      'protocolo cultivo biologico',
      'té de humus cannabis',
      'purín de ortiga marihuana',
      'prevención pythium',
      'aumento resina cannabis',
      'bioestimulante natural',
    ],
  });
}

export default async function ProtocoloCultivoPage() {
  let landingData = null;
  let payload: any = {};

  try {
    // Intentamos obtener los datos de la DB
    landingData = await prisma.seoPage.findUnique({
      where: { slug: 'protocolo-cultivo-biologico-profesional' }
    });

    if (landingData?.payloadJson) {
      const parsed = JSON.parse(landingData.payloadJson);
      payload = parsed && typeof parsed === 'object' ? parsed : {};
    }
  } catch (error) {
    // Si falla la DB, el bloque catch asegura que no haya un 500
    console.error('[Protocolo Landing] Error crítico capturado:', error);
  }

  // Imágenes con fallback absoluto a local public/
  const images = {
    hero: payload.heroImage || '/10 litros.jpg',
    section1: payload.section1Image || '/5 litros.jpg',
    section2: payload.section2Image || '/1 litro.jpg',
    section3: payload.section3Image || '/10 litros.jpg'
  };

  return (
    <main className="flex flex-col w-full antialiased bg-background min-h-screen">
      <StructuredData
        id="protocolo-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Aprende', path: '/aprende' },
          { name: 'Protocolo de Cultivo Biológico Profesional', path: '/aprende/protocolo-cultivo-biologico-profesional' },
        ])}
      />

      {/* ── Hero Section ──────────────────────── */}
      <section className="relative w-full py-20 md:py-32 bg-earth-dark overflow-hidden min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={images.hero}
            alt="Cultivo Biológico Profesional"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-dark via-earth-dark/80 to-transparent" />
        </div>
        
        <div className="relative z-10 w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 text-left">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Aprende', href: '/aprende' },
              { label: 'Protocolo Profesional' },
            ]}
          />
          <div className="max-w-4xl mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-light font-bold text-xs uppercase tracking-widest mb-6 border border-primary/30">
              <Shield className="w-4 h-4" /> La Guía Definitiva de Biocultor
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-cream mb-6 tracking-tight leading-tight">
              {landingData?.title || 'Protocolo de Cultivo Biológico Profesional'}
            </h1>
            <p className="text-lg md:text-xl text-cream/80 leading-relaxed max-w-2xl font-light">
              {landingData?.intro || 'Cómo integrar Té de Humus de Lombriz y Purín de Ortiga para prevenir patógenos radiculares, acelerar el crecimiento vegetativo e inducir una floración explosiva y rica en resina.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Introduction ──────────────────────── */}
      <section className="w-full py-16 bg-background border-b border-border/30">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              El fin de los cultivos estériles.
            </h2>
            <div className="prose prose-lg text-muted-foreground">
              <p>
                Durante años, la industria ha empujado a los cultivadores hacia entornos completamente estériles. El problema es que un medio estéril es un lienzo en blanco para patógenos oportunistas como el <em>Pythium</em>.
              </p>
              <p>
                Este protocolo cambia el paradigma. Al inocular el sustrato con microbiología viva, construimos un ecosistema supresor que además dispara la producción de tricomas y cannabinoides.
              </p>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-cream-warm p-6 rounded-2xl border border-border/50 shadow-sm">
              <h3 className="font-heading font-bold text-xl text-foreground flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" /> Pilares del Protocolo
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span><strong>Microbiología activa:</strong> Exclusión competitiva en la rizosfera.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span><strong>Bioestimulación:</strong> Aceleración metabólica con Nitrógeno orgánico.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span><strong>Elicitación (ISR):</strong> Activación de defensas sistémicas.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FASE 1: Raíz ──────────────────────── */}
      <section className="w-full py-20 bg-cream-warm border-b border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-2xl">
              1
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
              Protección y expansión radicular.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Utilizando el <strong className="text-foreground">Té de Humus de Lombriz Premium</strong> en riego, saturamos el sustrato con bacterias aeróbicas que colonizan el espacio físico alrededor de las raíces.
              </p>
              <div className="space-y-4">
                <Link href="/aprende/prevencion-pythium-fusarium-cannabis-te-humus" className="group flex items-center gap-4 p-5 bg-background rounded-2xl border border-border/50 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
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
            <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl aspect-[16/9] w-full bg-muted min-h-[200px]">
              <Image 
                src={images.section1} 
                alt="Protección radicular" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-bold text-lg">Producto: Té de Humus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FASE 2: Vegetativo ────────────────── */}
      <section className="w-full py-20 bg-background border-b border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-2xl">
              2
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
              Aceleración vegetativa orgánica.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl aspect-[16/9] w-full bg-muted min-h-[200px]">
              <Image 
                src={images.section2} 
                alt="Crecimiento acelerado" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-bold text-lg">Producto: Purín de Ortiga</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                El <strong className="text-foreground">Purín de Ortiga Concentrado</strong> actúa como bioestimulante foliar y radicular para acortar la fase de crecimiento sin sales químicas.
              </p>
              <div className="space-y-4">
                <Link href="/aprende/purin-ortiga-crecimiento-vegetativo-cannabis-biostimulante" className="group flex items-center gap-4 p-5 bg-cream-warm rounded-2xl border border-border/50 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
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

      {/* ── FASE 3: Floración ─────────────────── */}
      <section className="w-full py-24 bg-earth-dark text-cream">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-full bg-primary-light text-earth-dark flex items-center justify-center font-heading font-bold text-2xl">
              3
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">
              El arte de la elicitación.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-xl text-cream/80 leading-relaxed mb-10">
                Al pulverizar Purín de Ortiga, sus fitoquímicos actúan como "elicitores". Engañan al sistema de la planta para que produzca más resina como defensa natural.
              </p>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                <h3 className="text-2xl font-bold text-primary-light mb-4">¿Qué es la ISR?</h3>
                <p className="text-cream/80 mb-6 leading-relaxed">
                  La Resistencia Sistémica Inducida activa los mecanismos de defensa antes de que llegue el ataque, forzando una mayor concentración de terpenos.
                </p>
                <Link
                  href="/aprende/purin-ortiga-elicitor-resina-defensas-cannabis"
                  className="inline-flex items-center gap-2 text-primary-light font-bold hover:text-white transition-all group"
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
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer / CTA ─────────────────────── */}
      <section className="w-full py-24 bg-background text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-8 tracking-tight">
            Empieza tu protocolo hoy.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/producto/te-humus-liquido-premium"
              className="w-full sm:w-auto bg-primary hover:bg-brand-green-hover text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
            >
              Comprar Té de Humus
            </Link>
            <Link
              href="/producto/purin-ortiga-concentrado"
              className="w-full sm:w-auto bg-background border-2 border-primary text-primary hover:bg-primary/5 font-bold px-10 py-5 rounded-2xl transition-all hover:-translate-y-1"
            >
              Comprar Purín de Ortiga
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
