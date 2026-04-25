import prisma from "@/lib/db";
import Link from "next/link";
import { Package, ExternalLink, Truck } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];

  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        items: { include: { variant: true } },
      },
    });
  } catch (error) {
    console.error("Error cargando pedidos", error);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight">
          Pedidos
        </h1>
        <p className="text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          Historial completo de transacciones. Click en el número de pedido para ver detalle, cambiar estado, reembolsar o gestionar el envío.
        </p>
      </div>

      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center gap-4 opacity-70">
            <Package className="w-12 h-12 text-muted-foreground/40" />
            <h2 className="text-lg font-bold font-heading">Sin pedidos todavía</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              A la espera del primer checkout. Asegúrate de tener configurado el Webhook de Stripe.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-muted/30 border-b border-border/60">
                <tr>
                  <Th>Pedido</Th>
                  <Th>Estado</Th>
                  <Th>Cliente</Th>
                  <Th className="hidden lg:table-cell">Dirección</Th>
                  <Th className="hidden md:table-cell">Items</Th>
                  <Th>Envío</Th>
                  <Th className="text-right">Total</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {(orders as any[]).map((order) => (
                  <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                    {/* Pedido */}
                    <td className="px-4 py-3.5 align-top">
                      <Link
                        href={`/admin/orders/${order.orderNumber}`}
                        className="inline-flex items-center font-mono text-xs font-bold text-secondary-foreground bg-secondary hover:bg-primary px-2.5 py-1 rounded-md transition-colors"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        {new Date(order.createdAt).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3.5 align-top">
                      <StatusBadge status={order.status} />
                      {order.refundedAmount && order.refundedAmount > 0 && (
                        <p className="text-[10px] text-amber-700 mt-1.5 font-bold">
                          Refund €{order.refundedAmount.toFixed(2)}
                        </p>
                      )}
                    </td>

                    {/* Cliente */}
                    <td className="px-4 py-3.5 align-top">
                      <p className="font-semibold text-foreground text-sm truncate max-w-[180px]">
                        {order.customer.name}
                      </p>
                      <a
                        href={`mailto:${order.customer.email}`}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors truncate block max-w-[180px]"
                      >
                        {order.customer.email}
                      </a>
                    </td>

                    {/* Dirección */}
                    <td className="hidden lg:table-cell px-4 py-3.5 align-top text-xs text-muted-foreground max-w-[260px]">
                      <p className="line-clamp-2 leading-snug">{order.shippingAddress}</p>
                    </td>

                    {/* Items */}
                    <td className="hidden md:table-cell px-4 py-3.5 align-top">
                      <ul className="flex flex-col gap-0.5">
                        {order.items.slice(0, 3).map((item: any) => (
                          <li key={item.id} className="text-xs flex items-center gap-1.5">
                            <span className="text-[10px] bg-foreground text-background px-1.5 py-0.5 rounded font-bold">
                              {item.quantity}x
                            </span>
                            <span className="text-muted-foreground">{item.variant.size}</span>
                          </li>
                        ))}
                        {order.items.length > 3 && (
                          <li className="text-[10px] text-muted-foreground/70">
                            +{order.items.length - 3} más
                          </li>
                        )}
                      </ul>
                    </td>

                    {/* Envío */}
                    <td className="px-4 py-3.5 align-top">
                      {order.packlinkReference ? (
                        <div className="flex flex-col gap-1">
                          {order.carrier && (
                            <span className="text-[11px] font-bold text-foreground inline-flex items-center gap-1">
                              <Truck className="w-3 h-3 text-muted-foreground" />
                              {order.carrier}
                            </span>
                          )}
                          {order.trackUrl ? (
                            <a
                              href={order.trackUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                            >
                              Tracking <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-muted-foreground/70">Sin URL</span>
                          )}
                          {order.trackingToken && (
                            <Link
                              href={`/seguimiento/${order.orderNumber}?token=${order.trackingToken}`}
                              target="_blank"
                              className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                            >
                              Vista cliente
                            </Link>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">
                          Sin envío
                        </span>
                      )}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3.5 align-top text-right">
                      <p className="text-base font-heading font-black text-foreground">
                        €{order.totalAmount.toFixed(2)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 font-bold text-foreground text-[10px] uppercase tracking-widest ${className ?? ''}`}
    >
      {children}
    </th>
  );
}
