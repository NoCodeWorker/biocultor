import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, FileCheck2, Scale } from 'lucide-react';
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
import { comparisonPages, leadershipLibrarySections } from '@/lib/leadership-assets';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Biblioteca de jardineria biologica y humus liquido | Biocultor',
  description:
    'Biblioteca Biocultor con comparativas, calculadoras, metodologia y recursos para decidir entre comprar producto o contratar aplicacion profesional.',
  path: '/biblioteca',
  keywords: [
    'biblioteca jardineria biologica',
    'comparativas humus liquido',
    'calculadora humus jardin',
    'metodologia aplicacion humus',
  ],
});

export default function BibliotecaPage() {
  const breadcrumbs = [{ label: 'Inicio', href: '/' }, { label: 'Biblioteca' }];
  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: 'Inicio', path: '/' },
        { name: 'Biblioteca', path: '/biblioteca' },
      ]),
      collectionPageSchema({
        name: 'Biblioteca Biocultor',
        description:
          'Centro de liderazgo sectorial con comparativas, calculadoras, metodologia, casos y recursos.',
        path: '/biblioteca',
        items: [
          ...comparisonPages.map((item) => ({
            name: item.title,
            path: `/comparativas/${item.slug}`,
          })),
          { name: 'Calculadoras Biocultor', path: '/calculadoras' },
          { name: 'Metodologia y trazabilidad', path: '/metodologia' },
          { name: 'Casos y recursos', path: '/casos' },
        ],
      }),
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <StructuredData id="library-schema" data={graphSchema} />
      <div className="mx-auto w-[92%] py-8 lg:w-[80%] xl:w-[75%]">
        <Breadcrumbs items={breadcrumbs} />

        <section className="grid gap-10 py-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Liderazgo sectorial
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
              Biblioteca para decidir con criterio, no por impulso.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              El objetivo de Biocultor no es ser otro ecommerce de insumos. Es construir una base consultable para saber cuando comprar te de humus, cuando usar purin de ortiga y cuando contratar aplicacion profesional.
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
              <FileCheck2 className="mb-4 h-6 w-6 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Todas las piezas deben mantener evidencia visible, limites honestos y CTA contextual segun ADR-002.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 py-10">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {leadershipLibrarySections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/50"
              >
                <h2 className="font-heading text-xl font-bold text-foreground">{section.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Abrir
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="comparativas" className="border-t border-border/60 py-10">
          <div className="mb-8 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Scale className="h-3.5 w-3.5" />
              Comparativas
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Contra que compite realmente Biocultor</h2>
            <p className="mt-3 text-muted-foreground">
              No todas las alternativas son malas. La autoridad se gana explicando cuando Biocultor encaja y cuando otra solucion puede tener mas sentido.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {comparisonPages.map((item) => (
              <Link
                key={item.slug}
                href={`/comparativas/${item.slug}`}
                className="flex flex-col rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/50"
              >
                <span className="mb-4 w-fit rounded-full bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  vs {item.alternative}
                </span>
                <h3 className="font-heading text-xl font-bold leading-tight text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Leer comparativa
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 py-10">
          <div className="rounded-3xl bg-primary px-6 py-8 text-white md:px-10">
            <Calculator className="mb-4 h-7 w-7" />
            <h2 className="font-heading text-3xl font-bold">Calcula antes de comprar o contratar.</h2>
            <p className="mt-3 max-w-3xl text-white/80">
              Las calculadoras convierten la intencion en decision: litros, coste por m2, servicio estimado y siguiente paso.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6 rounded-full">
              <Link href="/calculadoras">Abrir calculadoras</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
