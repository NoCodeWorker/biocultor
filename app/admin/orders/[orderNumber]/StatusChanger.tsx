'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatus } from '../actions';
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUSES = [
  { value: 'PENDING', label: 'Pendiente', tone: 'amber' },
  { value: 'PAID', label: 'Pagado', tone: 'emerald' },
  { value: 'SHIPPED', label: 'Enviado', tone: 'blue' },
  { value: 'DELIVERED', label: 'Entregado', tone: 'primary' },
  { value: 'CANCELLED', label: 'Cancelado', tone: 'red' },
  { value: 'REFUNDED', label: 'Reembolsado', tone: 'red' },
] as const;

const TONE_CLASS: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-800 ring-amber-300',
  emerald: 'bg-emerald-100 text-emerald-800 ring-emerald-300',
  blue: 'bg-blue-100 text-blue-800 ring-blue-300',
  primary: 'bg-primary/15 text-primary ring-primary/40',
  red: 'bg-red-100 text-red-800 ring-red-300',
};

export default function StatusChanger({
  orderNumber,
  currentStatus,
}: {
  orderNumber: string;
  currentStatus: string;
}) {
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const dirty = selected !== currentStatus;

  const handleSave = () => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateOrderStatus(orderNumber, selected);
      if (!result.success) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const isActive = selected === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setSelected(s.value)}
              className={cn(
                'inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ring-1',
                isActive
                  ? `${TONE_CLASS[s.tone]} ring-2 shadow-sm`
                  : 'bg-muted/40 text-muted-foreground ring-border/40 hover:bg-muted/70'
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || pending}
          className="inline-flex items-center gap-2 bg-foreground text-background font-bold px-5 py-2.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-30"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar estado
        </button>
        {error && (
          <span className="text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </span>
        )}
        {success && (
          <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Estado actualizado
          </span>
        )}
      </div>
    </div>
  );
}
