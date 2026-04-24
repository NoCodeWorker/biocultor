const PACKLINK_BASE = 'https://api.packlink.com/v1';

export type TrackingEvent = {
  timestamp: string;
  status: string;
  description: string;
  location?: string | null;
};

export type ShipmentSnapshot = {
  reference: string | null;
  carrier: string | null;
  serviceName: string | null;
  status: TrackingStatus;
  rawStatus: string | null;
  trackUrl: string | null;
  estimatedDelivery: string | null;
  events: TrackingEvent[];
};

export type TrackingStatus =
  | 'CREATED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'INCIDENT'
  | 'UNKNOWN';

export function normalizeStatus(raw: string | null | undefined): TrackingStatus {
  if (!raw) return 'UNKNOWN';
  const s = raw.toLowerCase();
  if (s.includes('deliver') && !s.includes('out_for')) return 'DELIVERED';
  if (s.includes('out_for') || s.includes('reparto')) return 'OUT_FOR_DELIVERY';
  if (s.includes('incident') || s.includes('fail') || s.includes('return')) return 'INCIDENT';
  if (s.includes('transit') || s.includes('pickup') || s.includes('picked') || s.includes('sorted'))
    return 'IN_TRANSIT';
  if (s.includes('create') || s.includes('pending') || s.includes('ready')) return 'CREATED';
  return 'UNKNOWN';
}

export async function fetchShipmentSnapshot(reference: string): Promise<ShipmentSnapshot | null> {
  const key = process.env.PACKLINK_API_KEY;
  if (!key || !reference) return null;

  const headers = { Authorization: key, 'Content-Type': 'application/json' } as const;

  try {
    const [detailsRes, trackingRes] = await Promise.all([
      fetch(`${PACKLINK_BASE}/shipments/${reference}`, { headers, cache: 'no-store' }),
      fetch(`${PACKLINK_BASE}/shipments/${reference}/tracking`, { headers, cache: 'no-store' }),
    ]);

    const details = detailsRes.ok ? await detailsRes.json() : null;
    const tracking = trackingRes.ok ? await trackingRes.json() : null;

    const rawEvents: any[] = Array.isArray(tracking)
      ? tracking
      : tracking?.events ?? tracking?.tracking ?? [];

    const events: TrackingEvent[] = rawEvents
      .map((e: any) => ({
        timestamp: e.timestamp ?? e.date ?? e.event_date ?? new Date().toISOString(),
        status: String(e.status ?? e.code ?? e.event_code ?? 'UNKNOWN'),
        description: String(e.description ?? e.message ?? e.event ?? e.status ?? ''),
        location: e.location?.city ?? e.location ?? e.place ?? null,
      }))
      .sort((a: TrackingEvent, b: TrackingEvent) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    const latestStatusRaw: string | null =
      events[0]?.status ?? details?.state ?? details?.status ?? null;

    return {
      reference: details?.reference ?? reference,
      carrier: details?.carrier_name ?? details?.service?.carrier_name ?? details?.carrier ?? null,
      serviceName: details?.service?.name ?? details?.service_name ?? null,
      status: normalizeStatus(latestStatusRaw),
      rawStatus: latestStatusRaw,
      trackUrl: details?.track_url ?? details?.tracking_url ?? null,
      estimatedDelivery: details?.estimated_delivery_date ?? details?.estimated_delivery ?? null,
      events,
    };
  } catch (err) {
    console.error('Packlink fetch error:', err);
    return null;
  }
}

export type GeoPoint = { lat: number; lng: number; label: string };

// Aproximación de origen (Sevilla) — coords fijas del polígono
export const ORIGIN_POINT: GeoPoint = {
  lat: 37.3886,
  lng: -5.9823,
  label: 'Biocultor · Sevilla',
};

// Geocode ES postal code con API pública de Zippopotam (sin key).
// Es suficiente para aproximar la ciudad en el mapa.
export async function geocodeSpanishPostalCode(zip: string): Promise<GeoPoint | null> {
  if (!zip || !/^\d{5}$/.test(zip)) return null;
  try {
    const res = await fetch(`https://api.zippopotam.us/es/${zip}`, {
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const place = data?.places?.[0];
    if (!place) return null;
    return {
      lat: Number(place.latitude),
      lng: Number(place.longitude),
      label: `${place['place name']} · ${zip}`,
    };
  } catch {
    return null;
  }
}
