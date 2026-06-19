import prisma from '@/lib/db';
import Link from 'next/link';
import { PenSquare, Plus, Eye, EyeOff, ArrowRight, FileText, BookOpen } from 'lucide-react';
import {
  syncDashboardBlogPosts,
  syncDashboardSeoPages,
} from '@/lib/admin/editorial-dashboard-sync';

export const dynamic = 'force-dynamic';

const CATEGORY_LABELS: Record<string, string> = {
  KNOWLEDGE: 'Guía',
  EVIDENCE: 'Evidencia',
  EDITORIAL: 'Editorial',
  TECHNICAL: 'Técnico',
};

export default async function AdminBlogPage() {
  await Promise.all([syncDashboardBlogPosts(), syncDashboardSeoPages()]);

  const [posts, editableSeoPages] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.seoPage.findMany({
      where: { kind: { in: ['LANDING', 'SERVICIO'] } },
      select: {
        id: true,
        kind: true,
        slug: true,
        title: true,
        label: true,
        image: true,
        updatedAt: true,
        priorityScore: true,
        isPublished: true,
      },
      orderBy: [{ kind: 'desc' }, { priorityScore: 'desc' }, { slug: 'asc' }],
    }),
  ]);

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
            <p className="font-bold text-foreground">Gestión de Landings y Servicios</p>
            <p className="text-muted-foreground mt-0.5">
              Los artículos viven en Blog; las landings y servicios tienen editor propio para imágenes, SEO y payload visual.
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

      {/* Editable landings and services */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border/40 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
              Landings y servicios editables
            </p>
            <h2 className="mt-1 font-heading text-xl font-black tracking-tight text-foreground">
              {editableSeoPages.length} páginas con edición de imágenes
            </h2>
          </div>
          <Link
            href="/admin/servicios"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-muted"
          >
            Abrir gestor de servicios <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {editableSeoPages.length === 0 ? (
          <div className="px-5 py-6 text-sm text-muted-foreground">
            No hay landings ni servicios sincronizados en la base de datos.
          </div>
        ) : (
          <ul className="divide-y divide-border/30">
            {editableSeoPages.map((page) => {
              const editHref =
                page.kind === 'SERVICIO'
                  ? `/admin/servicios?slug=${page.slug}`
                  : `/admin/seo?kind=${page.kind}&q=${page.slug}&open=${page.slug}`;
              const publicHref =
                page.kind === 'SERVICIO'
                  ? `/servicios/${page.slug}`
                  : page.slug === 'protocolo-cultivo-biologico-profesional'
                  ? '/aprende/protocolo-cultivo-biologico-profesional'
                  : `/solucion-humus/${page.slug}`;

              return (
                <li key={page.id}>
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        page.isPublished ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {page.title}
                        </p>
                        <span className="shrink-0 rounded bg-muted/50 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                          {page.kind === 'SERVICIO' ? 'SERVICIO' : 'LANDING'}
                        </span>
                        {page.image ? (
                          <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                            IMAGEN
                          </span>
                        ) : (
                          <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                            SIN IMAGEN
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          /{page.slug}
                        </span>
                        {page.label && (
                          <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground/70">
                            {page.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="hidden shrink-0 text-xs text-muted-foreground md:block">
                      {new Date(page.updatedAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <Link
                      href={publicHref}
                      target="_blank"
                      className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold text-primary hover:bg-primary/10"
                    >
                      Ver
                    </Link>
                    <Link
                      href={editHref}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/10 transition-colors hover:bg-brand-green-hover"
                    >
                      Editar imágenes <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
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
