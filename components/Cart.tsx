'use client';

import { useCartStore } from '@/store/cartStore';
import { X, Plus, Minus, ShoppingBag, Loader2, Leaf } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
export default function Cart() {
  const { items, isOpen, setIsOpen, updateQuantity, addItem } = useCartStore();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [crossSellData, setCrossSellData] = useState<any>(null);
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const freeShipping = total >= 50;

  const hasBIO5L = items.some(item => item.sku === 'BIO-5L');
  const hasORT5L = items.some(item => item.sku === 'ORT-5L');
  const isBundle = hasBIO5L && hasORT5L;

  // Si tiene el bundle, aplicamos 5% de descuento al frontend (en checkout ya se aplica)
  const cartTotalWithDiscount = items.reduce((acc, item) => {
    let unitPrice = item.price;
    if (isBundle && (item.sku === 'BIO-5L' || item.sku === 'ORT-5L')) {
      unitPrice = unitPrice * 0.95;
    }
    return acc + (unitPrice * item.quantity);
  }, 0);

  const hasBIO = items.some(item => item.sku?.startsWith('BIO'));
  const hasORT = items.some(item => item.sku?.startsWith('ORT'));
  const hasBIO1L = items.some(item => item.sku === 'BIO-1L');
  const hasORT1L = items.some(item => item.sku === 'ORT-1L');

  let boosterVariant = null;
  if (hasBIO && !hasORT && !hasORT1L && crossSellData?.ort1L) {
    boosterVariant = crossSellData.ort1L;
  } else if (hasORT && !hasBIO && !hasBIO1L && crossSellData?.bio1L) {
    boosterVariant = crossSellData.bio1L;
  } else if (!hasBIO1L && crossSellData?.bio1L) {
    boosterVariant = crossSellData.bio1L;
  } else if (!hasORT1L && crossSellData?.ort1L) {
    boosterVariant = crossSellData.ort1L;
  }

  const percentage = Math.min((total / 50) * 100, 100);
  let milestoneText = "";
  let milestoneSubtext = "";
  if (total < 15) {
    milestoneText = `Te faltan €${(50 - total).toFixed(2)} para envío gratis`;
    milestoneSubtext = "🌱 ¡Excelente elección! Inicia tu cultivo con el pie derecho.";
  } else if (total >= 15 && total < 35) {
    milestoneText = `Te faltan €${(50 - total).toFixed(2)} para envío gratis`;
    milestoneSubtext = "🚚 ¡Vas por muy buen camino! Estás a mitad de conseguir envío gratis.";
  } else if (total >= 35 && total < 50) {
    milestoneText = `¡Estás a solo €${(50 - total).toFixed(2)} del envío gratis!`;
    milestoneSubtext = "⚡ ¡Casi lo tienes! Un último empujón y tu pedido viaja gratis.";
  } else {
    milestoneText = "¡Envío gratuito incluido! 🎉";
    milestoneSubtext = "✨ Tu pedido califica para entrega prioritaria sin coste de transporte.";
  }

  // Fetch cross-sell variants when Cart opens
  useEffect(() => {
    if (isOpen && !crossSellData) {
      fetch('/api/cross-sell')
        .then(res => res.json())
        .then(data => setCrossSellData(data))
        .catch(console.error);
    }
  }, [isOpen, crossSellData]);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Error iniciando pago seguro");
      }
    } catch (e) {
      console.error(e);
      alert("Error crítico iniciando Stripe checkout");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <>
      {/* Custom Keyframes for Premium Shimmer Effect */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cartShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .cart-shimmer-bg {
          animation: cartShimmer 2.5s infinite linear;
        }
      `}} />

      {/* Overlay Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-earth-dark/60 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[440px] bg-background border-l border-border/50 shadow-2xl z-50 transform transition-transform duration-400 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-cream-warm">
          <h2 className="text-xl font-heading font-bold flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            Tu Pedido
            {totalItems > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{totalItems}</span>
            )}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 bg-muted/50 rounded-full hover:bg-muted text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unified Free Shipping Progress & Milestone Booster */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-cream-warm border-b border-border/40 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Leaf className={cn("w-4 h-4 text-primary transition-transform duration-500", freeShipping ? "scale-110 rotate-12" : "animate-pulse")} />
                <span className={cn("text-sm font-heading font-bold", freeShipping ? "text-primary" : "text-foreground")}>
                  {milestoneText}
                </span>
              </div>
              {!freeShipping && (
                <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                  {percentage.toFixed(0)}%
                </span>
              )}
            </div>
            
            {/* Elegant Custom Animated Progress Bar */}
            <div className="w-full bg-muted/70 rounded-full h-2.5 overflow-hidden relative shadow-inner">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden",
                  freeShipping 
                    ? "bg-gradient-to-r from-primary to-brand-green-hover" 
                    : "bg-gradient-to-r from-brand-olive to-primary"
                )}
                style={{ width: `${percentage}%` }}
              >
                {/* Shiny gloss wave effect on progress bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full cart-shimmer-bg pointer-events-none" />
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {milestoneSubtext}
            </p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <div className="w-20 h-20 rounded-full bg-cream-warm flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 opacity-20" />
              </div>
              <p className="font-heading text-lg text-foreground/60">Tu carrito está vacío.</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-2 px-6 py-2.5 rounded-full border border-primary/30 hover:bg-primary/8 transition-colors text-sm font-bold text-foreground"
              >
                Ver Formatos
              </button>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm relative group">
                  <div className="w-20 h-20 relative bg-cream-warm rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.image} fill className="object-contain p-2" alt={item.name} />
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-0.5">
                    <div>
                      <h3 className="font-bold text-foreground leading-tight text-sm">{item.name}</h3>
                      <p className="text-[10px] text-primary uppercase tracking-wider font-bold mt-1">{item.size}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-lg text-foreground">€{(item.price * item.quantity).toFixed(2)}</span>
                      <div className="flex items-center gap-2 bg-cream-warm rounded-lg p-1 border border-border/50">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-background rounded-md text-foreground transition-colors">
                          <Minus className="w-3.5 h-3.5"/>
                        </button>
                        <span className="font-bold min-w-[20px] text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-background rounded-md text-foreground transition-colors">
                          <Plus className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Contextual AOV Booster (1L Quick-Add for Free Shipping) */}
              {!freeShipping && (50 - total) <= 10 && boosterVariant && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-cream-warm/50 to-brand-olive/5 border border-primary/20 shadow-sm flex flex-col gap-3 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 mt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 relative bg-background rounded-xl overflow-hidden flex-shrink-0 border border-border/40">
                      <Image 
                        src={boosterVariant.imagePath || boosterVariant.image || (boosterVariant.sku?.startsWith('BIO') ? '/1 litro.jpg' : '/1 litro.jpg')} 
                        fill 
                        className="object-contain p-1" 
                        alt={boosterVariant.product.name} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">Recomendado</span>
                        <span className="text-[10px] font-bold text-brand-olive-dark uppercase tracking-wider">Ahorra Envío 🚚</span>
                      </div>
                      <h4 className="font-bold text-xs text-foreground mt-1 truncate">{boosterVariant.product.name} - 1L</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                        Añade este formato de 1L para conseguir el <strong>Envío Gratis</strong>.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-black text-sm text-foreground">€{boosterVariant.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addItem({
                        id: boosterVariant.id,
                        name: boosterVariant.product.name,
                        size: boosterVariant.size,
                        price: boosterVariant.price,
                        image: boosterVariant.imagePath || boosterVariant.image || (boosterVariant.sku?.startsWith('BIO') ? '/1 litro.jpg' : '/1 litro.jpg'),
                        quantity: 1,
                        sku: boosterVariant.sku,
                      });
                    }}
                    className="w-full py-2 bg-primary hover:bg-brand-green-hover text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-1 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>Añadir y Activar Envío Gratis (+€{boosterVariant.price.toFixed(2)})</span>
                  </button>
                </div>
              )}

              {/* Módulo Cross-Sell Purín de Ortiga 5L */}
              {hasBIO5L && !hasORT5L && crossSellData?.ort5L && (
                <div className="p-4 rounded-2xl bg-brand-olive-dark/10 border border-brand-olive-dark/20 flex flex-col gap-3 mt-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Completa tu tratamiento</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Añade 5L de Purín de Ortiga y obtén un 5% de descuento en el pack.</p>
                    </div>
                    <Leaf className="w-5 h-5 text-brand-olive-dark flex-shrink-0" />
                  </div>
                  <button
                    onClick={() => {
                      const ort = crossSellData.ort5L;
                      addItem({
                        id: ort.id,
                        name: ort.product.name,
                        size: ort.size,
                        price: ort.price,
                        image: ort.imagePath || ort.image || '/5-litros.jpg',
                        quantity: 1,
                        sku: ort.sku,
                      });
                    }}
                    className="w-full py-2 bg-brand-olive-dark hover:bg-brand-olive-dark/90 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    Añadir Purín de Ortiga 5L (+€{crossSellData.ort5L.price})
                  </button>
                </div>
              )}

              {/* Módulo Cross-Sell Té de Humus 5L (Inverso) */}
              {hasORT5L && !hasBIO5L && crossSellData?.bio5L && (
                <div className="p-4 rounded-2xl bg-brand-olive-dark/10 border border-brand-olive-dark/20 flex flex-col gap-3 mt-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Completa tu nutrición</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Añade 5L de Té de Humus y obtén un 5% de descuento en el pack.</p>
                    </div>
                    <Leaf className="w-5 h-5 text-brand-olive-dark flex-shrink-0" />
                  </div>
                  <button
                    onClick={() => {
                      const bio = crossSellData.bio5L;
                      addItem({
                        id: bio.id,
                        name: bio.product.name,
                        size: bio.size,
                        price: bio.price,
                        image: bio.imagePath || bio.image || '/5-litros.jpg',
                        quantity: 1,
                        sku: bio.sku,
                      });
                    }}
                    className="w-full py-2 bg-brand-olive-dark hover:bg-brand-olive-dark/90 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    Añadir Té de Humus 5L (+€{crossSellData.bio5L.price})
                  </button>
                </div>
              )}

              {/* Mensaje de Éxito de Bundle */}
              {isBundle && (
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center gap-2 text-center mt-2">
                  <span className="text-primary font-bold text-sm">🎉 ¡Pack de Tratamiento Completo! Tienes un 5% de descuento.</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer CTA */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border/50 bg-cream-warm">
            <div className="flex justify-between items-center mb-5">
              <span className="text-base text-muted-foreground">Total (IVA incl.)</span>
              <div className="flex items-baseline gap-2">
                {isBundle && (
                  <span className="text-lg text-muted-foreground line-through font-medium">€{total.toFixed(2)}</span>
                )}
                <span className="text-3xl font-heading font-extrabold text-foreground tracking-tighter">
                  €{isBundle ? cartTotalWithDiscount.toFixed(2) : total.toFixed(2)}
                </span>
              </div>
            </div>
            {isMaintenance ? (
              <button 
                disabled={true}
                className="w-full bg-muted border border-border text-muted-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-not-allowed text-base"
              >
                Compras Suspendidas (Mantenimiento)
              </button>
            ) : (
              <button 
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
                className="w-full bg-primary hover:bg-brand-green-hover text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-base cursor-pointer shadow-lg shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckoutLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Iniciando pago seguro...
                  </>
                ) : (
                  "Tramitar Pedido Seguro"
                )}
              </button>
            )}
            <p className="text-center text-xs text-muted-foreground mt-3 opacity-70">
              Pagos encriptados con seguridad bancaria mediante Stripe®
            </p>
          </div>
        )}
      </div>
    </>
  );
}
