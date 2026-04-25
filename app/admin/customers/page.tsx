import prisma from '@/lib/db';
import Link from 'next/link';
import { Users, ShoppingBag, Euro, TrendingUp, Search, ArrowRight, Mail, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q, sort } = await searchParams;

  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined,
    include: {
      orders: {
        where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
        select: { totalAmount: true, createdAt: true, orderNumber: true, status: true },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Enriquecer con métricas calculadas
  const enriched = customers.map((c) => {
    const paidOrders = c.orders;
    const totalSpent = paidOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const lastOrder = paidOrders[0] ?? null;
    const aov = paidOrders.length > 0 ? totalSpent / paidOrders.length : 0;
    return { ...c, totalSpent, lastOrder, aov, orderCount: paidOrders.length };
  });

  // Ordenar según parámetro
  const sorted = [...enriched].sort((a, b) => {
    if (sort === 'spent') return b.totalSpent - a.totalSpent;
    if (sort === 'orders') return b.orderCount - a.orderCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // KPIs globales
  const totalCustomers = customers.length;
  const totalRevenue = enriched.reduce((acc, c) => acc + c.totalSpent, 0);
  const repeatCustomers = enriched.filter((c) => c.orderCount > 1).length;
  const avgLtv = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  const SORT_OPTIONS = [
    { value: 'recent', label: 'Más recientes' },
    { value: 'spent', label: 'Mayor gasto' },
    { value: 'orders', label: 'Más pedidos' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">Ventas</p>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mt-1">
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
            Base de datos de clientes con historial de compra, LTV y contacto directo.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Clientes totales" value={totalCustomers.toString()} icon={Users} />
        <KpiCard label="Ingresos totales" value={`€${totalRevenue.toFixed(0)}`} icon={Euro} />
        <KpiCard label="LTV medio" value={`€${avgLtv.toFixed(2)}`} icon={TrendingUp} />
        <KpiCard
          label="Recurrentes"
          value={`${repeatCustomers}`}
          icon={ShoppingBag}
          hint={totalCustomers > 0 ? `${Math.round((repeatCustomers / totalCustomers) * 100)}% del total` : '—'}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form method="GET" className="flex-1 flex items-center gap-2 bg-card border border-border/60 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Buscar por nombre o email…"
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          />
          {sort && <input type="hidden" name="sort" value={sort} />}
        </form>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((o) => (
            <Link
              key={o.value}
              href={`?${q ? `q=${q}&` : ''}sort=${o.value}`}
              className={`text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
                (sort ?? 'recent') === o.value
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card border-border/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {o.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="bg-card border border-dashed border-border/60 rounded-3xl p-16 text-center">
          <Users className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-heading font-bold">Sin clientes{q ? ` para "${q}"` : ''}</p>
          <p className="text-sm text-muted-foreground mt-1">Los clientes aparecen aquí tras completar un pago.</p>
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 px-5 py-3 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Cliente</span>
            <span className="text-right w-16">Pedidos</span>
            <span className="text-right w-24">Gasto total</span>
            <span className="text-right w-20 hidden md:block">AOV</span>
            <span className="w-6" />
          </div>
          <ul className="divide-y divide-border/30">
            {sorted.map((c) => (
              <li key={c.id}>
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-0 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  {/* Customer info */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <a
                        href={`mailto:${c.email}`}
                        className="text-xs text-primary hover:underline flex items-center gap-1 truncate"
                      >
                        <Mail className="w-3 h-3 shrink-0" />
                        {c.email}
                      </a>
                      {c.phone && (
                        <a
                          href={`tel:${c.phone}`}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 shrink-0" />
                          {c.phone}
                        </a>
                      )}
                    </div>
                    {c.lastOrder && (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-muted-foreground/70">
                          Último pedido:{' '}
                          <Link href={`/admin/orders/${c.lastOrder.orderNumber}`} className="font-mono font-bold hover:text-primary transition-colors text-foreground/80">
                            {c.lastOrder.orderNumber}
                          </Link>{' '}
                          · {new Date(c.lastOrder.createdAt).toLocaleDateString('es-ES')}
                        </p>
                        <Link 
                          href={`/seguimiento/${c.lastOrder.orderNumber}`}
                          target="_blank"
                          className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded hover:bg-primary/20 transition-colors flex items-center gap-0.5"
                        >
                          Seguimiento
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Pedidos */}
                  <div className="text-right w-16">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        c.orderCount > 1
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted/60 text-muted-foreground'
                      }`}
                    >
                      {c.orderCount}
                    </span>
                  </div>

                  {/* Gasto */}
                  <div className="text-right w-24">
                    <span className="text-sm font-heading font-bold text-foreground">
                      €{c.totalSpent.toFixed(2)}
                    </span>
                  </div>

                  {/* AOV */}
                  <div className="text-right w-20 hidden md:block">
                    <span className="text-xs text-muted-foreground">€{c.aov.toFixed(2)}</span>
                  </div>

                  {/* Arrow */}
                  <div className="w-6 flex justify-end">
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: typeof Users;
  hint?: string;
}) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-xl font-heading font-black text-foreground mt-0.5">{value}</p>
        {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
