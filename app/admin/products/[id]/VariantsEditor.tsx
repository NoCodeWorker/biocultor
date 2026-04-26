'use client';

import { useState, useTransition } from 'react';
import { createVariant, updateVariant, deleteVariant } from '../actions';
import {
  Save,
  Loader2,
  Trash2,
  Plus,
  Star,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ImageUploader from '@/components/admin/ImageUploader';

type VariantData = {
  id: string;
  sku: string;
  size: string;
  target: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  features: string;
  popular: boolean;
  imagePath: string | null;
};

type RowState = {
  saving: boolean;
  deleting: boolean;
  error: string | null;
  success: boolean;
};

export default function VariantsEditor({
  productId,
  initialVariants,
}: {
  productId: string;
  initialVariants: VariantData[];
}) {
  const [variants, setVariants] = useState(initialVariants);
  const [rowState, setRowState] = useState<Record<string, RowState>>({});
  const [showNewForm, setShowNewForm] = useState(false);
  const [, startTransition] = useTransition();

  const setRow = (id: string, patch: Partial<RowState>) => {
    setRowState((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { saving: false, deleting: false, error: null, success: false }), ...patch },
    }));
  };

  const handleSave = (variant: VariantData) => {
    setRow(variant.id, { saving: true, error: null, success: false });
    const fd = new FormData();
    fd.set('sku', variant.sku);
    fd.set('size', variant.size);
    fd.set('target', variant.target);
    fd.set('price', String(variant.price));
    fd.set('comparePrice', variant.comparePrice != null ? String(variant.comparePrice) : '');
    fd.set('stock', String(variant.stock));
    fd.set('features', variant.features);
    if (variant.popular) fd.set('popular', 'on');
    if (variant.imagePath) fd.set('imagePath', variant.imagePath);

    startTransition(async () => {
      const result = await updateVariant(variant.id, fd);
      if (result?.error) {
        setRow(variant.id, { saving: false, error: result.error });
      } else {
        setRow(variant.id, { saving: false, success: true });
        setTimeout(() => setRow(variant.id, { success: false }), 2500);
      }
    });
  };

  const handleDelete = (variant: VariantData) => {
    if (!confirm(`¿Eliminar la variante ${variant.sku} (${variant.size})? Esta acción no se puede deshacer.`)) {
      return;
    }
    setRow(variant.id, { deleting: true, error: null });
    startTransition(async () => {
      const result = await deleteVariant(variant.id);
      if (result?.error) {
        setRow(variant.id, { deleting: false, error: result.error });
      } else {
        setVariants((prev) => prev.filter((v) => v.id !== variant.id));
      }
    });
  };

  const updateVariantField = <K extends keyof VariantData>(
    id: string,
    field: K,
    value: VariantData[K]
  ) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  return (
    <div className="flex flex-col gap-4">
      {variants.length === 0 && !showNewForm && (
        <div className="text-center py-10 border border-dashed border-border/60 rounded-2xl">
          <p className="text-muted-foreground">Aún no hay variantes en este producto.</p>
        </div>
      )}

      {variants.map((variant) => {
        const state = rowState[variant.id] ?? {
          saving: false,
          deleting: false,
          error: null,
          success: false,
        };
        const hasDiscount =
          variant.comparePrice != null && variant.comparePrice > variant.price;
        const discountPct = hasDiscount
          ? Math.round(((variant.comparePrice! - variant.price) / variant.comparePrice!) * 100)
          : 0;

        return (
          <div
            key={variant.id}
            className={cn(
              'rounded-2xl border p-5 transition-colors',
              variant.popular ? 'bg-primary/5 border-primary/30' : 'bg-background border-border/50'
            )}
          >
            <div className="grid grid-cols-12 gap-3">
              <Cell label="SKU" span={2}>
                <input
                  type="text"
                  value={variant.sku}
                  onChange={(e) =>
                    updateVariantField(variant.id, 'sku', e.target.value.toUpperCase())
                  }
                  className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg font-mono text-sm focus:border-primary focus:outline-none"
                />
              </Cell>
              <Cell label="Formato" span={2}>
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => updateVariantField(variant.id, 'size', e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg text-sm focus:border-primary focus:outline-none"
                />
              </Cell>
              <Cell label="Audiencia" span={3}>
                <input
                  type="text"
                  value={variant.target}
                  onChange={(e) => updateVariantField(variant.id, 'target', e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg text-sm focus:border-primary focus:outline-none"
                />
              </Cell>
              <Cell label="Precio €" span={2}>
                <input
                  type="number"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariantField(variant.id, 'price', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg font-bold text-sm focus:border-primary focus:outline-none"
                />
              </Cell>
              <Cell label="Ref. 1 L €" span={2}>
                <input
                  type="number"
                  step="0.01"
                  value={variant.comparePrice ?? ''}
                  placeholder="—"
                  title="Precio equivalente si se comprara en envases de 1 L (N × precio del 1 L). NO es 'precio anterior'."
                  onChange={(e) =>
                    updateVariantField(
                      variant.id,
                      'comparePrice',
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                  className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg text-sm text-muted-foreground focus:border-primary focus:outline-none"
                />
                {hasDiscount && (
                  <span className="text-[10px] font-bold text-primary mt-1 block">
                    -{discountPct}% por L
                  </span>
                )}
              </Cell>
              <Cell label="Stock" span={1}>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariantField(variant.id, 'stock', parseInt(e.target.value, 10) || 0)
                  }
                  className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg text-sm focus:border-primary focus:outline-none"
                />
              </Cell>
            </div>

            <div className="grid grid-cols-12 gap-3 mt-3">
              <Cell label="Features (separadas por comas)" span={9}>
                <input
                  type="text"
                  value={variant.features}
                  onChange={(e) => updateVariantField(variant.id, 'features', e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg text-sm focus:border-primary focus:outline-none"
                />
              </Cell>
              <Cell label="Imagen" span={3}>
                <ImageUploader
                  value={variant.imagePath}
                  onChange={(next) => updateVariantField(variant.id, 'imagePath', next)}
                  size="sm"
                  allowManual
                />
              </Cell>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={variant.popular}
                  onChange={(e) => updateVariantField(variant.id, 'popular', e.target.checked)}
                  className="rounded"
                />
                <Star
                  className={cn(
                    'w-4 h-4',
                    variant.popular ? 'fill-primary text-primary' : 'text-muted-foreground'
                  )}
                />
                <span className="font-semibold">Marcar como popular</span>
              </label>

              <div className="flex items-center gap-3">
                {state.error && (
                  <span className="text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {state.error}
                  </span>
                )}
                {state.success && (
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(variant)}
                  disabled={state.deleting || state.saving}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {state.deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(variant)}
                  disabled={state.saving || state.deleting}
                  className="inline-flex items-center gap-1.5 text-sm font-bold bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {state.saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {showNewForm ? (
        <NewVariantInline
          productId={productId}
          onCreated={(v) => {
            setVariants((prev) => [...prev, v].sort((a, b) => a.price - b.price));
            setShowNewForm(false);
          }}
          onCancel={() => setShowNewForm(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary font-bold py-3 rounded-2xl border-2 border-dashed border-primary/40 hover:bg-primary/15 transition-colors"
        >
          <Plus className="w-5 h-5" /> Añadir nueva variante
        </button>
      )}
    </div>
  );
}

function Cell({
  label,
  span,
  children,
}: {
  label: string;
  span: number;
  children: React.ReactNode;
}) {
  const colSpanClass: Record<number, string> = {
    1: 'col-span-12 md:col-span-1',
    2: 'col-span-12 md:col-span-2',
    3: 'col-span-12 md:col-span-3',
    4: 'col-span-12 md:col-span-4',
    9: 'col-span-12 md:col-span-9',
  };
  return (
    <div className={colSpanClass[span] ?? 'col-span-12'}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}

function NewVariantInline({
  productId,
  onCreated,
  onCancel,
}: {
  productId: string;
  onCreated: (v: VariantData) => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<Omit<VariantData, 'id'>>({
    sku: '',
    size: '',
    target: '',
    price: 0,
    comparePrice: null,
    stock: 0,
    features: '',
    popular: false,
    imagePath: null,
  });

  const submit = () => {
    setError(null);
    const fd = new FormData();
    fd.set('sku', draft.sku);
    fd.set('size', draft.size);
    fd.set('target', draft.target);
    fd.set('price', String(draft.price));
    fd.set('comparePrice', draft.comparePrice != null ? String(draft.comparePrice) : '');
    fd.set('stock', String(draft.stock));
    fd.set('features', draft.features);
    if (draft.popular) fd.set('popular', 'on');
    if (draft.imagePath) fd.set('imagePath', draft.imagePath);

    startTransition(async () => {
      const result = await createVariant(productId, fd);
      if (result?.error) {
        setError(result.error);
      } else {
        // No tenemos el id real desde aquí; recargamos la lista vía router
        // pero como queremos UX inmediata, devolvemos un placeholder y
        // confiamos en que la siguiente revalidación traiga los datos.
        // Forzamos refresh para sincronizar:
        window.location.reload();
      }
    });
  };

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg">Nueva variante</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 hover:bg-card rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <Cell label="SKU *" span={2}>
          <input
            type="text"
            placeholder="ORT-1L"
            value={draft.sku}
            onChange={(e) => setDraft({ ...draft, sku: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg font-mono text-sm focus:border-primary focus:outline-none"
          />
        </Cell>
        <Cell label="Formato *" span={2}>
          <input
            type="text"
            placeholder="1 Litro"
            value={draft.size}
            onChange={(e) => setDraft({ ...draft, size: e.target.value })}
            className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg text-sm focus:border-primary focus:outline-none"
          />
        </Cell>
        <Cell label="Audiencia *" span={3}>
          <input
            type="text"
            placeholder="Jardinero Urbano"
            value={draft.target}
            onChange={(e) => setDraft({ ...draft, target: e.target.value })}
            className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg text-sm focus:border-primary focus:outline-none"
          />
        </Cell>
        <Cell label="Precio € *" span={2}>
          <input
            type="number"
            step="0.01"
            value={draft.price || ''}
            onChange={(e) => setDraft({ ...draft, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg font-bold text-sm focus:border-primary focus:outline-none"
          />
        </Cell>
        <Cell label="Ref. 1 L €" span={2}>
          <input
            type="number"
            step="0.01"
            value={draft.comparePrice ?? ''}
            title="Precio equivalente si se comprara en envases de 1 L (N × precio del 1 L). NO es 'precio anterior'."
            onChange={(e) =>
              setDraft({
                ...draft,
                comparePrice: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg text-sm text-muted-foreground focus:border-primary focus:outline-none"
          />
        </Cell>
        <Cell label="Stock" span={1}>
          <input
            type="number"
            value={draft.stock || ''}
            onChange={(e) => setDraft({ ...draft, stock: parseInt(e.target.value, 10) || 0 })}
            className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg text-sm focus:border-primary focus:outline-none"
          />
        </Cell>
      </div>

      <div className="grid grid-cols-12 gap-3 mt-3">
        <Cell label="Features (separadas por comas)" span={9}>
          <input
            type="text"
            placeholder="Para 100L de riego, Aplicación foliar"
            value={draft.features}
            onChange={(e) => setDraft({ ...draft, features: e.target.value })}
            className="w-full px-3 py-2 bg-card border border-border/60 rounded-lg text-sm focus:border-primary focus:outline-none"
          />
        </Cell>
        <Cell label="Imagen" span={3}>
          <ImageUploader
            value={draft.imagePath}
            onChange={(next) => setDraft({ ...draft, imagePath: next })}
            size="sm"
            allowManual
          />
        </Cell>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={draft.popular}
            onChange={(e) => setDraft({ ...draft, popular: e.target.checked })}
            className="rounded"
          />
          <Star
            className={cn(
              'w-4 h-4',
              draft.popular ? 'fill-primary text-primary' : 'text-muted-foreground'
            )}
          />
          <span className="font-semibold">Popular</span>
        </label>

        <div className="flex items-center gap-3">
          {error && (
            <span className="text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </span>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground px-4 py-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="inline-flex items-center gap-1.5 text-sm font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Crear variante
          </button>
        </div>
      </div>
    </div>
  );
}
