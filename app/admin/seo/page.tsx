import prisma from "@/lib/db"
import SeoPagesEditor from "../SeoPagesEditor"
import { syncDashboardSeoPages } from "@/lib/admin/editorial-dashboard-sync"
import { getContentIntelligenceSummary } from "@/lib/admin/content-intelligence"
import GrowthIntelligencePanel from "@/components/admin/GrowthIntelligencePanel"

export const dynamic = "force-dynamic"

export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams?: Promise<{ kind?: string; q?: string; open?: string }>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  await syncDashboardSeoPages()

  const [pages, posts, intelligence] = await Promise.all([
    prisma.seoPage.findMany({
      orderBy: [{ priorityScore: "desc" }, { kind: "asc" }, { slug: "asc" }],
    }),
    prisma.post.findMany({
      select: { slug: true, coverImage: true },
    }),
    getContentIntelligenceSummary(),
  ])

  const postImageMap = new Map(posts.map((p) => [p.slug, p.coverImage]))

  const enrichedPages = pages.map((page) => ({
    ...page,
    updatedAt: page.updatedAt.toISOString(),
    // Fallback a la imagen del post si la de SEO está vacía
    image: page.image || postImageMap.get(page.slug) || null,
  }))

  const priorityCount = enrichedPages.filter(
    (page) => page.workflowStatus === "PRIORITY"
  ).length
  const readyCount = enrichedPages.filter(
    (page) => page.workflowStatus === "READY"
  ).length
  const landingAndServiceCount = enrichedPages.filter((page) =>
    ["LANDING", "SERVICIO"].includes(page.kind)
  ).length
  const missingImageCount = enrichedPages.filter(
    (page) => ["LANDING", "SERVICIO"].includes(page.kind) && !page.image
  ).length
  return (
    <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 antialiased">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-heading text-4xl font-black tracking-tight text-foreground md:text-5xl">
            Gestión SEO
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Editor persistente para los dominios transaccional, informacional,
            GEO/IA y de aplicaciones. Los cambios revalidan las rutas públicas
            afectadas.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold tracking-[0.25em] text-primary/80 uppercase">
            Total SEO
          </p>
          <p className="mt-3 font-heading text-4xl font-black tracking-tight">
            {enrichedPages.length}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Inventario editorial persistente.
          </p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold tracking-[0.25em] text-primary/80 uppercase">
            Landings
          </p>
          <p className="mt-3 font-heading text-4xl font-black tracking-tight">
            {landingAndServiceCount}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Landings y servicios con edición visual.
          </p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold tracking-[0.25em] text-primary/80 uppercase">
            Prioridad
          </p>
          <p className="mt-3 font-heading text-4xl font-black tracking-tight">
            {priorityCount}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            URLs marcadas como ataque inmediato.
          </p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold tracking-[0.25em] text-primary/80 uppercase">
            Ready
          </p>
          <p className="mt-3 font-heading text-4xl font-black tracking-tight">
            {readyCount}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            URLs publicadas listas para refino.
          </p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold tracking-[0.25em] text-primary/80 uppercase">
            Sin imagen
          </p>
          <p className="mt-3 font-heading text-4xl font-black tracking-tight">
            {missingImageCount}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Landings/servicios pendientes de visual.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-border/50 bg-card p-6 shadow-xl shadow-black/5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-black tracking-tight">
              CRO / SEO / GEO / AIO
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Auditoría calculada desde contenido editable, imágenes asignadas y
              payloads semánticos.
            </p>
          </div>
          <p className="text-xs font-semibold text-muted-foreground">
            {intelligence.totals.editable} piezas editables
          </p>
        </div>

        <div className="mt-5">
          <GrowthIntelligencePanel intelligence={intelligence} />
        </div>
      </div>

      <SeoPagesEditor
        pages={enrichedPages}
        initialKind={resolvedSearchParams.kind}
        initialQuery={resolvedSearchParams.q}
        initialOpenSlug={resolvedSearchParams.open}
      />
    </div>
  )
}
