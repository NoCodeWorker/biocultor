'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Truck, ShieldCheck, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

interface StickyCartBarProps {
  variants: any[];
  productName: string;
}

export default function StickyCartBar({ variants, productName }: StickyCartBarProps) {
  const [visible, setVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(variants.find(v => v.popular) || variants[0]);
  const { addItem } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 600px (after the main CTA)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant.id,
      name: productName,
      size: selectedVariant.size,
      price: selectedVariant.price,
      image: selectedVariant.imagePath || selectedVariant.image || '',
    });
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      {/* Mobile sticky bar */}
      <div className="block md:hidden bg-background border-t border-border/60 shadow-2xl shadow-earth-dark/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {variants.slice(0, 3).map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={cn(
                    "text-xs font-bold px-2.5 py-1 rounded-lg border transition-all",
                    selectedVariant.id === v.id
                      ? "border-primary bg-primary/8 text-secondary"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {v.size}
                </button>
              ))}
            </div>
            <p className="text-lg font-extrabold text-foreground leading-none">
              €{selectedVariant.price.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-primary hover:bg-brand-green-hover text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/15 transition-all active:scale-95 whitespace-nowrap"
          >
            <ShoppingBag className="w-5 h-5" />
            Añadir
          </button>
        </div>
      </div>

      {/* Desktop sticky bar */}
      <div className="hidden md:block bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-xl shadow-earth-dark/10">
        <div className="w-[80%] xl:w-[75%] mx-auto px-4 py-3 flex items-center justify-between gap-6">
          {/* Product info */}
          <div className="flex items-center gap-4">
            <div>
              <p className="font-heading font-bold text-foreground leading-tight">{productName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">4.9 (148)</span>
              </div>
            </div>
          </div>

          {/* Format selector */}
          <div className="flex items-center gap-2">
            {variants.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={cn(
                  "text-sm font-semibold px-3 py-1.5 rounded-lg border transition-all",
                  selectedVariant.id === v.id
                    ? "border-primary bg-primary/8 text-secondary"
                    : "border-border/50 text-muted-foreground hover:border-primary/25"
                )}
              >
                {v.size}
              </button>
            ))}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-extrabold text-foreground">€{selectedVariant.price.toFixed(2)}</p>
              <div className="flex items-center gap-1.5 text-xs text-primary justify-end">
                <Truck className="w-3 h-3" />
                {selectedVariant.price >= 50 ? 'Envío gratis' : 'Envío 24/48h'}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-primary hover:bg-brand-green-hover text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/15 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            >
              <ShoppingBag className="w-5 h-5" />
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

