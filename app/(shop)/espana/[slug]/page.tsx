export const revalidate = 3600

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';
import { getSeoGeoPages } from '@/lib/seo-store';

export async function generateStaticParams() {
  const seoGeoPages = await getSeoGeoPages();
  return seoGeoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seoGeoPages = await getSeoGeoPages();
  const page = seoGeoPages.find((entry) => entry.slug === slug);

  if (!page) {
    return buildMetadata({
      title: 'Región no encontrada | Biocultor',
      description: 'La página regional solicitada no está disponible.',
      path: '/espana',
    });
  }

  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/espana/${page.slug}`,
    keywords: [page.region, page.title, 'té de humus de lombriz'],
  });
}

export default async function GeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seoGeoPages = await getSeoGeoPages();
  const page = seoGeoPages.find((entry) => entry.slug === slug);

  if (!page) {
    notFound();
  }

  const geoSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.metaDescription,
    areaServed: page.region,
  };

  return (
    <article className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData id="geo-page-schema" data={geoSchema} />
      <StructuredData id="geo-page-faq-schema" data={faqSchema(page.faq)} />
      <StructuredData
        id="geo-page-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'España', path: '/espana' },
          { name: page.region, path: `/espana/${page.slug}` },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'España', href: '/espana' },
          { label: page.region },
        ]}
      />

      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          {page.region}
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-heading font-extrabold tracking-tight">
          {page.title}
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">{page.intro}</p>
      </div>

      <section className="mt-14 max-w-5xl rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
          Respuesta rápida para motores de IA
        </h2>
        <ul className="mt-6 space-y-4 text-lg text-muted-foreground leading-relaxed">
          {page.quickAnswers.map((answer) => (
            <li key={answer}>{answer}</li>
          ))}
        </ul>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 max-w-5xl">
        <section className="rounded-[2rem] border border-border/50 bg-card p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
            Cultivos y usos con mejor encaje
          </h2>
          <ul className="mt-6 space-y-4 text-lg text-muted-foreground leading-relaxed">
            {page.crops.map((crop) => (
              <li key={crop}>{crop}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-[2rem] border border-border/50 bg-card p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
            Lectura territorial y logística
          </h2>
          <ul className="mt-6 space-y-4 text-lg text-muted-foreground leading-relaxed">
            {page.logistics.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

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

      <section className="mt-10 max-w-5xl rounded-[2rem] border border-primary/20 bg-card p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
          Enlaces clave para esta región
        </h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/producto/te-humus-liquido-premium" className="font-semibold text-foreground hover:text-primary transition-colors">
            Ver producto
          </Link>
          <Link href="/comprar-te-de-humus-de-lombriz" className="font-semibold text-foreground hover:text-primary transition-colors">
            Ver compra directa
          </Link>
          <Link href="/te-de-humus-de-lombriz" className="font-semibold text-foreground hover:text-primary transition-colors">
            Ver aplicaciones por cultivo
          </Link>
        </div>
      </section>
    </article>
  );
}
