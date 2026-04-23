export const dynamic = 'force-dynamic'

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';
import { getSeoSolutions } from '@/lib/seo-store';

export async function generateStaticParams() {
  const seoSolutions = await getSeoSolutions();
  return seoSolutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seoSolutions = await getSeoSolutions();
  const solution = seoSolutions.find((entry) => entry.slug === slug);

  if (!solution) {
    return buildMetadata({
      title: 'Aplicación no encontrada | Biocultor',
      description: 'La aplicación solicitada no está disponible.',
      path: '/te-de-humus-de-lombriz',
    });
  }

  return buildMetadata({
    title: solution.metaTitle,
    description: solution.metaDescription,
    path: `/te-de-humus-de-lombriz/${solution.slug}`,
    keywords: [solution.title, solution.audience, 'comprar té de humus de lombriz'],
  });
}

export default async function SeoSolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seoSolutions = await getSeoSolutions();
  const solution = seoSolutions.find((entry) => entry.slug === slug);

  if (!solution) {
    notFound();
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: solution.title,
    description: solution.metaDescription,
    areaServed: {
      '@type': 'Country',
      name: 'España',
    },
    provider: {
      '@type': 'Organization',
      name: 'Biocultor',
    },
  };

  return (
    <article className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData id="solution-schema" data={serviceSchema} />
      <StructuredData id="solution-faq-schema" data={faqSchema(solution.faq)} />
      <StructuredData
        id="solution-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Té de humus de lombriz', path: '/te-de-humus-de-lombriz' },
          { name: solution.title, path: `/te-de-humus-de-lombriz/${solution.slug}` },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Té de humus de lombriz', href: '/te-de-humus-de-lombriz' },
          { label: solution.title },
        ]}
      />

      <div className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          {solution.audience}
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-heading font-extrabold tracking-tight">
          {solution.title}
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
          {solution.intro}
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2 max-w-5xl">
        <section className="rounded-[2rem] border border-border/50 bg-card p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Beneficios para tu Cultivo
          </h2>
          <ul className="mt-6 space-y-4 text-lg text-muted-foreground leading-relaxed">
            {solution.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-[2rem] border border-border/50 bg-card p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
            Escenarios de aplicación
          </h2>
          <ul className="mt-6 space-y-4 text-lg text-muted-foreground leading-relaxed">
            {solution.applications.map((application) => (
              <li key={application}>{application}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-10 max-w-5xl rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
          Encuentra el formato adecuado para este uso
        </h2>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Descubre el formato que mejor encaja con tu escala de uso, tipo de cultivo y forma de aplicación.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link 
            href="/producto/te-humus-liquido-premium" 
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-brand-green-hover transition-colors shadow-lg shadow-primary/20"
          >
            Ver Formatos y Precios
          </Link>
          <Link 
            href="/envios" 
            className="px-8 py-4 bg-background border-2 border-border/50 text-foreground font-bold rounded-xl hover:border-primary/30 transition-colors"
          >
            Condiciones de Envío
          </Link>
        </div>
      </section>

      <section className="mt-10 max-w-5xl rounded-[2rem] border border-border/50 bg-background p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
          Preguntas frecuentes
        </h2>
        <div className="mt-6 space-y-6">
          {solution.faq.map((item) => (
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
