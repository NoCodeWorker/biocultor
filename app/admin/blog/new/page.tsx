'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { createPost } from '../actions';

const CATEGORIES = [
  { value: 'KNOWLEDGE', label: 'Guía' },
  { value: 'EVIDENCE', label: 'Evidencia' },
  { value: 'EDITORIAL', label: 'Editorial' },
  { value: 'TECHNICAL', label: 'Técnico' },
];

const INPUT = 'w-full bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

export default function NewPostPage() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('KNOWLEDGE');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [keywords, setKeywords] = useState('');

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slug || slug === title.toLowerCase().replace(/\s+/g, '-')) {
      setSlug(v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }

  function handleSubmit() {
    const fd = new FormData();
    fd.set('title', title);
    fd.set('slug', slug);
    fd.set('excerpt', excerpt);
    fd.set('content', content);
    fd.set('category', category);
    fd.set('metaTitle', metaTitle);
    fd.set('metaDesc', metaDesc);
    fd.set('keywords', keywords);

    setError(null);
    startTransition(async () => {
      const result = await createPost(fd);
      if (result?.error) setError(result.error);
      // Si éxito, redirect ocurre en la server action
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Blog
      </Link>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">Nuevo</p>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-foreground tracking-tight mt-1">
            Crear artículo
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <span className="flex items-center gap-1 text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </span>
          )}
          <button
            onClick={handleSubmit}
            disabled={pending}
            className="inline-flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground px-4 py-2.5 rounded-xl hover:bg-brand-green-hover transition-colors disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Crear artículo
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-5">
          <section className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-heading font-bold">Contenido</h2>
            <Field label="Título *">
              <input value={title} onChange={(e) => handleTitleChange(e.target.value)} className={INPUT} placeholder="Título del artículo" />
            </Field>
            <Field label="Slug *">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">/aprende/</span>
                <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} className={INPUT + ' flex-1'} placeholder="url-del-articulo" />
              </div>
            </Field>
            <Field label="Extracto *">
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={INPUT + ' resize-none'} placeholder="Resumen breve del artículo" />
            </Field>
            <Field label="Contenido *">
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} className={INPUT + ' resize-y font-mono text-sm'} placeholder="Escribe aquí el contenido..." />
            </Field>
          </section>
        </div>

        <div className="flex flex-col gap-5">
          <section className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-heading font-bold">Configuración</h2>
            <Field label="Categoría">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={INPUT}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
          </section>

          <section className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-heading font-bold">SEO</h2>
            <Field label="Meta título">
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={INPUT} placeholder={title || 'Meta título'} />
            </Field>
            <Field label="Meta descripción">
              <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={3} className={INPUT + ' resize-none'} placeholder={excerpt || 'Meta descripción'} />
            </Field>
            <Field label="Keywords (comas)">
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className={INPUT} placeholder="té de humus, lombriz..." />
            </Field>
          </section>
        </div>
      </div>
    </div>
  );
}
