import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, CalendarDays, Ruler } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import ProfessionalServiceCalculator from '@/components/ProfessionalServiceCalculator';
import ServicePriceCalculator from '@/components/ServicePriceCalculator';
import { Button } from '@/components/ui/button';
import {
  breadcrumbSchema,
  buildMetadata,
  collectionPageSchema,
  organizationSchema,
  websiteSchema,
} from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Calculadoras de humus liquido, litros y servicio | Biocultor',
  description:
    'Calcula litros, coste por m2, presupuesto orientativo y calendario de decision para jardines, paisajistas, comunidades y empresas.',
  path: '/calculadoras',
  keywords: [
    'calculadora humus liquido',
    'calcular litros te de humus',
    'coste por m2 humus jardin',
    'presupuesto regeneracion cesped',
  ],
});

export default function CalculadorasPage() {
  const breadcrumbs = [{ label: 'Inicio', href: '/' }, { label: 'Calculadoras' }];
  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: 'Inicio', path: '/' },
        { name: 'Calculadoras', path: '/calculadoras' },
      ]),
      collectionPageSchema({
        name: 'Calculadoras Biocultor',
        description:
          'Herramientas de estimacion para litros, coste por m2, servicio profesional y calendario de aplicacion.',
        path: '/calculadoras',
        items: [
          { name: 'Calculadora profesional', path: '/calculadoras#profesional' },
          { name: 'Calculadora de presupuesto de jardin', path: '/calculadoras#presupuesto' },
          { name: 'Calendario de decision', path: '/calculadoras#calendario' },
        ],
      }),
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <StructuredData id="calculators-schema" data={graphSchema} />
      <div className="mx-auto w-[92%] py-8 lg:w-[80%] xl:w-[75%]">
        <Breadcrumbs items={breadcrumbs} />

        <section className="py-10">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Calculator className="h-3.5 w-3.5" />
              Decision antes de compra
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
              Calculadoras para no improvisar litros, coste ni servicio.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Estas estimaciones no sustituyen diagnostico de campo. Sirven para orientar el siguiente paso: comprar producto, pedir suministro profesional o contratar aplicacion.
            </p>
          </div>
        </section>

        <section id="profesional" className="grid gap-8 border-t border-border/60 py-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <h2 className="font-heading text-3xl font-bold text-foreground">Litros y coste para proyectos profesionales</h2>
            <p className="mt-3 text-muted-foreground">
              Pensada para paisajistas, empresas y comunidades con superficie conocida.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ProfessionalServiceCalculator />
          </div>
        </section>

        <section id="presupuesto" className="grid gap-8 border-t border-border/60 py-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <h2 className="font-heading text-3xl font-bold text-foreground">Presupuesto orientativo de jardin</h2>
            <p className="mt-3 text-muted-foreground">
              Para propietarios de chalets o responsables de jardines que quieren una referencia antes de enviar el formulario.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ServicePriceCalculator />
          </div>
        </section>

        <section id="calendario" className="border-t border-border/60 py-10">
          <div className="mb-8 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <CalendarDays className="h-3.5 w-3.5" />
              Calendario de decision
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Que hacer segun el estado del jardin</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Mantenimiento normal',
                text: 'Compra directa y aplicacion periodica si el riego y la siega estan controlados.',
                href: '/producto/te-humus-liquido-premium',
                cta: 'Comprar producto',
              },
              {
                title: 'Cesped irregular o compactado',
                text: 'Pide diagnostico si hay zonas duras, calvas o perdida recurrente de vigor.',
                href: '/servicios/regeneracion-cesped-y-jardines',
                cta: 'Ver servicio',
              },
              {
                title: 'Proyecto profesional',
                text: 'Calcula litros y logistica antes de decidir entre suministro o aplicacion completa.',
                href: '/servicios/te-humus-paisajistas-jardineros',
                cta: 'Ver B2B',
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/50">
                <Ruler className="mb-4 h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 py-10">
          <div className="rounded-3xl bg-primary px-6 py-8 text-white md:px-10">
            <h2 className="font-heading text-3xl font-bold">Prefieres que lo dimensionemos contigo?</h2>
            <p className="mt-3 max-w-3xl text-white/80">
              En proyectos grandes, una calculadora solo aproxima. El diagnostico evita comprar litros de mas o contratar una aplicacion sin corregir primero riego, compactacion o resiembra.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6 rounded-full">
              <Link href="/contacto?servicio=calculadora">Enviar datos del jardin</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
