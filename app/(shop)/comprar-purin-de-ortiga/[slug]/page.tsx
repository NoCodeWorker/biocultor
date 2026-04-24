export const revalidate = 3600

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';
import { getSeoCommercialPagesOrtiga } from '@/lib/seo-store';

export async function generateStaticParams() {
  const pages = await getSeoCommercialPagesOrtiga();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pages = await getSeoCommercialPagesOrtiga();
  const page = pages.find((entry) => entry.slug === slug);

  if (!page) {
    return buildMetadata({
      title: 'Página comercial no encontrada | Biocultor',
      description: 'La página comercial solicitada no está disponible.',
      path: '/comprar-purin-de-ortiga',
    });
  }

  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/comprar-purin-de-ortiga/${page.slug}`,
    keywords: [page.keyword, page.title, 'Biocultor'],
  });
}

export default async function CommercialOrtigaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pages = await getSeoCommercialPagesOrtiga();
  const page = pages.find((entry) => entry.slug === slug);

  if (!page) notFound();

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.metaDescription,
    about: page.keyword,
  };

  return (
    <article className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData id="commercial-ortiga-page-schema" data={pageSchema} />
      <StructuredData id="commercial-ortiga-page-faq-schema" data={faqSchema(page.faq)} />
      <StructuredData
        id="commercial-ortiga-page-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Comprar purín de ortiga', path: '/comprar-purin-de-ortiga' },
          { name: page.title, path: `/comprar-purin-de-ortiga/${page.slug}` },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Comprar purín de ortiga', href: '/comprar-purin-de-ortiga' },
          { label: page.title },
        ]}
      />

      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          {page.keyword}
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-heading font-extrabold tracking-tight">
          {page.title}
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">{page.intro}</p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2 max-w-5xl">
        <section className="rounded-[2rem] border border-border/50 bg-card p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
            Ventajas de esta propuesta
          </h2>
          <ul className="mt-6 space-y-4 text-lg text-muted-foreground leading-relaxed">
            {page.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-[2rem] border border-border/50 bg-card p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
            Ideal para
          </h2>
          <ul className="mt-6 space-y-4 text-lg text-muted-foreground leading-relaxed">
            {page.bestFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-10 max-w-5xl rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
          De la tierra a tu cultivo, sin intermediarios
        </h2>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Compra directa con revisión previa de formato, uso y condiciones. La tienda explica
          el producto desde el contexto de aplicación, no desde una promesa cerrada.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/producto/purin-ortiga-concentrado"
            className="font-semibold text-foreground hover:text-primary transition-colors"
          >
            Ver producto
          </Link>
          <Link
            href="/purin-de-ortiga"
            className="font-semibold text-foreground hover:text-primary transition-colors"
          >
            Ver aplicaciones por cultivo
          </Link>
        </div>
      </section>

      <section className="mt-10 max-w-5xl rounded-[2rem] border border-border/50 bg-background p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
          Preguntas frecuentes
        </h2>
        <div className="mt-6 space-y-6">
          {page.faq.map((item) => (
            <div key={item.question} className="border-b border-border/50 pb-6 last:border-b-0">
              <h3 className="text-xl font-heading font-semibold">{item.question}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
