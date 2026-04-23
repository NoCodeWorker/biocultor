'use client';

import { useEffect, useState } from 'react';
import { Package, Leaf, Truck } from 'lucide-react';

export default function SocialProofTicker() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 2000);

    return () => {
      clearTimeout(showTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="flex flex-col gap-2.5 py-3 px-4 rounded-xl bg-background/60 border border-primary/10 text-xs sm:text-sm">
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Leaf className="w-3 h-3 text-primary" />
        </div>
        <span className="text-muted-foreground font-medium leading-tight">
          Formatos para huerto, jardín y uso profesional
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Truck className="w-3 h-3 text-primary" />
        </div>
        <span className="text-muted-foreground font-medium leading-tight">
          Envío nacional y compra directa desde la tienda
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
          <Package className="w-3 h-3 text-amber-600" />
        </div>
        <span className="text-amber-700 font-semibold leading-tight">
          Consulta formato, uso y disponibilidad
        </span>
      </div>
    </div>
  );
}
