'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, Truck, ShieldCheck, Check, Droplet, Sprout, Leaf, Zap, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import UrgencyModule from '@/components/UrgencyModule';
import AnchoringBanner from '@/components/AnchoringBanner';
import PremiumAudioPlayer from '@/components/PremiumAudioPlayer';
import SocialProofTicker from '@/components/SocialProofTicker';

export default function ProductFunnel({ product, dbVariants }: { product: any, dbVariants: any[] }) {
  const defaultVariant = dbVariants.find(v => v.popular) || dbVariants[0];
  const [selected, setSelected] = useState(defaultVariant);
  const [activeTab, setActiveTab] = useState<'modo' | 'envio' | 'ciencia'>('modo');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: selected.id,
      name: product.name,
      size: selected.size,
      price: selected.price,
      image: selected.imagePath || selected.image,
      quantity,
    });
  };

  const discount = selected.comparePrice && selected.comparePrice > selected.price 
    ? Math.round(((selected.comparePrice - selected.price) / selected.comparePrice) * 100)
    : 0;

  const getModoDeUso = () => {
    switch (selected.sku) {
      case 'BIO-1L': return "Aplicación ideal para macetas y jardines pequeños. Diluye tapón y medio en 5 litros de agua y pulveriza directamente en hojas y base.";
      case 'BIO-5L': return "Pensado para huertos familiares. Conecta a la regadera o mochila sulfatadora. Dilución óptima: 1L por cada 100L de agua sin cloro.";
      case 'BIO-10L': return "Para invernaderos y cultivos avanzados. Formato pensado para uso continuado y preparación controlada en sistemas de riego.";
      default: return "Formatos industriales (25L+). Uso directo en balsas de riego y sistemas de inyección Venturi a dosis calibrada según ficha técnica.";
    }
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-24">
      
      {/* =========================================
          SECCIÓN HERO (2 COLUMNAS)
      ========================================= */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start relative">
        
        {/* 📸 COLUMNA IZQUIERDA: GALERÍA (STICKY) */}
        <div className="w-full lg:w-[45%] flex flex-col gap-3 md:gap-4 sticky top-20 md:top-28 self-start">
          <div className="aspect-[4/5] md:aspect-square bg-cream-warm border border-border/40 rounded-2xl md:rounded-3xl relative overflow-hidden flex items-center justify-center p-6 md:p-8 shadow-sm transition-all hover:border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent pointer-events-none" />
            <Image 
              src={selected.imagePath || selected.image || "/5 litros.jpg"} 
              alt={selected.size} 
              fill 
              className="object-contain transition-transform duration-700 ease-out md:hover:scale-105" 
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {dbVariants.map((v) => (
              <div 
                key={v.id} 
                onClick={() => setSelected(v)}
                className={cn(
                  "aspect-square bg-cream-warm border rounded-xl md:rounded-2xl relative overflow-hidden flex items-center justify-center p-1.5 md:p-2 cursor-pointer transition-all duration-300",
                  selected.id === v.id 
                    ? "border-primary/50 shadow-sm ring-2 ring-primary/15 opacity-100" 
                    : "border-border/40 opacity-50 hover:opacity-100 hover:border-border"
                )}
              >
                <Image src={v.imagePath || v.image || "/1 litro.jpg"} alt={v.size} fill className="object-contain" />
              </div>
            ))}
          </div>

          {/* Reproductor de Audio Premium (Bajo las Thumbnails) */}
          <div className="w-full mt-2">
            <PremiumAudioPlayer 
              src={`/audio/${selected.sku.toLowerCase()}.mp3`} 
              title={`Explicación formato ${selected.size}`} 
            />
          </div>
        </div>

        {/* 🚀 COLUMNA DERECHA: EMBUDO DE CONVERSIÓN */}
        <div className="w-full lg:w-[55%] flex flex-col gap-6 md:gap-8 pt-2">
          
          {/* Cabecera, Autoridad & Trust */}
          <div>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mb-3 md:mb-4">
              <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">
                Uso Profesional
              </span>
              <span className="text-border hidden sm:block">|</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-foreground/80 text-[11px] md:text-sm font-medium ml-1">Formato y uso explicados con claridad</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-[2.5rem] font-heading font-bold text-foreground tracking-tight leading-[1.10] md:leading-[1.15]">
              {product.name}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground mt-3 md:mt-4 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Tarjetas de Psicología Visual */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
            {[
              { icon: Leaf, label: 'Uso orientado', sub: 'Huerto, jardín y cultivo' },
              { icon: Droplet, label: 'Aplicación clara', sub: 'Riego o pulverización' },
              { icon: Sprout, label: 'Compra por formato', sub: 'Escala doméstica o profesional' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-transparent border border-border/60 hover:border-primary/25 transition-colors rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-row sm:flex-col items-center sm:items-start text-left sm:text-left gap-3 sm:gap-2">
                <Icon className="w-5 h-5 text-primary"/>
                <div>
                  <span className="block text-[13px] md:text-sm font-semibold text-foreground/90">{label}</span>
                  <span className="text-[11px] md:text-xs text-muted-foreground hidden sm:block">{sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Módulo de Urgencia Psicológica */}
          <UrgencyModule stock={0} />

          {/* Selector de Formatos */}
          <div className="mt-1 md:mt-2">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="font-heading font-bold text-foreground text-base md:text-lg">Selecciona tu formato</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {dbVariants.map((v) => (
                <div 
                  key={v.id}
                  onClick={() => setSelected(v)}
                  className={cn(
                    "relative flex flex-col p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all cursor-pointer group",
                    selected.id === v.id 
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-border/40 bg-transparent active:bg-muted/40 lg:hover:border-primary/25"
                  )}
                >
                  {v.popular && (
                    <div className="absolute -top-2.5 right-2 md:right-3 bg-primary text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap uppercase tracking-wide">
                      Recomendado
                    </div>
                  )}
                  <span className="font-semibold text-base md:text-lg text-foreground">{v.size}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground font-medium mt-0.5">{v.target}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selector de cantidad */}
          <div className="flex items-center justify-between p-4 bg-cream-warm rounded-2xl border border-border/40">
            <div>
              <p className="text-sm font-semibold text-foreground">Cantidad</p>
              <p className="text-xs text-muted-foreground">Ahorra más comprando varios</p>
            </div>
            <div className="flex items-center gap-0 bg-background border border-border/60 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-lg font-bold"
                aria-label="Reducir cantidad"
              >
                −
              </button>
              <span className="w-10 text-center font-bold text-foreground text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(20, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-lg font-bold"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          {/* Bloque Maestro de Compra */}
          <div className="p-5 md:p-8 bg-cream-warm border border-border/50 rounded-2xl md:rounded-3xl relative mt-1 md:mt-2">
            <div className="flex justify-between items-end mb-6 md:mb-8">
              <div className="flex flex-col">
                {discount > 0 && (
                  <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                    <span className="text-base md:text-lg text-muted-foreground line-through decoration-muted-foreground/30 font-medium">
                      €{selected.comparePrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] md:text-xs bg-primary/12 text-secondary font-bold px-2 py-0.5 md:px-2.5 rounded-full tracking-wide">
                      Ahorro del {discount}%
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-1 md:gap-2">
                  <span className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
                    €{(selected.price * quantity).toFixed(2)}
                  </span>
                  <span className="text-xs md:text-sm font-medium text-muted-foreground">IVA incl.</span>
                </div>
                {quantity > 1 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {quantity}× €{selected.price.toFixed(2)} c/u
                  </p>
                )}
              </div>
            </div>

            {/* Social Proof Ticker reposicionado bajo el precio */}
            <div className="mb-6 -mt-2">
              <SocialProofTicker />
            </div>

            <Button 
              size="lg" 
              disabled
              className="w-full h-14 rounded-xl md:rounded-2xl text-base md:text-lg font-bold bg-muted/80 border border-border text-muted-foreground shadow-none cursor-not-allowed"
            >
              <ShoppingBag className="w-5 h-5 mr-2 opacity-50" />
              Agotado Temporalmente (Mantenimiento)
            </Button>

            <div className="grid grid-cols-2 gap-2 md:gap-4 mt-5 md:mt-6 pt-4 md:pt-5 border-t border-border/40">
              <div className="flex items-center gap-2 md:gap-3">
                <Truck className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-medium text-foreground leading-tight">Envío 24/48h</span>
                  <span className="text-[9px] md:text-[10px] text-muted-foreground">{selected.price >= 50 ? 'Gratuito' : 'Calculado en pago'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-medium text-foreground leading-tight">Garantía Segura</span>
                  <span className="text-[9px] md:text-[10px] text-muted-foreground">Pagos Cifrados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          ANCHORING — Precio vs. competencia
      ========================================= */}
      <div className="w-full max-w-4xl mx-auto mt-2 px-0 sm:px-4">
        <AnchoringBanner />
      </div>

      {/* =========================================
          SECCIÓN TABS (FULL WIDTH OUTSIDE)
      ========================================= */}
      <div className="w-full max-w-4xl mx-auto mt-4 md:mt-8 px-0 sm:px-4">
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 border-b border-border/40 overflow-x-auto hide-scrollbar pb-0 mb-6 md:mb-8 px-4 sm:px-0">
          {[
            { key: 'modo' as const, label: 'Cómo Utilizarlo' },
            { key: 'ciencia' as const, label: 'Nuestra Ciencia' },
            { key: 'envio' as const, label: 'Envíos y Retornos' },
          ].map(({ key, label }) => (
            <button 
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "text-xs md:text-base font-semibold py-3 md:py-4 px-2 whitespace-nowrap transition-all border-b-2",
                activeTab === key 
                  ? "text-primary border-primary" 
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        
        <div className="py-2 min-h-[200px] bg-card p-5 md:p-10 mx-4 sm:mx-0 rounded-2xl md:rounded-3xl border border-border/30 shadow-sm">
          {activeTab === 'modo' && (
            <div className="animate-in fade-in duration-500 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              <div className="flex-1">
                <h4 className="font-heading font-bold text-foreground mb-3 md:mb-4 text-base md:text-lg">Protocolo para formato de {selected.size}</h4>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-light mb-5 md:mb-6">
                  {getModoDeUso()}
                </p>
                <div className="flex items-start gap-3 bg-primary/5 p-4 md:p-5 rounded-xl md:rounded-2xl border border-primary/15">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5"/> 
                  <p className="text-[13px] md:text-base text-foreground/80 font-light">
                    <strong className="font-medium text-foreground block mb-1">Compatibilidad a revisar caso por caso.</strong> 
                     Antes de mezclar con otros insumos conviene revisar la combinación concreta y hacer una prueba pequeña.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'ciencia' && (
            <div className="animate-in fade-in duration-500">
              <h4 className="font-heading font-bold text-foreground mb-4 md:mb-6 text-base md:text-lg">Características del formato</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {selected.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 border border-border/40 bg-background/50 rounded-xl md:rounded-2xl transition-colors md:hover:border-primary/20">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium text-sm md:text-base text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'envio' && (
            <div className="animate-in fade-in duration-500 flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-1 flex flex-col gap-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center mb-1 md:mb-2">
                  <Truck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h4 className="font-heading font-bold text-foreground text-sm md:text-lg">Logística del pedido</h4>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light mt-1">
                  El pedido se gestiona con operadores logísticos disponibles para la tienda. Los plazos concretos dependen del destino y del servicio seleccionado.
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center mb-1 md:mb-2">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h4 className="font-heading font-bold text-foreground text-sm md:text-lg">Incidencias y soporte</h4>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light mt-1">
                  Si el pedido llega con incidencia o necesitas soporte, la gestión se hace según las condiciones publicadas y el canal de atención disponible.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

