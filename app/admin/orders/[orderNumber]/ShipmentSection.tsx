'use client';

import { useState, useTransition } from 'react';
import { createShipmentForOrder, fetchLabelUrl } from '../actions';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Truck,
  ExternalLink,
  Package,
  Download,
  Copy,
  Check,
} from 'lucide-react';

export default function ShipmentSection({
  orderNumber,
  packlinkReference,
  trackUrl,
  carrier,
  serviceName,
}: {
  orderNumber: string;
  packlinkReference: string | null;
  trackUrl: string | null;
  carrier: string | null;
  serviceName: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    setError(null);
    startTransition(async () => {
      const result = await createShipmentForOrder(orderNumber);
      if (!result.success) {
        setError(result.error);
      }
    });
  };

  const handleLabel = () => {
    setError(null);
    startTransition(async () => {
      const result = await fetchLabelUrl(orderNumber);
      if (!result.success) {
        setError(result.error);
      } else if (result.data?.url) {
        window.open(result.data.url, '_blank', 'noopener,noreferrer');
      }
    });
  };

  const copyReference = async () => {
    if (!packlinkReference) return;
    try {
      await navigator.clipboard.writeText(packlinkReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!packlinkReference) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <Package className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-amber-900">Aún sin envío Packlink</p>
            <p className="text-sm text-amber-800/80 mt-1 leading-relaxed">
              Esto puede pasar si el webhook de Stripe falló o si Packlink rechazó el destino. Puedes
              reintentar la creación manualmente.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <pre className="font-mono text-xs whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <button
          type="button"
          onClick={handleCreate}
          disabled={pending}
          className="inline-flex items-center gap-2 bg-foreground text-background font-bold px-5 py-2.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 w-fit"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
          Crear envío en Packlink
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Carrier" value={carrier ?? '—'} />
        <Field label="Servicio" value={serviceName ?? '—'} />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Referencia
          </span>
          <button
            type="button"
            onClick={copyReference}
            className="inline-flex items-center gap-2 font-mono text-sm bg-muted/50 hover:bg-muted rounded-lg px-3 py-2 transition-colors w-fit"
          >
            {packlinkReference}
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        {trackUrl && (
          <a
            href={trackUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold px-4 py-2.5 rounded-xl hover:bg-primary/15 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Tracking carrier
          </a>
        )}
        <button
          type="button"
          onClick={handleLabel}
          disabled={pending}
          className="inline-flex items-center gap-2 bg-foreground text-background font-bold px-4 py-2.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Descargar etiqueta PDF
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
