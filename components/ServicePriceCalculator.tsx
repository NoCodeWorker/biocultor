'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Ruler, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServicePriceCalculator() {
  const [area, setArea] = useState<number>(500);

  // Calcula el precio dinámicamente
  // Base 195 € por 500 m2
  // Adicional: 0.2 € por cada m2 de más.
  const calculatePrice = (m2: number) => {
    const basePrice = 195;
    const baseArea = 500;
    const ratePerAdditionalM2 = 0.2;

    if (m2 <= baseArea) {
      return basePrice;
    }
    return basePrice + (m2 - baseArea) * ratePerAdditionalM2;
  };

  const totalPrice = calculatePrice(area);

  return (
    <div className="bg-card border border-border/60 p-6 md:p-8 rounded-3xl w-full shadow-lg shadow-foreground/5 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">Calculadora de Presupuesto</h3>
          <p className="text-xs text-muted-foreground">Obtén una estimación instantánea para tu jardín</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Input de m2 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <label htmlFor="garden-area" className="text-foreground flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-muted-foreground" /> Superficie de césped o jardín
            </label>
            <span className="text-primary font-bold text-base">{area} m²</span>
          </div>
          <input
            id="garden-area-range"
            type="range"
            min={100}
            max={5000}
            step={50}
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>100 m²</span>
            <span>1.000 m²</span>
            <span>2.500 m²</span>
            <span>5.000 m²</span>
          </div>
        </div>

        {/* Input manual */}
        <div className="relative">
          <input
            id="garden-area-input"
            type="number"
            min={10}
            max={10000}
            value={area || ''}
            onChange={(e) => setArea(Math.max(0, Number(e.target.value)))}
            placeholder="Introduce m² exactos"
            className="w-full h-11 px-4 pr-12 bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm font-semibold text-foreground transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">m²</span>
        </div>
      </div>

      {/* Resultado */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 text-center flex flex-col gap-1.5 relative overflow-hidden">
        <div className="absolute -right-2 -bottom-2 opacity-5 text-primary">
          <Sparkles className="w-16 h-16" />
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Presupuesto Estimado</p>
        <div className="text-4xl font-extrabold text-foreground mt-1 transition-all">
          {totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          {area <= 500
            ? 'Tarifa mínima aplicable (cubre hasta 500 m²).'
            : `Tarifa mínima de 195 € más suplemento por los metros adicionales.`}
        </p>
      </div>

      {/* Botón CTA con pre-llenado */}
      <Button asChild size="lg" className="rounded-full w-full bg-primary hover:bg-brand-green-hover text-white py-6 shadow-md shadow-primary/15 transition-all">
        <Link href={`/contacto?servicio=cesped&m2=${area}&precio=${totalPrice}`}>
          Solicitar este Presupuesto
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </Button>

      <p className="text-[10px] text-muted-foreground text-center">
        *El presupuesto final se confirmará tras el diagnóstico inicial en el terreno.
      </p>
    </div>
  );
}
