import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Leaf, ShieldCheck, Check, ArrowRight, Sparkles, CheckCircle2, FlaskConical, HelpCircle, Truck, ClipboardCheck } from 'lucide-react';
import prisma from '@/lib/db';
import { buildMetadata, breadcrumbSchema, organizationSchema, websiteSchema, faqSchema } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ImageComparison } from '@/components/ui/image-comparison';
import { Button } from '@/components/ui/button';
import ProfessionalServiceCalculator from '@/components/ProfessionalServiceCalculator';

export const revalidate = 1800;

const defaultFaqs = [
  {
    question: '¿Qué caducidad tiene el Té de Humus de Lombriz?',
    answer: 'Dado que es un extracto biológico vivo y altamente oxigenado, su efectividad máxima se encuentra dentro de las primeras 24-48 horas tras su recolección. Por ello, coordinamos la entrega fresca directamente en tu obra o jardín en Madrid y Castilla-La Mancha.'
  },
  {
    question: '¿Es compatible con mi equipo de pulverización o cuba de riego?',
    answer: 'Absolutamente. El Té de Humus Biocultor se somete a un doble filtrado de 100 micras que retira cualquier micropartícula sólida. Es perfectamente compatible con sistemas de riego por goteo, inyectores Venturi, pulverizadores de mochila y cubas de aplicación hidromecánica, sin obstruir boquillas.'
  },
  {
    question: '¿Se puede mezclar con tratamientos fitosanitarios?',
    answer: 'Se recomienda no mezclarlo directamente con fungicidas o bactericidas en el mismo tanque, ya que neutralizarían los microorganismos benéficos del té. Para otros tratamientos o abonos foliares, consúltanos compatibilidades específicas.'
  },
  {
    question: '¿Qué certificaciones tiene el producto?',
    answer: 'El humus de lombriz base utilizado está certificado para agricultura ecológica por el CAAE. El té resultante cumple estrictamente con la normativa europea para insumos en agricultura y jardinería ecológica, aportando total residuo cero.'
  }
];

const defaultPayload = {
  beforeImage: '/servicios-cesped-antes.webp',
  afterImage: '/servicios-cesped-despues.webp',
  price: '195',
  areaLimit: '500',
  additionalRate: '0.2',
  trustBadge1_title: 'Microbiología Profesional Activa',
  trustBadge1_desc: 'Extraído en frío y entregado en menos de 24 horas para garantizar la viabilidad biológica.',
  trustBadge2_title: 'Suelos de la Meseta Optimizados',
  trustBadge2_desc: 'Formulación que rompe las arcillas compactadas y reactiva la nutrición en suelos calizos secos.',
  trustBadge3_title: 'Garantía Ecológica CAAE',
  trustBadge3_desc: 'Insumo 100% certificado, idóneo para proyectos de paisajismo sostenible y residuo cero.'
};

export async function generateMetadata(): Promise<Metadata> {
  let page = null;
  try {
    page = await prisma.seoPage.findUnique({
      where: { slug: 'te-humus-paisajistas-jardineros' },
    });
  } catch (e) {
    console.warn("Error querying DB for metadata on servicios/te-humus-paisajistas-jardineros page, using defaults.");
  }

  return buildMetadata({
    title: page?.metaTitle || 'Té de Humus de Lombriz para Paisajistas y Jardineros | Biocultor',
    description: page?.metaDescription || 'Suministro y aplicación profesional de té de humus fresco en Madrid y Castilla-La Mancha. Optimiza suelos arcillosos y calizos con residuo cero.',
    path: '/servicios/te-humus-paisajistas-jardineros',
    keywords: [
      'te de humus para paisajistas',
      'humus liquido para jardineros',
      'aplicacion de humus de lombriz madrid',
      'descompactacion biologica de suelos',
      'fertilizacion biologica castilla la mancha',
      'tratamiento arizonicas fitoptora'
    ]
  });
}

export default async function Page() {
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '#' },
    { label: 'Paisajistas y Jardineros' }
  ];

  let page = null;
  let product = null;
  try {
    [page, product] = await Promise.all([
      prisma.seoPage.findUnique({
        where: { slug: 'te-humus-paisajistas-jardineros' },
      }),
      prisma.product.findUnique({
        where: { slug: 'te-humus-liquido-premium' },
        include: { variants: true }
      })
    ]);
  } catch (e) {
    console.warn("Error querying DB for te-humus-paisajistas-jardineros page or products, using defaults.");
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
    console.error("Error parsing payloadJson for te-humus-paisajistas-jardineros", e);
  }

  let faqs = defaultFaqs;
  try {
    if (page?.faqJson && page.faqJson !== '[]') {
      faqs = JSON.parse(page.faqJson);
    }
  } catch (e) {
    console.error("Error parsing faqJson for te-humus-paisajistas-jardineros", e);
  }

  const title = page?.title || 'Té de Humus para Paisajistas y Jardineros';
  const productVariants = product?.variants || [];

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: 'Inicio', path: '/' },
        { name: 'Servicios', path: '/servicios/te-humus-paisajistas-jardineros' }
      ]),
      faqSchema(faqs),
      {
        '@type': 'Service',
        '@id': 'https://biocultor.com/servicios/te-humus-paisajistas-jardineros#service',
        'name': 'Suministro y Aplicación de Té de Humus para Profesionales',
        'serviceType': 'Professional Lawn Care and Soil Inoculation',
        'provider': {
          '@id': 'https://biocultor.com/#organization'
        },
        'description': 'Servicio B2B de suministro y aplicación técnica de té de humus de lombriz fresco para paisajistas, jardineros y mantenimiento de grandes áreas verdes en Madrid y Castilla-La Mancha.',
        'areaServed': [
          { '@type': 'AdministrativeArea', 'name': 'Comunidad de Madrid' },
          { '@type': 'AdministrativeArea', 'name': 'Castilla-La Mancha' }
        ],
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
      <StructuredData id="landscaper-service-graph-schema" data={graphSchema} />

      {/* Main Container */}
      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto py-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* 1. HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider self-start border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Especial para Profesionales y Paisajismo
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Diferénciate y optimiza tus costes de mantenimiento. Ofrecemos suministro directo a obra de Té de Humus fresco oxigenado o servicio de aplicación técnica in-situ con cubas especializadas. Diseñado para jardineros y paisajistas de Madrid y Castilla-La Mancha.
            </p>
            
            {/* Tarjeta de conversión Hero */}
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-md shadow-foreground/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Suministro y Aplicación</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-foreground">{payload.price} €</span>
                  <span className="text-muted-foreground text-sm">/ base {payload.areaLimit} m²</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Suministro de garrafas y formatos desde 9.95 €.</p>
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-primary hover:bg-brand-green-hover text-white shadow-lg shadow-primary/15 transition-all">
                <Link href="#presupuesto">
                  Calcular Dosis y Presupuesto
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Certificación Ecológica CAAE
              </span>
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-primary" /> Doble filtrado de 100 micras (sin atascos)
              </span>
            </div>
          </div>

          {/* Slider Hero */}
          <div className="lg:col-span-6 h-[320px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl shadow-foreground/5 border border-border/50">
            <ImageComparison
              beforeSrc={payload.beforeImage}
              afterSrc={payload.afterImage}
              beforeAlt="Jardín degradado, compactado y seco antes de la inoculación biológica"
              afterAlt="Jardín exuberante, verde y recuperado tras la aplicación de Té de Humus"
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

        {/* 3. OPTIMIZACIÓN LOCAL - MADRID Y CASTILLA-LA MANCHA */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-3xl font-bold text-foreground">Optimización biológica para los suelos de la Meseta Central</h2>
            <p className="text-muted-foreground">
              Madrid y Castilla-La Mancha presentan desafíos de suelo únicos que limitan el éxito de los proyectos de paisajismo tradicionales. Nuestro Té de Humus está formulado biológicamente para corregir estos factores clave:
            </p>
            <ul className="space-y-4">
              <li className="border-l-2 border-primary/40 pl-4">
                <strong className="text-foreground text-sm block">Suelos Arcillosos y Calizos (Sur de Madrid y Toledo)</strong>
                <span className="text-xs text-muted-foreground leading-relaxed mt-1 block">
                  La caliza bloquea el hierro y el fósforo, provocando clorosis. Las bacterias y ácidos orgánicos del té de humus actúan como agentes quelantes naturales, liberando los nutrientes bloqueados y estructurando las arcillas para favorecer el drenaje y la aireación de las raíces.
                </span>
              </li>
              <li className="border-l-2 border-primary/40 pl-4">
                <strong className="text-foreground text-sm block">Suelos Arenosos y Graníticos (Sierra de Madrid)</strong>
                <span className="text-xs text-muted-foreground leading-relaxed mt-1 block">
                  Suelos ácidos con bajísima retención de agua y lixiviación de abonos. El aporte microbiano coloniza la arena y genera un biofilm orgánico ("materia orgánica activa") que actúa como una esponja, reteniendo la humedad y los nutrientes aplicados.
                </span>
              </li>
              <li className="border-l-2 border-primary/40 pl-4">
                <strong className="text-foreground text-sm block">Prevención de Fitosanitarios (Arizónicas y Cipreses)</strong>
                <span className="text-xs text-muted-foreground leading-relaxed mt-1 block">
                  Los setos de cipreses en urbanizaciones de Madrid y Guadalajara sufren de *Phytophthora* (fitóftora). La biomasa activa de hongos beneficiosos y bacterias del humus compite directamente y protege la rizosfera del seto frente a este patógeno fúngico, evitando el uso repetido de químicos.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6 bg-primary/5 rounded-3xl p-8 border border-primary/10 justify-center">
            <h3 className="font-heading text-2xl font-bold text-primary">Ventajas exclusivas para Jardineros y Paisajistas</h3>
            <p className="text-muted-foreground text-sm">
              Incorporar enmiendas biológicas de humus fresco en tus obras te posiciona a la vanguardia del sector:
            </p>
            <ul className="space-y-3">
              {[
                "Reducción de hasta un 40% en las necesidades de riego de tus jardines.",
                "Menor pérdida de marras en nuevas plantaciones gracias a la rápida colonización de micorrizas y bacterias.",
                "Efecto visual impecable: césped homogéneo, verde natural intenso y denso sin picos de crecimiento artificial.",
                "Seguridad 100%: Plazos de seguridad cero para tus operarios y clientes.",
                "Certificado CAAE compatible con normativas de residuo cero y paisajismo sostenible."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. EVIDENCIA CIENTÍFICA */}
        <section className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
          
          <div className="max-w-3xl flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/8 text-primary rounded-full text-xs font-bold uppercase tracking-wider self-start">
              <FlaskConical className="w-3.5 h-3.5" /> Respaldado Agronómicamente
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">El aval de la biología del suelo</h2>
            <p className="text-muted-foreground leading-relaxed">
              No es magia, es microbiología. Al inocular té de humus de lombriz de alta concentración, estás restaurando la red trófica del suelo que los fertilizantes de síntesis química destruyen. Numerosos estudios agronómicos corroboran que la presencia de microrganismos fijadores de nitrógeno, solubilizadores de fósforo y productores de fitohormonas estimula el enraizamiento profundo y la salud vegetal de forma duradera.
            </p>
            <p className="text-xs text-muted-foreground italic">
              *Nota logística: Dado que son microorganismos vivos, el té de humus se oxigena continuamente hasta su entrega. Debe ser aplicado en las primeras 24-48 horas tras su recepción.
            </p>
          </div>
        </section>

        {/* 5. CÓMO FUNCIONA EL PROCESO B2B */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-12">Logística y Aplicación Profesional</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Logística Fresca",
                desc: "Brewing bajo demanda. Preparamos el té de humus oxigenándolo continuamente y te lo entregamos fresco en garrafas o IBCs a pie de obra en Madrid y Castilla-La Mancha."
              },
              {
                step: "02",
                title: "Compatibilidad Absoluta",
                desc: "Gracias a nuestro proceso de filtrado industrial de 100 micras, el producto no obstruye inyectores, sistemas de goteo ni boquillas de pulverizadores profesionales."
              },
              {
                step: "03",
                title: "Opcion de Aplicación",
                desc: "Si lo prefieres, nuestros técnicos acuden con equipos de pulverización de gran caudal para inocular superficies deportivas, praderas residenciales o grandes setos."
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
        <section id="presupuesto" className="bg-gradient-to-br from-brand-brown-dark/5 to-primary/5 border border-primary/10 rounded-3xl p-8 md:p-12 mb-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl flex flex-col gap-4">
            <h2 className="font-heading text-3xl font-extrabold text-foreground">Calculadora de Tarifas para Profesionales</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Selecciona los metros cuadrados de tu proyecto para estimar las garrafas de té de humus concentrado requeridas o calcula el coste completo del suministro con operarios y aplicación técnica in-situ.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Truck className="w-4 h-4 text-primary" />
                <span><strong>Opción Solo Suministro:</strong> Compra directa de garrafas según tus m² calculando los formatos más eficientes de la tienda (1L, 5L, 10L, 25L).</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <ClipboardCheck className="w-4 h-4 text-primary" />
                <span><strong>Opción Aplicación Completa:</strong> Cobertura técnica base a partir de un mínimo de {payload.price} € (hasta {payload.areaLimit} m²).</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[450px] shrink-0">
            <ProfessionalServiceCalculator
              basePrice={parseFloat(payload.price || '195')}
              baseArea={parseFloat(payload.areaLimit || '500')}
              ratePerAdditionalM2={parseFloat(payload.additionalRate || '0.2')}
              productVariants={productVariants}
            />
          </div>
        </section>

        {/* 7. FAQs */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle className="w-3.5 h-3.5" /> Preguntas Frecuentes Profesionales
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Consultas técnicas frecuentes de paisajistas y jardineros</h2>
            <p className="text-muted-foreground text-sm mt-2">Dudas habituales sobre la aplicación, logística de microorganismos y compatibilidades.</p>
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
