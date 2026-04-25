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

// -----------------------------------------------------------------------------
// CREACIÓN DE ENVÍO + ETIQUETA (uso desde admin)
// -----------------------------------------------------------------------------

export type CreateShipmentParams = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string; // ISO 2 letras, ej. "ES"
  };
  packageWeightKg: number;
};

export type CreatedShipment = {
  reference: string;
  trackUrl: string | null;
  carrier: string | null;
  serviceName: string | null;
  rawStatus: string | null;
};

/**
 * Crea un envío en Packlink: pide rates, escoge el primer servicio puerta-puerta,
 * y crea el shipment. Devuelve la información necesaria para guardarla en Order.
 *
 * Esta lógica replica la del webhook de Stripe pero exponible como helper para
 * reintentar manualmente desde el admin si el auto-create falló.
 */
export async function createPacklinkShipment(
  params: CreateShipmentParams
): Promise<CreatedShipment | { error: string }> {
  const key = process.env.PACKLINK_API_KEY;
  if (!key) return { error: 'PACKLINK_API_KEY no configurado.' };

  const headers = { 'Content-Type': 'application/json', Authorization: key } as const;
  const totalWeight = Math.max(1, Math.round(params.packageWeightKg));

  try {
    const ratesRes = await fetch(`${PACKLINK_BASE}/services`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: { country: 'ES', zip: '41001' },
        to: { country: params.shippingAddress.country || 'ES', zip: params.shippingAddress.postalCode },
        packages: [{ width: 20, height: 20, length: 20, weight: totalWeight }],
      }),
    });
    if (!ratesRes.ok) {
      return { error: `Packlink rates failed (${ratesRes.status}): ${await ratesRes.text()}` };
    }
    const services = await ratesRes.json();
    const bestService = services.find((s: any) => s.delivery_type === 'door_to_door') || services[0];
    if (!bestService) return { error: 'Sin servicios Packlink disponibles para este destino.' };

    const [first, ...rest] = (params.customerName || 'Cliente').trim().split(/\s+/);
    const surname = rest.join(' ') || 'Biocultor';

    const shipmentRes = await fetch(`${PACKLINK_BASE}/shipments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        service_id: bestService.id,
        content: 'Abono Biocultor',
        packages: [{ weight: totalWeight, width: 20, length: 20, height: 20 }],
        from: {
          name: 'Biocultor',
          surname: 'Logística',
          street1: 'Polígono Industrial',
          zip: '41001',
          city: 'Sevilla',
          country: 'ES',
          phone: '900123456',
          email: 'logistica@biocultor.com',
        },
        to: {
          name: first || 'Cliente',
          surname,
          street1: params.shippingAddress.line1,
          street2: params.shippingAddress.line2 ?? '',
          zip: params.shippingAddress.postalCode,
          city: params.shippingAddress.city,
          country: params.shippingAddress.country || 'ES',
          phone: params.customerPhone || '600000000',
          email: params.customerEmail,
        },
      }),
    });
    if (!shipmentRes.ok) {
      return { error: `Packlink create failed (${shipmentRes.status}): ${await shipmentRes.text()}` };
    }
    const data = await shipmentRes.json();
    return {
      reference: data.reference,
      trackUrl: data.track_url ?? null,
      carrier: bestService.carrier_name ?? bestService.carrier ?? null,
      serviceName: bestService.name ?? null,
      rawStatus: 'CREATED',
    };
  } catch (err: any) {
    return { error: `Packlink exception: ${err?.message ?? 'desconocido'}` };
  }
}

/**
 * Devuelve la URL del PDF de la etiqueta del envío. Algunos carriers la generan
 * de forma asíncrona; si aún no está disponible, devuelve null.
 */
export async function getPacklinkLabelUrl(reference: string): Promise<string | null> {
  const key = process.env.PACKLINK_API_KEY;
  if (!key || !reference) return null;
  const headers = { Authorization: key, 'Content-Type': 'application/json' } as const;

  try {
    const res = await fetch(`${PACKLINK_BASE}/shipments/${reference}/labels`, {
      headers,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Packlink devuelve un array de objetos con `url` o un objeto único.
    if (Array.isArray(data)) {
      return data[0]?.url ?? data[0]?.label_url ?? null;
    }
    return data?.url ?? data?.label_url ?? null;
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// GEOCODING (lo de antes, sin tocar)
// -----------------------------------------------------------------------------

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
