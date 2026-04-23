'use client';

import { useEffect, useState } from 'react';
import { Flame, Package, Calendar, AlertTriangle, Leaf, Sun, Wind, Snowflake } from 'lucide-react';

// Current month determines the active growing season
function getSeasonContext() {
  const month = new Date().getMonth(); // 0-11
  if (month >= 1 && month <= 4) return {
    season: 'Primavera',
    icon: Leaf,
    urgency: 'Buen momento para revisar arranque de campaña, frecuencia de aplicación y formato adecuado según cultivo.',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
  };
  if (month >= 5 && month <= 7) return {
    season: 'Verano',
    icon: Sun,
    urgency: 'En verano conviene ajustar riego, observar el estado del cultivo y ordenar mejor la aplicación si el uso es recurrente.',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  };
  if (month >= 8 && month <= 10) return {
    season: 'Otoño',
    icon: Wind,
    urgency: 'El otoño es útil para reevaluar manejo, cierre de campaña y necesidad de reposición para el siguiente ciclo.',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  };
  return {
    season: 'Invierno',
    icon: Snowflake,
    urgency: 'En invierno suele tener más sentido planificar compra, conservación y estrategia de uso que buscar mensajes de urgencia.',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  };
}

export default function UrgencyModule({ stock = 12 }: { stock?: number }) {
  const [mounted, setMounted] = useState(false);
  const [stockDisplay, setStockDisplay] = useState(stock);
  const seasonCtx = getSeasonContext();

  useEffect(() => {
    setMounted(true);
    setStockDisplay(stock);
  }, []);

  const stockPercent = Math.min((stockDisplay / 20) * 100, 100);
  const isLow = stockDisplay <= 5;

  return (
    <div className="flex flex-col gap-3 my-4">

      {/* Season Urgency */}
      <div className={`flex items-start gap-3 p-4 rounded-2xl border ${seasonCtx.bg} ${seasonCtx.border}`}>
        <seasonCtx.icon className={`w-6 h-6 shrink-0 mt-0.5 ${seasonCtx.color}`} />
        <div>
          <p className={`text-xs font-extrabold uppercase tracking-widest mb-1 ${seasonCtx.color}`}>
            Temporada activa: {seasonCtx.season}
          </p>
          <p className={`text-sm leading-snug ${seasonCtx.color} opacity-90`}>
            {seasonCtx.urgency}
          </p>
        </div>
      </div>

      {/* Stock Meter */}
      <div className={`flex flex-col gap-2 p-4 rounded-2xl border ${isLow ? 'bg-red-50 border-red-200' : 'bg-amber-50/60 border-amber-200/60'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className={`w-4 h-4 ${isLow ? 'text-red-600' : 'text-amber-700'}`} />
            <span className={`text-xs font-extrabold uppercase tracking-widest ${isLow ? 'text-red-600' : 'text-amber-700'}`}>
              {isLow ? 'Últimas unidades' : 'Stock del lote actual'}
            </span>
          </div>
          {mounted && (
            <span className={`text-sm font-black ${isLow ? 'text-red-700' : 'text-amber-800'}`}>
              {stockDisplay} unidades
            </span>
          )}
        </div>

        {/* Stock bar */}
        <div className="w-full bg-white/60 rounded-full h-2.5 overflow-hidden border border-white/40">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isLow ? 'bg-red-500' : 'bg-amber-500'}`}
            style={{ width: `${stockPercent}%` }}
          />
        </div>

        <p className={`text-xs ${isLow ? 'text-red-600 font-semibold' : 'text-amber-700'}`}>
          {isLow
            ? 'Disponibilidad baja en este formato. Conviene revisar stock antes de cerrar compra.'
            : 'Disponibilidad orientativa del lote actual.'
          }
        </p>
      </div>

      {/* Batch production mention */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-muted/40 border border-border/40">
        <Flame className="w-4 h-4 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground leading-snug">
          La disponibilidad mostrada es orientativa y puede cambiar con nuevas entradas de stock.
          <strong className="text-foreground"> Si necesitas volumen, conviene confirmarlo antes del pedido.</strong>
        </p>
      </div>

    </div>
  );
}
