import { BookOpen, Leaf, Shield, TestTube, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import prisma from '@/lib/db';

export const revalidate = 3600;

export const metadata = buildMetadata({
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

export default async function ProtocoloCultivoPage() {
  const landingData = await prisma.seoPage.findUnique({
    where: { slug: 'protocolo-cultivo-biologico-profesional' }
  });

  const payload = landingData?.payloadJson ? JSON.parse(landingData.payloadJson) : {};
  
  // Imágenes dinámicas con fallback a las originales
  const images = {
    hero: payload.heroImage || '/10 litros.jpg',
    section1: payload.section1Image || '/5 litros.jpg',
    section2: payload.section2Image || '/1 litro.jpg',
    section3: payload.section3Image || '/10 litros.jpg'
  };

  return (
    <div className="flex flex-col w-full">
      <StructuredData
        id="protocolo-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Aprende', path: '/aprende' },
          { name: 'Protocolo de Cultivo Biológico Profesional', path: '/aprende/protocolo-cultivo-biologico-profesional' },
        ])}
      />

      {/* ── Hero Section ──────────────────────── */}
      <section className="relative w-full py-20 md:py-32 bg-earth-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={images.hero}
            alt="Cultivo Biológico Profesional"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-dark via-earth-dark/90 to-earth-dark/70" />
        </div>
        
        <div className="relative z-10 w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Aprende', href: '/aprende' },
              { label: 'Protocolo Profesional' },
            ]}
          />
          <div className="max-w-4xl mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-light font-bold text-xs uppercase tracking-widest mb-6 border border-primary/30">
              <Shield className="w-3.5 h-3.5" /> La Guía Definitiva de Biocultor
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-cream mb-6 tracking-tight leading-tight">
              {landingData?.title || 'Protocolo de Cultivo Biológico Profesional'}
            </h1>
            <p className="text-lg md:text-xl text-cream/80 leading-relaxed max-w-2xl font-light">
              {landingData?.intro || 'Cómo integrar Té de Humus de Lombriz y Purín de Ortiga para prevenir patógenos radiculares, acelerar el crecimiento vegetativo e inducir una floración explosiva y rica en resina. Basado en evidencia agronómica real.'}
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
                Durante años, la industria ha empujado a los cultivadores hacia entornos completamente estériles, dependiendo de fertilizantes minerales y fungicidas químicos agresivos. El problema de un medio estéril es que se convierte en un lienzo en blanco para patógenos oportunistas como el <em>Pythium</em> y el <em>Fusarium</em>.
              </p>
              <p>
                Este protocolo cambia el paradigma. Al inocular el sustrato con microbiología viva y aplicar elicitores botánicos en el follaje, construimos un ecosistema supresor de enfermedades que, además, estimula los mecanismos naturales de defensa del cannabis, disparando la producción de tricomas y cannabinoides.
              </p>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-cream-warm p-6 rounded-2xl border border-border/50 card-lift">
              <h3 className="font-heading font-bold text-xl text-foreground flex items-center gap-2 mb-4">
                <TestTube className="w-5 h-5 text-primary" /> Pilares del Protocolo
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span><strong>Microbiología activa:</strong> Exclusión competitiva en la rizosfera frente a hongos patógenos.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span><strong>Bioestimulación:</strong> Aceleración metabólica segura con nitrógeno y hierro biodisponible.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span><strong>Elicitación (ISR):</strong> Activación de defensas sistémicas para forzar la secreción de tricomas.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FASE 1: Raíz y Sustrato ────────────── */}
      <section className="w-full py-20 bg-cream-warm border-b border-border/40 relative overflow-hidden">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-2xl">
              1
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
              Protección y expansión radicular.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                El protocolo comienza en el momento de la germinación y el primer trasplante. Utilizando el <strong className="text-foreground">Té de Humus de Lombriz Premium</strong> en riego (Drench), saturamos el sustrato con bacterias aeróbicas que colonizan el espacio físico alrededor de las raíces.
              </p>
              <div className="space-y-4">
                <Link href="/aprende/prevencion-pythium-fusarium-cannabis-te-humus" className="group flex items-center gap-3 p-4 bg-background rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Prevención de Pythium y Fusarium</h4>
                    <p className="text-sm text-muted-foreground">Lee la evidencia científica sobre microbiología supresora.</p>
                  </div>
                </Link>
                <Link href="/aprende/te-vermicompost-rendimiento-cannabinoides-thc-cbd" className="group flex items-center gap-3 p-4 bg-background rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Rendimiento en Biomasa</h4>
                    <p className="text-sm text-muted-foreground">Cómo las fitohormonas aumentan el tamaño del sistema radicular.</p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl h-80 md:h-auto">
              <Image src={images.section1} alt="Té de humus para raíces" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white font-bold text-xl mb-2">Producto Clave: Té de Humus</h3>
                <p className="text-white/80 text-sm">Dilución: 1:10 en riego cada 15 días.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FASE 2: Impulso Vegetativo ─────────── */}
      <section className="w-full py-20 bg-background border-b border-border/40 relative overflow-hidden">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-2xl">
              2
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
              Aceleración vegetativa orgánica.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl h-80 md:h-auto">
              <Image src={images.section2} alt="Purín de ortiga para crecimiento" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white font-bold text-xl mb-2">Producto Clave: Purín de Ortiga</h3>
                <p className="text-white/80 text-sm">Foliar: 3-5ml/L. Riego: 7-10ml/L.</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Durante la fase de crecimiento, la planta demanda grandes cantidades de nitrógeno y hierro para la síntesis de clorofila. Introducimos el <strong className="text-foreground">Purín de Ortiga Concentrado</strong> como bioestimulante foliar y radicular para acortar esta fase sin recurrir a sales químicas que quemen las raíces.
              </p>
              <div className="space-y-4">
                <Link href="/aprende/purin-ortiga-crecimiento-vegetativo-cannabis-biostimulante" className="group flex items-center gap-3 p-4 bg-cream-warm rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Efecto Bioestimulante Directo</h4>
                    <p className="text-sm text-muted-foreground">Reverdece hojas en 48h y engrosa los tallos estructurales.</p>
                  </div>
                </Link>
                <Link href="/aprende/purin-ortiga-control-plagas-arana-roja-pulgon-cannabis" className="group flex items-center gap-3 p-4 bg-cream-warm rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Control de Plagas Integrado</h4>
                    <p className="text-sm text-muted-foreground">Acción repelente contra araña roja y pulgón sin pesticidas tóxicos.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FASE 3: Floración y Resina ─────────── */}
      <section className="w-full py-20 bg-earth-dark text-cream relative overflow-hidden">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-primary-light text-earth-dark flex items-center justify-center font-heading font-bold text-2xl">
              3
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">
              El arte de la elicitación.
            </h2>
          </div>
          
          <div className="max-w-4xl grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <p className="text-xl text-cream/80 leading-relaxed mb-8">
                En las semanas previas a la floración y durante la misma, el objetivo cambia: ya no buscamos solo crecimiento estructural, buscamos que la genética exprese todo su potencial químico (terpenos y cannabinoides).
              </p>
              <div className="bg-earth/50 border border-white/10 p-8 rounded-2xl mb-8 card-lift backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-primary-light mb-4">¿Qué es la Resistencia Sistémica Inducida (ISR)?</h3>
                <p className="text-cream/80 mb-6">
                  Al pulverizar Purín de Ortiga, sus fitoquímicos actúan como "elicitores". Engañan al sistema inmunológico de la planta haciéndole creer que está bajo ataque (eustrés o estrés positivo). La respuesta defensiva natural del cannabis es producir más resina y tricomas como barrera física.
                </p>
                <Link
                  href="/aprende/purin-ortiga-elicitor-resina-defensas-cannabis"
                  className="inline-flex items-center text-primary-light font-bold hover:text-white transition-colors"
                >
                  Leer el estudio sobre elicitores
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
            <div className="md:col-span-4 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-64 md:h-auto">
              <Image src={images.section3} alt="Elicitación y resina" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Resumen Legal y Estratégico ────────── */}
      <section className="w-full py-16 bg-cream-warm">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary font-bold text-xs uppercase tracking-widest mb-4 border border-primary/15">
                <BookOpen className="w-3.5 h-3.5" /> Marco Normativo
              </div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Por qué la calidad por planta es la única vía legal.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                En España no existe un número fijo de plantas legales. La ley penaliza la visibilidad y comercialización. En espacios de autoconsumo reducidos (indoor o terrazas discretas), no puedes compensar la falta de producción poniendo más macetas. El único camino es lograr el máximo rendimiento bioquímico y estructural de cada semilla invertida.
              </p>
              <Link
                href="/aprende/cuantas-plantas-marihuana-legales-espana"
                className="inline-flex items-center gap-2 bg-background border border-border/60 hover:border-primary/50 text-foreground px-6 py-3 rounded-full transition-all font-medium"
              >
                Leer guía legal sobre autoconsumo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-xl">
              <h3 className="font-heading font-bold text-xl text-foreground mb-6">Tu Plan Mensual de Cultivo Biológico</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-foreground">Semana 1-4 (Vegetativo)</h4>
                    <p className="text-sm text-muted-foreground">Té de Humus (Riego 1:10) alternado con Purín de Ortiga (Foliar 3ml/L) cada 10 días.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-foreground">Semana 5-8 (Pre-flora y Flora Temprana)</h4>
                    <p className="text-sm text-muted-foreground">Foliar intensivo de Purín (Elicitor) + Riego con Té de Humus (Prevención Pythium).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-foreground">Semana 9+ (Engorde y Lavado)</h4>
                    <p className="text-sm text-muted-foreground">Suspender foliar. Mantener riegos esporádicos con Té de Humus para no estresar el sustrato.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA to Shop ──────────────────────── */}
      <section className="w-full py-20 bg-background border-t border-border/30 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Empieza a cultivar con rigor.
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Adquiere los dos pilares del protocolo botánico. Formatos desde 1L hasta 25L para cubrir todo el ciclo de tu cultivo, ya sea en armario o en invernadero comercial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/producto/te-humus-liquido-premium"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-brand-green-hover text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-primary/15 transition-all hover:scale-[1.02]"
            >
              Comprar Té de Humus
            </Link>
            <Link
              href="/producto/purin-ortiga-concentrado"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-background border-2 border-primary hover:bg-primary/5 text-primary font-bold px-8 py-4 rounded-full transition-all hover:scale-[1.02]"
            >
              Comprar Purín de Ortiga
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
