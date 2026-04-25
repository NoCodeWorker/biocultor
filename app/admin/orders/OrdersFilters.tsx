'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Search, X, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUSES = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PAID', label: 'Pagado' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'REFUNDED', label: 'Reembolsado' },
];

export default function OrdersFilters({ totalResults }: { totalResults: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get('q') ?? '');

  // Mantener el input en sync si cambia desde fuera (botón limpiar, navegación)
  useEffect(() => {
    setQ(params.get('q') ?? '');
  }, [params]);

  const statuses = (params.get('status') ?? '').split(',').filter(Boolean);
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';
  const shipping = params.get('shipping') ?? '';

  const apply = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    });
    // Reset paginación al cambiar filtros
    next.delete('page');
    startTransition(() => {
      router.push(`/admin/orders?${next.toString()}`);
    });
  };

  const toggleStatus = (s: string) => {
    const set = new Set(statuses);
    if (set.has(s)) set.delete(s);
    else set.add(s);
    apply({ status: set.size ? Array.from(set).join(',') : null });
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    apply({ q: q.trim() || null });
  };

  const exportHref = (() => {
    const sp = new URLSearchParams(params.toString());
    sp.delete('page');
    sp.delete('perPage');
    const qs = sp.toString();
    return `/api/admin/orders/export${qs ? `?${qs}` : ''}`;
  })();

  const hasActiveFilters =
    statuses.length > 0 || from || to || shipping || params.get('q') || params.get('minTotal') || params.get('maxTotal');

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-4 flex flex-col gap-3">
      {/* Fila 1: search + acciones */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={onSearchSubmit} className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nº pedido, email o nombre…"
            className="w-full h-10 pl-10 pr-9 bg-background border border-border/60 rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ('');
                apply({ q: null });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-bold text-muted-foreground">
            {totalResults.toLocaleString('es-ES')} resultado{totalResults === 1 ? '' : 's'}
          </span>
          <a
            href={exportHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-foreground text-background px-3 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar CSV
          </a>
        </div>
      </div>

      {/* Fila 2: pills de estado */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">
          Estado
        </span>
        {STATUSES.map((s) => {
          const active = statuses.includes(s.value);
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => toggleStatus(s.value)}
              className={cn(
                'text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ring-1',
                active
                  ? 'bg-primary text-primary-foreground ring-primary/40'
                  : 'bg-muted/40 text-muted-foreground ring-border/40 hover:bg-muted'
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Fila 3: fecha + envío + reset */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Desde
          </span>
          <input
            type="date"
            value={from}
            onChange={(e) => apply({ from: e.target.value || null })}
            className="h-9 px-2.5 bg-background border border-border/60 rounded-lg text-xs focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Hasta
          </span>
          <input
            type="date"
            value={to}
            onChange={(e) => apply({ to: e.target.value || null })}
            className="h-9 px-2.5 bg-background border border-border/60 rounded-lg text-xs focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              apply({ shipping: shipping === 'with' ? null : 'with' })
            }
            className={cn(
              'text-xs font-bold px-3 py-1.5 rounded-lg ring-1 transition-colors',
              shipping === 'with'
                ? 'bg-primary text-primary-foreground ring-primary/40'
                : 'bg-muted/40 text-muted-foreground ring-border/40 hover:bg-muted'
            )}
          >
            Con envío
          </button>
          <button
            type="button"
            onClick={() =>
              apply({ shipping: shipping === 'without' ? null : 'without' })
            }
            className={cn(
              'text-xs font-bold px-3 py-1.5 rounded-lg ring-1 transition-colors',
              shipping === 'without'
                ? 'bg-amber-200 text-amber-900 ring-amber-300'
                : 'bg-muted/40 text-muted-foreground ring-border/40 hover:bg-muted'
            )}
          >
            Sin envío
          </button>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              startTransition(() => router.push('/admin/orders'));
            }}
            className="ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar filtros
          </button>
        )}

        {pending && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
      </div>
    </div>
  );
}
