export const revalidate = 3600

import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, collectionPageSchema } from '@/lib/seo';
import { getSeoCommercialPagesOrtiga } from '@/lib/seo-store';

export const metadata = buildMetadata({
  title: 'Comprar purín de ortiga online | Biocultor España',
  description:
    'Centro transaccional para comprar purín concentrado de ortiga en España: huerto urbano, jardín ornamental y pequeña explotación ecológica.',
  path: '/comprar-purin-de-ortiga',
  keywords: [
    'comprar purín de ortiga',
    'purín de ortiga ecológico',
    'purín concentrado ortiga online',
    'ortiga para huerto y jardín',
  ],
});

export default async function CommercialOrtigaHubPage() {
  const pages = await getSeoCommercialPagesOrtiga();
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData
        id="commercial-ortiga-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Comprar purín de ortiga', path: '/comprar-purin-de-ortiga' },
        ])}
      />
      <StructuredData
        id="commercial-ortiga-collection-schema"
        data={collectionPageSchema({
          name: 'Dominio transaccional — Purín de ortiga',
          description: 'Páginas comerciales para capturar intención de compra explícita de purín de ortiga.',
          path: '/comprar-purin-de-ortiga',
          items: pages.map((page) => ({
            name: page.title,
            path: `/comprar-purin-de-ortiga/${page.slug}`,
          })),
        })}
      />

      <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Comprar purín de ortiga' }]} />

      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          Dominio transaccional
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-heading font-extrabold tracking-tight">
          Comprar purín de ortiga con arquitectura de compra real.
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
          Agrupamos aquí las búsquedas con intención comercial explícita: compra directa,
          manejo ecológico y escenarios donde el extracto vegetal encaja dentro de un plan.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/comprar-purin-de-ortiga/${page.slug}`}
            className="rounded-[2rem] border border-border/50 bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
              {page.keyword}
            </p>
            <h2 className="mt-4 text-2xl font-heading font-bold">{page.title}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{page.intro}</p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {page.bestFor.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
}
