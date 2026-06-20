'use client';

import { useState } from 'react';
import { Calculator, Ruler, Sparkles, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitContactForm } from '@/app/(shop)/contacto/actions';

interface ServicePriceCalculatorProps {
  /** Precio base del servicio leído de la BD (SeoPage.payloadJson). */
  basePrice?: number;
  /** Área cubierta por la tarifa base, en m². */
  baseArea?: number;
  /** Incremento por m² adicional. */
  ratePerAdditionalM2?: number;
  sourcePath?: string;
  serviceSlug?: string;
}

export default function ServicePriceCalculator({
  basePrice = 195,
  baseArea = 500,
  ratePerAdditionalM2 = 0.2,
  sourcePath = '/calculadoras',
  serviceSlug = 'cesped',
}: ServicePriceCalculatorProps) {
  const [area, setArea] = useState<number>(baseArea);
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);

  // Calcula el precio dinámicamente usando los valores que vienen de la BD
  const calculatePrice = (m2: number) => {
    if (m2 <= baseArea) {
      return basePrice;
    }
    return basePrice + (m2 - baseArea) * ratePerAdditionalM2;
  };

  const totalPrice = calculatePrice(area);

  async function action(formData: FormData) {
    setIsPending(true);
    setStatus(null);
    const result = await submitContactForm(formData);
    setStatus(result);
    setIsPending(false);
  }

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
          {area <= baseArea
            ? `Tarifa mínima aplicable (cubre hasta ${baseArea.toLocaleString('es-ES')} m²).`
            : `Tarifa mínima de ${basePrice.toLocaleString('es-ES')} € más suplemento por los metros adicionales.`}
        </p>
      </div>

      <form action={action} className="rounded-2xl border border-primary/15 bg-primary/5 p-4 flex flex-col gap-3">
        <input type="hidden" name="motivo" value="Servicio de Regeneración de Césped" />
        <input
          type="hidden"
          name="mensaje"
          value={`Hola, quiero validar el servicio de regeneración de césped y jardines para ${area} m2. La estimación web es de ${totalPrice.toFixed(2)} EUR.`}
        />
        <input type="hidden" name="sourcePath" value={sourcePath} />
        <input type="hidden" name="sourceQuery" value={`?servicio=${serviceSlug}&m2=${area}&precio=${totalPrice.toFixed(2)}`} />
        <input type="hidden" name="sourceReferrer" value="" />
        <input type="hidden" name="estimatedM2" value={area.toString()} />
        <input type="hidden" name="estimatedPrice" value={totalPrice.toFixed(2)} />
        <input type="hidden" name="serviceSlug" value={serviceSlug} />
        <input type="hidden" name="leadIntent" value="service" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            name="name"
            type="text"
            placeholder="Nombre"
            className="h-11 rounded-xl border border-border/60 bg-background px-3 text-sm font-semibold text-foreground outline-none focus:border-primary"
          />
          <input
            required
            name="phone"
            type="tel"
            placeholder="Teléfono"
            className="h-11 rounded-xl border border-border/60 bg-background px-3 text-sm font-semibold text-foreground outline-none focus:border-primary"
          />
        </div>
        <input
          name="email"
          type="email"
          placeholder="Email opcional"
          className="h-11 rounded-xl border border-border/60 bg-background px-3 text-sm font-semibold text-foreground outline-none focus:border-primary"
        />
        {status?.error && <p className="text-xs font-semibold text-red-600">{status.error}</p>}
        {status?.success ? (
          <div className="flex items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm font-bold text-primary">
            <CheckCircle2 className="w-4 h-4" />
            Solicitud recibida. Revisaremos superficie y viabilidad.
          </div>
        ) : (
          <Button disabled={isPending} size="lg" className="rounded-full w-full bg-primary hover:bg-brand-green-hover text-white py-6 shadow-md shadow-primary/15 transition-all">
            {isPending ? 'Enviando...' : 'Solicitar diagnóstico'}
            {isPending ? null : <Send className="ml-2 w-4 h-4" />}
          </Button>
        )}

      <p className="text-[10px] text-muted-foreground text-center">
        *El presupuesto final se confirmará tras el diagnóstico inicial en el terreno.
      </p>
      </form>
    </div>
  );
}
