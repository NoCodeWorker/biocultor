import prisma from '@/lib/db';
import SeoPagesEditor from '../SeoPagesEditor';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
  // --- SYNC LANDINGS ---
  const landingSlug = 'protocolo-cultivo-biologico-profesional';
  const existingLanding = await prisma.seoPage.findUnique({
    where: { slug: landingSlug }
  });

  if (!existingLanding) {
    await prisma.seoPage.create({
      data: {
        kind: 'LANDING',
        slug: landingSlug,
        title: 'Protocolo de Cultivo Biológico Profesional',
        metaTitle: 'Protocolo de Cultivo Biológico Profesional | Biocultor',
        metaDescription: 'La guía definitiva paso a paso para maximizar biomasa, cannabinoides y prevenir patógenos en el cultivo de cannabis mediante Té de Humus y Purín de Ortiga.',
        workflowStatus: 'READY',
        priorityScore: 90,
        payloadJson: JSON.stringify({
          heroImage: '/10 litros.jpg',
          section1Image: '/5 litros.jpg',
          section2Image: '/1 litro.jpg',
          section3Image: '/10 litros.jpg'
        }),
      }
    });
  }
  // ----------------------

  const [pages, posts] = await Promise.all([
    prisma.seoPage.findMany({
      orderBy: [{ priorityScore: 'desc' }, { kind: 'asc' }, { slug: 'asc' }],
    }),
    prisma.post.findMany({
      select: { slug: true, coverImage: true },
    }),
  ]);

  const postImageMap = new Map(posts.map((p) => [p.slug, p.coverImage]));

  const enrichedPages = pages.map((page) => ({
    ...page,
    updatedAt: page.updatedAt.toISOString(),
    // Fallback a la imagen del post si la de SEO está vacía
    image: page.image || postImageMap.get(page.slug) || null,
  }));

  const priorityCount = enrichedPages.filter((page) => page.workflowStatus === 'PRIORITY').length;
  const readyCount = enrichedPages.filter((page) => page.workflowStatus === 'READY').length;
  const avgPriority =
    enrichedPages.length > 0
      ? Math.round(
          enrichedPages.reduce((acc, page) => acc + page.priorityScore, 0) / enrichedPages.length
        )
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

      <SeoPagesEditor pages={enrichedPages} />
    </div>
  );
}
