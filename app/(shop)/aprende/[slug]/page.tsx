export const revalidate = 3600;

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Droplets, Leaf } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import MarkdownContent from '@/components/MarkdownContent';
import { absoluteUrl, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
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
  const linkedContent = injectInternalLinks(dbPost.content);
  const cta = getContextualCta(dbPost.title, dbPost.category, dbPost.content);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/aprende/${dbPost.slug}`),
    },
    headline: dbPost.title,
    description: dbPost.metaDesc ?? dbPost.excerpt,
    author: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.defaultUrl },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(siteConfig.brandLogoPng),
      },
    },
    datePublished: dbPost.createdAt.toISOString(),
    dateModified: dbPost.updatedAt.toISOString(),
    articleSection: dbPost.category,
    image: coverImage ? absoluteUrl(coverImage) : undefined,
    inLanguage: siteConfig.locale,
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
              alt={dbPost.coverImageAlt ?? dbPost.title}
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
        <MarkdownContent content={linkedContent} className="space-y-5" />
      </div>

      {/* Caja de Conversión Cruzada (CRO) Contextual Dinámica y Premium */}
      <div className={`mt-20 max-w-3xl mx-auto rounded-[2.5rem] border p-8 md:p-12 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${cta.borderColorClass} ${cta.bgColorClass}`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full pointer-events-none" />
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-sm border border-border/10 shadow-sm bg-background/50">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>{cta.badge}</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground leading-tight">
          {cta.title}
        </h2>
        
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          {cta.desc}
        </p>

        {/* Badges de Valor */}
        <div className="mt-8 grid grid-cols-2 gap-4 pb-8 border-b border-border/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-foreground">Envío gratis &gt;50€ (24/48h)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-foreground">PEAD Protector Anti-Fugas</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link 
            href={cta.btnHref} 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            {cta.btnText}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link 
            href={cta.secondaryHref} 
            className="inline-flex items-center justify-center px-6 py-4 bg-background/50 hover:bg-background/85 border border-border/80 text-foreground font-semibold rounded-2xl transition-colors hover:text-primary animate-pulse"
          >
            {cta.secondaryText}
          </Link>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Helpers para SEO y CRO Dinámico
// ---------------------------------------------------------------------------

function injectInternalLinks(markdown: string): string {
  let result = markdown;
  
  const rules = [
    { text: 'té de humus de lombriz', link: '/producto/te-humus-liquido-premium' },
    { text: 'humus líquido', link: '/producto/te-humus-liquido-premium' },
    { text: 'té de humus', link: '/producto/te-humus-liquido-premium' },
    { text: 'purín de ortiga', link: '/producto/purin-ortiga-concentrado' },
    { text: 'purín de ortigas', link: '/producto/purin-ortiga-concentrado' },
    { text: 'extracto de ortiga', link: '/producto/purin-ortiga-concentrado' },
  ];

  for (const item of rules) {
    const escapedText = item.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?<!\\[)(?<!\\/)\\b${escapedText}\\b(?!\\s*\\])(?!\\s*\\()`, 'i');
    
    if (regex.test(result)) {
      result = result.replace(regex, `[${item.text}](${item.link})`);
    }
  }
  
  return result;
}

interface CtaData {
  title: string;
  desc: string;
  badge: string;
  borderColorClass: string;
  bgColorClass: string;
  btnText: string;
  btnHref: string;
  secondaryText: string;
  secondaryHref: string;
}

function getContextualCta(title: string, category: string, content: string): CtaData {
  const contentLower = (content + ' ' + title + ' ' + category).toLowerCase();
  
  const isOrtiga = contentLower.includes('ortiga') || contentLower.includes('plaga') || contentLower.includes('insecticida') || contentLower.includes('pulgón');
  const isHumus = contentLower.includes('humus') || contentLower.includes('lombriz') || contentLower.includes('lixiviado') || contentLower.includes('resina') || contentLower.includes('floración');

  if (isOrtiga && !isHumus) {
    return {
      title: '¿Necesitas proteger tu cultivo de forma ecológica?',
      desc: 'Combate plagas y hongos de manera preventiva. Nuestro Purín de Ortiga Concentrado es 100% natural, fermentado de forma controlada en Toledo para conservar todos sus nutrientes y compuestos de defensa.',
      badge: 'Escudo Protector Biológico',
      borderColorClass: 'border-emerald-600/20 dark:border-emerald-400/10',
      bgColorClass: 'bg-emerald-600/4 dark:bg-emerald-400/4',
      btnText: 'Ver Purín de Ortiga Concentrado',
      btnHref: '/producto/purin-ortiga-concentrado',
      secondaryText: 'Ver aplicaciones de Ortiga',
      secondaryHref: '/purin-de-ortiga',
    };
  }

  // Por defecto o si es de Humus
  return {
    title: '¿Quieres maximizar la vitalidad y el sabor de tu cosecha?',
    desc: 'Alimenta la microbiología del suelo con nuestro Té de Humus de Lombriz Líquido Premium. Fermentado activado con aireación constante para multiplicar las bacterias benéficas y disparar la absorción de nutrientes.',
    badge: 'Nutrición Activa & Vitalidad',
    borderColorClass: 'border-primary/20 dark:border-primary/10',
    bgColorClass: 'bg-primary/5 dark:bg-primary/4',
    btnText: 'Ver Té de Humus Líquido Premium',
    btnHref: '/producto/te-humus-liquido-premium',
    secondaryText: 'Ver aplicaciones por cultivo',
    secondaryHref: '/te-de-humus-de-lombriz',
  };
}
