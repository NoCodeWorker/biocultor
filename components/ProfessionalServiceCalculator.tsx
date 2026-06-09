'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Ruler, ArrowRight, Sparkles, Truck, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Variant {
  sku: string;
  size: string;
  price: number;
}

interface ProfessionalServiceCalculatorProps {
  basePrice?: number;
  baseArea?: number;
  ratePerAdditionalM2?: number;
  productVariants?: Variant[];
}

export default function ProfessionalServiceCalculator({
  basePrice = 195,
  baseArea = 500,
  ratePerAdditionalM2 = 0.2,
  productVariants = []
}: ProfessionalServiceCalculatorProps) {
  const [area, setArea] = useState<number>(1000);
  const [serviceType, setServiceType] = useState<'suministro' | 'aplicacion'>('aplicacion');

  // Lógica de Suministro: Calcula los litros necesarios y la combinación más barata de garrafas
  const getSupplyEstimation = (m2: number) => {
    const litersNeeded = Math.ceil(m2 / 10); // 1L cada 10m²
    
    // Precios de la base de datos con fallbacks de seguridad
    const p25 = productVariants.find(v => v.sku === 'BIO-25L')?.price || 49.95;
    const p10 = productVariants.find(v => v.sku === 'BIO-10L')?.price || 29.95;
    const p5 = productVariants.find(v => v.sku === 'BIO-5L')?.price || 19.95;
    const p1 = productVariants.find(v => v.sku === 'BIO-1L')?.price || 9.95;

    const base25 = Math.floor(litersNeeded / 25);

    let bestPrice = Infinity;
    let bestCombination = { num25: 0, num10: 0, num5: 0, num1: 0 };

    // Buscamos el óptimo sobre el residuo (hasta 1 garrafa de 25L extra)
    for (let n25 = 0; n25 <= 1; n25++) {
      for (let n10 = 0; n10 <= 3; n10++) {
        for (let n5 = 0; n5 <= 5; n5++) {
          for (let n1 = 0; n1 <= 10; n1++) {
            const totalLiters = (base25 + n25) * 25 + n10 * 10 + n5 * 5 + n1 * 1;
            if (totalLiters >= litersNeeded) {
              const cost = (base25 + n25) * p25 + n10 * p10 + n5 * p5 + n1 * p1;
              if (cost < bestPrice) {
                bestPrice = cost;
                bestCombination = {
                  num25: base25 + n25,
                  num10: n10,
                  num5: n5,
                  num1: n1
                };
              }
            }
          }
        }
      }
    }

    return {
      liters: litersNeeded,
      price: bestPrice,
      combination: bestCombination
    };
  };

  // Lógica de Aplicación Completa: Tarifa similar a la de césped y jardines
  const getApplicationPrice = (m2: number) => {
    if (m2 <= baseArea) {
      return basePrice;
    }
    return basePrice + (m2 - baseArea) * ratePerAdditionalM2;
  };

  const supplyEst = getSupplyEstimation(area);
  const appPrice = getApplicationPrice(area);

  const totalPrice = serviceType === 'suministro' ? supplyEst.price : appPrice;

  // URL del CTA
  const queryParams = new URLSearchParams({
    servicio: 'paisajistas',
    m2: area.toString(),
    tipo: serviceType,
    precio: totalPrice.toFixed(2),
    litros: supplyEst.liters.toString()
  });

  return (
    <div className="bg-card border border-border/60 p-6 md:p-8 rounded-3xl w-full shadow-lg shadow-foreground/5 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">Calculadora Profesional</h3>
          <p className="text-xs text-muted-foreground">Estima dosis y costes para tu proyecto</p>
        </div>
      </div>

      {/* Selector de tipo de servicio */}
      <div className="grid grid-cols-2 gap-2 bg-background p-1 rounded-xl border border-border/60">
        <button
          onClick={() => setServiceType('aplicacion')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            serviceType === 'aplicacion'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          Suministro y Aplicación
        </button>
        <button
          onClick={() => setServiceType('suministro')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            serviceType === 'suministro'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Solo Suministro
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Input de m2 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <label htmlFor="pro-garden-area-range" className="text-foreground flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-muted-foreground" /> Superficie total a tratar
            </label>
            <span className="text-primary font-bold text-base">{area.toLocaleString('es-ES')} m²</span>
          </div>
          <input
            id="pro-garden-area-range"
            type="range"
            min={100}
            max={10000}
            step={100}
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>100 m²</span>
            <span>2.500 m²</span>
            <span>5.000 m²</span>
            <span>10.000 m²</span>
          </div>
        </div>

        {/* Input manual */}
        <div className="relative">
          <input
            id="pro-garden-area-input"
            type="number"
            min={10}
            max={50000}
            value={area || ''}
            onChange={(e) => setArea(Math.max(0, Number(e.target.value)))}
            placeholder="Introduce m² exactos"
            className="w-full h-11 px-4 pr-12 bg-background border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm font-semibold text-foreground transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">m²</span>
        </div>
      </div>

      {/* Resultados de Dosis (Siempre útil para el profesional) */}
      <div className="bg-background border border-border/60 rounded-2xl p-4 flex flex-col gap-2.5 text-xs text-muted-foreground">
        <div className="flex justify-between items-center border-b border-border/40 pb-2">
          <span className="font-semibold text-foreground">Dosis recomendada:</span>
          <span className="font-bold text-primary">{supplyEst.liters} Litros de Té concentrado</span>
        </div>
        
        {serviceType === 'suministro' && (
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-foreground">Distribución óptima recomendada:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {supplyEst.combination.num25 > 0 && (
                <span className="bg-muted px-2.5 py-1 rounded-md font-medium text-foreground">
                  {supplyEst.combination.num25}x Garrafa 25L
                </span>
              )}
              {supplyEst.combination.num10 > 0 && (
                <span className="bg-muted px-2.5 py-1 rounded-md font-medium text-foreground">
                  {supplyEst.combination.num10}x Garrafa 10L
                </span>
              )}
              {supplyEst.combination.num5 > 0 && (
                <span className="bg-muted px-2.5 py-1 rounded-md font-medium text-foreground">
                  {supplyEst.combination.num5}x Garrafa 5L
                </span>
              )}
              {supplyEst.combination.num1 > 0 && (
                <span className="bg-muted px-2.5 py-1 rounded-md font-medium text-foreground">
                  {supplyEst.combination.num1}x Botella 1L
                </span>
              )}
            </div>
          </div>
        )}

        {serviceType === 'aplicacion' && (
          <div>
            <span>*Incluye suministro del producto, operario aplicador con equipo especializado in-situ y testeo de pH/compactación.</span>
          </div>
        )}
      </div>

      {/* Resultado de Precio */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 text-center flex flex-col gap-1.5 relative overflow-hidden">
        <div className="absolute -right-2 -bottom-2 opacity-5 text-primary">
          <Sparkles className="w-16 h-16" />
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
          {serviceType === 'suministro' ? 'Coste Producto Estimado' : 'Presupuesto Estimado'}
        </p>
        <div className="text-4xl font-extrabold text-foreground mt-1 transition-all">
          {totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          {serviceType === 'aplicacion'
            ? area <= baseArea
              ? `Tarifa mínima del servicio (cubre hasta ${baseArea} m²).`
              : 'Tarifa base de aplicación con coste adicional por m².'
            : 'Precios optimizados para profesionales basados en formatos comerciales.'}
        </p>
      </div>

      {/* Botón CTA con redirección y pre-llenado */}
      <Button asChild size="lg" className="rounded-full w-full bg-primary hover:bg-brand-green-hover text-white py-6 shadow-md shadow-primary/15 transition-all">
        <Link href={`/contacto?${queryParams.toString()}`}>
          Solicitar Presupuesto Profesional
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </Button>

      <p className="text-[10px] text-muted-foreground text-center">
        *Presupuestos para Madrid y Castilla-La Mancha. Logística adaptada a la viabilidad de microorganismos vivos.
      </p>
    </div>
  );
}
