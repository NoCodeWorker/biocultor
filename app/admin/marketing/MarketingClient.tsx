'use client';

import { useState, useTransition } from 'react';
import { Mail, Tag, Plus, Check, X, Trash2, Loader2, Percent, Euro } from 'lucide-react';
import { createCoupon, deleteCoupon, type CouponRow } from './actions';

type Props = { coupons: CouponRow[] };

export default function MarketingClient({ coupons: initial }: Props) {
  const [coupons, setCoupons] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<'percent' | 'amount'>('percent');
  const [value, setValue] = useState('');
  const [duration, setDuration] = useState<'once' | 'repeating' | 'forever'>('once');
  const [months, setMonths] = useState('');

  function reset() {
    setName(''); setType('percent'); setValue(''); setDuration('once'); setMonths('');
    setError(null); setSuccess(null); setShowForm(false);
  }

  function handleCreate() {
    const numValue = parseFloat(value);
    if (!name.trim()) return setError('El nombre es obligatorio.');
    if (isNaN(numValue) || numValue <= 0) return setError('Introduce un valor válido.');
    if (type === 'percent' && numValue > 100) return setError('El porcentaje no puede superar 100%.');
    if (duration === 'repeating' && (!months || parseInt(months) < 1))
      return setError('Introduce el número de meses.');

    setError(null);
    startTransition(async () => {
      const result = await createCoupon({
        name: name.trim(),
        type,
        value: numValue,
        duration,
        durationMonths: duration === 'repeating' ? parseInt(months) : undefined,
      });
      if (result.success && result.coupon) {
        setCoupons((prev) => [result.coupon!, ...prev]);
        setSuccess(`Cupón "${result.coupon.name}" creado en Stripe.`);
        reset();
        setShowForm(false);
      } else {
        setError(result.error ?? 'Error desconocido.');
      }
    });
  }

  function handleDelete(id: string, label: string) {
    if (!confirm(`¿Eliminar el cupón "${label}" de Stripe? Esta acción es irreversible.`)) return;
    startTransition(async () => {
      const result = await deleteCoupon(id);
      if (result.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        setError(result.error ?? 'No se pudo eliminar.');
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Feedback */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800 font-semibold">
          <Check className="w-4 h-4 shrink-0" /> {success}
          <button onClick={() => setSuccess(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800 font-semibold">
          <X className="w-4 h-4 shrink-0" /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Create button / form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-2xl shadow-lg shadow-primary/20 hover:bg-brand-green-hover transition-colors w-fit text-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo cupón
        </button>
      ) : (
        <div className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="text-base font-heading font-bold text-foreground">Crear cupón en Stripe</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nombre del cupón</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: VERANO10, LANZAMIENTO20..."
                className="bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>

            {/* Duration */}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Duración</span>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as typeof duration)}
                className="bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="once">Una vez</option>
                <option value="repeating">Repetido (N meses)</option>
                <option value="forever">Para siempre</option>
              </select>
            </label>

            {/* Discount type + value */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Descuento</span>
              <div className="flex gap-2">
                <div className="flex rounded-xl border border-border/60 overflow-hidden shrink-0">
                  <button
                    onClick={() => setType('percent')}
                    className={`px-3 py-2 text-sm font-bold transition-colors flex items-center gap-1 ${type === 'percent' ? 'bg-primary text-primary-foreground' : 'bg-muted/40 text-muted-foreground'}`}
                  >
                    <Percent className="w-3.5 h-3.5" /> %
                  </button>
                  <button
                    onClick={() => setType('amount')}
                    className={`px-3 py-2 text-sm font-bold transition-colors flex items-center gap-1 ${type === 'amount' ? 'bg-primary text-primary-foreground' : 'bg-muted/40 text-muted-foreground'}`}
                  >
                    <Euro className="w-3.5 h-3.5" /> €
                  </button>
                </div>
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder={type === 'percent' ? '10' : '5.00'}
                  className="flex-1 bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Months (only repeating) */}
            {duration === 'repeating' && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Número de meses</span>
                <input
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  type="number"
                  min="1"
                  placeholder="3"
                  className="bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                />
              </label>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={pending}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm hover:bg-brand-green-hover transition-colors disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Crear en Stripe
            </button>
            <button
              onClick={reset}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5 rounded-xl hover:bg-muted/40"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Coupons list */}
      {coupons.length === 0 ? (
        <div className="bg-card border border-dashed border-border/60 rounded-2xl p-12 text-center">
          <Tag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-heading font-bold text-foreground">Sin cupones activos en Stripe</p>
          <p className="text-sm text-muted-foreground mt-1">Crea el primero para hacer descuentos.</p>
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 px-5 py-3 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Cupón</span>
            <span className="text-right w-28">Descuento</span>
            <span className="text-right w-28 hidden sm:block">Duración</span>
            <span className="w-10" />
          </div>
          <ul className="divide-y divide-border/30">
            {coupons.map((c) => (
              <li key={c.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-0 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                <div>
                  <p className="text-sm font-bold text-foreground">{c.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{c.id}</p>
                </div>
                <div className="text-right w-28">
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                    {c.percentOff ? (
                      <><Percent className="w-3 h-3" />{c.percentOff}%</>
                    ) : (
                      <><Euro className="w-3 h-3" />{((c.amountOff ?? 0) / 100).toFixed(2)}</>
                    )}
                  </span>
                </div>
                <div className="text-right w-28 hidden sm:block">
                  <span className="text-xs text-muted-foreground capitalize">
                    {c.duration === 'once' ? 'Una vez' : c.duration === 'forever' ? 'Siempre' : `${c.durationMonths} meses`}
                  </span>
                </div>
                <div className="w-10 flex justify-end">
                  <button
                    onClick={() => handleDelete(c.id, c.name ?? c.id)}
                    disabled={pending}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Eliminar cupón"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Email placeholder */}
      <div className="bg-muted/30 border border-border/40 rounded-2xl p-6 flex items-center justify-between opacity-70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-bold text-sm text-foreground">Campañas de email</h3>
          </div>
          <p className="text-xs text-muted-foreground">Envío de newsletters y campañas vía Resend. Próximamente.</p>
        </div>
        <span className="text-[10px] font-bold bg-muted text-muted-foreground/70 px-2 py-1 rounded">PRÓX</span>
      </div>
    </div>
  );
}
