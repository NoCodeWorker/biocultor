'use client';

import { useState } from 'react';
import { Calculator, Leaf, TrendingDown, Sprout, TreePine, Sun, Home } from 'lucide-react';

const crops = [
  { id: 'huerto', icon: Sprout, label: 'Huerto Urbano', plants: 20, treatment: 0.15, chemical: 0.42 },
  { id: 'olivar', icon: TreePine, label: 'Olivar', plants: 200, treatment: 0.08, chemical: 0.31 },
  { id: 'citricos', icon: Sun, label: 'Cítricos', plants: 80, treatment: 0.09, chemical: 0.35 },
  { id: 'jardin', icon: Leaf, label: 'Jardín', plants: 50, treatment: 0.12, chemical: 0.38 },
  { id: 'invernadero', icon: Home, label: 'Invernadero', plants: 150, treatment: 0.07, chemical: 0.28 },
];

export default function CostCalculator() {
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const [plants, setPlants] = useState(crops[0].plants);

  const biocultorCost = plants * selectedCrop.treatment;
  const chemicalCost = plants * selectedCrop.chemical;
  const savings = chemicalCost - biocultorCost;
  const savingsPct = Math.round((savings / chemicalCost) * 100);
  const costPerPlant = selectedCrop.treatment;

  const handleCropChange = (crop: typeof crops[0]) => {
    setSelectedCrop(crop);
    setPlants(crop.plants);
  };

  return (
    <section className="w-full py-20 md:py-28 bg-card border-t border-border/40 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(74,107,28,0.04),transparent_60%)] pointer-events-none" />

      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/20">
            <Calculator className="w-3.5 h-3.5 text-primary" />
            Calculadora de Ahorro Real
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground mb-5">
            ¿Cuánto ahorras con Biocultor?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Compara el coste real por planta frente a fertilizantes convencionales. 
            El extracto de humus es la opción más económica <em>y</em> más eficaz.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left: Inputs */}
            <div className="bg-background rounded-3xl border border-border/50 p-7 md:p-8 flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
                  1. Tu tipo de cultivo
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {crops.map((crop) => (
                    <button
                      key={crop.id}
                      onClick={() => handleCropChange(crop)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                        selectedCrop.id === crop.id
                          ? 'border-primary bg-primary/8 text-secondary font-bold'
                          : 'border-border/50 text-muted-foreground hover:border-primary/25'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <crop.icon className="w-4 h-4 shrink-0" />
                        <span>{crop.label}</span>
                      </div>
                      {selectedCrop.id === crop.id && (
                        <span className="text-xs bg-primary/12 text-secondary px-2 py-0.5 rounded-full font-bold">
                          Seleccionado
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
                  2. Número de plantas / árboles
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={plants}
                    onChange={(e) => setPlants(Number(e.target.value))}
                    className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer"
                  />
                  <span className="text-2xl font-extrabold text-primary min-w-[60px] text-right">{plants}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>5 plantas</span>
                  <span>500 plantas</span>
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div className="flex flex-col gap-4">
              {/* Biocultor cost */}
              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 md:p-7 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Leaf className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">Con Biocultor</span>
                    </div>
                    <p className="text-muted-foreground text-sm">Orgánico + Efectivo</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-display font-bold text-foreground">€{biocultorCost.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">por temporada</p>
                  </div>
                </div>
                <div className="w-full bg-primary/10 rounded-full h-2">
                  <div
                    className="h-2 bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${(biocultorCost / chemicalCost) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-primary font-bold mt-2.5">
                  Solo {costPerPlant.toFixed(2)}€ / planta / temporada
                </p>
              </div>

              {/* Chemical cost */}
              <div className="bg-muted/40 border border-border/50 rounded-3xl p-6 md:p-7 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Fertilizante convencional</p>
                    <p className="text-muted-foreground text-sm">Químico + Riesgo</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-display font-bold text-muted-foreground line-through decoration-red-400">€{chemicalCost.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">por temporada</p>
                  </div>
                </div>
                <div className="w-full bg-muted/60 rounded-full h-2">
                  <div className="h-2 bg-muted-foreground/30 rounded-full w-full" />
                </div>
                <p className="text-xs text-muted-foreground font-bold mt-2.5">
                  {selectedCrop.chemical.toFixed(2)}€ / planta + daño al suelo
                </p>
              </div>

              {/* Savings callout */}
              <div className="bg-primary text-white rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Tu Ahorro Real</span>
                  </div>
                  <p className="text-sm font-medium opacity-80">Por cada temporada de cultivo</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-display font-black">€{savings.toFixed(2)}</p>
                  <p className="text-sm font-bold opacity-80 mt-0.5">
                    {savingsPct}% menos
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 opacity-70">
            * Cálculos basados en consumo medio por planta según tipo de cultivo. Ratios de dilución Biocultor: 1L / 100L agua.
          </p>
        </div>
      </div>
    </section>
  );
}

