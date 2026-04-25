export const revalidate = 3600

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';
import { getSeoCommercialPages } from '@/lib/seo-store';

export async function generateStaticParams() {
  const seoCommercialPages = await getSeoCommercialPages();
  return seoCommercialPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seoCommercialPages = await getSeoCommercialPages();
  const page = seoCommercialPages.find((entry) => entry.slug === slug);

  if (!page) {
    return buildMetadata({
      title: 'Página comercial no encontrada | Biocultor',
      description: 'La página comercial solicitada no está disponible.',
      path: '/comprar-te-de-humus-de-lombriz',
    });
  }

  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/comprar-te-de-humus-de-lombriz/${page.slug}`,
    keywords: [page.keyword, page.title, 'Biocultor'],
  });
}

export default async function CommercialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seoCommercialPages = await getSeoCommercialPages();
  const page = seoCommercialPages.find((entry) => entry.slug === slug);

  if (!page) {
    notFound();
  }

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.metaDescription,
    about: page.keyword,
  };

  return (
    <article className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData id="commercial-page-schema" data={pageSchema} />
      <StructuredData id="commercial-page-faq-schema" data={faqSchema(page.faq)} />
      <StructuredData
        id="commercial-page-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Comprar té de humus de lombriz', path: '/comprar-te-de-humus-de-lombriz' },
          { name: page.title, path: `/comprar-te-de-humus-de-lombriz/${page.slug}` },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Comprar té de humus de lombriz', href: '/comprar-te-de-humus-de-lombriz' },
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
            Ventajas de nuestra fórmula
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
          Nuestra tienda online te permite comprar el producto directamente y revisar formatos, aplicaciones y condiciones antes de decidir.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/producto/te-humus-liquido-premium" className="font-semibold text-foreground hover:text-primary transition-colors">
            Ver producto
          </Link>
          <Link href="/te-de-humus-de-lombriz" className="font-semibold text-foreground hover:text-primary transition-colors">
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
