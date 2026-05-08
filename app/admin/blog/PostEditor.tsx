'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Eye, EyeOff, Trash2, AlertCircle, CheckCircle2, ExternalLink, ImageIcon } from 'lucide-react';
import { updatePost, deletePost, togglePublished } from './actions';

const CATEGORIES = [
  { value: 'KNOWLEDGE', label: 'Guía' },
  { value: 'EVIDENCE', label: 'Evidencia' },
  { value: 'EDITORIAL', label: 'Editorial' },
  { value: 'TECHNICAL', label: 'Técnico' },
];

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  isPublished: boolean;
  author: string;
  metaTitle: string | null;
  metaDesc: string | null;
  keywords: string;
  coverImage: string | null;
};

export default function PostEditor({ post }: { post: Post }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPublished, setIsPublished] = useState(post.isPublished);

  // Local form values
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState(post.category);
  const [metaTitle, setMetaTitle] = useState(post.metaTitle ?? '');
  const [metaDesc, setMetaDesc] = useState(post.metaDesc ?? '');
  const [keywords, setKeywords] = useState(post.keywords);
  const [coverImage, setCoverImage] = useState(post.coverImage ?? '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleImageUpload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error al subir');
      setCoverImage(data.url);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    const fd = new FormData();
    fd.set('title', title);
    fd.set('slug', slug);
    fd.set('excerpt', excerpt);
    fd.set('content', content);
    fd.set('category', category);
    fd.set('metaTitle', metaTitle);
    fd.set('metaDesc', metaDesc);
    fd.set('keywords', keywords);
    fd.set('coverImage', coverImage);
    if (isPublished) fd.set('isPublished', 'on');

    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updatePost(post.id, fd);
      if (result.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  function handleTogglePublish() {
    const next = !isPublished;
    startTransition(async () => {
      await togglePublished(post.id, next);
      setIsPublished(next);
    });
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar "${post.title}" permanentemente? No se puede deshacer.`)) return;
    startTransition(async () => {
      await deletePost(post.id);
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border/60 rounded-2xl px-5 py-3 sticky top-4 z-20">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          <span className="text-sm font-semibold text-foreground">
            {isPublished ? 'Publicado' : 'Borrador'}
          </span>
          {post.slug && (
            <a
              href={`/aprende/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
            >
              Ver <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <span className="flex items-center gap-1 text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </span>
          )}
          {saved && (
            <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
            </span>
          )}
          <button
            onClick={handleTogglePublish}
            disabled={pending}
            className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
              isPublished
                ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            {isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isPublished ? 'Despublicar' : 'Publicar'}
          </button>
          <button
            onClick={handleSave}
            disabled={pending}
            className="inline-flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-brand-green-hover transition-colors disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar
          </button>
        </div>
      </div>

      {/* Main fields */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Content column */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <section className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-heading font-bold">Contenido</h2>
            <Field label="Título *">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={INPUT}
                placeholder="Título del artículo"
              />
            </Field>
            <Field label="Slug *">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">/aprende/</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className={INPUT + ' flex-1'}
                  placeholder="url-del-articulo"
                />
              </div>
            </Field>
            <Field label="Extracto *">
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className={INPUT + ' resize-none'}
                placeholder="Resumen breve del artículo (aparece en listados)"
              />
            </Field>
            <Field label="Contenido (Markdown / texto) *">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className={INPUT + ' resize-y font-mono text-sm'}
                placeholder="Escribe aquí el contenido completo del artículo..."
              />
            </Field>
          </section>
        </div>

        {/* Sidebar: meta + config */}
        <div className="flex flex-col gap-5">
          <section className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-heading font-bold">Configuración</h2>
            <Field label="Categoría">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={INPUT}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Autor">
              <input
                defaultValue={post.author}
                disabled
                className={INPUT + ' opacity-60'}
              />
            </Field>
          </section>

          <section className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-heading font-bold">Imagen de cabecera</h2>

            {/* Drop zone / upload */}
            <label
              className={`relative flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden
                ${uploading ? 'opacity-60 pointer-events-none' : 'hover:border-primary/60'}
                ${coverImage ? 'border-border/40' : 'border-border/30 bg-muted/20'}`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 p-4 text-center pointer-events-none">
                  {uploading
                    ? <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    : <ImageIcon className="w-8 h-8 text-muted-foreground/40" />}
                  <p className="text-sm font-medium text-muted-foreground">
                    {uploading ? 'Subiendo...' : 'Haz clic para subir imagen'}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">JPG · PNG · WEBP · AVIF · máx 5 MB</p>
                </div>
              )}
              {coverImage && uploading && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </label>

            {/* Cambiar / quitar */}
            {coverImage && !uploading && (
              <div className="flex gap-2 flex-wrap">
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  Cambiar imagen
                </label>
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="text-xs font-semibold text-destructive hover:underline"
                >
                  Quitar imagen
                </button>
              </div>
            )}

            {/* URL manual (fallback) */}
            <Field label="O pega una URL externa">
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className={INPUT}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </Field>

            {uploadError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {uploadError}
              </p>
            )}
          </section>

          <section className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-heading font-bold">SEO</h2>
            <Field label="Meta título">
              <input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className={INPUT}
                placeholder={title || 'Título SEO'}
              />
              <p className="text-[10px] text-muted-foreground mt-1">{metaTitle.length}/60 caracteres</p>
            </Field>
            <Field label="Meta descripción">
              <textarea
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                rows={3}
                className={INPUT + ' resize-none'}
                placeholder={excerpt || 'Descripción SEO'}
              />
              <p className="text-[10px] text-muted-foreground mt-1">{metaDesc.length}/160 caracteres</p>
            </Field>
            <Field label="Keywords (comas)">
              <input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className={INPUT}
                placeholder="té de humus, lombriz, abono..."
              />
            </Field>
          </section>

          {/* Danger zone */}
          <section className="bg-red-50/50 border border-red-200/60 rounded-2xl p-5">
            <h2 className="text-sm font-heading font-bold text-red-900 mb-2">Zona de peligro</h2>
            <p className="text-xs text-red-800/70 mb-4">
              Eliminar este artículo es permanente e irreversible.
            </p>
            <button
              onClick={handleDelete}
              disabled={pending}
              className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Eliminar artículo
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

const INPUT = 'w-full bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
