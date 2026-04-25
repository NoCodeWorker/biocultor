'use client';

import { useActionState, useState } from 'react';
import { updateProduct, initialActionState } from '../actions';
import { Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  benefits: string;
};

export default function ProductForm({ product }: { product: Product }) {
  const action = updateProduct.bind(null, product.id);
  const [state, formAction, pending] = useActionState(action, initialActionState);

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field label="Nombre" name="name" value={name} onChange={setName} required />
      <Field label="Slug" name="slug" value={slug} onChange={setSlug} required mono />
      <FieldArea label="Descripción" name="description" defaultValue={product.description} required />
      <FieldArea
        label="Beneficios"
        hint="Separados por comas"
        name="benefits"
        defaultValue={product.benefits}
      />

      {state?.error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm leading-relaxed">{state.error}</p>
        </div>
      )}
      {state?.success && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm leading-relaxed">Cambios guardados.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:bg-brand-green-hover transition-colors disabled:opacity-50 w-fit"
      >
        {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {pending ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  required,
  mono,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  mono?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-foreground">{label}{required && <span className="text-primary ml-1">*</span>}</span>
      <input
        type="text"
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 bg-background border-2 border-border/50 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all ${mono ? 'font-mono text-sm' : ''}`}
      />
    </label>
  );
}

function FieldArea({
  label,
  hint,
  name,
  defaultValue,
  required,
}: {
  label: string;
  hint?: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-foreground">{label}{required && <span className="text-primary ml-1">*</span>}</span>
      {hint && <span className="text-xs text-muted-foreground leading-snug">{hint}</span>}
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={3}
        className="w-full px-4 py-3 bg-background border-2 border-border/50 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all leading-relaxed"
      />
    </label>
  );
}
