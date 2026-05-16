export const revalidate = 3600

import Link from 'next/link';
import Image from 'next/image';
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
          <div className="mt-10">
            <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-border/40">
              <img
                src={coverImage}
                alt={dbPost.title}
                className="w-full h-full object-cover"
              />
            </div>
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

  // ── B) Artículo Estático (lib/seo-content.ts) ───────────────────────────
  if (!staticArt) notFound();

  // Imagen final: prioriza la de BD si el post es placeholder pero el usuario cambió la imagen.
  // Si no hay imagen en BD, usa la del objeto estático.
  const finalImage = (isPlaceholder && dbPost?.coverImage) ? dbPost.coverImage : (staticArt.image || '/Logo.svg');

  return (
    <div className="bg-background min-h-screen">
      {/* Premium Header */}
      <header className="relative w-full h-[60vh] md:h-[70vh] flex items-end overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <Image
            src={finalImage}
            alt={staticArt.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-12">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Aprende', href: '/aprende' },
              { label: staticArt.title },
            ]}
          />
          <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/30">
            {staticArt.category}
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-heading font-black text-foreground leading-[1.1] tracking-tight">
            {staticArt.title}
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl">
            {staticArt.excerpt}
          </p>
        </div>
      </header>

      <article className="w-full max-w-5xl mx-auto px-6 py-16 md:py-24">
        <StructuredData id="article-schema" data={articleSchema} />
        <StructuredData id="article-faq-schema" data={faqSchema(staticArt.faq)} />
        <StructuredData
          id="article-breadcrumb-schema"
          data={breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Aprende', path: '/aprende' },
            { name: staticArt.title, path: `/aprende/${staticArt.slug}` },
          ])}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-16">
            {staticArt.sourceNote && (
              <section className="rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
                <h2 className="text-2xl font-heading font-bold tracking-tight text-primary">
                  Fundamento Científico
                </h2>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed italic">
                  "{staticArt.sourceNote}"
                </p>
              </section>
            )}

            <section className="space-y-8">
              <h2 className="text-3xl font-heading font-black tracking-tight">Resumen Ejecutivo</h2>
              <div className="grid gap-4">
                {staticArt.summary.map((point, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-muted/30 p-5 rounded-2xl border border-border/40">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <p className="text-lg text-foreground/80 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </section>

            {staticArt.sections.map((section) => (
              <section key={section.heading} className="space-y-6">
                <h2 className="text-3xl font-heading font-black tracking-tight border-l-4 border-primary pl-6">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  {section.body.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-[2rem] bg-foreground text-background p-10 md:p-14 shadow-2xl shadow-primary/20">
              <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight">
                ¿Buscas resultados profesionales?
              </h2>
              <p className="mt-6 text-xl text-background/80 leading-relaxed font-light">
                Biocultor no es solo información. Es una metodología agronómica completa encapsulada en formatos de 1L a 25L para cubrir desde el autoconsumo hasta el cultivo a escala.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/producto/te-humus-liquido-premium" className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
                  Ver Soluciones Premium
                </Link>
                <Link href="/te-de-humus-de-lombriz" className="px-8 py-4 rounded-2xl font-bold border border-background/20 hover:bg-background/10 transition-colors">
                  Explorar Cultivos
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="sticky top-24 space-y-10">
              <section className="p-8 rounded-3xl border border-border/50 bg-card">
                <h3 className="text-xl font-heading font-bold mb-6">Preguntas Frecuentes</h3>
                <div className="space-y-6">
                  {staticArt.faq.map((item) => (
                    <div key={item.question} className="space-y-2">
                      <h4 className="font-bold text-foreground text-sm">{item.question}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              {staticArt.references && staticArt.references.length > 0 && (
                <section className="p-8 rounded-3xl border border-border/50 bg-muted/20">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Referencias</h3>
                  <div className="space-y-4">
                    {staticArt.references.map((ref, idx) => (
                      <div key={idx} className="text-xs">
                        <p className="font-semibold text-foreground/80 leading-tight">{ref.title}</p>
                        <p className="text-muted-foreground mt-1">{ref.authority} · {ref.year}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
  );
}
