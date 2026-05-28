export const revalidate = 3600;

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import MarkdownContent from '@/components/MarkdownContent';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import prisma from '@/lib/db';
import { alertCritical, alertWarning } from '@/lib/alert';

// ---------------------------------------------------------------------------
// Static params — Leído atómicamente de la Base de Datos
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  try {
    const dbPosts = await prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return dbPosts.map((p) => ({ slug: p.slug }));
  } catch (err) {
    alertWarning('ArticlePage.generateStaticParams', 'No se pudieron generar rutas dinámicas del blog', { error: String(err) });
    return [];
  }
}

// ---------------------------------------------------------------------------
// Metadata — Carga dinámica desde la tabla Post de PostgreSQL
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Redirigir a /solucion-humus/[slug] si es una landing page de tipo LANDING, cumpliendo el roadmap oficial
  try {
    const isLanding = await prisma.seoPage.findFirst({
      where: { slug, kind: 'LANDING', isPublished: true },
      select: { id: true },
    });
    if (isLanding) {
      redirect(`/solucion-humus/${slug}`);
    }
  } catch (err) {
    // Silencioso
  }

  let dbPost = null;
  try {
    dbPost = await prisma.post.findUnique({ where: { slug } });
  } catch (err) {
    alertCritical('ArticlePage.generateMetadata', err, { extra: { slug } });
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

  return buildMetadata({
    title: 'Guía no encontrada | Biocultor',
    description: 'La guía solicitada no está disponible o ha sido trasladada.',
    path: '/aprende',
  });
}

// ---------------------------------------------------------------------------
// Page Component — Carga 100% en Base de Datos de producción
// ---------------------------------------------------------------------------

export default async function AprendeArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Redirigir a /solucion-humus/[slug] si es una landing page de tipo LANDING, cumpliendo el roadmap oficial
  try {
    const isLanding = await prisma.seoPage.findFirst({
      where: { slug, kind: 'LANDING', isPublished: true },
      select: { id: true },
    });
    if (isLanding) {
      redirect(`/solucion-humus/${slug}`);
    }
  } catch (err) {
    // Silencioso
  }

  let dbPost = null;
  try {
    dbPost = await prisma.post.findUnique({ where: { slug } });
  } catch (err) {
    alertWarning('ArticlePage.render', 'DB no disponible o error al leer post', { slug });
  }

  // Si no existe el post en la base de datos o es un placeholder no editado, lanzamos 404
  if (!dbPost || dbPost.content === 'PLACEHOLDER') {
    notFound();
  }

  const coverImage = dbPost.coverImage;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: dbPost.title,
    description: dbPost.metaDesc ?? dbPost.excerpt,
    author: { '@type': 'Organization', name: 'Biocultor' },
    articleSection: dbPost.category,
    image: coverImage ?? undefined,
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

      {/* Caja de Conversión Cruzada (CRO) Contextual */}
      <div className="mt-16 max-w-3xl mx-auto rounded-[2rem] border border-primary/20 bg-primary/5 p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
          ¿Quieres pasar de la guía a la compra?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Biocultor conecta contenido editorial con intención comercial real: formatos, envío rápido
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
