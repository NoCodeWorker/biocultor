import prisma from '@/lib/db';
import Link from 'next/link';
import {
  Truck,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOperationsPage() {
  // Pedidos PAID sin envío Packlink generado = pendientes de procesar
  const pendingShipment = await prisma.order.findMany({
    where: { status: 'PAID', packlinkReference: null },
    orderBy: { createdAt: 'asc' }, // más antiguos primero: FIFO
    include: {
      customer: true,
      items: { include: { variant: { include: { product: true } } } },
    },
  });

  // Pedidos SHIPPED con trackUrl para monitorización
  const inTransit = await prisma.order.findMany({
    where: { status: 'SHIPPED', packlinkReference: { not: null } },
    orderBy: { lastStatusAt: 'desc' },
    take: 20,
    include: { customer: true },
  });

  // Métricas rápidas
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const shippedToday = await prisma.order.count({
    where: { status: 'SHIPPED', lastStatusAt: { gte: todayStart } },
  });

  const totalWeightPending = pendingShipment.reduce((acc, o) => {
    return (
      acc +
      o.items.reduce((s, it) => {
        const litros = parseInt(it.variant.size.match(/\d+/)?.[0] ?? '1', 10);
        return s + litros * it.quantity;
      }, 0)
    );
  }, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">Ventas</p>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mt-1">
          Operaciones de envío
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
          Cola de pedidos pendientes de procesar en Packlink y envíos activos en tránsito.
        </p>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <OpKpi
          label="Pendientes de envío"
          value={pendingShipment.length}
          icon={Clock}
          alert={pendingShipment.length > 0}
        />
        <OpKpi label="En tránsito" value={inTransit.length} icon={Truck} />
        <OpKpi label="Enviados hoy" value={shippedToday} icon={CheckCircle2} />
        <OpKpi
          label="Peso pendiente"
          value={`${totalWeightPending} kg`}
          icon={Package}
          valueStr
        />
      </div>

      {/* Cola de envíos pendientes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-heading font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Pedidos sin envío ({pendingShipment.length})
          </h2>
        </div>

        {pendingShipment.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-heading font-bold text-emerald-900">Cola vacía. Todo procesado.</p>
            <p className="text-sm text-emerald-700 mt-1">
              No hay pedidos pagados esperando etiqueta de Packlink.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-amber-300/40 rounded-2xl overflow-hidden">
            <ul className="divide-y divide-border/30">
              {pendingShipment.map((o) => {
                const weight = o.items.reduce((acc, it) => {
                  const l = parseInt(it.variant.size.match(/\d+/)?.[0] ?? '1', 10);
                  return acc + l * it.quantity;
                }, 0);
                const age = Math.floor(
                  (Date.now() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60)
                );

                return (
                  <li key={o.id}>
                    <Link
                      href={`/admin/orders/${o.orderNumber}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                    >
                      {/* Age indicator */}
                      <div
                        className={`shrink-0 w-2 h-2 rounded-full ${
                          age > 24 ? 'bg-red-500' : age > 8 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />

                      {/* Order number */}
                      <span className="font-mono text-xs font-bold text-secondary-foreground bg-secondary px-2 py-1 rounded shrink-0">
                        {o.orderNumber}
                      </span>

                      {/* Customer + address */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {o.customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {o.shippingAddress}
                          {o.shippingPostalCode && ` · CP ${o.shippingPostalCode}`}
                        </p>
                      </div>

                      {/* Items summary */}
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-xs font-semibold text-foreground">
                          {o.items.map((it) => `${it.quantity}× ${it.variant.size}`).join(', ')}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{weight} kg aprox.</p>
                      </div>

                      {/* Amount */}
                      <span className="font-heading font-bold text-sm text-foreground w-20 text-right shrink-0">
                        €{o.totalAmount.toFixed(2)}
                      </span>

                      {/* Age badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded shrink-0 hidden md:block ${
                          age > 24
                            ? 'bg-red-100 text-red-800'
                            : age > 8
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {age < 1 ? '< 1h' : `${age}h`}
                      </span>

                      <ArrowRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Envíos en tránsito */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-heading font-bold text-foreground flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            En tránsito ({inTransit.length})
          </h2>
        </div>

        {inTransit.length === 0 ? (
          <div className="bg-card border border-border/40 rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Sin envíos activos en tránsito.
          </div>
        ) : (
          <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
            <ul className="divide-y divide-border/30">
              {inTransit.map((o) => (
                <li key={o.id}>
                  <div className="flex items-center gap-4 px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-secondary-foreground bg-secondary px-2 py-1 rounded shrink-0">
                      {o.orderNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {o.customer.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Packlink: {o.packlinkReference}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 hidden md:block">
                      {o.carrier ?? '—'}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      {o.trackUrl && (
                        <a
                          href={o.trackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          Track <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <Link
                        href={`/admin/orders/${o.orderNumber}`}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Detalle
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

function OpKpi({
  label,
  value,
  icon: Icon,
  alert,
  valueStr,
}: {
  label: string;
  value: number | string;
  icon: typeof Truck;
  alert?: boolean;
  valueStr?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 flex items-center gap-4 border ${
        alert
          ? 'bg-amber-50 border-amber-200/80'
          : 'bg-card border-border/60'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          alert ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'
        }`}
      >
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p
          className={`text-xl font-heading font-black mt-0.5 ${
            alert && typeof value === 'number' && value > 0 ? 'text-amber-700' : 'text-foreground'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
