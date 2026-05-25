import prisma from '@/lib/db';
import Link from 'next/link';
import { PenSquare, Plus, Eye, EyeOff, ArrowRight, FileText, BookOpen } from 'lucide-react';
import { seoArticles, seoArticlesOrtiga } from '@/lib/seo-content';
import { articleToMarkdown, mapCategory } from '@/lib/article-to-md';

export const dynamic = 'force-dynamic';

const CATEGORY_LABELS: Record<string, string> = {
  KNOWLEDGE: 'Guía',
  EVIDENCE: 'Evidencia',
  EDITORIAL: 'Editorial',
  TECHNICAL: 'Técnico',
};

export default async function AdminBlogPage() {
  // --- SYNC: Crea en BD los artículos de seo-content.ts que falten ---
  // Solo INSERT (skip si el slug ya existe). Las ediciones del Dashboard no se tocan.
  const allStatic = [...seoArticles, ...seoArticlesOrtiga];

  const existingInDb = await prisma.post.findMany({ select: { slug: true } });
  const dbSlugs = new Set(existingInDb.map((p) => p.slug));

  const missing = allStatic.filter((a) => !dbSlugs.has(a.slug));

  if (missing.length > 0) {
    await Promise.all(
      missing.map((art) =>
        prisma.post.create({
          data: {
            title:       art.title,
            slug:        art.slug,
            excerpt:     art.excerpt ?? '',
            content:     articleToMarkdown(art),
            category:    mapCategory(art.category),
            metaTitle:   art.metaTitle,
            metaDesc:    art.metaDescription,
            keywords:    [art.title, art.category, 'biocultor'].join(', '),
            coverImage:  art.image ?? null,
            isPublished: true,
            author:      'Equipo Biocultor',
          },
        })
      )
    );
  }
  // -----------------------------------------------------------------------

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const published = posts.filter((p) => p.isPublished).length;
  const drafts = posts.filter((p) => !p.isPublished).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">Contenido</p>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mt-1 flex items-center gap-3">
            <PenSquare className="w-8 h-8 text-primary" />
            Blog
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
            Artículos de la sección{' '}
            <Link href="/aprende" target="_blank" className="text-primary hover:underline font-semibold">
              /aprende
            </Link>
            . Crea, edita y publica desde aquí.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-2xl shadow-lg shadow-primary/20 hover:bg-brand-green-hover transition-colors text-sm w-fit"
        >
          <Plus className="w-4 h-4" /> Nuevo artículo
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border/60 rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</p>
          <p className="text-2xl font-heading font-black text-foreground mt-1.5">{posts.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Publicados</p>
          <p className="text-2xl font-heading font-black text-emerald-700 mt-1.5">{published}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Borradores</p>
          <p className="text-2xl font-heading font-black text-amber-700 mt-1.5">{drafts}</p>
        </div>
      </div>

      {/* Notice about static articles */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-sm">
          <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-foreground">Gestión de Landings Especiales</p>
            <p className="text-muted-foreground mt-0.5">
              La landing "Protocolo Profesional" se edita desde la sección de Landings & SEO para permitir configuraciones avanzadas.
            </p>
          </div>
        </div>
        <Link 
          href="/admin/seo" 
          className="inline-flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-xl text-sm font-bold hover:bg-muted transition-colors"
        >
          Ir al editor de Landings <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="bg-card border border-dashed border-border/60 rounded-2xl p-16 text-center">
          <FileText className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-heading font-bold text-foreground text-lg">Sin artículos en la BD</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Los artículos creados aquí se guardan en Prisma y pueden publicarse en /aprende.
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-xl text-sm"
          >
            <Plus className="w-4 h-4" /> Crear primer artículo
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-border/30">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                >
                  {/* Status dot */}
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      post.isPublished ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-foreground truncate">{post.title}</p>
                      {!post.isPublished && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded shrink-0">
                          BORRADOR
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-muted-foreground">/{post.slug}</span>
                      <span className="text-[10px] font-bold text-muted-foreground/60 bg-muted/40 px-1.5 py-0.5 rounded">
                        {CATEGORY_LABELS[post.category] ?? post.category}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <span className="text-xs text-muted-foreground shrink-0 hidden md:block">
                    {new Date(post.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>

                  {/* Published icon */}
                  <div className="shrink-0">
                    {post.isPublished ? (
                      <Eye className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </div>

                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
