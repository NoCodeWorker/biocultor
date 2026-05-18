'use client'

import { useRef, useState, useEffect } from 'react'
import { Star, Quote, MapPin, Sprout, ChevronLeft, ChevronRight } from 'lucide-react'
import StructuredData from '@/components/StructuredData'

// ─── Datos de Testimonios — Geolocalizados y Específicos ────────────────────
const testimonials = [
  {
    id: 1,
    name: 'Javier M.',
    role: 'Olivicultor',
    region: 'Jaén, Andalucía',
    regionShort: 'Jaén',
    cultivo: 'Olivar en regadío — 42 ha',
    text: 'Llevaba dos temporadas buscando un extracto biológico que encajase en mi sistema de fertirrigación sin atascos. Lo aplico quincenal desde brotación. La lógica de uso que explican tiene más sentido que lo que me vendía el distribuidor de siempre.',
    rating: 5,
    date: '2025-10',
    highlight: 'Encaje perfecto en fertirrigación',
  },
  {
    id: 2,
    name: 'Cristina R.',
    role: 'Productora de cítricos',
    region: 'Valencia, Comunitat Valenciana',
    regionShort: 'Valencia',
    cultivo: 'Naranjos y mandarinos — 18 ha',
    text: 'El producto llegó en 36 horas. Lo que más valoro es que no venden milagros: explican formato, frecuencia y cómo leer la respuesta del suelo. Para naranjo con riego localizado funciona bien cuando sigues la guía.',
    rating: 5,
    date: '2025-11',
    highlight: '36 h de entrega a Valencia',
  },
  {
    id: 3,
    name: 'Alberto S.',
    role: 'Técnico de vivero',
    region: 'Almería, Andalucía',
    regionShort: 'Almería',
    cultivo: 'Vivero ornamental — producción profesional',
    text: 'Compro el formato de 25L para el vivero. La reposición es rápida y el packaging aguanta el transporte sin problemas. Para planta ornamental en producción intensiva es una herramienta que ya integro en el calendario.',
    rating: 5,
    date: '2025-09',
    highlight: 'Reposición fiable formato profesional',
  },
  {
    id: 4,
    name: 'Marta F.',
    role: 'Agricultora ecológica',
    region: 'Extremadura',
    regionShort: 'Extremadura',
    cultivo: 'Finca mixta — tomate, pimiento y frutales',
    text: 'Trabajo en ecológico certificado y necesito que todo lo que entra en la finca sea coherente con el pliego. El té de humus encaja. La ficha es clara y el contacto antes de comprar me aclaró las dudas sin presionar.',
    rating: 5,
    date: '2025-12',
    highlight: 'Coherente con producción ecológica',
  },
  {
    id: 5,
    name: 'Roberto P.',
    role: 'Productor de viñedo',
    region: 'La Rioja',
    regionShort: 'La Rioja',
    cultivo: 'Viñedo — 28 ha',
    text: 'Lo uso como inoculante biológico en la fase de brotación. No espero resultados rápidos, sino una mejora sostenida en el perfil de suelo. Llevan tres temporadas siendo coherentes en lo que dicen y en lo que mandan.',
    rating: 5,
    date: '2025-08',
    highlight: 'Coherencia producto–comunicación',
  },
  {
    id: 6,
    name: 'Laura G.',
    role: 'Jardinería profesional',
    region: 'Barcelona, Cataluña',
    regionShort: 'Barcelona',
    cultivo: 'Mantenimiento de zonas verdes municipales',
    text: 'Gestionamos zonas verdes para ayuntamientos y necesitamos fiabilidad en la cadena de suministro. El servicio de Biocultor nos funciona: pedido, entrega y calidad constante. Ya tenemos el 25L en el plan de temporada.',
    rating: 5,
    date: '2025-10',
    highlight: 'Fiabilidad en cadena de suministro',
  },
  {
    id: 7,
    name: 'Andrés V.',
    role: 'Agricultor ecológico',
    region: 'Navarra',
    regionShort: 'Navarra',
    cultivo: 'Hortícola en regadío — 8 ha',
    text: 'El producto funciona bien cuando se aplica con constancia. Al principio tardé en encontrar la dosis correcta para mi suelo arcilloso — tardé dos aplicaciones en calibrarlo. El soporte por email me ayudó a ajustarlo. Desde entonces, integrado en la rutina semanal.',
    rating: 4,
    date: '2025-11',
    highlight: 'Buena respuesta tras ajuste de dosis',
  },
  {
    id: 8,
    name: 'Isabel T.',
    role: 'Jardinera profesional',
    region: 'Asturias',
    regionShort: 'Asturias',
    cultivo: 'Jardines privados y terrazas urbanas',
    text: 'La entrega llegó bien y el producto es de calidad. El único punto a mejorar sería una guía de inicio más visual para clientes sin formación agronómica. La ficha técnica es buena pero algo técnica para el público general. Para profesionales, perfecta.',
    rating: 4,
    date: '2025-12',
    highlight: 'Calidad de producto confirmada',
  },
]

// ─── Schema Review (Google Rich Results) ────────────────────────────────────
const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Té de Humus de Lombriz Biocultor',
  description: 'Té de humus de lombriz elaborado en España para huerto, jardín y cultivo profesional.',
  brand: { '@type': 'Brand', name: 'Biocultor' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: testimonials.length.toString(),
    bestRating: '5',
    worstRating: '1',
  },
  review: testimonials.map((t) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: t.name },
    datePublished: t.date,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: t.rating.toString(),
      bestRating: '5',
    },
    reviewBody: t.text,
    name: t.highlight,
  })),
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div role="img" className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
        />
      ))}
    </div>
  )
}

export default function SocialProof() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Detecta la tarjeta visible con IntersectionObserver para actualizar los dots
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const cards = container.querySelectorAll('article')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(cards).indexOf(entry.target as HTMLElement)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { root: container, threshold: 0.6 }
    )
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.75
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section
      id="pruebas-sociales"
      className="w-full py-20 md:py-28 bg-background relative overflow-hidden border-t border-border/40"
      aria-label="Testimonios de clientes en España"
    >
      {/* Schema Markup invisible */}
      <StructuredData id="social-proof-review-schema" data={reviewSchema} />

      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary/4 rounded-full blur-[100px]" />
      </div>

      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 relative z-10">
        {/* ── Cabecera ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-5 border border-amber-200/60 dark:border-amber-800/40">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Clientes reales · Toda España
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              Lo que dicen los agricultores
              <span className="block text-primary mt-1">que ya usan Biocultor.</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Testimonios verificados de olivicultores, citricultura, viticultores y profesionales 
              de jardinería de toda la Península.
            </p>
          </div>

          {/* Rating global */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-end gap-2 p-6 rounded-3xl border border-amber-200/50 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/20 backdrop-blur-sm min-w-[160px]">
            <span className="text-5xl font-heading font-black text-foreground tracking-tight">4.8</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium text-center">
              {testimonials.length} valoraciones verificadas
            </span>
          </div>
        </div>

        {/* ── Carrusel de Testimonios ── */}
        <div className="relative">
          {/* Botones de navegación */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card border border-border/60 shadow-lg flex items-center justify-center hover:bg-accent transition-colors md:-left-6"
            aria-label="Testimonios anteriores"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card border border-border/60 shadow-lg flex items-center justify-center hover:bg-accent transition-colors md:-right-6"
            aria-label="Siguientes testimonios"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((t) => (
              <article
                key={t.id}
                className="flex-none w-[85vw] sm:w-[420px] lg:w-[380px] xl:w-[400px] snap-start rounded-3xl border border-border/50 bg-card p-7 md:p-8 flex flex-col gap-5 relative overflow-hidden group hover:border-primary/30 transition-colors duration-300"
              >
                {/* Acento de color en la esquina */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary/6 to-transparent rounded-bl-[3rem] pointer-events-none group-hover:from-primary/12 transition-colors duration-300" />

                {/* Icono de cita */}
                <Quote className="w-6 h-6 text-primary/30 flex-shrink-0" />

                {/* Highlight badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-[10px] font-bold uppercase tracking-widest w-fit">
                  <Sprout className="w-2.5 h-2.5" />
                  {t.highlight}
                </div>

                {/* Texto del testimonio */}
                <blockquote className="text-sm text-foreground/85 leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                {/* Rating */}
                <StarRating rating={t.rating} />

                {/* Divisor */}
                <div className="h-px bg-border/40" />

                {/* Autor */}
                <div className="flex items-start justify-between gap-3">
                  {/* Avatar generado con iniciales */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>

                  {/* Región (valor SEO/GEO) */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                      <MapPin className="w-3 h-3 text-primary" />
                      {t.regionShort}
                    </div>
                    <p className="text-[10px] text-muted-foreground text-right leading-tight max-w-[110px]">
                      {t.cultivo}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── Dots de paginación ── */}
        <div className="flex justify-center gap-1 mt-5" aria-label="Paginación de testimonios" role="tablist">
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={activeIndex === i}
              onClick={() => {
                const container = scrollRef.current
                if (!container) return
                const cards = container.querySelectorAll('article')
                cards[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
              }}
              aria-label={`Ir al testimonio ${i + 1}`}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-0"
            >
              <span
                className={`rounded-full transition-all duration-300 block ${
                  activeIndex === i
                    ? 'w-6 h-2 bg-primary'
                    : 'w-2 h-2 bg-border hover:bg-primary/40'
                }`}
              />
            </button>
          ))}
        </div>
        {/* ── Strip de regiones con SEO/GEO ── */}
        <div className="mt-12 pt-10 border-t border-border/30">
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-[0.25em] mb-6">
            Clientes activos en toda España
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { region: 'Andalucía', icon: '🫒', keywords: 'olivar, cítricos' },
              { region: 'Comunitat Valenciana', icon: '🍊', keywords: 'naranjo, limonero' },
              { region: 'Cataluña', icon: '🌿', keywords: 'jardinería, vivero' },
              { region: 'Extremadura', icon: '🌾', keywords: 'finca mixta, ecológico' },
              { region: 'La Rioja', icon: '🍇', keywords: 'viñedo, frutales' },
              { region: 'Castilla-La Mancha', icon: '🌻', keywords: 'olivar, cereal' },
              { region: 'Murcia', icon: '🍋', keywords: 'horticultura, cítricos' },
              { region: 'Aragón', icon: '🌲', keywords: 'frutales, arbolado' },
            ].map(({ region, icon, keywords }) => (
              <div
                key={region}
                title={`Biocultor en ${region} — ${keywords}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/40 bg-card text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors duration-200 cursor-default"
              >
                <span role="img" aria-label={region}>{icon}</span>
                <span className="font-medium">{region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
