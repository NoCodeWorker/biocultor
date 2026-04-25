export const revalidate = 3600

import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, collectionPageSchema } from '@/lib/seo';
import { getSeoCommercialPages } from '@/lib/seo-store';

export const metadata = buildMetadata({
  title: 'Comprar té de humus de lombriz | Dominio transaccional Biocultor',
  description:
    'Centro transaccional para comprar té de humus de lombriz en España: compra online, abono orgánico líquido, riego por goteo y formatos profesionales.',
  path: '/comprar-te-de-humus-de-lombriz',
  keywords: [
    'comprar té de humus de lombriz',
    'abono orgánico líquido',
    'humus líquido para riego',
    'humus líquido profesional',
  ],
});

export default async function CommercialHubPage() {
  const seoCommercialPages = await getSeoCommercialPages();
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData
        id="commercial-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Comprar té de humus de lombriz', path: '/comprar-te-de-humus-de-lombriz' },
        ])}
      />
      <StructuredData
        id="commercial-collection-schema"
        data={collectionPageSchema({
          name: 'Dominio transaccional Biocultor',
          description: 'Páginas comerciales para capturar intención de compra explícita.',
          path: '/comprar-te-de-humus-de-lombriz',
          items: seoCommercialPages.map((page) => ({
            name: page.title,
            path: `/comprar-te-de-humus-de-lombriz/${page.slug}`,
          })),
        })}
      />

      <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Comprar té de humus de lombriz' }]} />

      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          Dominio transaccional
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-heading font-extrabold tracking-tight">
          Comprar té de humus de lombriz con arquitectura de compra real.
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
          Aquí agrupamos las búsquedas con intención comercial más fuerte: compra directa,
          categoría genérica, riego por goteo y formatos de continuidad.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {seoCommercialPages.map((page) => (
          <Link
            key={page.slug}
            href={`/comprar-te-de-humus-de-lombriz/${page.slug}`}
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
