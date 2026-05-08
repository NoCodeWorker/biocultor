export const revalidate = 3600

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import MarkdownContent from '@/components/MarkdownContent';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';
import { getSeoArticles, getSeoArticlesOrtiga } from '@/lib/seo-store';
import prisma from '@/lib/db';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getAllStaticArticles() {
  const [base, ortiga] = await Promise.all([getSeoArticles(), getSeoArticlesOrtiga()]);
  return [...base, ...ortiga];
}

// ---------------------------------------------------------------------------
// Static params — resiliente a BD con schema desactualizado
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const staticArticles = await getAllStaticArticles();
  try {
    const dbPosts = await prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    const slugs = new Set([
      ...staticArticles.map((a) => a.slug),
      ...dbPosts.map((p) => p.slug),
    ]);
    return Array.from(slugs).map((slug) => ({ slug }));
  } catch {
    // BD no disponible o schema desactualizado → solo artículos estáticos
    return staticArticles.map((a) => ({ slug: a.slug }));
  }
}

// ---------------------------------------------------------------------------
// Metadata — BD primero, fallback estático
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let dbPost = null;
  try {
    dbPost = await prisma.post.findUnique({ where: { slug } });
  } catch {
    // BD no disponible o schema desactualizado → fallback estático
  }

  if (dbPost) {
    return buildMetadata({
      title: dbPost.metaTitle ?? dbPost.title,
      description: dbPost.metaDesc ?? dbPost.excerpt,
      path: `/aprende/${slug}`,
      image: dbPost.coverImage ?? undefined,
      keywords: [dbPost.title, dbPost.category, 'biocultor'],
    });
  }

  const staticArticles = await getAllStaticArticles();
  const article = staticArticles.find((e) => e.slug === slug);
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

// ---------------------------------------------------------------------------
// Page — A) Post de BD  B) Artículo estático
// ---------------------------------------------------------------------------

export default async function AprendeArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ── A) Post de base de datos (CRUD desde el admin) ───────────────────────
  let dbPost = null;
  try {
    dbPost = await prisma.post.findUnique({ where: { slug } });
  } catch {
    // BD no disponible o schema desactualizado → fallback estático
  }

  if (dbPost) {
    const coverImage = dbPost.coverImage;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: dbPost.title,
      description: dbPost.metaDesc ?? dbPost.excerpt,
      author: { '@type': 'Organization', name: 'Biocultor' },
      articleSection: dbPost.category,
      image: coverImage,
    };

    return (
      <article className="w-full max-w-5xl mx-auto px-6 py-16 md:py-24">
        <StructuredData id="article-schema" data={articleSchema} />
        <StructuredData
          id="article-breadcrumb-schema"
          data={breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Aprende', path: '/aprende' },
            { name: dbPost.title, path: `/aprende/${dbPost.slug}` },
          ])}
        />

        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Aprende', href: '/aprende' },
            { label: dbPost.title },
          ]}
        />

        {coverImage && (
          <div className="mt-8 w-full aspect-video rounded-[2rem] overflow-hidden border border-border/40">
            <img
              src={coverImage}
              alt={dbPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mt-10 max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
            {dbPost.category}
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-heading font-extrabold tracking-tight">
            {dbPost.title}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            {dbPost.excerpt}
          </p>
        </div>

        <div className="mt-14 max-w-3xl mx-auto">
          <MarkdownContent content={dbPost.content} className="space-y-5" />
        </div>

        <div className="mt-16 max-w-3xl mx-auto rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
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

  // ── B) Artículo estático (seoArticles / seoArticlesOrtiga) ───────────────
  const staticArticles = await getAllStaticArticles();
  const article = staticArticles.find((entry) => entry.slug === slug);

  if (!article) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    author: { '@type': 'Organization', name: 'Biocultor' },
    articleSection: article.category,
  };

  return (
    <article className="w-full max-w-5xl mx-auto px-6 py-16 md:py-24">
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

      <div className="max-w-3xl mx-auto">
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

      <div className="mt-14 max-w-3xl mx-auto space-y-10">
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

      <section className="mt-10 max-w-3xl mx-auto rounded-[2rem] border border-border/50 bg-background p-8 md:p-10">
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
        <section className="mt-10 max-w-3xl mx-auto rounded-[2rem] border border-border/50 bg-card p-8 md:p-10">
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

      <div className="mt-14 max-w-3xl mx-auto rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
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
