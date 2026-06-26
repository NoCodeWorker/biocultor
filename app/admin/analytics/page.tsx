import prisma from "@/lib/db"
import {
  Euro,
  ShoppingBasket,
  Users,
  Component,
  BarChart3,
  ReceiptEuro,
  MousePointerClick,
  Activity,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const range = parseAnalyticsRange(resolvedSearchParams?.range)
  const since30d = new Date()
  since30d.setDate(since30d.getDate() - range.days)

  // Consultas críticas a Base de Datos
  const [orders, webContacts, webDeals, ecommerceEvents] = await Promise.all([
    prisma.order.findMany({
      where: { status: "PAID" },
      include: { items: { include: { variant: true } }, customer: true },
    }),
    prisma.crmContact.findMany({
      where: {
        createdAt: { gte: since30d },
        source: { startsWith: "Web" },
      },
      orderBy: { createdAt: "desc" },
      include: { deals: true },
    }),
    prisma.crmDeal.findMany({
      where: {
        createdAt: { gte: since30d },
        contact: { source: { startsWith: "Web" } },
      },
      include: { contact: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ecommerceEvent.findMany({
      where: { createdAt: { gte: since30d } },
      orderBy: { createdAt: "desc" },
      take: 5000,
    }),
  ])

  // Cálculo de KPIs
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)
  const totalOrders = orders.length
  const customersSet = new Set(orders.map((o) => o.customerId))
  const totalCustomers = customersSet.size
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const serviceWebDeals = webDeals.filter((deal) => deal.type === "SERVICIO")
  const servicePipelineAmount = serviceWebDeals.reduce(
    (sum, deal) => sum + deal.amount,
    0
  )
  const topLeadSources = getTopLeadSources(webContacts)
  const ecommerceFunnel = buildEcommerceFunnel(ecommerceEvents)

  // Minería de datos: Ventas por formato
  const variantSales: Record<
    string,
    { name: string; qty: number; revenue: number; percentage: number }
  > = {}

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const vId = item.variantId
      if (!variantSales[vId]) {
        variantSales[vId] = {
          name: item.variant.size,
          qty: 0,
          revenue: 0,
          percentage: 0,
        }
      }
      variantSales[vId].qty += item.quantity
      variantSales[vId].revenue += item.quantity * item.priceAt
    })
  })

  const sortedVariants = Object.values(variantSales).sort(
    (a, b) => b.revenue - a.revenue
  )

  // Calcular % sobre facturación total
  if (totalRevenue > 0) {
    sortedVariants.forEach((v) => {
      v.percentage = Math.round((v.revenue / totalRevenue) * 100)
    })
  }

  // Tarjetas métricas
  const kpis = [
    {
      label: "Ingresos Brutos",
      value: `€${totalRevenue.toFixed(2)}`,
      icon: Euro,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Valor Medio Pedido",
      value: `€${averageOrderValue.toFixed(2)}`,
      icon: ReceiptEuro,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Total Pedidos (Pagados)",
      value: totalOrders,
      icon: ShoppingBasket,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Clientes Únicos",
      value: totalCustomers,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 antialiased">
      <div>
        <h1 className="flex items-center gap-4 font-heading text-4xl font-black tracking-tight text-foreground md:text-5xl">
          <BarChart3 className="h-10 w-10 text-primary" />
          Inteligencia de Negocio
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          KPIs financieros, rendimiento de producto y atribución de leads
          conectados con el motor transaccional y el CRM.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5"
          >
            <div className={`w-fit rounded-2xl p-3 ${kpi.bg}`}>
              <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                {kpi.label}
              </p>
              <p className="mt-1 font-heading text-3xl font-black text-foreground">
                {kpi.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CRO Funnel */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl shadow-black/5">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
            <Activity className="h-6 w-6 text-primary" /> Embudo CRO ecommerce
          </h2>
          <p className="text-sm text-muted-foreground">
            Últimos {range.label}. Eventos internos propios, no dependientes de
            GA4. Sirve para detectar fricción real entre ficha, formato, carrito
            y checkout.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { key: "24h", label: "24h" },
              { key: "7d", label: "7 días" },
              { key: "30d", label: "30 días" },
            ].map((item) => (
              <Link
                key={item.key}
                href={`/admin/analytics?range=${item.key}`}
                className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                  range.key === item.key
                    ? "border-primary bg-primary text-white"
                    : "border-border/70 bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {ecommerceFunnel.steps.map((step) => (
            <div
              key={step.eventName}
              className="rounded-2xl border border-border/60 bg-background p-5"
            >
              <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                {step.label}
              </p>
              <p className="mt-2 font-heading text-3xl font-black text-foreground">
                {step.count}
              </p>
              <p className="mt-1 text-xs font-semibold text-primary">
                {step.rateLabel}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-background p-6">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">
              Formatos con fricción
            </h3>
            {ecommerceFunnel.variantFriction.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aún no hay suficiente señal por formato.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {ecommerceFunnel.variantFriction.map((row) => (
                  <div
                    key={row.variant}
                    className="flex items-center justify-between gap-4 border-b border-border/40 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-bold text-foreground">{row.variant}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.selects} selecciones · {row.adds} add-to-cart
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {row.rate}% avance
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/60 bg-background p-6">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">
              Alertas operativas
            </h3>
            {ecommerceFunnel.alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sin alertas relevantes con los datos actuales.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {ecommerceFunnel.alerts.map((alert) => (
                  <div
                    key={alert}
                    className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="font-semibold">{alert}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <BreakdownCard
            title="Desglose por producto"
            rows={ecommerceFunnel.productBreakdown}
            empty="Aún no hay eventos suficientes por producto."
          />
          <BreakdownCard
            title="Desglose por dispositivo"
            rows={ecommerceFunnel.deviceBreakdown}
            empty="Aún no hay eventos suficientes por dispositivo."
          />
        </div>
      </div>

      {/* Deep-Dive: Ventas por formato */}
      <div className="mt-4 rounded-3xl border border-border bg-card p-8 shadow-2xl shadow-black/5">
        <h2 className="mb-6 flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
          <Component className="h-6 w-6 text-primary" /> Rendimiento de Formatos
          (Bestseller Map)
        </h2>

        {sortedVariants.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Aún no hay datos. Haz el primer checkout para iniciar los gráficos.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {sortedVariants.map((v, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="block text-lg font-bold text-foreground">
                      {v.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {v.qty} unidades vendidas
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading text-2xl font-black text-foreground">
                      €{v.revenue.toFixed(2)}
                    </span>
                    <span className="ml-3 rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary">
                      {v.percentage}%
                    </span>
                  </div>
                </div>
                {/* CSS Progress Bar */}
                <div className="h-4 w-full overflow-hidden rounded-full bg-muted/50">
                  <div
                    className="relative h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${v.percentage}%` }}
                  >
                    <div className="absolute inset-0 h-full w-full animate-pulse bg-white/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO/CRO Attribution */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl shadow-black/5">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
            <MousePointerClick className="h-6 w-6 text-primary" /> Atribución
            SEO/CRO de leads
          </h2>
          <p className="text-sm text-muted-foreground">
            Últimos 30 días. Usa los formularios con URL/referrer para conectar
            contenido, calculadoras y servicios con CRM.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <AttributionKpi
            label="Leads web"
            value={webContacts.length.toString()}
          />
          <AttributionKpi
            label="Leads de servicio"
            value={serviceWebDeals.length.toString()}
          />
          <AttributionKpi
            label="Pipeline servicio"
            value={`€${servicePipelineAmount.toLocaleString("es-ES", { maximumFractionDigits: 0 })}`}
          />
        </div>

        {topLeadSources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Aún no hay leads web atribuidos en los últimos 30 días.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/60">
            <div className="grid grid-cols-[1fr_90px_110px] bg-muted/30 px-4 py-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              <span>URL de origen</span>
              <span className="text-right">Leads</span>
              <span className="text-right">Servicio</span>
            </div>
            {topLeadSources.map((source) => (
              <div
                key={source.path}
                className="grid grid-cols-[1fr_90px_110px] items-center border-t border-border/40 px-4 py-3 text-sm"
              >
                <span className="truncate font-mono text-xs text-muted-foreground">
                  {source.path}
                </span>
                <span className="text-right font-bold text-foreground">
                  {source.count}
                </span>
                <span className="text-right font-bold text-primary">
                  {source.serviceCount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AttributionKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-5">
      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 font-heading text-3xl font-black text-foreground">
        {value}
      </p>
    </div>
  )
}

function BreakdownCard({
  title,
  rows,
  empty,
}: {
  title: string
  rows: Array<{ label: string; views: number; adds: number; purchases: number }>
  empty: string
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-6">
      <h3 className="mb-4 font-heading text-lg font-bold text-foreground">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/50">
          <div className="grid grid-cols-[1fr_70px_70px_70px] bg-muted/30 px-3 py-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            <span>Segmento</span>
            <span className="text-right">Vista</span>
            <span className="text-right">Cart</span>
            <span className="text-right">Compra</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_70px_70px_70px] border-t border-border/40 px-3 py-2 text-sm"
            >
              <span className="truncate font-semibold text-foreground">
                {row.label}
              </span>
              <span className="text-right text-muted-foreground">
                {row.views}
              </span>
              <span className="text-right font-bold text-primary">
                {row.adds}
              </span>
              <span className="text-right font-bold text-foreground">
                {row.purchases}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getTopLeadSources(
  contacts: Array<{
    notes: string | null
    sourcePath?: string | null
    sourceQuery?: string | null
    leadIntent?: string | null
    deals: Array<{ type: string }>
  }>
) {
  const buckets = new Map<
    string,
    { path: string; count: number; serviceCount: number }
  >()

  for (const contact of contacts) {
    const path =
      buildStructuredSourcePath(contact) ||
      extractSourcePath(contact.notes) ||
      "sin-origen"
    const current = buckets.get(path) ?? { path, count: 0, serviceCount: 0 }
    current.count += 1
    if (
      contact.leadIntent === "service" ||
      contact.deals.some((deal) => deal.type === "SERVICIO")
    ) {
      current.serviceCount += 1
    }
    buckets.set(path, current)
  }

  return [...buckets.values()]
    .sort((a, b) => b.count - a.count || b.serviceCount - a.serviceCount)
    .slice(0, 8)
}

function buildStructuredSourcePath(contact: {
  sourcePath?: string | null
  sourceQuery?: string | null
}) {
  if (!contact.sourcePath) return null
  return `${contact.sourcePath}${contact.sourceQuery ?? ""}`
}

function extractSourcePath(notes: string | null) {
  if (!notes) return null
  const match = notes.match(/URL origen:\s*(.+)/)
  return match?.[1]?.trim() ?? null
}

type EcommerceEventRow = {
  eventName: string
  productSlug: string | null
  variantSku: string | null
  variantSize: string | null
  device: string | null
}

function buildEcommerceFunnel(events: EcommerceEventRow[]) {
  const count = (eventName: string) =>
    events.filter((event) => event.eventName === eventName).length

  const viewItem = count("view_item")
  const selectItem = count("select_item")
  const addToCart = count("add_to_cart")
  const beginCheckout = count("begin_checkout")
  const purchase = count("purchase")
  const checkoutErrors = count("checkout_error")

  const stepDefinitions = [
    {
      eventName: "view_item",
      label: "Ficha vista",
      count: viewItem,
      previous: null,
    },
    {
      eventName: "select_item",
      label: "Formato",
      count: selectItem,
      previous: viewItem,
    },
    {
      eventName: "add_to_cart",
      label: "Carrito",
      count: addToCart,
      previous: selectItem,
    },
    {
      eventName: "begin_checkout",
      label: "Checkout",
      count: beginCheckout,
      previous: addToCart,
    },
    {
      eventName: "purchase",
      label: "Compra",
      count: purchase,
      previous: beginCheckout,
    },
  ]

  const steps = stepDefinitions.map((step) => ({
    ...step,
    rateLabel:
      step.previous === null
        ? "base"
        : `${formatRate(step.count, step.previous)}% desde paso anterior`,
  }))

  const variantMap = new Map<
    string,
    { variant: string; selects: number; adds: number }
  >()

  for (const event of events) {
    if (event.eventName !== "select_item" && event.eventName !== "add_to_cart")
      continue

    const variant = event.variantSku || event.variantSize || "sin-variante"
    const current = variantMap.get(variant) ?? { variant, selects: 0, adds: 0 }
    if (event.eventName === "select_item") current.selects += 1
    if (event.eventName === "add_to_cart") current.adds += 1
    variantMap.set(variant, current)
  }

  const variantFriction = [...variantMap.values()]
    .filter((row) => row.selects >= 3 || row.adds >= 1)
    .map((row) => ({
      ...row,
      rate: formatRate(row.adds, row.selects),
    }))
    .sort((a, b) => a.rate - b.rate || b.selects - a.selects)
    .slice(0, 6)

  const alerts: string[] = []
  const checkoutErrorRate = formatRate(checkoutErrors, beginCheckout)
  const mobile = events.filter((event) => event.device === "mobile")
  const desktop = events.filter((event) => event.device === "desktop")
  const mobilePurchaseRate = formatRate(
    mobile.filter((event) => event.eventName === "purchase").length,
    mobile.filter((event) => event.eventName === "begin_checkout").length
  )
  const desktopPurchaseRate = formatRate(
    desktop.filter((event) => event.eventName === "purchase").length,
    desktop.filter((event) => event.eventName === "begin_checkout").length
  )

  if (beginCheckout >= 5 && checkoutErrorRate >= 15) {
    alerts.push(
      `Checkout con ${checkoutErrorRate}% de errores: revisar stock, Stripe o payload.`
    )
  }

  const weakVariants = variantFriction.filter(
    (row) => row.selects >= 5 && row.rate < 25
  )
  for (const row of weakVariants.slice(0, 2)) {
    alerts.push(
      `${row.variant} recibe interés pero bajo add-to-cart (${row.rate}%).`
    )
  }

  if (
    desktopPurchaseRate > 0 &&
    mobilePurchaseRate > 0 &&
    mobilePurchaseRate < desktopPurchaseRate * 0.6
  ) {
    alerts.push(
      `Conversión móvil inferior a desktop (${mobilePurchaseRate}% vs ${desktopPurchaseRate}%).`
    )
  }

  return {
    steps,
    variantFriction,
    alerts,
    productBreakdown: buildSegmentBreakdown(
      events,
      (event) => event.productSlug
    ),
    deviceBreakdown: buildSegmentBreakdown(events, (event) => event.device),
  }
}

function formatRate(numerator: number, denominator: number | null) {
  if (!denominator || denominator <= 0) return 0
  return Math.round((numerator / denominator) * 100)
}

function buildSegmentBreakdown(
  events: EcommerceEventRow[],
  getLabel: (event: EcommerceEventRow) => string | null
) {
  const buckets = new Map<
    string,
    { label: string; views: number; adds: number; purchases: number }
  >()

  for (const event of events) {
    const label = getLabel(event) || "sin-dato"
    const current = buckets.get(label) ?? {
      label,
      views: 0,
      adds: 0,
      purchases: 0,
    }

    if (event.eventName === "view_item") current.views += 1
    if (event.eventName === "add_to_cart") current.adds += 1
    if (event.eventName === "purchase") current.purchases += 1

    buckets.set(label, current)
  }

  return [...buckets.values()]
    .filter((row) => row.views > 0 || row.adds > 0 || row.purchases > 0)
    .sort(
      (a, b) =>
        b.purchases - a.purchases || b.adds - a.adds || b.views - a.views
    )
    .slice(0, 8)
}

function parseAnalyticsRange(range?: string) {
  if (range === "24h") return { key: "24h", label: "24 horas", days: 1 }
  if (range === "7d") return { key: "7d", label: "7 días", days: 7 }
  return { key: "30d", label: "30 días", days: 30 }
}
