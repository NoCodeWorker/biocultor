'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Home,
} from 'lucide-react';
import type { ShipmentSnapshot, TrackingStatus, GeoPoint } from '@/lib/packlink';

const TrackingMap = dynamic(() => import('@/components/tracking/TrackingMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[340px] md:h-[420px] rounded-2xl bg-brand-brown-light/50 animate-pulse" />
  ),
});

const STATUS_META: Record<
  TrackingStatus,
  { label: string; hint: string; icon: typeof Package; progress: number; tone: 'info' | 'progress' | 'done' | 'warn' }
> = {
  CREATED: {
    label: 'Pedido preparado',
    hint: 'Tu paquete tiene etiqueta y espera la recogida del carrier.',
    icon: Package,
    progress: 20,
    tone: 'info',
  },
  IN_TRANSIT: {
    label: 'En tránsito',
    hint: 'Tu pedido está viajando hacia tu dirección.',
    icon: Truck,
    progress: 60,
    tone: 'progress',
  },
  OUT_FOR_DELIVERY: {
    label: 'En reparto',
    hint: 'El repartidor lleva hoy tu paquete.',
    icon: Truck,
    progress: 85,
    tone: 'progress',
  },
  DELIVERED: {
    label: 'Entregado',
    hint: 'Tu pedido ha llegado. Gracias por confiar en Biocultor.',
    icon: CheckCircle2,
    progress: 100,
    tone: 'done',
  },
  INCIDENT: {
    label: 'Incidencia',
    hint: 'Hay una incidencia registrada. Ya estamos al tanto.',
    icon: AlertTriangle,
    progress: 50,
    tone: 'warn',
  },
  UNKNOWN: {
    label: 'Registrado',
    hint: 'Estamos preparando tu envío. En unas horas tendrás más detalle aquí.',
    icon: Clock,
    progress: 10,
    tone: 'info',
  },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function TrackingView({
  orderNumber,
  customerName,
  createdAt,
  totalAmount,
  shippingAddress,
  status,
  snapshot,
  fallbackCarrier,
  fallbackTrackUrl,
  fallbackService,
  origin,
  destination,
  items,
  token,
}: {
  orderNumber: string;
  customerName: string;
  createdAt: string;
  totalAmount: number;
  shippingAddress: string;
  status: TrackingStatus;
  snapshot: ShipmentSnapshot | null;
  fallbackCarrier: string | null;
  fallbackTrackUrl: string | null;
  fallbackService: string | null;
  origin: GeoPoint;
  destination: GeoPoint | null;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    priceAt: number;
    imagePath: string | null;
  }>;
  token: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [live, setLive] = useState<{ status: TrackingStatus; snapshot: ShipmentSnapshot | null }>({
    status,
    snapshot,
  });

  useEffect(() => {
    if (!token) return;
    const terminal: TrackingStatus[] = ['DELIVERED'];
    if (terminal.includes(live.status)) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/tracking/${orderNumber}?token=${token}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setLive({ status: data.status, snapshot: data.shipment });
      } catch {}
    }, 45_000);
    return () => clearInterval(id);
  }, [token, orderNumber, live.status]);

  const currentStatus = live.status;
  const currentSnapshot = live.snapshot ?? snapshot;
  const meta = STATUS_META[currentStatus];
  const StatusIcon = meta.icon;

  const carrier = currentSnapshot?.carrier ?? fallbackCarrier;
  const serviceName = currentSnapshot?.serviceName ?? fallbackService;
  const carrierTrackUrl = currentSnapshot?.trackUrl ?? fallbackTrackUrl;
  const reference = currentSnapshot?.reference ?? null;
  const eta = currentSnapshot?.estimatedDelivery;

  const onCopy = async () => {
    if (!reference) return;
    await navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toneRing =
    meta.tone === 'done'
      ? 'bg-brand-green text-white'
      : meta.tone === 'warn'
        ? 'bg-amber-500 text-white'
        : meta.tone === 'progress'
          ? 'bg-brand-green text-white'
          : 'bg-brand-brown-light text-brand-brown-dark';

  return (
    <section className="bg-cream-warm border-t border-border/40 min-h-[80vh]">
      <div className="w-[94%] lg:w-[88%] xl:w-[78%] max-w-6xl mx-auto px-4 py-12 md:py-16">

        {/* Breadcrumb intro */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
          <Home className="w-3.5 h-3.5" />
          <span>Inicio</span>
          <span className="opacity-40">/</span>
          <span className="text-brand-brown-dark">Seguimiento</span>
        </div>

        {/* HERO STATUS */}
        <div className="relative bg-card rounded-3xl border border-border/60 overflow-hidden shadow-sm mb-8">
          <div className="p-7 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center shrink-0 shadow-md ${toneRing}`}>
                <StatusIcon className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.6} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-green mb-2">
                  Pedido {orderNumber}
                </p>
                <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-brand-brown-dark leading-[1.05] tracking-tight mb-3">
                  {meta.label}.
                </h1>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  {meta.hint}
                </p>

                {/* Progress bar */}
                <div className="mt-7 max-w-xl">
                  <div className="h-1.5 bg-brand-brown-light/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${
                        meta.tone === 'warn' ? 'bg-amber-500' : 'bg-brand-green'
                      }`}
                      style={{ width: `${meta.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Preparado</span>
                    <span>Tránsito</span>
                    <span>Reparto</span>
                    <span>Entregado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border/60 bg-cream-warm/60 divide-x divide-border/60">
            <MetaCell label="Cliente" value={customerName.split(' ')[0]} />
            <MetaCell label="Fecha pedido" value={formatDate(createdAt)} />
            <MetaCell label="Importe" value={`${totalAmount.toFixed(2)}€`} emphasis />
            <MetaCell label="Entrega estimada" value={eta ? formatDate(eta) : '—'} />
          </div>
        </div>

        {/* MAP + CARRIER */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mb-8">
          <div className="lg:col-span-3 bg-card rounded-3xl border border-border/60 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-green" />
                <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-brand-brown-dark">
                  Ruta del envío
                </h2>
              </div>
              {destination && (
                <span className="text-xs text-muted-foreground font-mono">
                  {origin.label.split(' · ')[1]} → {destination.label.split(' · ')[0]}
                </span>
              )}
            </div>
            <TrackingMap
              origin={origin}
              destination={destination}
              status={currentStatus}
            />
          </div>

          <div className="lg:col-span-2 bg-card rounded-3xl border border-border/60 shadow-sm p-6 md:p-7 flex flex-col">
            <div className="flex items-center gap-2.5 mb-5">
              <Truck className="w-4 h-4 text-brand-green" />
              <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-brand-brown-dark">
                Transportista
              </h2>
            </div>

            <div className="space-y-4 flex-1">
              <Row label="Carrier" value={carrier ?? 'Asignando…'} strong />
              <Row label="Servicio" value={serviceName ?? '—'} />
              <Row
                label="Referencia"
                value={
                  reference ? (
                    <span className="flex items-center gap-2">
                      <code className="font-mono text-xs bg-cream-warm px-2 py-1 rounded border border-border/60">
                        {reference}
                      </code>
                      <button
                        onClick={onCopy}
                        className="p-1.5 rounded-md hover:bg-brand-brown-light/50 transition-colors"
                        aria-label="Copiar referencia"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-brand-green" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </span>
                  ) : (
                    '—'
                  )
                }
              />
              <Row
                label="Destino"
                value={
                  <span className="text-xs text-brand-brown-dark/80 leading-snug text-right inline-block max-w-[200px]">
                    {shippingAddress}
                  </span>
                }
              />
            </div>

            {carrierTrackUrl && (
              <a
                href={carrierTrackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-brand-brown-dark text-cream font-bold text-xs uppercase tracking-widest hover:bg-primary transition-colors"
              >
                Ver en web del carrier
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* TIMELINE + ITEMS */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Timeline */}
          <div className="lg:col-span-3 bg-card rounded-3xl border border-border/60 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <Calendar className="w-4 h-4 text-brand-green" />
              <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-brand-brown-dark">
                Historial de movimientos
              </h2>
            </div>

            {currentSnapshot?.events && currentSnapshot.events.length > 0 ? (
              <ol className="relative border-l-2 border-brand-brown-light/70 ml-2 space-y-6">
                {currentSnapshot.events.map((ev, idx) => (
                  <li key={`${ev.timestamp}-${idx}`} className="pl-6 relative">
                    <span
                      className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 ${
                        idx === 0
                          ? 'bg-brand-green border-brand-green ring-4 ring-brand-green/15'
                          : 'bg-card border-brand-brown-light'
                      }`}
                    />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                      {formatDate(ev.timestamp)}
                      {ev.location && <span className="ml-2 text-brand-brown/50">· {ev.location}</span>}
                    </p>
                    <p className={`text-sm ${idx === 0 ? 'text-brand-brown-dark font-semibold' : 'text-brand-brown/80'}`}>
                      {ev.description || ev.status}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-center py-10 px-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-brown-light/50 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-brand-brown/60" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Aún no hay movimientos registrados por el transportista. El historial se llenará
                  automáticamente en cuanto el paquete empiece a moverse.
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="lg:col-span-2 bg-card rounded-3xl border border-border/60 shadow-sm p-6 md:p-7">
            <div className="flex items-center gap-2.5 mb-5">
              <Package className="w-4 h-4 text-brand-green" />
              <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-brand-brown-dark">
                Contenido del paquete
              </h2>
            </div>
            <ul className="divide-y divide-border/60">
              {items.map((it, idx) => (
                <li key={idx} className="py-3.5 flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-warm border border-border/60 shrink-0 relative">
                    {it.imagePath ? (
                      <Image
                        src={it.imagePath}
                        alt={it.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-brand-brown/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-brown-dark leading-tight truncate">
                      {it.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {it.size} · {it.quantity} ud{it.quantity > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="font-heading font-bold text-sm text-brand-brown-dark shrink-0">
                    {(it.priceAt * it.quantity).toFixed(2)}€
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</span>
              <span className="font-heading font-extrabold text-lg text-brand-green">
                {totalAmount.toFixed(2)}€
              </span>
            </div>
          </div>
        </div>

        {/* Bottom support note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl mx-auto">
            ¿Alguna duda con tu envío? Puedes{' '}
            <a
              href="mailto:soporte@biocultor.com"
              className="text-brand-green font-semibold hover:underline"
            >
              escribirnos a soporte
            </a>{' '}
            y te responde una persona real. Esta página se actualiza automáticamente.
          </p>
        </div>
      </div>
    </section>
  );
}

function MetaCell({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="px-5 py-4 md:px-7 md:py-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p
        className={`text-sm md:text-base font-semibold ${
          emphasis ? 'text-brand-green font-heading font-extrabold text-base md:text-lg' : 'text-brand-brown-dark'
        } truncate`}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 pb-3 border-b border-border/50 last:border-0 last:pb-0">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap pt-0.5">
        {label}
      </span>
      <span
        className={`text-sm text-right ${
          strong ? 'text-brand-brown-dark font-semibold' : 'text-brand-brown/80'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
