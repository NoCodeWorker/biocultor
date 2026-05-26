/**
 * ProductImageGallery — BLOQUE 3: Galería física con <picture> y fallback JPG
 *
 * Objetivo: activar el carrusel de imágenes de producto en Google y Google
 * Shopping generando señales HTML semánticas que Googlebot Image pueda rastrear.
 *
 * Estrategia de carga:
 *   - Primera imagen (hero): loading="eager" + fetchpriority="high"
 *     → Above the Fold, crítica para LCP. No bloquea el renderizado inicial.
 *   - Imágenes adicionales: loading="lazy" + decoding="async"
 *     → El navegador las carga solo cuando entran en el viewport.
 *
 * Compatibilidad con bots legacy:
 *   - <source type="image/webp"> → prioridad para Chrome, Firefox, Safari 14+
 *   - <img src="...jpg"> → fallback para IE11, Safari 13, y algunos bots legacy
 *     que aún no entienden WebP. Googlebot soporta WebP desde 2014, pero el
 *     fallback protege contra scrapers y parsers de 3ª parte.
 *
 * Integración:
 *   - Se puede usar como galería standalone en la columna izquierda del funnel
 *   - Coexiste con el JSON-LD @graph y los OG tags sin conflictos
 *   - Las URLs webp se sincronizan con las del JSON-LD para coherencia semántica
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ProductImage {
  /** URL absoluta del archivo WebP (prioridad). Ej: https://biocultor.com/media/te-humus-1l.webp */
  webpSrc: string;
  /** URL absoluta del archivo JPG de fallback. Mismas dimensiones que webpSrc. */
  jpgFallbackSrc: string;
  /** Texto alternativo descriptivo para accesibilidad e indexación */
  alt: string;
  /** Ancho intrínseco en píxeles (para evitar layout shift = CLS) */
  width?: number;
  /** Alto intrínseco en píxeles */
  height?: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export default function ProductImageGallery({
  images,
  productName,
  className,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!images.length) return null;

  return (
    <div className={cn('flex flex-col gap-3 md:gap-4', className)}>

      {/* ── Imagen principal (hero) ── Above the Fold → eager + high priority */}
      {/* La primera imagen es crítica para LCP; se carga inmediatamente */}
      <div
        className="aspect-square bg-cream-warm border border-border/40 rounded-2xl md:rounded-3xl relative overflow-hidden flex items-center justify-center p-6 md:p-8 shadow-sm transition-all hover:border-primary/20"
        aria-label={`Imagen principal: ${activeImage.alt}`}
      >
        {/* Gradiente decorativo — solo visual, no bloquea el bot */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent pointer-events-none" />

        {/*
         * <picture> activa el carrusel de Google Images cuando Googlebot
         * rastrea la imagen WebP mediante <source> y la asocia con el
         * ImageObject del JSON-LD a través de la URL coincidente.
         *
         * Estructura semántica para Google:
         *   <source type="image/webp"> → señal de formato WebP (indexada)
         *   <img src=".jpg">           → fallback accesible para bots legacy
         */}
        <picture className="w-full h-full flex items-center justify-center">
          {/* WebP: prioridad absoluta para navegadores modernos y Googlebot */}
          <source
            srcSet={activeImage.webpSrc}
            type="image/webp"
            width={activeImage.width ?? 1200}
            height={activeImage.height ?? 1200}
          />
          {/*
           * JPG fallback obligatorio:
           *   - IE11, Safari 13- que no soportan WebP
           *   - Bots legacy de comparadores de precios y marketplaces
           *   - fetchpriority="high" → señal al navegador de recurso LCP crítico
           */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage.jpgFallbackSrc}
            alt={activeImage.alt}
            width={activeImage.width ?? 1200}
            height={activeImage.height ?? 1200}
            loading="eager"
            // fetchpriority es un atributo de performance nativo del navegador
            // no es una prop de React estándar → lo pasamos como string
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...({ fetchpriority: 'high' } as any)}
            decoding="sync"
            className="object-contain w-full h-full max-h-[480px] transition-transform duration-700 ease-out md:hover:scale-105"
            itemProp="image" // Microdata schema.org como señal adicional
          />
        </picture>
      </div>

      {/* ── Miniaturas de navegación (thumbnails) ── */}
      {/* Cada thumbnail es una imagen de producto secundaria. Googlebot las
          rastreará si están enlazadas en el HTML visible (sin JS para renderizar). */}
      {images.length > 1 && (
        <div
          className="grid grid-cols-4 gap-2 md:gap-3"
          role="listbox"
          aria-label={`Galería de imágenes de ${productName}`}
        >
          {images.map((img, i) => (
            <button
              key={img.webpSrc}
              role="option"
              aria-selected={i === activeIndex}
              aria-label={`Ver imagen ${i + 1}: ${img.alt}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'aspect-square bg-cream-warm border rounded-xl md:rounded-2xl relative overflow-hidden flex items-center justify-center p-1.5 md:p-2 cursor-pointer transition-all duration-300',
                i === activeIndex
                  ? 'border-primary/50 shadow-sm ring-2 ring-primary/15 opacity-100'
                  : 'border-border/40 opacity-50 hover:opacity-100 hover:border-border'
              )}
            >
              {/*
               * Imágenes de thumbnails: loading="lazy" para no bloquear LCP.
               * Se cargan solo cuando entran en el viewport del usuario.
               *
               * <picture> aquí también, por coherencia semántica con el hero:
               *   - Googlebot rastreará cada imagen thumbnail como candidata
               *     al carrusel de imágenes de producto.
               */}
              <picture className="w-full h-full flex items-center justify-center">
                <source
                  srcSet={img.webpSrc}
                  type="image/webp"
                  width={img.width ?? 400}
                  height={img.height ?? 400}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.jpgFallbackSrc}
                  alt={img.alt}
                  width={img.width ?? 400}
                  height={img.height ?? 400}
                  // Las imágenes secundarias NO son Above the Fold → lazy
                  loading="lazy"
                  decoding="async"
                  className="object-contain w-full h-full"
                />
              </picture>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
