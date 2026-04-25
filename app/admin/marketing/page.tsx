import { Tag } from 'lucide-react';
import { listCoupons } from './actions';
import MarketingClient from './MarketingClient';

export const dynamic = 'force-dynamic';

export default async function AdminMarketingPage() {
  const coupons = await listCoupons();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">Marketing</p>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mt-1 flex items-center gap-3">
          <Tag className="w-8 h-8 text-primary" />
          Email & Cupones
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
          Gestión de cupones de descuento directamente en Stripe. Crea, revisa y elimina
          codes sin salir del panel.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border/60 rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Activos</p>
          <p className="text-2xl font-heading font-black text-foreground mt-1.5">
            {coupons.filter((c) => c.valid).length}
          </p>
        </div>
        <div className="bg-card border border-border/60 rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total usos</p>
          <p className="text-2xl font-heading font-black text-foreground mt-1.5">
            {coupons.reduce((acc, c) => acc + c.timesRedeemed, 0)}
          </p>
        </div>
        <div className="bg-card border border-border/60 rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total cupones</p>
          <p className="text-2xl font-heading font-black text-foreground mt-1.5">{coupons.length}</p>
        </div>
      </div>

      <MarketingClient coupons={coupons} />
    </div>
  );
}
