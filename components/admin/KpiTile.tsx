import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string;
  pct: number | null;
  icon: LucideIcon;
  /** Si true, un % positivo es malo (ej. tasa refund). */
  inverted?: boolean;
  hint?: string;
};

export default function KpiTile({ label, value, pct, icon: Icon, inverted, hint }: Props) {
  const direction = pct === null || pct === 0 ? 'flat' : pct > 0 ? 'up' : 'down';
  const isGood =
    direction === 'flat'
      ? null
      : inverted
        ? direction === 'down'
        : direction === 'up';

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        {pct !== null && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-md',
              isGood === true && 'bg-emerald-100 text-emerald-700',
              isGood === false && 'bg-red-100 text-red-700',
              isGood === null && 'bg-muted text-muted-foreground'
            )}
          >
            {direction === 'up' && <ArrowUpRight className="w-3 h-3" />}
            {direction === 'down' && <ArrowDownRight className="w-3 h-3" />}
            {direction === 'flat' && <Minus className="w-3 h-3" />}
            {Math.abs(pct).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl xl:text-3xl font-heading font-black text-foreground tracking-tight mt-1">
          {value}
        </p>
        {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
      </div>
    </div>
  );
}
