import prisma from '@/lib/db';
import Link from 'next/link';
import {
  RefreshCw,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Euro,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminRefundsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;

  // Todos los pedidos con algún tipo de devolución
  const refundedOrders = await prisma.order.findMany({
    where: {
      OR: [
        { refundedAmount: { gt: 0 } },
        { status: 'REFUNDED' },
      ],
    },
    orderBy: { refundedAt: 'desc' },
    include: {
      customer: true,
      items: { include: { variant: { include: { product: true } } } },
    },
  });

  // Filtro activo
  const filtered = filter === 'partial'
    ? refundedOrders.filter((o) => (o.refundedAmount ?? 0) < o.totalAmount)
    : filter === 'full'
    ? refundedOrders.filter((o) => (o.refundedAmount ?? 0) >= o.totalAmount)
    : refundedOrders;

  // KPIs
  const totalRefunded = refundedOrders.reduce((acc, o) => acc + (o.refundedAmount ?? 0), 0);
  const fullRefunds = refundedOrders.filter((o) => (o.refundedAmount ?? 0) >= o.totalAmount).length;
  const partialRefunds = refundedOrders.filter(
    (o) => (o.refundedAmount ?? 0) > 0 && (o.refundedAmount ?? 0) < o.totalAmount
  ).length;
  const totalRevenueLost = totalRefunded; // alias semántico

  // Tasa de refund sobre total de pedidos pagados
  const totalPaidOrders = await prisma.order.count({
    where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED', 'REFUNDED'] } },
  });
  const refundRate = totalPaidOrders > 0 ? (refundedOrders.length / totalPaidOrders) * 100 : 0;

  const FILTERS = [
    { value: undefined, label: 'Todos' },
    { value: 'full', label: 'Totales' },
    { value: 'partial', label: 'Parciales' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">Ventas</p>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mt-1 flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-500" />
          Devoluciones
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
          Historial centralizado de reembolsos procesados en Stripe. Los reembolsos se inician
          desde el{' '}
          <Link href="/admin/orders" className="text-primary hover:underline font-semibold">
            detalle de cada pedido
          </Link>
          .
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <RefundKpi
          label="Total devuelto"
          value={`€${totalRefunded.toFixed(2)}`}
          icon={Euro}
          color="amber"
        />
        <RefundKpi
          label="Reembolsos totales"
          value={fullRefunds.toString()}
          icon={CheckCircle2}
          color="red"
        />
        <RefundKpi
          label="Reembolsos parciales"
          value={partialRefunds.toString()}
          icon={AlertCircle}
          color="amber"
        />
        <RefundKpi
          label="Tasa de refund"
          value={`${refundRate.toFixed(1)}%`}
          icon={TrendingDown}
          color={refundRate > 5 ? 'red' : 'neutral'}
          hint={`${refundedOrders.length} de ${totalPaidOrders} pedidos`}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `?filter=${f.value}` : '/admin/refunds'}
            className={`text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
              (filter ?? undefined) === f.value
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card border-border/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <p className="font-heading font-bold text-emerald-900">Sin devoluciones registradas</p>
          <p className="text-sm text-emerald-700 mt-1">
            Aquí aparecerán los pedidos cuando se procese un reembolso desde el detalle del pedido.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          {/* Column headers */}
          <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] items-center gap-4 px-5 py-3 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="w-24">Pedido</span>
            <span>Cliente</span>
            <span className="text-right w-24">Total pedido</span>
            <span className="text-right w-24">Devuelto</span>
            <span className="text-right w-20">Tipo</span>
            <span className="text-right w-32">Fecha refund</span>
            <span className="w-6" />
          </div>

          <ul className="divide-y divide-border/30">
            {filtered.map((o) => {
              const refunded = o.refundedAmount ?? 0;
              const isFull = refunded >= o.totalAmount;
              const pct = o.totalAmount > 0 ? (refunded / o.totalAmount) * 100 : 0;

              return (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.orderNumber}`}
                    className="flex flex-col md:grid md:grid-cols-[auto_1fr_auto_auto_auto_auto_auto] md:items-center gap-2 md:gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                  >
                    {/* Order number */}
                    <span className="font-mono text-xs font-bold text-secondary-foreground bg-secondary px-2 py-1 rounded w-fit md:w-24">
                      {o.orderNumber}
                    </span>

                    {/* Customer */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {o.customer.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{o.customer.email}</p>
                      {/* Mobile: items */}
                      <p className="text-xs text-muted-foreground mt-0.5 md:hidden">
                        {o.items.map((it) => `${it.quantity}× ${it.variant.size}`).join(', ')}
                      </p>
                    </div>

                    {/* Total pedido */}
                    <div className="text-right w-24 hidden md:block">
                      <span className="text-sm text-muted-foreground">€{o.totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Devuelto */}
                    <div className="md:text-right md:w-24 flex md:flex-col items-center md:items-end gap-2 md:gap-0">
                      <span className="text-sm font-heading font-bold text-amber-700">
                        €{refunded.toFixed(2)}
                      </span>
                      {/* Progress bar */}
                      <div className="flex-1 md:flex-none md:w-20 md:mt-1 h-1.5 bg-muted/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-amber-400'}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Tipo badge */}
                    <div className="md:text-right md:w-20 hidden md:block">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
                          isFull
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isFull ? (
                          <><CheckCircle2 className="w-3 h-3" /> Total</>
                        ) : (
                          <><AlertCircle className="w-3 h-3" /> Parcial {pct.toFixed(0)}%</>
                        )}
                      </span>
                    </div>

                    {/* Fecha refund */}
                    <div className="md:text-right md:w-32 hidden md:block">
                      {o.refundedAt ? (
                        <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(o.refundedAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 hidden md:block" />
                  </Link>

                  {/* Stripe refund ID row (collapsible info) */}
                  {o.refundId && (
                    <div className="px-5 pb-3 flex items-center gap-2 md:-mt-2">
                      <span className="text-[10px] text-muted-foreground font-mono bg-muted/40 px-2 py-0.5 rounded">
                        {o.refundId}
                      </span>
                      <a
                        href={`https://dashboard.stripe.com/refunds/${o.refundId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-semibold"
                      >
                        Ver en Stripe <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Footer totals */}
          <div className="border-t border-border/40 bg-muted/20 px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {filtered.length} devolución{filtered.length !== 1 ? 'es' : ''}
            </span>
            <span className="text-sm font-heading font-bold text-amber-700">
              Total devuelto: €{filtered.reduce((acc, o) => acc + (o.refundedAmount ?? 0), 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function RefundKpi({
  label,
  value,
  icon: Icon,
  color,
  hint,
}: {
  label: string;
  value: string;
  icon: typeof RefreshCw;
  color: 'amber' | 'red' | 'neutral';
  hint?: string;
}) {
  const styles = {
    amber: { card: 'bg-amber-50 border-amber-200/80', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-700' },
    red: { card: 'bg-red-50 border-red-200/80', icon: 'bg-red-100 text-red-600', text: 'text-red-700' },
    neutral: { card: 'bg-card border-border/60', icon: 'bg-primary/10 text-primary', text: 'text-foreground' },
  };
  const s = styles[color];

  return (
    <div className={`rounded-2xl p-5 flex items-center gap-4 border ${s.card}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.icon}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className={`text-xl font-heading font-black mt-0.5 ${s.text}`}>{value}</p>
        {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
