'use client';

import { useState, useTransition } from 'react';
import { refundOrder } from '../actions';
import { Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function RefundSection({
  orderNumber,
  totalAmount,
  stripeSession,
  refundId,
  refundedAmount,
  refundedAt,
}: {
  orderNumber: string;
  totalAmount: number;
  stripeSession: string | null;
  refundId: string | null;
  refundedAmount: number | null;
  refundedAt: string | null;
}) {
  const [mode, setMode] = useState<'idle' | 'confirm'>('idle');
  const [partialAmount, setPartialAmount] = useState<string>('');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ refundId: string } | null>(null);

  if (refundId) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="text-sm font-bold text-amber-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Refund procesado
        </p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">ID Stripe</p>
            <p className="font-mono text-amber-900 text-xs mt-1 break-all">{refundId}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">Importe</p>
            <p className="font-bold text-amber-900 mt-1">€{(refundedAmount ?? 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">Fecha</p>
            <p className="text-amber-900 mt-1">
              {refundedAt
                ? new Date(refundedAt).toLocaleString('es-ES', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })
                : '—'}
            </p>
          </div>
        </div>
        <p className="text-xs text-amber-800/70 mt-3">
          Si necesitas devolver más o ajustar, hazlo desde el dashboard de Stripe directamente.
        </p>
      </div>
    );
  }

  if (!stripeSession) {
    return (
      <p className="text-sm text-muted-foreground">
        Este pedido no tiene sesión de Stripe asociada (probablemente fue creado antes de migrar
        a Stripe Checkout). Solo se puede gestionar manualmente.
      </p>
    );
  }

  const submit = (amount?: number) => {
    setError(null);
    setDone(null);
    startTransition(async () => {
      const result = await refundOrder(orderNumber, amount);
      if (!result.success) {
        setError(result.error);
      } else if (result.data) {
        setDone(result.data);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {done && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Refund creado: <code className="font-mono">{done.refundId}</code>. Recarga para ver el detalle.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed">
        Esto crea un refund directamente en Stripe sobre el payment intent del pedido. Por defecto
        es la cantidad total ({`€${totalAmount.toFixed(2)}`}). Puedes hacer un reembolso parcial si lo prefieres.
      </p>

      {mode === 'idle' && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setMode('confirm')}
            className="inline-flex items-center gap-2 bg-foreground text-background font-bold px-5 py-2.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reembolsar
          </button>
        </div>
      )}

      {mode === 'confirm' && (
        <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-5 flex flex-col gap-4">
          <p className="text-sm font-bold text-amber-900">¿Total o parcial?</p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => submit()}
              disabled={pending}
              className="inline-flex items-center gap-2 bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-amber-800 transition-colors disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Total (€{totalAmount.toFixed(2)})
            </button>

            <span className="text-xs font-bold text-amber-900/70">o</span>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-900">€</span>
              <input
                type="number"
                step="0.01"
                min="0"
                max={totalAmount}
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                placeholder="Parcial"
                className="w-28 px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const n = parseFloat(partialAmount);
                  if (!isFinite(n) || n <= 0) {
                    setError('Importe parcial inválido.');
                    return;
                  }
                  if (n > totalAmount) {
                    setError(`No puede ser mayor que el total (${totalAmount.toFixed(2)}).`);
                    return;
                  }
                  submit(n);
                }}
                disabled={pending || !partialAmount}
                className="inline-flex items-center gap-2 bg-amber-700 text-white font-bold px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-30"
              >
                {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Parcial
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMode('idle');
                setPartialAmount('');
                setError(null);
              }}
              disabled={pending}
              className="text-xs font-semibold text-amber-900/70 hover:text-amber-900 ml-auto"
            >
              Cancelar
            </button>
          </div>

          <p className="text-xs text-amber-900/70 leading-relaxed">
            Esta acción es irreversible. El cliente recibirá el reembolso en su método de pago en
            5-10 días laborables (depende del banco).
          </p>
        </div>
      )}
    </div>
  );
}
