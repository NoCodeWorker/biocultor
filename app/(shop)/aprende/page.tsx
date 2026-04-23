export const dynamic = 'force-dynamic'

import { BookOpen, ArrowRight, Clock, Leaf } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { buildMetadata, breadcrumbSchema, collectionPageSchema } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import { getSeoArticles } from '@/lib/seo-store';

export const metadata = buildMetadata({
  title: 'Guías de té de humus de lombriz | Biocultor',
  description:
    'Guías técnicas y prácticas sobre té de humus de lombriz en España: aplicación correcta, comparativas, olivar, huerto urbano y criterios de compra.',
  path: '/aprende',
  keywords: [
    'guía té de humus de lombriz',
    'cómo aplicar té de humus',
    'té de humus para olivos',
    'blog humus de lombriz',
  ],
});

export default async function AprendePage() {
  const seoArticles = await getSeoArticles();
  const evidenceArticles = seoArticles.filter((article) => article.category === 'Evidencia');
  const editorialArticles = seoArticles.filter((article) => article.category !== 'Evidencia');
  const featuredEvidence = evidenceArticles.slice(0, 4);
  const featuredGuides = editorialArticles.slice(0, 6);
  const intentClusters = [
    {
      title: 'Comprar con evidencia',
      description: 'Papers, meta-análisis y estudios traducidos a criterio de compra sin exageraciones.',
      href: '#evidencia',
    },
    {
      title: 'Aplicación y formato',
      description: 'Guías para entender frecuencia, sistema de uso, riego y elección de formato.',
      href: '#guias',
    },
    {
      title: 'Cultivos concretos',
      description: 'Recorridos para olivo, cítricos, huerto urbano, tomate y horticultura.',
      href: '/te-de-humus-de-lombriz',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <StructuredData
        id="aprende-breadcrumb-schema"
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Aprende', path: '/aprende' },
        ])}
      />
      <StructuredData
        id="aprende-collection-schema"
        data={collectionPageSchema({
          name: 'Guías sobre té de humus de lombriz',
          description: 'Centro editorial de Biocultor para resolver intención informacional y comparativa.',
          path: '/aprende',
          items: seoArticles.map((article) => ({
            name: article.title,
            path: `/aprende/${article.slug}`,
          })),
        })}
      />

      {/* ── Header Section ───────────────────── */}
      <section className="w-full py-16 md:py-24 bg-cream-warm border-b border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Aprende' }]} />
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary font-bold text-xs uppercase tracking-widest mb-6 border border-primary/15">
              <BookOpen className="w-3.5 h-3.5" /> Hub editorial y evidencia
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-foreground mb-6 tracking-tight">
              Aprende a usarlo<br /> <span className="text-primary">con más criterio.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Guías prácticas, comparativas y artículos apoyados en estudios para entender formatos,
              aplicaciones y criterios de compra de Biocultor sin promesas exageradas.
            </p>
          </div>

          {/* Intent pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { label: 'Evidencia', href: '#evidencia' },
              { label: 'Guías de compra', href: '#guias' },
              { label: 'Cultivos', href: '/te-de-humus-de-lombriz' },
              { label: 'Producto', href: '/producto/te-humus-liquido-premium' },
            ].map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  index === 0
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary bg-background'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intent Clusters ───────────────────── */}
      <section className="w-full py-14 bg-background border-b border-border/30">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="grid gap-4 md:grid-cols-3">
            {intentClusters.map((cluster) => (
              <Link
                key={cluster.title}
                href={cluster.href}
                className="rounded-2xl border border-border/50 bg-card p-6 md:p-7 card-lift"
              >
                <div className="w-8 h-1 bg-gradient-to-r from-primary/60 to-primary rounded-full mb-4" />
                <h2 className="font-heading font-bold text-foreground mb-3">{cluster.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{cluster.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Evidence Section ─────────────────── */}
      <section id="evidencia" className="w-full py-16 md:py-20 bg-background">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/15">
              <BookOpen className="w-3.5 h-3.5" />
              Evidencia para comprar mejor
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-bold tracking-tight text-foreground">
              Estudios y meta-análisis convertidos en criterio de compra.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Esta capa editorial parte de fuentes primarias visibles y las traduce a uso, formato,
              compatibilidad y contexto de aplicación sin disfrazar la venta de evidencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {featuredEvidence.map((article, idx) => (
              <Link
                href={`/aprende/${article.slug}`}
                key={article.slug}
                className="group flex flex-col bg-card border border-border/50 rounded-2xl md:rounded-3xl overflow-hidden card-lift"
              >
                <div className="w-full aspect-[4/3] bg-cream-warm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-dark/60 via-transparent to-transparent z-10" />
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-sm border border-border/50 px-3 py-1 rounded-full text-xs font-bold text-foreground">
                    {article.category}
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-4 right-4 z-20 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      Destacado
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-6 md:p-8">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Lectura: {article.readTime}</span>
                  </div>
                  <h2 className="font-heading font-bold text-xl text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-primary font-bold text-sm mt-auto pt-4 border-t border-border/30">
                    Leer guía completa
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guides Grid ──────────────────────── */}
      <section id="guias" className="w-full py-16 md:py-20 bg-cream-warm border-t border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/15">
              <Leaf className="w-3.5 h-3.5" />
              Guías de uso y compra
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-bold tracking-tight text-foreground">
              Aplicación, comparativas y contexto por cultivo.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Piezas pensadas para reducir fricción antes de comprar: cuándo usarlo, cómo encaja en
              riego, qué cultivo tienes delante y qué formato tiene sentido.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredGuides.map((article) => (
              <Link
                href={`/aprende/${article.slug}`}
                key={article.slug}
                className="group flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden card-lift"
              >
                <div className="flex flex-col flex-1 p-6 md:p-7">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Lectura: {article.readTime}</span>
                  </div>
                  <div className="inline-flex self-start rounded-full border border-border/50 bg-background px-3 py-1 text-xs font-bold text-foreground">
                    {article.category}
                  </div>
                  <h3 className="mt-4 font-heading font-bold text-xl text-foreground leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground text-sm leading-relaxed flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-primary font-bold text-sm mt-6 pt-4 border-t border-border/30">
                    Leer guía completa
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content Coverage ─────────────────── */}
      <section className="w-full py-16 bg-background border-t border-border/40">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/15">
              <Leaf className="w-3.5 h-3.5" />
              Temáticas cubiertas
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-bold tracking-tight text-foreground">
              Todo lo que necesitas saber para cultivar mejor.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Protocolos de Uso',
                desc: 'Cómo aplicar, cuándo usar y cómo integrar el producto en tu rutina de riego y abonado.',
              },
              {
                title: 'Evidencia y Papers',
                desc: 'Fuentes primarias traducidas a contexto comercial para comprar con criterio y menos ruido.',
              },
              {
                title: 'Cultivos Específicos',
                desc: 'Guías dedicadas a olivar, cítricos, huerto urbano y horticultura intensiva.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-2xl border border-border/50 bg-card p-6 md:p-7 card-lift">
                <div className="w-8 h-1 bg-gradient-to-r from-primary/60 to-primary rounded-full mb-4" />
                <h3 className="font-heading font-bold text-foreground mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA to Shop ──────────────────────── */}
      <section className="w-full py-16 bg-earth-dark text-cream">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-2">¿Listo para empezar?</p>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-cream">
              Aplica lo que has aprendido.
            </h2>
            <p className="text-cream/60 mt-2 max-w-md text-sm">
              Revisa el producto y elige formato con el contexto que acabas de leer.
            </p>
          </div>
          <Link
            href="/producto/te-humus-liquido-premium"
            className="shrink-0 inline-flex items-center gap-2 bg-primary hover:bg-brand-green-hover text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-primary/15 transition-all hover:scale-[1.02] whitespace-nowrap"
          >
            Comprar Biocultor
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

