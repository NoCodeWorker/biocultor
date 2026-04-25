'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, Truck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import { bulkUpdateOrderStatus } from './actions';

type OrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  refundedAmount: number | null;
  createdAt: string; // ISO
  shippingAddress: string;
  packlinkReference: string | null;
  trackUrl: string | null;
  carrier: string | null;
  trackingToken: string | null;
  customer: { name: string; email: string };
  items: Array<{ id: string; quantity: number; variant: { size: string } }>;
};

const BULK_STATUSES = [
  { value: 'PAID', label: 'Marcar pagado' },
  { value: 'SHIPPED', label: 'Marcar enviado' },
  { value: 'DELIVERED', label: 'Marcar entregado' },
  { value: 'CANCELLED', label: 'Cancelar' },
];

export default function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  const allSelected = orders.length > 0 && selected.size === orders.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(orders.map((o) => o.orderNumber)));
  };

  const toggleOne = (orderNumber: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(orderNumber)) next.delete(orderNumber);
      else next.add(orderNumber);
      return next;
    });
  };

  const applyBulk = (status: string) => {
    if (selected.size === 0) return;
    if (!confirm(`Cambiar ${selected.size} pedido(s) a "${status}"?`)) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await bulkUpdateOrderStatus(Array.from(selected), status);
      if (result.success) {
        setFeedback({ kind: 'ok', msg: `${result.data?.updated ?? 0} pedidos actualizados.` });
        setSelected(new Set());
        router.refresh();
      } else {
        setFeedback({ kind: 'err', msg: result.error });
      }
      setTimeout(() => setFeedback(null), 4000);
    });
  };

  const memoOrders = useMemo(() => orders, [orders]);

  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
      {/* Bulk action bar — solo visible con selección */}
      {selected.size > 0 && (
        <div className="bg-primary/8 border-b border-primary/20 px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-foreground">
            {selected.size} seleccionado{selected.size === 1 ? '' : 's'}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          {BULK_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => applyBulk(s.value)}
              disabled={pending}
              className="text-xs font-bold bg-foreground text-background px-3 py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
          {pending && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            disabled={pending}
            className="ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Deseleccionar
          </button>
        </div>
      )}

      {feedback && (
        <div
          className={
            feedback.kind === 'ok'
              ? 'bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-800 flex items-center gap-2'
              : 'bg-red-50 border-b border-red-200 px-4 py-2.5 text-xs font-bold text-red-800 flex items-center gap-2'
          }
        >
          {feedback.kind === 'ok' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {feedback.msg}
        </div>
      )}

      {memoOrders.length === 0 ? (
        <div className="p-16 text-center text-sm text-muted-foreground">
          Sin pedidos que coincidan con los filtros.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-muted/30 border-b border-border/60">
              <tr>
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                    className="rounded cursor-pointer"
                    aria-label="Seleccionar todo"
                  />
                </th>
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
              {memoOrders.map((order) => {
                const isSelected = selected.has(order.orderNumber);
                return (
                  <tr
                    key={order.id}
                    className={
                      isSelected
                        ? 'bg-primary/5 hover:bg-primary/8 transition-colors'
                        : 'hover:bg-muted/20 transition-colors'
                    }
                  >
                    <td className="px-3 py-3.5 align-top">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(order.orderNumber)}
                        className="rounded cursor-pointer"
                        aria-label={`Seleccionar ${order.orderNumber}`}
                      />
                    </td>
                    <td className="px-3 py-3.5 align-top">
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
                    <td className="px-3 py-3.5 align-top">
                      <StatusBadge status={order.status} />
                      {order.refundedAmount && order.refundedAmount > 0 && (
                        <p className="text-[10px] text-amber-700 mt-1.5 font-bold">
                          Refund €{order.refundedAmount.toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3.5 align-top">
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
                    <td className="hidden lg:table-cell px-3 py-3.5 align-top text-xs text-muted-foreground max-w-[260px]">
                      <p className="line-clamp-2 leading-snug">{order.shippingAddress}</p>
                    </td>
                    <td className="hidden md:table-cell px-3 py-3.5 align-top">
                      <ul className="flex flex-col gap-0.5">
                        {order.items.slice(0, 3).map((item) => (
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
                    <td className="px-3 py-3.5 align-top">
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
                    <td className="px-3 py-3.5 align-top text-right">
                      <p className="text-base font-heading font-black text-foreground">
                        €{order.totalAmount.toFixed(2)}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-3 py-3 font-bold text-foreground text-[10px] uppercase tracking-widest ${className ?? ''}`}
    >
      {children}
    </th>
  );
}
