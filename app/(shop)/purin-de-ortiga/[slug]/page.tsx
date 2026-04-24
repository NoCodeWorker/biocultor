export const revalidate = 3600

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';
import { getSeoSolutionsOrtiga } from '@/lib/seo-store';

export async function generateStaticParams() {
  const solutions = await getSeoSolutionsOrtiga();
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solutions = await getSeoSolutionsOrtiga();
  const solution = solutions.find((entry) => entry.slug === slug);

  if (!solution) {
    return buildMetadata({
      title: 'Aplicación no encontrada | Biocultor',
      description: 'La aplicación solicitada no está disponible.',
      path: '/purin-de-ortiga',
    });
  }

  return buildMetadata({
    title: solution.metaTitle,
    description: solution.metaDescription,
    path: `/purin-de-ortiga/${solution.slug}`,
    keywords: [solution.title, solution.audience, 'purín de ortiga'],
  });
}

export default async function SeoSolutionOrtigaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solutions = await getSeoSolutionsOrtiga();
  const solution = solutions.find((entry) => entry.slug === slug);

  if (!solution) notFound();

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: solution.title,
    description: solution.metaDescription,
    areaServed: { '@type': 'Country', name: 'España' },
    provider: { '@type': 'Organization', name: 'Biocultor' },
  };

  return (
    <article className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData id="solution-ortiga-schema" data={serviceSchema} />
      <StructuredData id="solution-ortiga-faq-schema" data={faqSchema(solution.faq)} />
      <StructuredData
        id="solution-ortiga-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Purín de ortiga', path: '/purin-de-ortiga' },
          { name: solution.title, path: `/purin-de-ortiga/${solution.slug}` },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Purín de ortiga', href: '/purin-de-ortiga' },
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
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">{solution.intro}</p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2 max-w-5xl">
        <section className="rounded-[2rem] border border-border/50 bg-card p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Beneficios para tu cultivo
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
          Los formatos pequeños encajan en prueba y uso doméstico; los formatos de continuidad
          tienen más sentido cuando ya hay una rutina orgánica consolidada.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/producto/purin-ortiga-concentrado"
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-brand-green-hover transition-colors shadow-lg shadow-primary/20"
          >
            Ver formatos y precios
          </Link>
          <Link
            href="/envios"
            className="px-8 py-4 bg-background border-2 border-border/50 text-foreground font-bold rounded-xl hover:border-primary/30 transition-colors"
          >
            Condiciones de envío
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
