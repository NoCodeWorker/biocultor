import prisma from '@/lib/db';
import SeoPagesEditor from '../SeoPagesEditor';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
  const pages = await prisma.seoPage.findMany({
    orderBy: [{ priorityScore: 'desc' }, { kind: 'asc' }, { slug: 'asc' }],
  });

  const priorityCount = pages.filter((page) => page.workflowStatus === 'PRIORITY').length;
  const readyCount = pages.filter((page) => page.workflowStatus === 'READY').length;
  const avgPriority =
    pages.length > 0
      ? Math.round(pages.reduce((acc, page) => acc + page.priorityScore, 0) / pages.length)
      : 0;

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto relative z-10 antialiased">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight">
            Gestión SEO
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-3xl leading-relaxed">
            Editor persistente para los dominios transaccional, informacional, GEO/IA y de
            aplicaciones. Los cambios revalidan las rutas públicas afectadas.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/80">Prioridad</p>
          <p className="mt-3 text-4xl font-heading font-black tracking-tight">{priorityCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">URLs marcadas como ataque inmediato.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/80">Ready</p>
          <p className="mt-3 text-4xl font-heading font-black tracking-tight">{readyCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">URLs publicadas listas para refino.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/80">Media</p>
          <p className="mt-3 text-4xl font-heading font-black tracking-tight">{avgPriority}</p>
          <p className="mt-2 text-sm text-muted-foreground">Prioridad media del inventario SEO.</p>
        </div>
      </div>

      <SeoPagesEditor
        pages={pages.map((page) => ({
          ...page,
          updatedAt: page.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
