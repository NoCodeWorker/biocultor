import prisma from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Package, MapPin, User, Calendar } from 'lucide-react';
import StatusChanger from './StatusChanger';
import RefundSection from './RefundSection';
import ShipmentSection from './ShipmentSection';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      customer: true,
      items: { include: { variant: { include: { product: true } } } },
    },
  });
  if (!order) notFound();

  const refundedAmount = order.refundedAmount ?? 0;
  const refundedFull = refundedAmount >= order.totalAmount;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto relative z-10 antialiased">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Pedidos
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary/80">Pedido</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight font-mono">
            {order.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <Calendar className="inline w-3.5 h-3.5 mr-1" />
            {new Date(order.createdAt).toLocaleString('es-ES', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-3xl font-heading font-black text-foreground">€{order.totalAmount.toFixed(2)}</p>
          {refundedAmount > 0 && (
            <p className="text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">
              Reembolsado: €{refundedAmount.toFixed(2)} {refundedFull ? '(total)' : '(parcial)'}
            </p>
          )}
        </div>
      </div>

      {/* Estado */}
      <section className="bg-card border border-border/60 rounded-3xl p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-heading font-bold">Estado del pedido</h2>
          <span className="text-xs text-muted-foreground">
            Última actualización:{' '}
            {order.lastStatusAt
              ? new Date(order.lastStatusAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
              : '—'}
          </span>
        </div>
        <StatusChanger orderNumber={order.orderNumber} currentStatus={order.status} />
      </section>

      {/* Cliente y dirección */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-card border border-border/60 rounded-3xl p-7">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <User className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Cliente</h2>
          </div>
          <p className="text-lg font-heading font-bold">{order.customer.name}</p>
          <a
            href={`mailto:${order.customer.email}`}
            className="text-sm text-primary hover:underline block mt-1"
          >
            {order.customer.email}
          </a>
          {order.customer.phone && (
            <a
              href={`tel:${order.customer.phone}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block mt-1"
            >
              {order.customer.phone}
            </a>
          )}
        </div>

        <div className="bg-card border border-border/60 rounded-3xl p-7">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <MapPin className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Dirección de envío</h2>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{order.shippingAddress}</p>
          {order.shippingPostalCode && (
            <p className="text-xs font-mono text-muted-foreground mt-2">
              CP: {order.shippingPostalCode}
            </p>
          )}
        </div>
      </section>

      {/* Envío Packlink */}
      <section className="bg-card border border-border/60 rounded-3xl p-7">
        <h2 className="text-xl font-heading font-bold mb-5">Envío</h2>
        <ShipmentSection
          orderNumber={order.orderNumber}
          packlinkReference={order.packlinkReference}
          trackUrl={order.trackUrl}
          carrier={order.carrier}
          serviceName={order.serviceName}
        />
      </section>

      {/* Refund Stripe */}
      <section className="bg-card border border-border/60 rounded-3xl p-7">
        <h2 className="text-xl font-heading font-bold mb-5">Devolución (Stripe)</h2>
        <RefundSection
          orderNumber={order.orderNumber}
          totalAmount={order.totalAmount}
          stripeSession={order.stripeSession}
          refundId={order.refundId}
          refundedAmount={order.refundedAmount}
          refundedAt={order.refundedAt ? order.refundedAt.toISOString() : null}
        />
      </section>

      {/* Items */}
      <section className="bg-card border border-border/60 rounded-3xl p-7">
        <div className="flex items-center gap-2 mb-5 text-primary">
          <Package className="w-4 h-4" />
          <h2 className="text-sm font-bold uppercase tracking-widest">Contenido del pedido</h2>
        </div>
        <ul className="divide-y divide-border/50">
          {order.items.map((item) => (
            <li key={item.id} className="py-4 flex items-center gap-4">
              <span className="text-xs font-bold bg-foreground text-background px-2 py-0.5 rounded shrink-0">
                {item.quantity}x
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{item.variant.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.variant.size} · SKU {item.variant.sku}
                </p>
              </div>
              <p className="font-heading font-bold">€{(item.priceAt * item.quantity).toFixed(2)}</p>
            </li>
          ))}
        </ul>
        <div className="border-t border-border/50 mt-3 pt-4 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total</span>
          <span className="text-2xl font-heading font-black text-foreground">€{order.totalAmount.toFixed(2)}</span>
        </div>
      </section>

      {order.trackingToken && (
        <Link
          href={`/seguimiento/${order.orderNumber}?token=${order.trackingToken}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline w-fit"
        >
          Ver vista pública del cliente <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
