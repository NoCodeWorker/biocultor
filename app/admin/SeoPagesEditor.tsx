'use client';

import { useMemo, useState } from 'react';
import { Loader2, Save, Search, ExternalLink } from 'lucide-react';
import { updateSeoPage } from './actions';
import { cn } from '@/lib/utils';
import ImageUploader from '@/components/admin/ImageUploader';

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
  LANDING: 'Landing Especial',
  SERVICIO: 'Servicio',
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

  const updatePayloadField = (id: string, key: string, value: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        let payload: any = {};
        try {
          payload = JSON.parse(item.payloadJson || '{}');
        } catch (e) {
          payload = {};
        }
        const newPayload = { ...payload, [key]: value };
        return { ...item, payloadJson: JSON.stringify(newPayload) };
      })
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
              <option value="LANDING">Landings</option>
              <option value="SERVICIO">Servicios</option>
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
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
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
                    <div className="mt-3 flex items-center gap-3">
                      <h3 className="text-2xl font-heading font-bold tracking-tight">{item.title}</h3>
                      <a
                        href={
                          item.kind === 'SOLUTION'
                            ? `/te-de-humus-de-lombriz/${item.slug}`
                            : item.kind === 'SOLUTION_ORTIGA'
                            ? `/purin-de-ortiga/${item.slug}`
                            : item.kind === 'COMMERCIAL'
                            ? `/comprar-te-de-humus-de-lombriz/${item.slug}`
                            : item.kind === 'COMMERCIAL_ORTIGA'
                            ? `/comprar-purin-de-ortiga/${item.slug}`
                            : item.kind === 'GEO'
                            ? `/espana/${item.slug}`
                            : item.kind === 'LANDING'
                            ? `/solucion-humus/${item.slug}`
                            : item.kind === 'SERVICIO'
                            ? `/servicios/${item.slug}`
                            : `/aprende/${item.slug}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
                      >
                        Ver <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{item.slug}</p>
                  </div>
  
                  <div className="text-sm text-muted-foreground">
                    Última actualización: {new Date(item.updatedAt).toLocaleString('es-ES')}
                  </div>
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
                      <ImageUploader
                        value={item.image || null}
                        onChange={(next) => updateField(item.id, 'image', next ?? '')}
                        size="md"
                        allowManual
                        hint="Recomendado: 1200×630 para portada de blog/SEO. Formatos: jpg, png, webp, avif, svg. Máx 8MB."
                      />
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

                  {item.kind === 'SERVICIO' && (
                    <div className="p-6 rounded-[1.5rem] bg-primary/5 border border-primary/20 space-y-3">
                      <h4 className="font-heading font-bold text-foreground">💡 Editor de Servicios Disponible</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Este registro es un servicio. Puedes editar su meta title y meta description aquí, pero para gestionar el precio, imágenes antes/después, trust badges y preguntas frecuentes de forma visual, te recomendamos usar el <a href="/admin/servicios" className="text-primary font-bold underline">Gestor de Servicios Especializado</a>.
                      </p>
                    </div>
                  )}

                  {item.kind === 'LANDING' && (
                    <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 space-y-8">
                      <div>
                        <h3 className="text-xl font-heading font-bold tracking-tight text-primary">Contenido Visual y Texto de la Landing</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.slug === 'protocolo-cultivo-biologico-profesional'
                            ? 'Gestiona las imágenes del Hero y de cada una de las 3 fases del protocolo.'
                            : 'Gestiona la imagen de cabecera (Hero) y el contenido Markdown de la landing programmática GEO.'}
                        </p>
                      </div>

                      {/* ── PROTOCOLO: Hero + 3 fases ── */}
                      {item.slug === 'protocolo-cultivo-biologico-profesional' ? (
                        <div className="grid gap-8 md:grid-cols-2">
                          <div className="space-y-4">
                            <ImageUploader
                              label="Imagen Hero (Cabecera)"
                              value={(() => {
                                try { return JSON.parse(item.payloadJson).heroImage || ''; } catch { return ''; }
                              })()}
                              onChange={(url) => updatePayloadField(item.id, 'heroImage', url || '')}
                              size="lg"
                              allowManual
                              hint="Imagen de fondo para la sección principal."
                            />
                          </div>
                          <div className="space-y-4">
                            <ImageUploader
                              label="Fase 1: Protección Radicular"
                              value={(() => {
                                try { return JSON.parse(item.payloadJson).section1Image || ''; } catch { return ''; }
                              })()}
                              onChange={(url) => updatePayloadField(item.id, 'section1Image', url || '')}
                              size="lg"
                              allowManual
                              hint="Imagen para la sección de Té de Humus y Raíces."
                            />
                          </div>
                          <div className="space-y-4">
                            <ImageUploader
                              label="Fase 2: Aceleración Vegetativa"
                              value={(() => {
                                try { return JSON.parse(item.payloadJson).section2Image || ''; } catch { return ''; }
                              })()}
                              onChange={(url) => updatePayloadField(item.id, 'section2Image', url || '')}
                              size="lg"
                              allowManual
                              hint="Imagen para la sección de Purín de Ortiga y Crecimiento."
                            />
                          </div>
                          <div className="space-y-4">
                            <ImageUploader
                              label="Fase 3: Elicitación y Resina"
                              value={(() => {
                                try { return JSON.parse(item.payloadJson).section3Image || ''; } catch { return ''; }
                              })()}
                              onChange={(url) => updatePayloadField(item.id, 'section3Image', url || '')}
                              size="lg"
                              allowManual
                              hint="Imagen para la sección de Floración y Terpenos."
                            />
                          </div>
                        </div>
                      ) : (
                        /* ── LANDINGS GEO PROGRAMÁTICAS: Hero + Markdown ── */
                        <div className="grid gap-8 md:grid-cols-2">
                          <div className="space-y-4">
                            <ImageUploader
                              label="Imagen Hero (Cabecera)"
                              value={(() => {
                                try { return JSON.parse(item.payloadJson).heroImage || ''; } catch { return ''; }
                              })()}
                              onChange={(url) => updatePayloadField(item.id, 'heroImage', url || '')}
                              size="lg"
                              allowManual
                              hint="Imagen de fondo del hero de la landing. Recomendado: 16:9 (ej. 1600×900px)."
                            />
                          </div>
                          <div className="flex flex-col justify-center p-5 rounded-2xl bg-background border border-border/50 text-sm text-muted-foreground space-y-2">
                            <p className="font-semibold text-foreground">Landing Programática GEO</p>
                            <p>El contenido de esta landing se genera dinámicamente desde el <strong>Markdown</strong> que escribes abajo. No necesita imágenes de fases: el layout se divide automáticamente por secciones <code className="text-xs bg-muted px-1 py-0.5 rounded">## Título</code>.</p>
                          </div>
                        </div>
                      )}

                      <div className="grid gap-4 mt-8">
                        <label className="flex flex-col gap-2">
                          <span className="text-sm font-semibold">
                            {item.slug === 'protocolo-cultivo-biologico-profesional'
                              ? 'Contenido Markdown (no usado por el Protocolo)'
                              : 'Contenido Técnico Markdown'}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {item.slug === 'protocolo-cultivo-biologico-profesional'
                              ? 'El Protocolo usa sus textos hardcodeados. Este campo se ignora.'
                              : 'Escribe el contenido de la landing. Usa ## para crear secciones: la primera es el diagnóstico, la segunda la estrategia, la tercera la aplicación práctica. Los items de lista con * **Título:** texto se renderizan como tarjetas visuales.'}
                          </p>
                          <textarea
                            value={(() => {
                              try { return JSON.parse(item.payloadJson).markdownContent || ''; } catch { return ''; }
                            })()}
                            onChange={(e) => updatePayloadField(item.id, 'markdownContent', e.target.value)}
                            rows={item.slug === 'protocolo-cultivo-biologico-profesional' ? 4 : 20}
                            className="rounded-xl border border-border/50 bg-background p-4 font-mono text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 resize-y w-full"
                            placeholder={item.slug === 'protocolo-cultivo-biologico-profesional'
                              ? '(No necesario para el Protocolo)'
                              : '## Por qué los Cítricos en Valencia Sufren Clorosis Férrica\n\nTexto introductorio...\n\n## La Solución Orgánica\n\n1. **Microbiología activa:** texto\n\n## Aplicación Práctica\n\n* **Tratamiento foliar:** texto del punto'
                            }
                          />
                        </label>
                      </div>
                    </div>
                  )}

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

                  <div className="flex justify-end gap-3">
                    <a
                      href={
                        item.kind === 'SOLUTION'
                          ? `/te-de-humus-de-lombriz/${item.slug}`
                          : item.kind === 'SOLUTION_ORTIGA'
                          ? `/purin-de-ortiga/${item.slug}`
                          : item.kind === 'COMMERCIAL'
                          ? `/comprar-te-de-humus-de-lombriz/${item.slug}`
                          : item.kind === 'COMMERCIAL_ORTIGA'
                          ? `/comprar-purin-de-ortiga/${item.slug}`
                          : item.kind === 'GEO'
                          ? `/espana/${item.slug}`
                          : item.kind === 'LANDING'
                          ? `/solucion-humus/${item.slug}`
                          : item.kind === 'SERVICIO'
                          ? `/servicios/${item.slug}`
                          : `/aprende/${item.slug}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold transition-all hover:bg-muted"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Ver Página
                    </a>
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
