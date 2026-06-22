import Link from "next/link"
import {
  Euro,
  ShoppingBag,
  Users,
  Receipt,
  RefreshCw,
  Boxes,
  TrendingUp,
  Trophy,
  Map,
  Clock,
  ArrowRight,
  AlertTriangle,
  Activity,
  CheckCircle2,
  ExternalLink,
  FileText,
  Layers,
  SearchCheck,
} from "lucide-react"
import {
  getDashboardKpis,
  getRevenueSeries,
  getTopVariants,
  getLatestOrders,
  getStockAlerts,
  getGeoDistribution,
  type DashboardKpis,
} from "@/lib/admin/metrics"
import KpiTile from "@/components/admin/KpiTile"
import Panel from "@/components/admin/Panel"
import StatusBadge from "@/components/admin/StatusBadge"
import RevenueChart from "@/components/admin/charts/RevenueChart"
import TopVariantsChart from "@/components/admin/charts/TopVariantsChart"
import GrowthIntelligencePanel from "@/components/admin/GrowthIntelligencePanel"
import {
  syncDashboardBlogPosts,
  syncDashboardSeoPages,
} from "@/lib/admin/editorial-dashboard-sync"
import { getContentIntelligenceSummary } from "@/lib/admin/content-intelligence"

export const dynamic = "force-dynamic"

const PERIOD_DAYS = 30

export default async function AdminOverviewPage() {
  const [kpis, revenueSeries, topVariants, latest, lowStock, geo, editorial] =
    await Promise.all([
      getDashboardKpis(PERIOD_DAYS),
      getRevenueSeries(PERIOD_DAYS),
      getTopVariants(PERIOD_DAYS, 6),
      getLatestOrders(8),
      getStockAlerts(10),
      getGeoDistribution(90, 8),
      getEditorialInventory(),
    ])
  const operatingBrief = buildOperatingBrief({ kpis, lowStock, editorial })

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[1.6rem] border border-border/60 bg-[linear-gradient(135deg,var(--card)_0%,var(--brand-green-light)_58%,var(--brand-brown-light)_100%)] p-5 md:p-7">
        <div className="absolute top-0 right-0 h-44 w-44 translate-x-10 -translate-y-12 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-end">
          <div>
            <p className="text-[10px] font-black tracking-[0.22em] text-primary/80 uppercase">
              Centro de mando
            </p>
            <h1 className="mt-2 max-w-4xl font-heading text-3xl font-black tracking-tight text-balance text-foreground md:text-5xl">
              Administración Biocultor
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Ventas, catálogo, contenido orgánico y operaciones en una vista
              priorizada. Comparativa de {PERIOD_DAYS} días contra el período
              anterior.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href={operatingBrief.primaryAction.href}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-black text-background transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              >
                {operatingBrief.primaryAction.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/analytics"
                className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              >
                Ver inteligencia
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {operatingBrief.statusCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/70 bg-card/75 p-4 shadow-sm shadow-primary/5 backdrop-blur"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                        {card.label}
                      </p>
                      <p className="mt-1 font-heading text-xl font-black text-foreground">
                        {card.value}
                      </p>
                    </div>
                    <span className={card.tone}>
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {card.detail}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiTile
          label="Ingresos"
          value={`€${kpis.revenue.value.toFixed(2)}`}
          pct={kpis.revenue.pct}
          icon={Euro}
          hint={`vs €${kpis.revenue.previous.toFixed(0)} anterior`}
        />
        <KpiTile
          label="Pedidos"
          value={kpis.orders.value.toString()}
          pct={kpis.orders.pct}
          icon={ShoppingBag}
        />
        <KpiTile
          label="AOV"
          value={`€${kpis.aov.value.toFixed(2)}`}
          pct={kpis.aov.pct}
          icon={Receipt}
        />
        <KpiTile
          label="Clientes nuevos"
          value={kpis.newCustomers.value.toString()}
          pct={kpis.newCustomers.pct}
          icon={Users}
        />
        <KpiTile
          label="Tasa refund"
          value={`${kpis.refundRate.value.toFixed(1)}%`}
          pct={kpis.refundRate.pct}
          icon={RefreshCw}
          inverted
        />
        <KpiTile
          label="Stock crítico"
          value={kpis.lowStockCount.toString()}
          pct={null}
          icon={Boxes}
          hint={kpis.lowStockCount > 0 ? "<10 unidades" : "Todo OK"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel
          title="Prioridades operativas"
          icon={Activity}
          hint="Ordenadas por riesgo para proteger caja, contenido e inventario"
          action={{
            href: operatingBrief.primaryAction.href,
            label: operatingBrief.primaryAction.shortLabel,
          }}
          bodyClassName="px-0 pb-0"
        >
          <div className="divide-y divide-border/50">
            {operatingBrief.priorities.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-muted/35 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span className={item.iconClass}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black text-foreground">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {item.detail}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-primary">
                    Resolver <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </Panel>

        <Panel
          title="Pulso comercial"
          icon={ShoppingBag}
          hint="Lectura ejecutiva del período"
        >
          <div className="grid gap-3">
            <PulseLine
              label="Ingresos netos"
              value={formatEuro(kpis.revenue.value)}
            />
            <PulseLine
              label="Pedido medio"
              value={formatEuro(kpis.aov.value)}
            />
            <PulseLine label="Pedidos pagados" value={`${kpis.orders.value}`} />
            <PulseLine
              label="Producto líder"
              value={topVariants[0] ? topVariants[0].productName : "Sin ventas"}
              subdued={!topVariants[0]}
            />
          </div>
        </Panel>
      </div>

      {/* Inventario editorial */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel
          title="Inventario editorial"
          icon={FileText}
          hint="Contenido editable sincronizado con el dashboard"
          action={{ href: "/admin/seo", label: "Landings & SEO" }}
          className="lg:col-span-2"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/50 bg-background p-5">
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Artículos
              </p>
              <p className="mt-2 font-heading text-3xl font-black">
                {editorial.posts}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Se editan en Blog.
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-background p-5">
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Landings / servicios / GEO
              </p>
              <p className="mt-2 font-heading text-3xl font-black">
                {editorial.editableSeoPages}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Se editan en Landings & SEO.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50 p-5">
              <p className="text-[10px] font-bold tracking-widest text-emerald-800/70 uppercase">
                Total editable
              </p>
              <p className="mt-2 font-heading text-3xl font-black text-emerald-700">
                {editorial.totalEditable}
              </p>
              <p className="mt-1 text-xs text-emerald-800/70">
                Inventario editorial real.
              </p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Acceso editorial"
          icon={Layers}
          hint="Cada tipo en su editor"
          bodyClassName="p-5"
        >
          <div className="flex flex-col gap-2">
            <QuickLink
              href="/admin/blog"
              label="Editar artículos"
              external={false}
            />
            <QuickLink
              href="/admin/seo?kind=LANDING"
              label="Editar landings"
              external={false}
            />
            <QuickLink
              href="/admin/servicios"
              label="Editar servicios"
              external={false}
            />
          </div>
        </Panel>
      </div>

      {/* Auditoría CRO / SEO / GEO / AIO */}
      <Panel
        title="Auditoría de crecimiento orgánico"
        icon={SearchCheck}
        hint="CRO, SEO, GEO, AIO y contrato visual calculados desde el inventario editable"
        action={{ href: "/admin/seo", label: "Abrir editor" }}
      >
        <GrowthIntelligencePanel
          intelligence={editorial.intelligence}
          showOperationalDetails
        />
      </Panel>

      {/* Fila principal: chart grande + top productos */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel
            title={`Ingresos diarios — últimos ${PERIOD_DAYS} días`}
            icon={TrendingUp}
            hint="Línea continua: período actual. Punteada: período anterior."
          >
            <RevenueChart data={revenueSeries} />
          </Panel>
        </div>
        <Panel
          title="Top productos por ingresos"
          icon={Trophy}
          hint={`Últimos ${PERIOD_DAYS} días`}
          action={{ href: "/admin/products", label: "Catálogo" }}
        >
          <TopVariantsChart data={topVariants} />
        </Panel>
      </div>

      {/* Fila secundaria: pedidos + stock + geo */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Latest orders */}
        <Panel
          title="Últimos pedidos"
          icon={Clock}
          action={{ href: "/admin/orders", label: "Ver todos" }}
          className="lg:col-span-2"
          bodyClassName="px-0 pb-0"
        >
          {latest.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              Aún no hay pedidos.
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {latest.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.orderNumber}`}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40"
                  >
                    <span className="shrink-0 rounded bg-secondary px-2 py-1 font-mono text-xs font-bold text-secondary-foreground">
                      {o.orderNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {o.customer.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.items.length} ud · {o.customer.email}
                      </p>
                    </div>
                    <StatusBadge status={o.status} />
                    <span className="w-20 text-right font-heading text-sm font-bold text-foreground">
                      €{o.totalAmount.toFixed(2)}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Stock alerts */}
        <Panel
          title="Stock crítico"
          icon={Boxes}
          hint="Variantes con menos de 10 unidades"
          action={{ href: "/admin/products", label: "Catálogo" }}
          bodyClassName="px-0 pb-0"
        >
          {lowStock.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              Sin alertas de stock.
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {lowStock.slice(0, 8).map((v) => (
                <li key={v.id}>
                  <Link
                    href={`/admin/products/${v.productId}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {v.size} · {v.product.name}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {v.sku}
                      </p>
                    </div>
                    <span
                      className={
                        v.stock === 0
                          ? "rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-800 ring-1 ring-red-300"
                          : "rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-300"
                      }
                    >
                      {v.stock} ud
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Geo + accesos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel
          title="Top provincias"
          icon={Map}
          hint="Ingresos últimos 90 días por código postal de envío"
          className="lg:col-span-2"
          bodyClassName="px-0 pb-0"
        >
          {geo.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              Sin pedidos con código postal en el período.
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {geo.map((g) => {
                const max = geo[0]?.revenue || 1
                const pct = (g.revenue / max) * 100
                return (
                  <li
                    key={g.province}
                    className="flex items-center gap-4 px-5 py-3"
                  >
                    <span className="w-32 truncate text-sm font-semibold text-foreground">
                      {g.province}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-xs text-muted-foreground">
                      {g.orders} ped.
                    </span>
                    <span className="w-20 text-right font-heading text-sm font-bold text-foreground">
                      €{g.revenue.toFixed(0)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        {/* Quick links */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5">
          <h2 className="text-sm font-bold text-foreground">Accesos rápidos</h2>
          <p className="text-xs text-muted-foreground">
            Funciones más usadas o que estarán disponibles pronto.
          </p>
          <div className="mt-2 flex flex-col gap-2">
            <QuickLink
              href="/admin/seo"
              label="Editor SEO Editorial"
              external={false}
            />
            <QuickLink
              href="/admin/servicios"
              label="Gestión de Servicios"
              external={false}
            />
            <QuickLink
              href="/admin/analytics"
              label="Inteligencia detallada"
              external={false}
            />
            <QuickLink href="/" label="Ver tienda pública" external />
            <QuickLink
              href="https://dashboard.stripe.com"
              label="Dashboard de Stripe"
              external
            />
            <QuickLink
              href="https://pro.packlink.es"
              label="Dashboard de Packlink PRO"
              external
            />
          </div>
        </div>
      </div>
    </div>
  )
}

async function getEditorialInventory() {
  await Promise.all([syncDashboardBlogPosts(), syncDashboardSeoPages()])

  const intelligence = await getContentIntelligenceSummary()

  return {
    posts: intelligence.totals.posts,
    editableSeoPages: intelligence.totals.seoPages,
    totalEditable: intelligence.totals.editable,
    intelligence,
  }
}

type EditorialInventory = Awaited<ReturnType<typeof getEditorialInventory>>
type StockAlerts = Awaited<ReturnType<typeof getStockAlerts>>

function buildOperatingBrief({
  kpis,
  lowStock,
  editorial,
}: {
  kpis: DashboardKpis
  lowStock: StockAlerts
  editorial: EditorialInventory
}) {
  const contentIssues = editorial.intelligence.priorityActions.length
  const revenueDown = (kpis.revenue.pct ?? 0) < 0
  const refundRisk =
    kpis.refundRate.value >= 3 || (kpis.refundRate.pct ?? 0) > 0
  const stockRisk = lowStock.length > 0

  const priorities = [
    ...(stockRisk
      ? [
          {
            label: `${lowStock.length} variantes con stock crítico`,
            detail:
              "Reposición o retirada comercial antes de escalar tráfico a producto.",
            href: "/admin/inventory",
            icon: Boxes,
            iconClass:
              "flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-700",
          },
        ]
      : []),
    ...(contentIssues > 0
      ? [
          {
            label: `${contentIssues} acciones editoriales pendientes`,
            detail:
              "Corrige primero visual, SEO, GEO o AIO en páginas editables con impacto orgánico.",
            href: "/admin/seo",
            icon: SearchCheck,
            iconClass:
              "flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700",
          },
        ]
      : []),
    ...(revenueDown
      ? [
          {
            label: `Ingresos ${Math.abs(kpis.revenue.pct ?? 0).toFixed(1)}% por debajo`,
            detail:
              "Revisa conversión, mix de producto y fuentes de demanda antes de ampliar campañas.",
            href: "/admin/analytics",
            icon: TrendingUp,
            iconClass:
              "flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700",
          },
        ]
      : []),
    ...(refundRisk
      ? [
          {
            label: `Tasa de refund en ${kpis.refundRate.value.toFixed(1)}%`,
            detail:
              "Audita pedidos, promesas comerciales, incidencias logísticas y causas de devolución.",
            href: "/admin/refunds",
            icon: RefreshCw,
            iconClass:
              "flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-700",
          },
        ]
      : []),
  ]

  if (priorities.length === 0) {
    priorities.push({
      label: "No hay bloqueos críticos detectados",
      detail:
        "Mantén la revisión de pedidos, contenido y stock para evitar deuda operativa.",
      href: "/admin/orders",
      icon: CheckCircle2,
      iconClass:
        "flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700",
    })
  }

  const primaryAction = priorities[0].href.includes("inventory")
    ? {
        href: "/admin/inventory",
        label: "Revisar inventario",
        shortLabel: "Inventario",
      }
    : priorities[0].href.includes("seo")
      ? {
          href: "/admin/seo",
          label: "Resolver cola editorial",
          shortLabel: "Abrir SEO",
        }
      : priorities[0].href.includes("refunds")
        ? {
            href: "/admin/refunds",
            label: "Auditar devoluciones",
            shortLabel: "Devoluciones",
          }
        : {
            href: "/admin/orders",
            label: "Revisar pedidos",
            shortLabel: "Pedidos",
          }

  return {
    primaryAction,
    priorities: priorities.slice(0, 4),
    statusCards: [
      {
        label: "Riesgo operativo",
        value: stockRisk || refundRisk ? "Atención" : "Controlado",
        detail: stockRisk
          ? "Hay variantes que pueden frenar ventas o generar promesas incumplidas."
          : "Sin señales críticas de inventario o devoluciones en la vista actual.",
        icon: stockRisk || refundRisk ? AlertTriangle : CheckCircle2,
        tone:
          stockRisk || refundRisk
            ? "flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-700"
            : "flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700",
      },
      {
        label: "Crecimiento",
        value: revenueDown ? "Revisar" : "Activo",
        detail: revenueDown
          ? "La comparativa de ingresos exige diagnóstico de conversión y demanda."
          : "Ingresos sin caída detectada frente al período comparable.",
        icon: revenueDown ? AlertTriangle : TrendingUp,
        tone: revenueDown
          ? "flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700"
          : "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary",
      },
      {
        label: "Contenido",
        value: `${editorial.totalEditable}`,
        detail:
          contentIssues > 0
            ? `${contentIssues} acciones priorizadas para proteger SEO, GEO, AIO y visual.`
            : "Inventario editable sin bloqueos críticos calculados.",
        icon: FileText,
        tone:
          contentIssues > 0
            ? "flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700"
            : "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary",
      },
    ],
  }
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

function PulseLine({
  label,
  value,
  subdued = false,
}: {
  label: string
  value: string
  subdued?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/30 px-4 py-3">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <span
        className={
          subdued
            ? "max-w-[12rem] truncate text-right text-sm font-bold text-muted-foreground"
            : "max-w-[12rem] truncate text-right text-sm font-black text-foreground"
        }
      >
        {value}
      </span>
    </div>
  )
}

function QuickLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external: boolean
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
      >
        <span>{label}</span>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
      </a>
    )
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
    >
      <span>{label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
    </Link>
  )
}
