import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, CheckCircle2, Leaf, MapPin, ShieldCheck, Sprout, Users } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { buildMetadata, breadcrumbSchema, collectionPageSchema, organizationSchema, websiteSchema } from '@/lib/seo';
import { premiumServicePages } from '@/lib/premium-service-pages';

export const revalidate = 3600;

const servicePages = [
  {
    title: 'Regeneración de césped y jardines',
    description:
      'Aplicación profesional de té de humus de lombriz para recuperar suelos compactados, césped debilitado y jardines con pérdida de vigor.',
    href: '/servicios/regeneracion-cesped-y-jardines',
    icon: Sprout,
    audience: 'Chalets, comunidades, urbanizaciones y jardines privados',
    cta: 'Ver servicio de regeneración',
  },
  {
    title: 'Té de humus para paisajistas y jardineros',
    description:
      'Suministro fresco y aplicación técnica para proyectos profesionales, mantenimientos recurrentes y zonas verdes de alto valor.',
    href: '/servicios/te-humus-paisajistas-jardineros',
    icon: Users,
    audience: 'Paisajistas, jardineros, empresas y complejos comerciales',
    cta: 'Ver servicio profesional',
  },
];

const supportLinks = [
  {
    title: 'Comprar té de humus líquido premium',
    href: '/producto/te-humus-liquido-premium',
    description: 'Para clientes que prefieren aplicar el producto por cuenta propia.',
  },
  {
    title: 'Cuándo contratar aplicación profesional',
    href: '/aprende/servicio-aplicacion-te-humus-cuando-contratar',
    description: 'Guía para decidir entre compra directa y servicio técnico.',
  },
  {
    title: 'Coste por m2 y litros necesarios',
    href: '/aprende/calcular-litros-coste-m2-te-humus-paisajistas',
    description: 'Cálculo orientativo para jardines, comunidades y profesionales.',
  },
];

const premiumServiceLinks = premiumServicePages.map((page) => ({
  title: page.title,
  description: page.intent,
  href: `/servicios/${page.slug}`,
  audience: page.segment,
  zone: page.zone,
  keyword: page.targetKeyword,
}));

export const metadata: Metadata = buildMetadata({
  title: 'Servicios de Jardinería Biológica | Biocultor',
  description:
    'Servicios profesionales de aplicación de té de humus de lombriz para césped, jardines premium, paisajistas, comunidades y empresas con zonas verdes.',
  path: '/servicios',
  keywords: [
    'servicios de jardineria biologica',
    'aplicacion te de humus',
    'regeneracion cesped',
    'jardines premium',
    'paisajistas te de humus',
    'mantenimiento biologico jardines',
  ],
});

export default function ServiciosPage() {
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios' },
  ];

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: 'Inicio', path: '/' },
        { name: 'Servicios', path: '/servicios' },
      ]),
      collectionPageSchema({
        name: 'Servicios de jardinería biológica Biocultor',
        description:
          'Hub de servicios profesionales de aplicación de té de humus de lombriz para césped, jardines, paisajistas, comunidades y empresas con zonas verdes.',
        path: '/servicios',
        items: [
          ...servicePages.map((service) => ({ name: service.title, path: service.href })),
          ...premiumServiceLinks.map((service) => ({ name: service.title, path: service.href })),
        ],
      }),
      {
        '@type': 'ItemList',
        '@id': 'https://biocultor.com/servicios#service-list',
        name: 'Servicios profesionales Biocultor',
        itemListElement: [
          ...servicePages.map((service) => ({
            name: service.title,
            description: service.description,
            href: service.href,
            areaServed: 'España',
          })),
          ...premiumServiceLinks.map((service) => ({
            name: service.title,
            description: service.description,
            href: service.href,
            areaServed: service.zone,
          })),
        ].map((service, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
            url: `https://biocultor.com${service.href}`,
            provider: { '@id': 'https://biocultor.com/#organization' },
            areaServed: { '@type': 'AdministrativeArea', name: service.areaServed },
          },
        })),
      },
    ],
  };

  return (
    <main className="bg-background min-h-screen">
      <StructuredData id="services-hub-schema" data={graphSchema} />

      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto py-8">
        <Breadcrumbs items={breadcrumbs} />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center py-10 md:py-14">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider self-start border border-primary/20">
              <Leaf className="w-3.5 h-3.5" />
              Microbiología aplicada al jardín
            </div>
            <div className="space-y-4">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
                Servicios de jardinería biológica para jardines de alto valor.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Aplicamos té de humus de lombriz con criterio técnico para recuperar césped, mejorar suelos compactados y ayudar a equipos de jardinería a trabajar con microbiología fresca, filtrada y trazable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-brand-green-hover text-white">
                <Link href="/servicios/regeneracion-cesped-y-jardines">
                  Solicitar diagnóstico
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/producto/te-humus-liquido-premium">Comprar producto</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {[
              { icon: ShieldCheck, title: 'Residuo cero', text: 'Sin herbicidas, fungicidas ni fertilizantes de síntesis.' },
              { icon: MapPin, title: 'Cobertura local', text: 'Madrid, Toledo, Castilla-La Mancha y proyectos cercanos bajo consulta.' },
              { icon: Building2, title: 'Uso profesional', text: 'Jardines privados, comunidades, empresas, hoteles y zonas comerciales.' },
            ].map((item) => (
              <div key={item.title} className="border border-border/60 bg-card rounded-2xl p-5 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-base text-foreground">{item.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10 md:py-14 border-t border-border/60">
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-3xl font-bold text-foreground">Servicios premium por tipo de cliente</h2>
            <p className="text-muted-foreground mt-3">
              Landings específicas para búsquedas de alto valor: chalets, comunidades, empresas, hostelería, paisajistas y zonas verdes donde la intervención debe ser clara, trazable y justificable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {premiumServiceLinks.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="border border-border/60 bg-card rounded-2xl p-5 hover:border-primary/50 transition-colors flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-lg text-foreground leading-tight">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
                <div className="mt-auto space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{service.audience}</p>
                  <p className="text-xs text-muted-foreground">{service.zone}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Ver servicio
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-10 md:py-14 border-t border-border/60">
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-3xl font-bold text-foreground">Elige el servicio según tu situación</h2>
            <p className="text-muted-foreground mt-3">
              La compra directa sigue siendo la vía más eficiente cuando tienes equipo y criterio de aplicación. El servicio aporta valor cuando necesitas diagnóstico, dosificación, logística fresca o ejecución profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servicePages.map((service) => (
              <article key={service.href} className="border border-border/60 bg-card rounded-2xl p-6 md:p-8 flex flex-col gap-5">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-heading text-2xl font-bold text-foreground">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{service.audience}</p>
                </div>
                <Button asChild variant="outline" className="rounded-full mt-auto justify-between">
                  <Link href={service.href}>
                    {service.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </section>

        <section className="py-10 md:py-14 border-t border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              'Diagnóstico del estado del suelo, compactación, riego y objetivo estético.',
              'Selección entre compra directa, suministro fresco o aplicación completa.',
              'Pautas posteriores para riego, siega y mantenimiento sin promesas milagrosas.',
            ].map((step, index) => (
              <div key={step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10 md:py-14 border-t border-border/60">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground">Guías para decidir con criterio</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                Contenido de apoyo para comparar coste, aplicación y cuándo tiene sentido contratar una intervención profesional.
              </p>
            </div>
            <Button asChild variant="ghost" className="rounded-full self-start md:self-auto">
              <Link href="/aprende">
                Ver aprende
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {supportLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-border/60 bg-card rounded-2xl p-5 hover:border-primary/50 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mb-4" />
                <h3 className="font-heading font-bold text-base text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
