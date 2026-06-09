import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Leaf, Droplets, ShieldCheck, Check, ArrowRight, Award, Calendar, Sparkles, CheckCircle2, FlaskConical, HelpCircle } from 'lucide-react';
import prisma from '@/lib/db';
import { buildMetadata, breadcrumbSchema, organizationSchema, websiteSchema, faqSchema } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ImageComparison } from '@/components/ui/image-comparison';
import { Button } from '@/components/ui/button';

export const revalidate = 1800;

const defaultFaqs = [
  {
    question: '¿Qué es exactamente la inoculación regenerativa?',
    answer: 'Es la aplicación pulverizada in-situ de un concentrado líquido extremadamente activo y denso en microorganismos benéficos (bacterias, hongos formadores de agregados, protozoos) extraídos del humus de lombriz premium. Estos microorganismos colonizan el suelo, descomponen la materia orgánica muerta y liberan nutrientes bloqueados para las raíces.'
  },
  {
    question: '¿Cuánto tiempo tardan en verse los resultados?',
    answer: 'No vendemos milagros instantáneos: esto es biología del suelo, no pintura química ni césped artificial. Los primeros cambios en el vigor de la raíz y la absorción de nutrientes ocurren bajo tierra en las primeras 2 semanas. Estéticamente, verás un césped más denso, homogéneo y verde de forma natural entre la semana 4 y 8 tras el tratamiento.'
  },
  {
    question: '¿Es seguro para niños y mascotas?',
    answer: '100% seguro. Al ser un tratamiento puramente biológico sin trazas de herbicidas, fungicidas ni fertilizantes químicos sintéticos, tu familia y mascotas pueden pisar y jugar en el césped inmediatamente después de la aplicación.'
  },
  {
    question: '¿Cuándo es la mejor época para realizar el tratamiento?',
    answer: 'Las mejores épocas son primavera y otoño, ya que la temperatura y la humedad del suelo favorecen el establecimiento y la proliferación de los microorganismos en la rizosfera. No obstante, se puede aplicar durante todo el año para corregir problemas específicos de compactación o degradación.'
  },
  {
    question: '¿Qué incluye la tarifa de 195 €?',
    answer: 'La tarifa incluye el desplazamiento de un técnico certificado, la inspección previa del estado del terreno (compactación y pH), la aplicación in-situ de té de humus fresco y ultra-concentrado para superficies de hasta 500 m², y una guía personalizada con pautas de riego y corte para maximizar los resultados.'
  },
  {
    question: '¿Cómo preparo mi jardín antes de que venga el técnico?',
    answer: 'Es recomendable cortar el césped a una altura estándar (unos 4-5 cm) y haber retirado hojas o ramas acumuladas el día anterior. Esto asegura que la pulverización biológica penetre directamente en el suelo y haga contacto óptimo con la base de los tallos.'
  }
];

const defaultPayload = {
  beforeImage: '/servicios-cesped-antes.webp',
  afterImage: '/servicios-cesped-despues.webp',
  price: '195',
  areaLimit: '500',
  trustBadge1_title: 'Biología Activa y Fresca',
  trustBadge1_desc: 'El té de humus se extrae y oxigena pocas horas antes de la aplicación, asegurando millones de microorganismos vivos.',
  trustBadge2_title: 'Avalado por la Ciencia',
  trustBadge2_desc: 'Estudios científicos corroboran que las enmiendas biológicas líquidas son el mejor tratamiento a medio y largo plazo.',
  trustBadge3_title: 'Cero Plazos de Seguridad',
  trustBadge3_desc: 'Seguridad total inmediata para tus hijos y mascotas. Sin metales pesados ni químicos de síntesis artificial.',
};

export async function generateMetadata(): Promise<Metadata> {
  let page = null;
  try {
    page = await prisma.seoPage.findUnique({
      where: { slug: 'regeneracion-cesped' },
    });
  } catch (e) {
    console.warn("Error querying DB for metadata on servicios/regeneracion-cesped page, using defaults.");
  }

  return buildMetadata({
    title: page?.metaTitle || 'Regeneración de Césped con Té de Humus | Biocultor',
    description: page?.metaDescription || 'Servicio profesional de inoculación biológica in-situ para recuperar la salud y el verde de tu césped. Tratamiento 100% ecológico desde 195€.',
    path: '/servicios/regeneracion-cesped',
    keywords: [
      'regeneracion de cesped',
      'te de humus cesped',
      'recuperar cesped seco',
      'abonado ecologico cesped',
      'tratamiento organico jardin',
      'inoculacion biologica cesped'
    ]
  });
}

export default async function Page() {
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '#' },
    { label: 'Regeneración de Césped' }
  ];

  let page = null;
  try {
    page = await prisma.seoPage.findUnique({
      where: { slug: 'regeneracion-cesped' },
    });
  } catch (e) {
    console.warn("Error querying DB for servicios/regeneracion-cesped page, using defaults.");
  }

  if (page && !page.isPublished) {
    notFound();
  }

  let payload = defaultPayload;
  try {
    if (page?.payloadJson && page.payloadJson !== '{}') {
      payload = { ...defaultPayload, ...JSON.parse(page.payloadJson) };
    }
  } catch (e) {
    console.error("Error parsing payloadJson for servicios/regeneracion-cesped", e);
  }

  let faqs = defaultFaqs;
  try {
    if (page?.faqJson && page.faqJson !== '[]') {
      faqs = JSON.parse(page.faqJson);
    }
  } catch (e) {
    console.error("Error parsing faqJson for servicios/regeneracion-cesped", e);
  }

  const title = page?.title || 'Regenera tu césped desde la biología del suelo.';
  const metaDescription = page?.metaDescription || 'Servicio profesional de inoculación biológica in-situ para recuperar la salud y el verde de tu césped. Tratamiento 100% ecológico desde 195€.';

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: 'Inicio', path: '/' },
        { name: 'Servicios', path: '/servicios/regeneracion-cesped' }
      ]),
      faqSchema(faqs),
      {
        '@type': 'Service',
        '@id': 'https://biocultor.com/servicios/regeneracion-cesped#service',
        'name': 'Servicio de Inoculación y Regeneración de Césped',
        'serviceType': 'Lawn Care and Soil Regeneration',
        'provider': {
          '@id': 'https://biocultor.com/#organization'
        },
        'description': 'Regeneración biológica in-situ de césped y jardinería mediante la aplicación de té de humus de lombriz fresco y activo.',
        'areaServed': {
          '@type': 'Country',
          'name': 'España'
        },
        'offers': {
          '@type': 'Offer',
          'price': parseFloat(payload.price).toFixed(2),
          'priceCurrency': 'EUR',
          'priceSpecification': {
            '@type': 'UnitPriceSpecification',
            'price': parseFloat(payload.price).toFixed(2),
            'priceCurrency': 'EUR',
            'referenceQuantity': {
              '@type': 'QuantitativeValue',
              'value': payload.areaLimit,
              'unitCode': 'MTK'
            }
          }
        }
      }
    ]
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <StructuredData id="service-graph-schema" data={graphSchema} />

      {/* Main Container */}
      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto py-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* 1. HERO SECTION (Before/After comparison layout) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider self-start border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Nuevo Servicio Profesional
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Tratamiento profesional in-situ mediante la inoculación de té de humus de lombriz ultra-activo. Diseñado para recuperar el verde, la densidad y la resistencia de tu jardín sin químicos sintéticos.
            </p>
            
            {/* Tarjeta de conversión Hero */}
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-md shadow-foreground/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Precio Base</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-foreground">{payload.price} €</span>
                  <span className="text-muted-foreground text-sm">/ hasta {payload.areaLimit} m²</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Para jardines más amplios, consúltanos.</p>
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-primary hover:bg-brand-green-hover text-white shadow-lg shadow-primary/15 transition-all">
                <Link href="/contacto?servicio=cesped">
                  Solicitar Tratamiento
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> 100% Ecológico e inocuo
              </span>
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-primary" /> Con soporte agronómico
              </span>
            </div>
          </div>

          {/* Slider Hero */}
          <div className="lg:col-span-6 h-[320px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl shadow-foreground/5 border border-border/50">
            <ImageComparison
              beforeSrc={payload.beforeImage}
              afterSrc={payload.afterImage}
              beforeAlt="Césped degradado, seco y con parches antes del tratamiento biológico"
              afterAlt="Césped verde denso y regenerado tras la inoculación de té de humus de lombriz"
              className="h-full w-full"
            />
          </div>
        </section>

        {/* 2. TRUST BAR */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-t border-b border-border/50 mb-20 bg-card/40 rounded-3xl px-8">
          {[
            {
              title: payload.trustBadge1_title,
              desc: payload.trustBadge1_desc
            },
            {
              title: payload.trustBadge2_title,
              desc: payload.trustBadge2_desc
            },
            {
              title: payload.trustBadge3_title,
              desc: payload.trustBadge3_desc
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <span className="text-primary font-bold text-lg flex items-center gap-2">
                <Check className="w-4 h-4" /> {item.title}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* 3. EL PROBLEMA vs LA SOLUCIÓN */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-3xl font-bold text-foreground">El problema: Suelos inertes y compactados</h2>
            <p className="text-muted-foreground">
              La mayoría de los céspedes sufren un ciclo de degradación constante debido al uso de fertilizantes químicos solubles y al pisoteo. Esto genera:
            </p>
            <ul className="space-y-3.5">
              {[
                "Pérdida de la flora microbiana del suelo por salinidad de los abonos.",
                "Compactación del terreno que impide el paso del agua y el oxígeno.",
                "Raíces superficiales y débiles, propensas a secarse con el calor.",
                "Mayor vulnerabilidad ante hongos patógenos comunes (Fusarium, Pythium)."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground italic">
              El abono químico tradicional actúa como un "estimulante artificial": aporta un verde rápido pero debilita el suelo a la larga.
            </p>
          </div>

          <div className="flex flex-col gap-6 bg-primary/5 rounded-3xl p-8 border border-primary/10">
            <h2 className="font-heading text-3xl font-bold text-primary">La Solución: Restaurar el ecosistema de raíz</h2>
            <p className="text-muted-foreground">
              Nuestro tratamiento de inoculación introduce un consorcio de microorganismos vivos del humus de lombriz que regenera la red trófica del suelo:
            </p>
            <ul className="space-y-3.5">
              {[
                "Descompactación biológica: Los microbios mejoran la estructura del suelo (agregados).",
                "Crecimiento radicular profundo: Las raíces buscan agua a mayor profundidad, aumentando la resistencia a sequías.",
                "Nutrición de liberación lenta: Transforma los minerales bloqueados en alimento asimilable.",
                "Inmunidad natural: Competición y exclusión de hongos patógenos de forma orgánica."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. EVIDENCIA CIENTÍFICA (NO MILAGROS, RESULTADOS A LARGO PLAZO) */}
        <section className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
          
          <div className="max-w-3xl flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/8 text-primary rounded-full text-xs font-bold uppercase tracking-wider self-start">
              <FlaskConical className="w-3.5 h-3.5" /> Evidencia Científica
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">La ciencia detrás de la regeneración orgánica</h2>
            <p className="text-muted-foreground leading-relaxed">
              No prometemos efectos mágicos inmediatos ni coloraciones artificiales en 24 horas. Las enmiendas biológicas basadas en extractos húmicos y microorganismos de compostaje han demostrado científicamente ser la mejor estrategia de regeneración y mantenimiento a medio y largo plazo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="border-l-2 border-primary/40 pl-4">
                <h4 className="font-bold text-foreground text-sm">Resiliencia a la sequía</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Estudios demuestran que las raíces tratadas con consorcios microbianos de humus aumentan su profundidad hasta un 40%, mejorando la absorción hídrica en periodos áridos.
                </p>
              </div>
              <div className="border-l-2 border-primary/40 pl-4">
                <h4 className="font-bold text-foreground text-sm">Protección natural</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  La biomasa microbiana del humus ejerce un antagonismo activo contra fitopatógenos, reduciendo drásticamente la necesidad de aplicar fungicidas sintéticos.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic mt-2">
              *Nota: Los resultados son visibles de forma progresiva a partir de la 4ª semana y alcanzan su máximo potencial a los 3 meses.
            </p>
          </div>
        </section>

        {/* 5. CÓMO FUNCIONA EL PROCESO */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-12">El proceso del servicio in-situ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Diagnóstico inicial",
                desc: "Un técnico visita tu jardín para examinar el pH, el nivel de compactación y las zonas dañadas del césped."
              },
              {
                step: "02",
                title: "Inoculación fresca",
                desc: "Aplicamos mediante pulverización a baja presión el té de humus oxigenado, asegurando que penetre directamente hasta la rizosfera."
              },
              {
                step: "03",
                title: "Guía de pautas",
                desc: "Te entregamos un plan de riego y mantenimiento específico para tu suelo que garantizará el establecimiento de la biología."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 flex flex-col gap-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <span className="text-5xl font-extrabold text-primary/10 group-hover:text-primary/20 transition-colors absolute top-4 right-6 select-none">{item.step}</span>
                <h3 className="font-heading font-bold text-xl text-foreground mt-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. TRANSPARENT PRICING & CONVERSION */}
        <section className="bg-gradient-to-br from-brand-brown-dark/5 to-primary/5 border border-primary/10 rounded-3xl p-8 md:p-12 mb-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl flex flex-col gap-4">
            <h2 className="font-heading text-3xl font-extrabold text-foreground">¿Listo para devolverle la vida a tu césped?</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              El tratamiento base cubre hasta {payload.areaLimit} m² de terreno por {payload.price} €. Incluye desplazamiento, diagnóstico, inoculado con té de humus premium y plan de pautas post-tratamiento. Para jardines más grandes de {payload.areaLimit} m², consúltanos tarifas reducidas por metro cuadrado adicional.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="bg-background border border-border px-3 py-1 rounded-full text-xs font-semibold text-muted-foreground">✓ Sin contratos de permanencia</span>
              <span className="bg-background border border-border px-3 py-1 rounded-full text-xs font-semibold text-muted-foreground">✓ Asesoramiento profesional</span>
            </div>
          </div>
          <div className="bg-card border border-border/60 p-8 rounded-3xl w-full lg:w-auto min-w-[280px] shadow-lg shadow-foreground/5 flex flex-col gap-6 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Tarifa Plana</p>
              <div className="text-4xl font-extrabold text-foreground mt-2">{payload.price} €</div>
              <p className="text-xs text-muted-foreground mt-1">Superficie hasta {payload.areaLimit} m²</p>
            </div>
            <Button asChild size="lg" className="rounded-full w-full bg-primary hover:bg-brand-green-hover text-white py-6 shadow-md shadow-primary/15 transition-all">
              <Link href="/contacto?servicio=cesped">
                Contratar Servicio
              </Link>
            </Button>
            <p className="text-[11px] text-muted-foreground max-w-[220px] mx-auto">
              Tratamiento ecológico seguro. Plazas limitadas según época del año.
            </p>
          </div>
        </section>

        {/* 7. FAQs */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle className="w-3.5 h-3.5" /> Preguntas Frecuentes
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Resolvemos tus dudas sobre el servicio</h2>
            <p className="text-muted-foreground text-sm mt-2">Todo lo que necesitas saber antes de contratar el tratamiento de regeneración.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <h3 className="font-heading font-bold text-base text-foreground flex items-start gap-2">
                  <span className="text-primary font-extrabold font-mono shrink-0">?</span>
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-4 border-l border-border/60">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
