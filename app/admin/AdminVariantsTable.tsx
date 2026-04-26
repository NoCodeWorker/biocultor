'use client';

import { useState } from 'react';
import { updateVariantPrice } from './actions';
import { Save, Loader2, Tag, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminVariantsTable({ variants }: { variants: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [localVariants, setLocalVariants] = useState(variants);

  const handlePriceChange = (id: string, field: 'price' | 'comparePrice', value: string) => {
    setLocalVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value === '' ? null : parseFloat(value) } : v));
  }

  const handleSave = async (variant: any) => {
    setLoadingId(variant.id);
    await updateVariantPrice(variant.id, variant.price, variant.comparePrice);
    setLoadingId(null);
  }

  return (
    <div className="bg-card border border-border shadow-2xl shadow-black/5 rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/30">
            <tr>
              <th className="p-6 font-heading font-bold text-foreground text-sm uppercase tracking-wider">SKU / Formato</th>
              <th className="p-6 font-heading font-bold text-foreground text-sm uppercase tracking-wider">Audiencia (Target)</th>
              <th className="p-6 font-heading font-bold text-foreground text-sm uppercase tracking-wider text-center">Precio Stripe (€)</th>
              <th className="p-6 font-heading font-bold text-foreground text-sm uppercase tracking-wider text-center">Precio referencia 1 L (€)</th>
              <th className="p-6 font-heading font-bold text-foreground text-sm uppercase tracking-wider text-right">Mando de Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {localVariants.map((variant, index) => {
              const hasDiscount = variant.comparePrice && variant.comparePrice > variant.price;
              const discountPercent = hasDiscount 
                ? Math.round(((variant.comparePrice - variant.price) / variant.comparePrice) * 100)
                : 0;

              return (
                <tr key={variant.id} className={cn(
                  "hover:bg-muted/10 transition-colors",
                  variant.popular ? "bg-primary/5" : ""
                )}>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-lg text-foreground">{variant.size}</span>
                        {variant.popular && <span className="bg-primary text-primary-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Top</span>}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono bg-border/50 px-2 py-0.5 rounded-md w-fit">{variant.sku}</span>
                    </div>
                  </td>
                  
                  <td className="p-6 text-sm font-semibold text-muted-foreground">
                    {variant.target}
                  </td>
                  
                  <td className="p-6">
                    <div className="relative max-w-[140px] mx-auto">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground font-bold">€</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={variant.price || ''} 
                        onChange={(e) => handlePriceChange(variant.id, 'price', e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 bg-background border-2 border-border/50 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all font-black text-lg text-foreground shadow-inner"
                      />
                    </div>
                  </td>
                  
                  <td className="p-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative max-w-[140px] mx-auto">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold opacity-60">€</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={variant.comparePrice || ''} 
                          onChange={(e) => handlePriceChange(variant.id, 'comparePrice', e.target.value)}
                          placeholder="Ninguno"
                          className="w-full pl-8 pr-3 py-2 bg-background border border-border/50 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all font-medium text-muted-foreground line-through decoration-red-500/50"
                        />
                      </div>
                      {hasDiscount && (
                        <span className="text-xs font-bold text-primary flex items-center gap-0.5 bg-primary/10 px-2 py-0.5 rounded-md">
                          -{discountPercent}% <Percent className="w-3 h-3"/>
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => handleSave(variant)}
                      disabled={loadingId === variant.id}
                      className={cn(
                        "inline-flex items-center justify-center min-w-[140px] gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95",
                        loadingId === variant.id 
                          ? "bg-muted text-muted-foreground shadow-none" 
                          : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground hover:shadow-primary/30"
                      )}
                    >
                      {loadingId === variant.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      {loadingId === variant.id ? 'Inyectando' : 'Impactar BD'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
