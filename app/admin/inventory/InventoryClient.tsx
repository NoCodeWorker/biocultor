'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { patchVariantStock } from './actions';

type VariantRow = {
  id: string;
  sku: string;
  size: string;
  price: number;
  stock: number;
  popular: boolean;
  productId: string;
  productName: string;
  productSlug: string;
};

type RowState = {
  stock: number;
  saving: boolean;
  saved: boolean;
  error: string | null;
  dirty: boolean;
};

const LOW = 10;
const CRITICAL = 3;

function stockColor(stock: number) {
  if (stock === 0) return 'text-red-700 bg-red-100 border-red-300';
  if (stock <= CRITICAL) return 'text-red-600 bg-red-50 border-red-200';
  if (stock <= LOW) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-emerald-700 bg-emerald-50 border-emerald-200';
}

export default function InventoryClient({ variants }: { variants: VariantRow[] }) {
  const [, startTransition] = useTransition();

  const [rows, setRows] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(
      variants.map((v) => [
        v.id,
        { stock: v.stock, saving: false, saved: false, error: null, dirty: false },
      ])
    )
  );

  function setRow(id: string, patch: Partial<RowState>) {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function handleChange(id: string, value: number) {
    const clean = Math.max(0, Math.floor(value));
    setRow(id, { stock: clean, dirty: clean !== variants.find((v) => v.id === id)!.stock, saved: false });
  }

  function handleSave(id: string) {
    const row = rows[id];
    if (!row || !row.dirty) return;
    setRow(id, { saving: true, error: null, saved: false });
    startTransition(async () => {
      const result = await patchVariantStock(id, row.stock);
      if (result.success) {
        setRow(id, { saving: false, saved: true, dirty: false });
        setTimeout(() => setRow(id, { saved: false }), 2500);
      } else {
        setRow(id, { saving: false, error: result.error });
      }
    });
  }

  const dirtyCount = Object.values(rows).filter((r) => r.dirty).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Dirty indicator */}
      {dirtyCount > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {dirtyCount} variante{dirtyCount > 1 ? 's' : ''} con cambios sin guardar. Haz clic en
          Guardar en cada fila para confirmar.
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        {/* Headers */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto_auto_auto] gap-4 items-center px-5 py-3 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>Variante / Producto</span>
          <span>Precio</span>
          <span>Estado</span>
          <span className="text-center w-36">Stock</span>
          <span className="w-24" />
          <span className="w-6" />
        </div>

        <ul className="divide-y divide-border/30">
          {variants.map((v) => {
            const row = rows[v.id];
            if (!row) return null;
            const isLow = row.stock <= LOW && row.stock > 0;
            const isOut = row.stock === 0;

            return (
              <li
                key={v.id}
                className={`flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_auto_auto_auto] gap-3 md:gap-4 items-start md:items-center px-5 py-4 transition-colors ${
                  row.dirty ? 'bg-amber-50/30' : 'hover:bg-muted/20'
                }`}
              >
                {/* Variant + product */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-secondary-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {v.sku}
                    </span>
                    {v.popular && (
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        ★ Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{v.size}</p>
                  <p className="text-xs text-muted-foreground truncate">{v.productName}</p>
                </div>

                {/* Price */}
                <div>
                  <span className="text-sm font-heading font-bold text-foreground">
                    €{v.price.toFixed(2)}
                  </span>
                </div>

                {/* Status badge */}
                <div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border ${stockColor(row.stock)}`}
                  >
                    {row.stock === 0
                      ? 'Agotado'
                      : row.stock <= CRITICAL
                      ? 'Crítico'
                      : row.stock <= LOW
                      ? 'Bajo'
                      : 'OK'}
                  </span>
                </div>

                {/* Stock spinner */}
                <div className="flex items-center gap-1 w-36">
                  <button
                    onClick={() => handleChange(v.id, row.stock - 1)}
                    disabled={row.saving || row.stock <= 0}
                    className="w-7 h-7 rounded-lg border border-border/60 bg-muted/40 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    value={row.stock}
                    min={0}
                    onChange={(e) => handleChange(v.id, parseInt(e.target.value, 10) || 0)}
                    className={`w-16 text-center text-sm font-heading font-bold rounded-lg border px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                      row.dirty
                        ? 'border-amber-400 bg-amber-50 text-amber-900'
                        : 'border-border/60 bg-muted/30 text-foreground'
                    }`}
                  />
                  <button
                    onClick={() => handleChange(v.id, row.stock + 1)}
                    disabled={row.saving}
                    className="w-7 h-7 rounded-lg border border-border/60 bg-muted/40 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Save / feedback */}
                <div className="w-24 flex items-center gap-2">
                  {row.error && (
                    <span className="text-[10px] text-red-700 bg-red-50 px-2 py-1 rounded">
                      {row.error}
                    </span>
                  )}
                  {row.saved && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-bold">
                      <CheckCircle2 className="w-3 h-3" /> OK
                    </span>
                  )}
                  {row.dirty && !row.saving && (
                    <button
                      onClick={() => handleSave(v.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-brand-green-hover transition-colors"
                    >
                      <Save className="w-3 h-3" /> Guardar
                    </button>
                  )}
                  {row.saving && (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  )}
                </div>

                {/* Link to product */}
                <div className="w-6 flex justify-end">
                  <Link
                    href={`/admin/products/${v.productId}`}
                    title="Editar producto completo"
                    className="text-muted-foreground/40 hover:text-primary transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
