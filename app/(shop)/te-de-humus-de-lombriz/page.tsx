export const revalidate = 3600

import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, collectionPageSchema } from '@/lib/seo';
import { getSeoSolutions } from '@/lib/seo-store';

export const metadata = buildMetadata({
  title: 'Té de humus de lombriz por aplicación | Biocultor España',
  description:
    'Landings transaccionales de té de humus de lombriz para España: olivos, cítricos, huerto urbano, viveros y jardinería profesional.',
  path: '/te-de-humus-de-lombriz',
  keywords: [
    'té de humus de lombriz para olivos',
    'té de humus de lombriz para cítricos',
    'té de humus de lombriz para huerto urbano',
    'comprar té de humus de lombriz españa',
  ],
});

export default async function TeaHumusLandingPage() {
  const seoSolutions = await getSeoSolutions();
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData
        id="solutions-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Té de humus de lombriz', path: '/te-de-humus-de-lombriz' },
        ])}
      />
      <StructuredData
        id="solutions-collection-schema"
        data={collectionPageSchema({
          name: 'Aplicaciones por cultivo',
          description: 'Landings transaccionales por cultivo y uso del té de humus de lombriz.',
          path: '/te-de-humus-de-lombriz',
          items: seoSolutions.map((solution) => ({
            name: solution.title,
            path: `/te-de-humus-de-lombriz/${solution.slug}`,
          })),
        })}
      />

      <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Té de humus de lombriz' }]} />

      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          SEO programático
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-heading font-extrabold tracking-tight">
          Té de humus de lombriz orientado a cada intención de compra.
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
          En vez de concentrar todo en una única ficha, Biocultor abre landings por aplicación
          para capturar búsquedas transaccionales y comparativas de toda España.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {seoSolutions.map((solution) => (
          <Link
            key={solution.slug}
            href={`/te-de-humus-de-lombriz/${solution.slug}`}
            className="rounded-[2rem] border border-border/50 bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
              {solution.audience}
            </p>
            <h2 className="mt-4 text-2xl font-heading font-bold">{solution.title}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{solution.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {solution.benefits.slice(0, 2).map((benefit) => (
                <span key={benefit} className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-foreground">
                  {benefit}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-16 rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
          Cómo funciona esta capa transaccional
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/40 bg-background p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">Cultivo</p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Cada landing agrupa necesidad, uso y lenguaje de compra propios de un sector concreto.
            </p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-background p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">Formato</p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              El usuario llega con intención clara y sale con un criterio mejor para elegir volumen.
            </p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-background p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">Conversión</p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Cada URL enlaza a compra, envío y soporte sin duplicar el contenido nuclear del producto.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
