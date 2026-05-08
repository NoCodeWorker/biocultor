'use client';

import { useState, useMemo } from 'react';
import { Calculator, Euro, Package, Truck, Percent, ShoppingCart, Store, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Tipos base
type FormatType = '1L' | '5L' | '20L' | '1000L';

interface Costs {
  rawMaterial: number;
  packaging: number;
  labor: number;
  energy: number;
  other: number;
}

interface FormatData {
  id: FormatType;
  name: string;
  weightKg: number;
  defaultCosts: Costs;
  defaultPvp: number;
}

// Datos por defecto basados en los formatos de Biocultor
const FORMATS: Record<FormatType, FormatData> = {
  '1L': {
    id: '1L',
    name: 'Botella 1 Litro',
    weightKg: 1.2,
    defaultCosts: { rawMaterial: 0.8, packaging: 0.5, labor: 0.3, energy: 0.1, other: 0.1 },
    defaultPvp: 14.90,
  },
  '5L': {
    id: '5L',
    name: 'Garrafa 5 Litros',
    weightKg: 5.5,
    defaultCosts: { rawMaterial: 3.5, packaging: 1.2, labor: 0.5, energy: 0.3, other: 0.2 },
    defaultPvp: 44.90,
  },
  '20L': {
    id: '20L',
    name: 'Garrafa 20 Litros',
    weightKg: 21.0,
    defaultCosts: { rawMaterial: 13.0, packaging: 3.5, labor: 1.0, energy: 0.8, other: 0.5 },
    defaultPvp: 149.90,
  },
  '1000L': {
    id: '1000L',
    name: 'IBC 1000 Litros',
    weightKg: 1050.0,
    defaultCosts: { rawMaterial: 600.0, packaging: 150.0, labor: 10.0, energy: 5.0, other: 10.0 },
    defaultPvp: 1250.0,
  }
};

// Simulador de API de Packlink Pro
// TODO: Sustituir por la llamada real a la API de Packlink Pro cuando esté integrada.
const calculatePacklinkShipping = (totalWeightKg: number): number => {
  if (totalWeightKg === 0) return 0;
  if (totalWeightKg <= 2) return 4.50;
  if (totalWeightKg <= 5) return 5.80;
  if (totalWeightKg <= 10) return 7.50;
  if (totalWeightKg <= 25) return 12.00;
  if (totalWeightKg <= 50) return 25.00;
  if (totalWeightKg <= 100) return 45.00;
  
  // Paletizado (aprox > 100kg)
  const basePallet = 65.00;
  const extraKg = totalWeightKg - 100;
  return basePallet + (Math.ceil(extraKg / 100) * 15.00);
};

export default function CalculadoraCostesPage() {
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('5L');
  const [quantity, setQuantity] = useState<number>(1);
  
  // Custom states that init with defaults
  const [costs, setCosts] = useState<Costs>(FORMATS['5L'].defaultCosts);
  const [pvp, setPvp] = useState<number>(FORMATS['5L'].defaultPvp);
  const [retailMargin, setRetailMargin] = useState<number>(30); // 30% margin for B2B Retailer
  const [iva, setIva] = useState<number>(21); // 21% general, or 10% agricultural

  // Handlers
  const handleFormatChange = (format: FormatType) => {
    setSelectedFormat(format);
    setCosts(FORMATS[format].defaultCosts);
    setPvp(FORMATS[format].defaultPvp);
    // Keep quantity and margins same
  };

  const handleCostChange = (key: keyof Costs, value: string) => {
    const num = parseFloat(value) || 0;
    setCosts(prev => ({ ...prev, [key]: num }));
  };

  // Calculations
  const formatInfo = FORMATS[selectedFormat];
  const totalWeight = formatInfo.weightKg * quantity;
  
  // Producción
  const unitCost = costs.rawMaterial + costs.packaging + costs.labor + costs.energy + costs.other;
  const totalProductionCost = unitCost * quantity;

  // Envío (Packlink Pro)
  const totalShippingCost = calculatePacklinkShipping(totalWeight);
  const unitShippingCost = totalShippingCost / quantity;

  // CANAL B2C (Venta Directa Cliente Final)
  const priceB2CExIva = pvp / (1 + (iva / 100));
  const revenueB2C = priceB2CExIva * quantity;
  const profitB2C = revenueB2C - totalProductionCost - totalShippingCost;
  const marginB2C = revenueB2C > 0 ? (profitB2C / revenueB2C) * 100 : 0;

  // CANAL B2B (Retail / Distribuidor)
  // El precio al distribuidor se calcula descontando su margen del PVP (sin IVA)
  const priceB2BExIva = priceB2CExIva * (1 - (retailMargin / 100));
  const revenueB2B = priceB2BExIva * quantity;
  
  // Normalmente los envíos grandes a B2B se negocian o van a portes debidos, 
  // pero lo incluimos como coste asumido para el análisis del peor caso.
  const profitB2B = revenueB2B - totalProductionCost - totalShippingCost; 
  const marginB2B = revenueB2B > 0 ? (profitB2B / revenueB2B) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-foreground flex items-center gap-3">
          <Calculator className="w-8 h-8 text-primary" />
          Calculadora de Costes y Rentabilidad
        </h1>
        <p className="text-muted-foreground mt-2">
          Simulador avanzado de márgenes B2C (Cliente Final) y B2B (Retail) con estimación de costes de envío vía Packlink Pro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PARTE IZQUIERDA: CONFIGURACIÓN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Tarjeta Configuración General */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Parámetros de Producto
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Formato del Producto</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(FORMATS) as FormatType[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleFormatChange(fmt)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        selectedFormat === fmt 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'bg-background border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {FORMATS[fmt].name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Unidades</label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">IVA Aplicable (%)</label>
                  <input 
                    type="number" 
                    value={iva}
                    onChange={(e) => setIva(parseFloat(e.target.value) || 0)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Costes de Producción */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Euro className="w-5 h-5 text-primary" />
              Costes de Producción (Unitarios)
            </h2>
            
            <div className="space-y-3">
              {[
                { key: 'rawMaterial', label: 'Materia Prima (Humus, etc)' },
                { key: 'packaging', label: 'Packaging (Envase, Etiqueta)' },
                { key: 'labor', label: 'Mano de Obra' },
                { key: 'energy', label: 'Energía / Suministros' },
                { key: 'other', label: 'Otros Costes Indirectos' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4">
                  <label className="flex-1 text-sm text-muted-foreground">{label}</label>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={costs[key as keyof Costs]}
                      onChange={(e) => handleCostChange(key as keyof Costs, e.target.value)}
                      className="w-full bg-background border border-border rounded-lg pl-7 pr-3 py-1.5 text-right font-medium text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-3 mt-3 border-t border-border flex items-center justify-between font-bold text-foreground">
                <span>Coste Total Producción (Ud.)</span>
                <span>{unitCost.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Precios y Márgenes */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" />
              Estrategia de Precios
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">PVP (con IVA) para Cliente Final</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <input 
                    type="number" 
                    step="0.10"
                    value={pvp}
                    onChange={(e) => setPvp(parseFloat(e.target.value) || 0)}
                    className="w-full bg-background border border-border rounded-lg pl-7 pr-3 py-2 font-bold text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Precio sin IVA: {priceB2CExIva.toFixed(2)} €</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Margen Comercial Retail / Distribuidor (%)</label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  <input 
                    type="number" 
                    value={retailMargin}
                    onChange={(e) => setRetailMargin(parseFloat(e.target.value) || 0)}
                    className="w-full bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  El distribuidor compra a {priceB2BExIva.toFixed(2)} € (sin IVA) y vende a {pvp} € (con IVA).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PARTE DERECHA: ANÁLISIS Y RESULTADOS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tarjeta Envío Packlink */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Estimación de Envío (Packlink Pro API)
            </h2>
            <div className="flex items-start gap-3 mt-4">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Cálculo de envío basado en el peso total. 
                El peso de {quantity} unidad(es) de {formatInfo.name} es de <strong>{totalWeight.toFixed(1)} kg</strong>.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Coste Envío Total</p>
                <p className="text-2xl font-bold text-foreground">{totalShippingCost.toFixed(2)} €</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Impacto por Unidad</p>
                <p className="text-2xl font-bold text-foreground">{unitShippingCost.toFixed(2)} €</p>
              </div>
            </div>
          </div>

          {/* Grid de Rentabilidad B2C / B2B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tarjeta Beneficio B2C */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShoppingCart className="w-24 h-24" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-4 relative z-10 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-500" />
                Canal B2C (Directo)
              </h2>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end border-b border-border/50 pb-2">
                  <span className="text-sm text-muted-foreground">Ingreso Neto (Sin IVA)</span>
                  <span className="font-medium text-foreground">{revenueB2C.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-end border-b border-border/50 pb-2 text-red-400">
                  <span className="text-sm">Costes Prod. + Envío</span>
                  <span className="font-medium">-{(totalProductionCost + totalShippingCost).toFixed(2)} €</span>
                </div>
                <div className="pt-2">
                  <span className="block text-sm text-muted-foreground mb-1">Beneficio Neto Total</span>
                  <span className={`text-4xl font-extrabold tracking-tight ${profitB2C >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {profitB2C.toFixed(2)} €
                  </span>
                </div>
                
                <div className="mt-4 bg-muted/30 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Margen Real Neto</span>
                  <span className={`font-bold ${marginB2C >= 30 ? 'text-emerald-500' : marginB2C >= 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {marginB2C.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjeta Beneficio B2B */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Store className="w-24 h-24" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-4 relative z-10 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-500" />
                Canal B2B (Retail)
              </h2>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end border-b border-border/50 pb-2">
                  <span className="text-sm text-muted-foreground">Ingreso B2B (Sin IVA)</span>
                  <span className="font-medium text-foreground">{revenueB2B.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-end border-b border-border/50 pb-2 text-red-400">
                  <span className="text-sm">Costes Prod. + Envío</span>
                  <span className="font-medium">-{(totalProductionCost + totalShippingCost).toFixed(2)} €</span>
                </div>
                <div className="pt-2">
                  <span className="block text-sm text-muted-foreground mb-1">Beneficio Neto Total</span>
                  <span className={`text-4xl font-extrabold tracking-tight ${profitB2B >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                    {profitB2B.toFixed(2)} €
                  </span>
                </div>
                
                <div className="mt-4 bg-muted/30 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Margen Real Neto</span>
                  <span className={`font-bold ${marginB2B >= 20 ? 'text-blue-500' : marginB2B >= 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {marginB2B.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Resumen Visual */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Desglose Unitario
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="w-full bg-muted/30 rounded-full h-8 flex overflow-hidden">
                <div 
                  className="bg-red-500/80 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all"
                  style={{ width: `${(unitCost / priceB2CExIva) * 100}%` }}
                  title="Producción"
                >Prod.</div>
                <div 
                  className="bg-orange-500/80 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all"
                  style={{ width: `${(unitShippingCost / priceB2CExIva) * 100}%` }}
                  title="Envío"
                >Envío</div>
                <div 
                  className="bg-blue-500/80 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all"
                  style={{ width: `${((priceB2CExIva - priceB2BExIva) / priceB2CExIva) * 100}%` }}
                  title="Margen Retailer"
                >Retailer</div>
                <div 
                  className="bg-emerald-500/80 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all"
                  style={{ width: `${(marginB2B / 100) * 100}%` }}
                  title="Beneficio Biocultor"
                >Beneficio</div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500/80"></div> Producción ({unitCost.toFixed(2)}€)</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-orange-500/80"></div> Envío ({unitShippingCost.toFixed(2)}€)</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500/80"></div> Retailer ({(priceB2CExIva - priceB2BExIva).toFixed(2)}€)</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500/80"></div> Beneficio Biocultor</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
