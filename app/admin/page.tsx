import Link from 'next/link';
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
  ExternalLink,
} from 'lucide-react';
import {
  getDashboardKpis,
  getRevenueSeries,
  getTopVariants,
  getLatestOrders,
  getStockAlerts,
  getGeoDistribution,
} from '@/lib/admin/metrics';
import KpiTile from '@/components/admin/KpiTile';
import Panel from '@/components/admin/Panel';
import StatusBadge from '@/components/admin/StatusBadge';
import RevenueChart from '@/components/admin/charts/RevenueChart';
import TopVariantsChart from '@/components/admin/charts/TopVariantsChart';

export const dynamic = 'force-dynamic';

const PERIOD_DAYS = 30;

export default async function AdminOverviewPage() {
  const [kpis, revenueSeries, topVariants, latest, lowStock, geo] = await Promise.all([
    getDashboardKpis(PERIOD_DAYS),
    getRevenueSeries(PERIOD_DAYS),
    getTopVariants(PERIOD_DAYS, 6),
    getLatestOrders(8),
    getStockAlerts(10),
    getGeoDistribution(90, 8),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
            Inicio
          </p>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-foreground tracking-tight mt-1">
            Buenos días, Biocultor.
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Resumen de los últimos {PERIOD_DAYS} días vs los {PERIOD_DAYS} anteriores.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm font-bold bg-foreground text-background px-4 py-2 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Pedidos
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 text-sm font-bold bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-sm hover:bg-brand-green-hover transition-colors"
          >
            Nuevo producto
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
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
          hint={kpis.lowStockCount > 0 ? '<10 unidades' : 'Todo OK'}
        />
      </div>

      {/* Fila principal: chart grande + top productos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
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
          action={{ href: '/admin/products', label: 'Catálogo' }}
        >
          <TopVariantsChart data={topVariants} />
        </Panel>
      </div>

      {/* Fila secundaria: pedidos + stock + geo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latest orders */}
        <Panel
          title="Últimos pedidos"
          icon={Clock}
          action={{ href: '/admin/orders', label: 'Ver todos' }}
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
                    className="flex items-center gap-4 px-5 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <span className="font-mono text-xs font-bold text-secondary-foreground bg-secondary px-2 py-1 rounded shrink-0">
                      {o.orderNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {o.customer.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {o.items.length} ud · {o.customer.email}
                      </p>
                    </div>
                    <StatusBadge status={o.status} />
                    <span className="font-heading font-bold text-sm text-foreground w-20 text-right">
                      €{o.totalAmount.toFixed(2)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
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
          action={{ href: '/admin/products', label: 'Catálogo' }}
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
                    className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {v.size} · {v.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">{v.sku}</p>
                    </div>
                    <span
                      className={
                        v.stock === 0
                          ? 'text-xs font-bold bg-red-100 text-red-800 px-2 py-1 rounded ring-1 ring-red-300'
                          : 'text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded ring-1 ring-amber-300'
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                const max = geo[0]?.revenue || 1;
                const pct = (g.revenue / max) * 100;
                return (
                  <li key={g.province} className="px-5 py-3 flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground w-32 truncate">
                      {g.province}
                    </span>
                    <div className="flex-1 h-2 bg-muted/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {g.orders} ped.
                    </span>
                    <span className="text-sm font-heading font-bold text-foreground w-20 text-right">
                      €{g.revenue.toFixed(0)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* Quick links */}
        <div className="bg-card border border-border/60 rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-foreground">Accesos rápidos</h2>
          <p className="text-xs text-muted-foreground">
            Funciones más usadas o que estarán disponibles pronto.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <QuickLink href="/admin/seo" label="Editor SEO Editorial" external={false} />
            <QuickLink href="/admin/analytics" label="Inteligencia detallada" external={false} />
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
  );
}

function QuickLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external: boolean;
}) {
  const Component: any = external ? 'a' : Link;
  const extras = external
    ? { target: '_blank', rel: 'noopener noreferrer' as const }
    : {};
  return (
    <Component
      href={href}
      {...extras}
      className="inline-flex items-center justify-between gap-2 text-sm font-semibold text-foreground bg-muted/40 hover:bg-muted px-3 py-2 rounded-lg transition-colors"
    >
      <span>{label}</span>
      {external ? <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" /> : <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />}
    </Component>
  );
}
