import { cn } from '@/lib/utils';

type Tone = 'amber' | 'emerald' | 'blue' | 'primary' | 'red' | 'gray';

const STYLES: Record<string, { label: string; tone: Tone }> = {
  PENDING: { label: 'Pendiente', tone: 'amber' },
  PAID: { label: 'Pagado', tone: 'emerald' },
  SHIPPED: { label: 'Enviado', tone: 'blue' },
  DELIVERED: { label: 'Entregado', tone: 'primary' },
  CANCELLED: { label: 'Cancelado', tone: 'gray' },
  REFUNDED: { label: 'Reembolsado', tone: 'red' },
};

const TONE_CLASS: Record<Tone, string> = {
  amber: 'bg-amber-100 text-amber-800 ring-amber-300',
  emerald: 'bg-emerald-100 text-emerald-800 ring-emerald-300',
  blue: 'bg-blue-100 text-blue-800 ring-blue-300',
  primary: 'bg-primary/15 text-primary ring-primary/40',
  red: 'bg-red-100 text-red-800 ring-red-300',
  gray: 'bg-muted text-muted-foreground ring-border',
};

export default function StatusBadge({
  status,
  size = 'sm',
}: {
  status: string;
  size?: 'sm' | 'md';
}) {
  const meta = STYLES[status] ?? { label: status, tone: 'gray' as Tone };
  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-md ring-1',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        TONE_CLASS[meta.tone]
      )}
    >
      {meta.label}
    </span>
  );
}
