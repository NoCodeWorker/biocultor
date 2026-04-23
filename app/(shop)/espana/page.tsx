export const dynamic = 'force-dynamic'

import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, collectionPageSchema } from '@/lib/seo';
import { getSeoGeoPages } from '@/lib/seo-store';

export const metadata = buildMetadata({
  title: 'Té de humus de lombriz en España | Dominio GEO/IA Biocultor',
  description:
    'Cobertura GEO/IA de Biocultor para España: Andalucía, Comunidad Valenciana, Murcia, Cataluña, Castilla-La Mancha y Extremadura.',
  path: '/espana',
  keywords: [
    'té de humus de lombriz españa',
    'comprar humus líquido españa',
    'té de humus andalucía',
    'té de humus comunidad valenciana',
  ],
});

export default async function EspanaHubPage() {
  const seoGeoPages = await getSeoGeoPages();
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData
        id="espana-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'España', path: '/espana' },
        ])}
      />
      <StructuredData
        id="espana-collection-schema"
        data={collectionPageSchema({
          name: 'Cobertura territorial Biocultor',
          description: 'Páginas GEO/IA de Biocultor para regiones relevantes de España.',
          path: '/espana',
          items: seoGeoPages.map((page) => ({
            name: page.title,
            path: `/espana/${page.slug}`,
          })),
        })}
      />

      <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'España' }]} />

      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          Dominio GEO/IA
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-heading font-extrabold tracking-tight">
          Té de humus de lombriz para toda España, con contexto regional útil.
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
          Esta capa territorial no está hecha para repetir ciudades: está construida para mezclar
          región, cultivo, logística y respuestas breves que los motores de IA pueden reutilizar.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {seoGeoPages.map((page) => (
          <Link
            key={page.slug}
            href={`/espana/${page.slug}`}
            className="rounded-[2rem] border border-border/50 bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
              {page.region}
            </p>
            <h2 className="mt-4 text-2xl font-heading font-bold">{page.title}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{page.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {page.crops.slice(0, 2).map((crop) => (
                <span key={crop} className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-foreground">
                  {crop}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
