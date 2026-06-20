import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ClipboardCheck, FileCheck2, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
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
  title: 'Metodologia, trazabilidad y limites | Biocultor',
  description:
    'Como Biocultor documenta producto, diagnostico, aplicacion, evidencia y limites honestos en jardines, servicios y contenido editorial.',
  path: '/metodologia',
  keywords: [
    'metodologia biocultor',
    'trazabilidad humus liquido',
    'evidencia jardineria biologica',
    'limites aplicacion humus',
  ],
});

export default function MetodologiaPage() {
  const breadcrumbs = [{ label: 'Inicio', href: '/' }, { label: 'Metodologia' }];
  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: 'Inicio', path: '/' },
        { name: 'Metodologia', path: '/metodologia' },
      ]),
      collectionPageSchema({
        name: 'Metodologia Biocultor',
        description:
          'Sistema de trabajo para producto, servicio, evidencia, trazabilidad y limites honestos.',
        path: '/metodologia',
        items: [
          { name: 'Diagnostico', path: '/metodologia#diagnostico' },
          { name: 'Trazabilidad', path: '/metodologia#trazabilidad' },
          { name: 'Limitaciones', path: '/metodologia#limites' },
        ],
      }),
    ],
  };

  const blocks = [
    {
      id: 'diagnostico',
      title: 'Diagnostico antes de prometer',
      points: [
        'Separar sintomas esteticos de causas probables: riego, compactacion, suelo, transito o manejo.',
        'Decidir si basta compra directa o si hay que dimensionar servicio.',
        'Registrar superficie, acceso, restricciones y objetivo del cliente.',
      ],
    },
    {
      id: 'trazabilidad',
      title: 'Trazabilidad de aplicacion',
      points: [
        'Documentar fecha, litros, superficie, metodo y responsable.',
        'Mantener fotos comparables cuando el proyecto se use como caso.',
        'Anotar incidencias de riego, calor, siega, sombra o uso intensivo.',
      ],
    },
    {
      id: 'limites',
      title: 'Limites honestos',
      points: [
        'No presentar observaciones como garantias universales.',
        'No vender producto como sustituto de aireacion, resiembra, drenaje o reparacion de riego.',
        'No usar fuentes tecnicas para claims que la fuente no sostiene.',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <StructuredData id="methodology-schema" data={graphSchema} />
      <div className="mx-auto w-[92%] py-8 lg:w-[80%] xl:w-[75%]">
        <Breadcrumbs items={breadcrumbs} />

        <section className="grid gap-10 py-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <ClipboardCheck className="h-3.5 w-3.5" />
              E-E-A-T operativo
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
              Metodologia y trazabilidad para no depender de marketing vacio.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              La autoridad de Biocultor se construye con criterio tecnico visible: diagnostico, datos de aplicacion, limites y fuentes. Si falta evidencia, se declara como pendiente.
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
              <ShieldCheck className="mb-4 h-6 w-6 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Esta pagina funciona como referencia editorial para SEO, GEO, AIO y para explicar a clientes premium como trabaja Biocultor.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-t border-border/60 py-10 md:grid-cols-3">
          {blocks.map((block) => (
            <article id={block.id} key={block.id} className="rounded-2xl border border-border/60 bg-card p-6">
              <FileCheck2 className="mb-4 h-6 w-6 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">{block.title}</h2>
              <ul className="mt-5 space-y-3">
                {block.points.map((point) => (
                  <li key={point} className="text-sm leading-relaxed text-muted-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="border-t border-border/60 py-10">
          <div className="rounded-3xl bg-primary px-6 py-8 text-white md:px-10">
            <h2 className="font-heading text-3xl font-bold">Quieres un plan con esta metodologia?</h2>
            <p className="mt-3 max-w-3xl text-white/80">
              En jardines de alto valor, el primer entregable debe ser claridad: que se puede mejorar, que no depende del producto y que seguimiento tiene sentido.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <Link href="/contacto?servicio=metodologia">Solicitar diagnostico</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/casos">
                  Ver casos documentables
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
