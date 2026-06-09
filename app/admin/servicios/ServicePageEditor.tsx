'use client';

import { useState } from 'react';
import { Save, Loader2, Plus, Trash2, ArrowUpRight, Check } from 'lucide-react';
import { updateSeoPage } from '../actions';
import ImageUploader from '@/components/admin/ImageUploader';
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

type FAQItem = {
  question: string;
  answer: string;
};

export default function ServicePageEditor({ page }: { page: SeoPageRecord }) {
  const [title, setTitle] = useState(page.title);
  const [metaTitle, setMetaTitle] = useState(page.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(page.metaDescription || '');
  const [isPublished, setIsPublished] = useState(page.isPublished);

  // Parse payloadJson
  let initialPayload = {
    beforeImage: '/servicios-cesped-antes.webp',
    afterImage: '/servicios-cesped-despues.webp',
    price: '195',
    areaLimit: '500',
    additionalRate: '0.2',
    trustBadge1_title: 'Biología Activa y Fresca',
    trustBadge1_desc: 'El té de humus se extrae y oxigena pocas horas antes de la aplicación, asegurando millones de microorganismos vivos.',
    trustBadge2_title: 'Avalado por la Ciencia',
    trustBadge2_desc: 'Estudios científicos corroboran que las enmiendas biológicas líquidas son el mejor tratamiento a medio y largo plazo.',
    trustBadge3_title: 'Cero Plazos de Seguridad',
    trustBadge3_desc: 'Seguridad total inmediata para tus hijos y mascotas. Sin metales pesados ni químicos de síntesis artificial.',
  };

  try {
    if (page.payloadJson && page.payloadJson !== '{}') {
      initialPayload = { ...initialPayload, ...JSON.parse(page.payloadJson) };
    }
  } catch (e) {
    console.error('Error parsing payloadJson', e);
  }

  const [payload, setPayload] = useState(initialPayload);

  // Parse faqJson
  let initialFaqs: FAQItem[] = [];
  try {
    if (page.faqJson && page.faqJson !== '[]') {
      initialFaqs = JSON.parse(page.faqJson);
    }
  } catch (e) {
    console.error('Error parsing faqJson', e);
  }
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const updatePayloadField = (key: keyof typeof initialPayload, value: string) => {
    setPayload((curr) => ({ ...curr, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const result = await updateSeoPage({
      id: page.id,
      kind: page.kind,
      slug: page.slug,
      title: title,
      targetKeyword: page.targetKeyword || 'regeneracion cesped',
      workflowStatus: page.workflowStatus,
      priorityScore: page.priorityScore,
      notes: page.notes || '',
      metaTitle: metaTitle,
      metaDescription: metaDescription,
      intro: page.intro || '',
      excerpt: page.excerpt || '',
      image: payload.afterImage, // Usa la imagen después como imagen principal SEO
      label: page.label || 'Servicio',
      readTime: page.readTime || '',
      payloadJson: JSON.stringify(payload),
      faqJson: JSON.stringify(faqs),
      summaryJson: page.summaryJson || '[]',
      isPublished: isPublished,
    });

    setSaving(false);
    if (result.success) {
      setMessage({ type: 'success', text: 'Servicio guardado con éxito. Los cambios ya están activos en la web.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al guardar los datos del servicio.' });
    }
  };

  const updateFaq = (index: number, field: keyof FAQItem, value: string) => {
    setFaqs((curr) =>
      curr.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeFaq = (index: number) => {
    setFaqs((curr) => curr.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs((curr) => [...curr, { question: '', answer: '' }]);
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto relative z-10 antialiased">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-foreground tracking-tight">
            Gestión de Servicios
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Configura el copy, precios, preguntas frecuentes e imágenes del servicio de {title}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={page.slug === 'regeneracion-cesped-y-jardines' ? '/servicios/regeneracion-cesped-y-jardines' : '/servicios/te-humus-paisajistas-jardineros'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold border border-border bg-card hover:bg-muted px-4 py-2 rounded-xl transition-all"
          >
            Ver página pública <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold shadow-md transition-all",
              saving
                ? "bg-muted text-muted-foreground"
                : "bg-primary hover:bg-brand-green-hover text-white shadow-primary/15"
            )}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
      
      {/* Service Selector Tabs */}
      <div className="flex border-b border-border/60 bg-muted/20 p-1.5 rounded-2xl max-w-xl self-start gap-1">
        <button
          onClick={() => window.location.href = '/admin/servicios?slug=regeneracion-cesped-y-jardines'}
          className={cn(
            "flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold transition-all truncate",
            page.slug === 'regeneracion-cesped-y-jardines'
              ? "bg-card text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Regeneración Césped y Jardines
        </button>
        <button
          onClick={() => window.location.href = '/admin/servicios?slug=te-humus-paisajistas-jardineros'}
          className={cn(
            "flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold transition-all truncate",
            page.slug === 'te-humus-paisajistas-jardineros'
              ? "bg-card text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Té de Humus (Paisajistas/Jardineros)
        </button>
      </div>

      {message && (
        <div
          className={cn(
            "rounded-2xl px-5 py-4 text-sm font-semibold flex items-center gap-2.5",
            message.type === 'success'
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-red-500/10 text-red-700 border border-red-500/20"
          )}
        >
          {message.type === 'success' && <Check className="w-4 h-4 shrink-0" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: SEO & Page Config */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Section 1: General Info */}
          <div className="rounded-3xl border border-border/50 bg-card p-6 md:p-8 flex flex-col gap-6">
            <h3 className="font-heading font-bold text-lg text-foreground">1. Configuración de Página</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Título visible (H1)</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 px-4 bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm transition-all"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Title (SEO)</span>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="h-11 px-4 bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm transition-all"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Description</span>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="p-4 bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm transition-all resize-none"
              />
            </label>

            <div className="flex items-center gap-3 mt-2">
              <input
                id="isPublished"
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
              />
              <label htmlFor="isPublished" className="text-sm font-semibold text-foreground cursor-pointer select-none">
                Publicar servicio (hacer visible en la web)
              </label>
            </div>
          </div>

          {/* Section 2: Before/After Images */}
          <div className="rounded-3xl border border-border/50 bg-card p-6 md:p-8 flex flex-col gap-6">
            <h3 className="font-heading font-bold text-lg text-foreground">2. Imágenes de Comparación (Antes / Después)</h3>
            <p className="text-xs text-muted-foreground -mt-3">
              Estas imágenes son las que se muestran en el slider interactivo en la cabecera de la página.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Foto ANTES (Césped degradado)</span>
                <ImageUploader
                  value={payload.beforeImage}
                  onChange={(url) => updatePayloadField('beforeImage', url || '/servicios-cesped-antes.webp')}
                  size="lg"
                  allowManual
                  hint="Imagen de césped seco/amarillo para mostrar el problema."
                />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Foto DESPUÉS (Césped verde)</span>
                <ImageUploader
                  value={payload.afterImage}
                  onChange={(url) => updatePayloadField('afterImage', url || '/servicios-cesped-despues.webp')}
                  size="lg"
                  allowManual
                  hint="Imagen de césped denso y verde después de inocular."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Trust Badges */}
          <div className="rounded-3xl border border-border/50 bg-card p-6 md:p-8 flex flex-col gap-6">
            <h3 className="font-heading font-bold text-lg text-foreground">3. Pilares de Confianza (Trust Badges)</h3>
            <p className="text-xs text-muted-foreground -mt-3">
              Los 3 pilares clave que demuestran la confiabilidad de este servicio.
            </p>

            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((num) => {
                const titleKey = `trustBadge${num}_title` as keyof typeof payload;
                const descKey = `trustBadge${num}_desc` as keyof typeof payload;
                return (
                  <div key={num} className="border-b border-border/40 pb-5 last:border-b-0 last:pb-0 flex flex-col gap-3">
                    <span className="text-xs font-bold text-primary">Badge #{num}</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex flex-col gap-1.5 md:col-span-1">
                        <span className="text-xs font-semibold text-muted-foreground">Título</span>
                        <input
                          type="text"
                          value={payload[titleKey]}
                          onChange={(e) => updatePayloadField(titleKey, e.target.value)}
                          className="h-10 px-3 bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-1.5 md:col-span-2">
                        <span className="text-xs font-semibold text-muted-foreground">Descripción corta</span>
                        <input
                          type="text"
                          value={payload[descKey]}
                          onChange={(e) => updatePayloadField(descKey, e.target.value)}
                          className="h-10 px-3 bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm"
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: FAQs */}
          <div className="rounded-3xl border border-border/50 bg-card p-6 md:p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-lg text-foreground">4. Preguntas Frecuentes (FAQs)</h3>
              <button
                type="button"
                onClick={addFaq}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-brand-green-hover transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir FAQ
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border/60 rounded-2xl p-5 flex flex-col gap-3 bg-background/50 relative group">
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar pregunta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <label className="flex flex-col gap-1.5 pr-8">
                    <span className="text-xs font-bold text-muted-foreground">Pregunta</span>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                      placeholder="Ej: ¿Qué incluye la tarifa?"
                      className="h-10 px-3 bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-muted-foreground">Respuesta</span>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      placeholder="Escribe aquí la respuesta explicativa..."
                      rows={3}
                      className="p-3 bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm resize-none"
                    />
                  </label>
                </div>
              ))}

              {faqs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No hay preguntas configuradas. Pulsa en "Añadir FAQ" para crear una.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Tarifa y Vista Rápida */}
        <div className="flex flex-col gap-6">
          
          {/* Pricing Config */}
          <div className="rounded-3xl border border-border/50 bg-card p-6 flex flex-col gap-5">
            <h3 className="font-heading font-bold text-lg text-foreground">Tarifa y Cobertura</h3>
            
            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Precio Base (€)</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">€</span>
                <input
                  type="number"
                  value={payload.price}
                  onChange={(e) => updatePayloadField('price', e.target.value)}
                  className="h-11 pl-8 pr-4 w-full bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm font-bold"
                />
              </div>
            </label>

             <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Superficie Incluida (m²)</span>
              <div className="relative">
                <input
                  type="number"
                  value={payload.areaLimit}
                  onChange={(e) => updatePayloadField('areaLimit', e.target.value)}
                  className="h-11 px-4 w-full bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">m²</span>
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Precio m² Adicional (€)</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">€</span>
                <input
                  type="number"
                  step="0.01"
                  value={payload.additionalRate || '0.2'}
                  onChange={(e) => updatePayloadField('additionalRate', e.target.value)}
                  className="h-11 pl-8 pr-4 w-full bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm font-bold"
                />
              </div>
            </label>

            <div className="p-4 bg-muted/30 border border-border/40 rounded-2xl flex flex-col gap-1.5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Cómo se calcula en la web:</span>
              <p>Se calculará el precio de la aplicación basándose en <strong className="text-foreground">{payload.price} €</strong> hasta <strong className="text-foreground">{payload.areaLimit} m²</strong>, sumando <strong className="text-foreground">{payload.additionalRate} €</strong> por cada m² adicional.</p>
              <p>Esta fórmula se comparte dinámicamente con la calculadora del frontend.</p>
            </div>
          </div>

          {/* Quick Preview Card */}
          <div className="rounded-3xl border border-border/50 bg-card p-6 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg text-foreground">Vista Previa Visual</h3>
            <div className="border border-border/60 rounded-2xl overflow-hidden bg-background">
              <div className="aspect-video relative bg-muted flex items-center justify-center overflow-hidden">
                {payload.afterImage ? (
                  <img
                    src={payload.afterImage}
                    alt="After preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">Sin imagen</span>
                )}
                <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded">Después</span>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase text-primary">Servicio Presencial</span>
                <h4 className="font-bold text-foreground text-sm truncate">{title}</h4>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-xs text-muted-foreground">Tarifa Fija</span>
                  <span className="font-extrabold text-foreground">{payload.price} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
