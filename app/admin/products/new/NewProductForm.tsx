'use client';

import { useActionState, useState } from 'react';
import { createProduct, initialActionState } from '../actions';
import { Loader2, AlertCircle } from 'lucide-react';

export default function NewProductForm() {
  const [state, formAction, pending] = useActionState(createProduct, initialActionState);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  // Auto-generar slug a partir del nombre la primera vez
  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug) {
      const auto = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(auto);
    }
  };

  return (
    <form action={formAction} className="bg-card border border-border/60 rounded-3xl p-8 flex flex-col gap-6">
      <Field
        label="Nombre"
        hint="Visible al cliente. Ej: Té de Humus de Lombriz Biocultor"
        name="name"
        value={name}
        onChange={handleNameChange}
        required
      />
      <Field
        label="Slug"
        hint="URL del producto. Solo minúsculas, números y guiones. Ej: te-humus-liquido-premium"
        name="slug"
        value={slug}
        onChange={setSlug}
        required
        mono
      />
      <FieldArea
        label="Descripción"
        hint="Visible en la ficha del producto. 1-3 frases comerciales sin promesas vacías."
        name="description"
        required
      />
      <FieldArea
        label="Beneficios"
        hint="Lista separada por comas. Ej: Regenera microbiota, Aplicación foliar, Alta concentración"
        name="benefits"
      />

      {state?.error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm leading-relaxed">{state.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:bg-brand-green-hover transition-colors disabled:opacity-50"
      >
        {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
        {pending ? 'Creando…' : 'Crear producto'}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  name,
  value,
  onChange,
  required,
  mono,
}: {
  label: string;
  hint?: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  mono?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-foreground">{label}{required && <span className="text-primary ml-1">*</span>}</span>
      {hint && <span className="text-xs text-muted-foreground leading-snug">{hint}</span>}
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
  required,
}: {
  label: string;
  hint?: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-foreground">{label}{required && <span className="text-primary ml-1">*</span>}</span>
      {hint && <span className="text-xs text-muted-foreground leading-snug">{hint}</span>}
      <textarea
        name={name}
        required={required}
        rows={3}
        className="w-full px-4 py-3 bg-background border-2 border-border/50 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all leading-relaxed"
      />
    </label>
  );
}
