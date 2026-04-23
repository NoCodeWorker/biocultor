'use client';

import Link from 'next/link';
import { ArrowRight, TrendingDown } from 'lucide-react';

const comparisons = [
  {
    competitor: 'Fertilizante líquido convencional',
    competitorPrice: '0,42€',
    savings: '64%',
    note: 'Enfoque de uso distinto y coste orientativo por aplicación.',
  },
  {
    competitor: 'Estiércol líquido industrializado',
    competitorPrice: '0,28€',
    savings: '46%',
    note: 'Formato y manejo diferentes según el tipo de cultivo.',
  },
  {
    competitor: 'Humus sólido de lombriz',
    competitorPrice: '0,35€',
    savings: '57%',
    note: 'Aplicación distinta según sistema de riego y escala.',
  },
];

export default function AnchoringBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-brand-brown-dark via-brand-brown to-brand-brown-dark rounded-2xl md:rounded-3xl overflow-hidden p-6 md:p-8 relative">
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/8 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 bg-primary/20 text-primary rounded-xl shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
              Comparativa orientativa de coste
            </p>
            <p className="text-cream/60 text-sm">
              Biocultor frente a otras categorías habituales
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {comparisons.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-white/8 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-cream/85 text-sm font-medium leading-tight truncate">{item.competitor}</p>
                <p className="text-cream/40 text-xs mt-0.5">{item.note}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-cream/40 text-sm line-through">{item.competitorPrice}/pl.</span>
                <span className="text-sm font-black text-primary">0,15€/pl.</span>
                <span className="text-[10px] font-extrabold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  -{item.savings}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="#formatos"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary hover:bg-brand-green-hover text-white font-bold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
        >
          Ver formatos y precios
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
