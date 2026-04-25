export const revalidate = 3600

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';
import { getSeoArticles, getSeoArticlesOrtiga } from '@/lib/seo-store';

async function getAllArticles() {
  const [base, ortiga] = await Promise.all([getSeoArticles(), getSeoArticlesOrtiga()]);
  return [...base, ...ortiga];
}

export async function generateStaticParams() {
  const seoArticles = await getAllArticles();
  return seoArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seoArticles = await getAllArticles();
  const article = seoArticles.find((entry) => entry.slug === slug);

  if (!article) {
    return buildMetadata({
      title: 'Guía no encontrada | Biocultor',
      description: 'La guía solicitada no está disponible.',
      path: '/aprende',
    });
  }

  return buildMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: `/aprende/${article.slug}`,
    image: article.image,
    keywords: [article.title, article.category, 'té de humus de lombriz'],
  });
}

export default async function AprendeArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seoArticles = await getAllArticles();
  const article = seoArticles.find((entry) => entry.slug === slug);

  if (!article) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    author: {
      '@type': 'Organization',
      name: 'Biocultor',
    },
    articleSection: article.category,
  };

  return (
    <article className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24">
      <StructuredData id="article-schema" data={articleSchema} />
      <StructuredData id="article-faq-schema" data={faqSchema(article.faq)} />
      <StructuredData
        id="article-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Aprende', path: '/aprende' },
          { name: article.title, path: `/aprende/${article.slug}` },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Aprende', href: '/aprende' },
          { label: article.title },
        ]}
      />

      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          {article.category}
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-heading font-extrabold tracking-tight">
          {article.title}
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
          {article.excerpt}
        </p>
      </div>

      <div className="mt-14 max-w-4xl space-y-10">
        {article.sourceNote && (
          <section className="rounded-[2rem] border border-primary/20 bg-background p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
              Fuente base
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              {article.sourceNote}
            </p>
          </section>
        )}

        <section className="rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
            Resumen rápido
          </h2>
          <ul className="mt-5 space-y-3 text-lg text-muted-foreground leading-relaxed">
            {article.summary.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        {article.sections.map((section) => (
          <section key={section.heading} className="rounded-[2rem] border border-border/50 bg-card p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
              {section.heading}
            </h2>
            <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed text-lg">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 max-w-4xl rounded-[2rem] border border-border/50 bg-background p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
          Preguntas frecuentes
        </h2>
        <div className="mt-6 space-y-6">
          {article.faq.map((item) => (
            <div key={item.question} className="border-b border-border/50 pb-6 last:border-b-0">
              <h3 className="text-xl font-heading font-semibold">{item.question}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {article.references && article.references.length > 0 && (
        <section className="mt-10 max-w-4xl rounded-[2rem] border border-border/50 bg-card p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
            Referencias
          </h2>
          <div className="mt-6 space-y-5">
            {article.references.map((reference) => (
              <div key={`${reference.title}-${reference.year}`} className="border-b border-border/40 pb-5 last:border-b-0">
                <p className="text-foreground font-medium leading-relaxed">{reference.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {reference.authority} · {reference.year}
                </p>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex text-sm font-semibold text-primary hover:underline"
                >
                  Ver fuente primaria
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-14 max-w-4xl rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
          ¿Quieres pasar de la guía a la compra?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Biocultor conecta contenido editorial con intención comercial real: formatos, envío
          en España y una ficha de producto diseñada para convertir sin perder rigor.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/producto/te-humus-liquido-premium" className="font-semibold text-foreground hover:text-primary transition-colors">
            Ver producto
          </Link>
          <Link href="/te-de-humus-de-lombriz" className="font-semibold text-foreground hover:text-primary transition-colors">
            Ver aplicaciones por cultivo
          </Link>
        </div>
      </div>
    </article>
  );
}
