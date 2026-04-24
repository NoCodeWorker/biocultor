export const revalidate = 3600

import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, collectionPageSchema } from '@/lib/seo';
import { getSeoSolutionsOrtiga } from '@/lib/seo-store';

export const metadata = buildMetadata({
  title: 'Purín concentrado de ortiga por aplicación | Biocultor España',
  description:
    'Landings de purín concentrado de ortiga para España: huerto urbano, rosales y ornamentales, frutales, tomates y hortalizas.',
  path: '/purin-de-ortiga',
  keywords: [
    'purín de ortiga para huerto urbano',
    'purín de ortiga para rosales',
    'purín de ortiga para frutales',
    'purín concentrado de ortiga españa',
  ],
});

export default async function PurinOrtigaLandingPage() {
  const solutions = await getSeoSolutionsOrtiga();
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData
        id="solutions-ortiga-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Purín de ortiga', path: '/purin-de-ortiga' },
        ])}
      />
      <StructuredData
        id="solutions-ortiga-collection-schema"
        data={collectionPageSchema({
          name: 'Aplicaciones por cultivo — Purín de ortiga',
          description: 'Landings transaccionales por cultivo y uso del purín concentrado de ortiga.',
          path: '/purin-de-ortiga',
          items: solutions.map((solution) => ({
            name: solution.title,
            path: `/purin-de-ortiga/${solution.slug}`,
          })),
        })}
      />

      <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Purín de ortiga' }]} />

      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          SEO programático
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-heading font-extrabold tracking-tight">
          Purín concentrado de ortiga orientado a cada uso real.
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
          Cada landing agrupa la intención de compra de un tipo de cultivo concreto,
          con un lenguaje alineado con manejo orgánico serio y sin atribuir efectos
          más allá de lo que la literatura sostiene.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {solutions.map((solution) => (
          <Link
            key={solution.slug}
            href={`/purin-de-ortiga/${solution.slug}`}
            className="rounded-[2rem] border border-border/50 bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
              {solution.audience}
            </p>
            <h2 className="mt-4 text-2xl font-heading font-bold">{solution.title}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{solution.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {solution.benefits.slice(0, 2).map((benefit) => (
                <span
                  key={benefit}
                  className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-16 rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
          Sobre esta capa y la evidencia que la respalda
        </h2>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          La editorial de Biocultor sigue la política de evidencia trazable definida en
          ADR-002: cada artículo se apoya en una fuente primaria o institucional citable
          y evita convertir la investigación en promesa comercial.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/producto/purin-ortiga-concentrado" className="font-semibold text-foreground hover:text-primary transition-colors">
            Ver producto y formatos
          </Link>
          <Link href="/comprar-purin-de-ortiga" className="font-semibold text-foreground hover:text-primary transition-colors">
            Ver páginas de compra
          </Link>
        </div>
      </section>
    </div>
  );
}
