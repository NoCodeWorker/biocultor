'use client';

import { useMemo, useState } from 'react';
import { Loader2, Save, Search, Upload } from 'lucide-react';
import { updateSeoPage } from './actions';
import { uploadImage } from './upload-action';
import { cn } from '@/lib/utils';

type SeoPageRecord = {
  id: string;
  kind: string;
  slug: string;
  title: string;
  targetKeyword: string | null;
  workflowStatus: string;
  priorityScore: number;
  notes: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  intro: string | null;
  excerpt: string | null;
  image: string | null;
  label: string | null;
  readTime: string | null;
  payloadJson: string;
  faqJson: string;
  summaryJson: string;
  isPublished: boolean;
  updatedAt: string;
};

const kindLabels: Record<string, string> = {
  ARTICLE: 'Informacional',
  COMMERCIAL: 'Transaccional',
  GEO: 'GEO/IA',
  SOLUTION: 'Aplicación',
};

const workflowLabels: Record<string, string> = {
  PRIORITY: 'Prioridad',
  READY: 'Ready',
  REFINE: 'Refinar',
  HOLD: 'Hold',
};

export default function SeoPagesEditor({ pages }: { pages: SeoPageRecord[] }) {
  const [items, setItems] = useState(pages);
  const [kindFilter, setKindFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(pages[0]?.id ?? null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const orderedQueue = useMemo(
    () => [...items].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 6),
    [items]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesKind = kindFilter === 'ALL' || item.kind === kindFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.slug.toLowerCase().includes(normalizedQuery) ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        (item.label || '').toLowerCase().includes(normalizedQuery);

      return matchesKind && matchesQuery;
    });
  }, [items, kindFilter, query]);

  const updateField = (
    id: string,
    field: keyof SeoPageRecord,
    value: string | boolean | number
  ) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async (item: SeoPageRecord) => {
    setSavingId(item.id);
    setMessage(null);
    const result = await updateSeoPage({
      id: item.id,
      kind: item.kind,
      slug: item.slug,
      title: item.title,
      targetKeyword: item.targetKeyword || '',
      workflowStatus: item.workflowStatus,
      priorityScore: item.priorityScore,
      notes: item.notes || '',
      metaTitle: item.metaTitle || '',
      metaDescription: item.metaDescription || '',
      intro: item.intro || '',
      excerpt: item.excerpt || '',
      image: item.image || '',
      label: item.label || '',
      readTime: item.readTime || '',
      payloadJson: item.payloadJson,
      faqJson: item.faqJson,
      summaryJson: item.summaryJson,
      isPublished: item.isPublished,
    });

    setSavingId(null);
    if (result.success) {
      setMessage({ type: 'success', text: `Guardado SEO para ${item.slug}` });
      return;
    }

    setMessage({ type: 'error', text: result.error || 'Error desconocido' });
  };

  return (
    <div className="rounded-[2rem] border border-border/50 bg-card shadow-2xl shadow-black/5 overflow-hidden">
      <div className="border-b border-border/50 p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-heading font-black tracking-tight">Editor SEO</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">
              Edita metadata, copy y payloads persistentes de las páginas SEO sin tocar el código.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar slug o título"
                className="h-11 w-full rounded-xl border border-border/50 bg-background pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 md:w-64"
              />
            </label>

            <select
              value={kindFilter}
              onChange={(event) => setKindFilter(event.target.value)}
              className="h-11 rounded-xl border border-border/50 bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="ALL">Todos los dominios</option>
              <option value="COMMERCIAL">Transaccional</option>
              <option value="ARTICLE">Informacional</option>
              <option value="GEO">GEO/IA</option>
              <option value="SOLUTION">Aplicaciones</option>
            </select>
          </div>
        </div>

        {message && (
          <div
            className={cn(
              'mt-5 rounded-2xl px-4 py-3 text-sm font-semibold',
              message.type === 'success'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
            )}
          >
            {message.text}
          </div>
        )}
      </div>

      <div className="border-b border-border/50 p-6 md:p-8 bg-muted/10">
        <h3 className="text-lg font-heading font-bold tracking-tight">Cola de ejecución recomendada</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orderedQueue.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenId(item.id)}
              className="rounded-2xl border border-border/50 bg-background p-5 text-left transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">
                  {kindLabels[item.kind] || item.kind}
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {item.priorityScore}/100
                </span>
              </div>
              <h4 className="mt-3 text-lg font-heading font-bold leading-tight">{item.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{item.targetKeyword || item.slug}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {workflowLabels[item.workflowStatus] || item.workflowStatus}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {filteredItems.map((item) => {
          const isOpen = openId === item.id;
          const isSaving = savingId === item.id;

          return (
            <section key={item.id} className="p-6 md:p-8">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full flex-col gap-4 text-left md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                      {kindLabels[item.kind] || item.kind}
                    </span>
                    {!item.isPublished && (
                      <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-2xl font-heading font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{item.slug}</p>
                </div>

                <div className="text-sm text-muted-foreground">
                  Última actualización: {new Date(item.updatedAt).toLocaleString('es-ES')}
                </div>
              </button>

              {isOpen && (
                <div className="mt-8 grid gap-8">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Título</span>
                      <input
                        value={item.title}
                        onChange={(event) => updateField(item.id, 'title', event.target.value)}
                        className="h-11 rounded-xl border border-border/50 bg-background px-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Etiqueta / categoría</span>
                      <input
                        value={item.label || ''}
                        onChange={(event) => updateField(item.id, 'label', event.target.value)}
                        className="h-11 rounded-xl border border-border/50 bg-background px-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="flex flex-col gap-2 md:col-span-2">
                      <span className="text-sm font-semibold">Keyword objetivo</span>
                      <input
                        value={item.targetKeyword || ''}
                        onChange={(event) => updateField(item.id, 'targetKeyword', event.target.value)}
                        className="h-11 rounded-xl border border-border/50 bg-background px-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Prioridad</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={item.priorityScore}
                        onChange={(event) =>
                          updateField(item.id, 'priorityScore', Number(event.target.value))
                        }
                        className="h-11 rounded-xl border border-border/50 bg-background px-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Estado editorial</span>
                      <select
                        value={item.workflowStatus}
                        onChange={(event) =>
                          updateField(item.id, 'workflowStatus', event.target.value)
                        }
                        className="h-11 rounded-xl border border-border/50 bg-background px-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      >
                        <option value="PRIORITY">Prioridad</option>
                        <option value="READY">Ready</option>
                        <option value="REFINE">Refinar</option>
                        <option value="HOLD">Hold</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Notas</span>
                      <input
                        value={item.notes || ''}
                        onChange={(event) => updateField(item.id, 'notes', event.target.value)}
                        className="h-11 rounded-xl border border-border/50 bg-background px-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold">Meta title</span>
                    <input
                      value={item.metaTitle || ''}
                      onChange={(event) => updateField(item.id, 'metaTitle', event.target.value)}
                      className="h-11 rounded-xl border border-border/50 bg-background px-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold">Meta description</span>
                    <textarea
                      rows={3}
                      value={item.metaDescription || ''}
                      onChange={(event) => updateField(item.id, 'metaDescription', event.target.value)}
                      className="rounded-xl border border-border/50 bg-background p-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Intro</span>
                      <textarea
                        rows={5}
                        value={item.intro || ''}
                        onChange={(event) => updateField(item.id, 'intro', event.target.value)}
                        className="rounded-xl border border-border/50 bg-background p-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Excerpt</span>
                      <textarea
                        rows={5}
                        value={item.excerpt || ''}
                        onChange={(event) => updateField(item.id, 'excerpt', event.target.value)}
                        className="rounded-xl border border-border/50 bg-background p-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <span className="text-sm font-semibold">Imagen</span>
                      <div className="flex gap-2">
                        <input
                          value={item.image || ''}
                          onChange={(event) => updateField(item.id, 'image', event.target.value)}
                          className="h-11 flex-1 rounded-xl border border-border/50 bg-background px-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />
                        <label className="flex h-11 cursor-pointer items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:opacity-90">
                          <Upload className="mr-2 h-4 w-4" />
                          Subir
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file);
                              const res = await uploadImage(formData);
                              if (res.success && res.url) {
                                updateField(item.id, 'image', res.url);
                              } else {
                                alert(res.error || 'Error subiendo la imagen');
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Read time</span>
                      <input
                        value={item.readTime || ''}
                        onChange={(event) => updateField(item.id, 'readTime', event.target.value)}
                        className="h-11 rounded-xl border border-border/50 bg-background px-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Payload JSON</span>
                      <textarea
                        rows={8}
                        value={item.payloadJson}
                        onChange={(event) => updateField(item.id, 'payloadJson', event.target.value)}
                        className="rounded-xl border border-border/50 bg-background p-4 font-mono text-xs outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">FAQ JSON</span>
                      <textarea
                        rows={8}
                        value={item.faqJson}
                        onChange={(event) => updateField(item.id, 'faqJson', event.target.value)}
                        className="rounded-xl border border-border/50 bg-background p-4 font-mono text-xs outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Summary JSON</span>
                      <textarea
                        rows={5}
                        value={item.summaryJson}
                        onChange={(event) => updateField(item.id, 'summaryJson', event.target.value)}
                        className="rounded-xl border border-border/50 bg-background p-4 font-mono text-xs outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </label>
                  </div>

                  <label className="flex items-center gap-3 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={item.isPublished}
                      onChange={(event) => updateField(item.id, 'isPublished', event.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    Publicada
                  </label>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSave(item)}
                      disabled={isSaving}
                      className={cn(
                        'inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition-all',
                        isSaving
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-foreground text-background hover:bg-primary hover:text-primary-foreground'
                      )}
                    >
                      {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                      {isSaving ? 'Guardando' : 'Guardar SEO'}
                    </button>
                  </div>
                </div>
              )}
            </section>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-8 text-sm text-muted-foreground">No hay páginas SEO que coincidan con el filtro actual.</div>
        )}
      </div>
    </div>
  );
}
