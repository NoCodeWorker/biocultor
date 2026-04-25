'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ALLOWED_PER_PAGE } from './_query';

export default function OrdersPagination({
  page,
  perPage,
  totalResults,
}: {
  page: number;
  perPage: number;
  totalResults: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));

  const navigate = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    });
    router.push(`/admin/orders?${next.toString()}`);
  };

  const from = totalResults === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(totalResults, page * perPage);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1">
      <p className="text-xs text-muted-foreground">
        Mostrando <strong className="text-foreground">{from.toLocaleString('es-ES')}</strong>–
        <strong className="text-foreground">{to.toLocaleString('es-ES')}</strong> de{' '}
        <strong className="text-foreground">{totalResults.toLocaleString('es-ES')}</strong>
      </p>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Por página:</span>
          <select
            value={perPage}
            onChange={(e) => navigate({ perPage: e.target.value, page: '1' })}
            className="h-8 px-2 bg-card border border-border/60 rounded-lg text-xs font-semibold focus:border-primary focus:outline-none cursor-pointer"
          >
            {ALLOWED_PER_PAGE.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => navigate({ page: String(page - 1) })}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-card border border-border/60 hover:bg-muted text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-foreground px-3">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => navigate({ page: String(page + 1) })}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-card border border-border/60 hover:bg-muted text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
