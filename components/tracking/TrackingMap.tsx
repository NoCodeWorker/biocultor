'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Tooltip,
  AttributionControl,
} from 'react-leaflet';
import L, { LatLngExpression, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoPoint, TrackingStatus } from '@/lib/packlink';

const originIcon = L.divIcon({
  className: 'biocultor-origin-marker',
  html: `
    <div style="position:relative;width:40px;height:40px;">
      <div style="
        position:absolute;inset:0;
        background:#4A6B1C;
        border:3px solid #FFFFFF;
        border-radius:50%;
        box-shadow:0 6px 16px -4px rgba(74,107,28,0.55), 0 0 0 1px rgba(0,0,0,0.05);
        display:flex;align-items:center;justify-content:center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21V12h6v9"/>
        </svg>
      </div>
    </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  tooltipAnchor: [0, -16],
});

const destinationIcon = L.divIcon({
  className: 'biocultor-destination-marker',
  html: `
    <div style="position:relative;width:44px;height:54px;">
      <div style="
        position:absolute;top:0;left:50%;transform:translateX(-50%);
        width:38px;height:38px;
        background:#3B2314;
        border:3px solid #FFFFFF;
        border-radius:50%;
        box-shadow:0 6px 16px -4px rgba(59,35,20,0.55), 0 0 0 1px rgba(0,0,0,0.05);
        display:flex;align-items:center;justify-content:center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div style="
        position:absolute;bottom:2px;left:50%;transform:translateX(-50%);
        width:10px;height:10px;border-radius:50%;
        background:rgba(59,35,20,0.25);filter:blur(2px);
      "></div>
    </div>`,
  iconSize: [44, 54],
  iconAnchor: [22, 46],
  tooltipAnchor: [0, -40],
});

function truckIcon(pulse: boolean) {
  return L.divIcon({
    className: 'biocultor-truck-marker',
    html: `
      <div style="position:relative;width:52px;height:52px;">
        ${
          pulse
            ? `<span style="
                position:absolute;inset:0;border-radius:50%;
                background:#4A6B1C;opacity:0.22;
                animation:biocultor-pulse 1.8s ease-out infinite;
              "></span>
              <span style="
                position:absolute;inset:6px;border-radius:50%;
                background:#4A6B1C;opacity:0.35;
                animation:biocultor-pulse 1.8s ease-out 0.4s infinite;
              "></span>`
            : ''
        }
        <div style="
          position:absolute;inset:10px;
          background:#FFFFFF;
          border:3px solid #4A6B1C;
          border-radius:50%;
          box-shadow:0 6px 14px -3px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="#4A6B1C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-4l-3-4h-5v8h2"/>
            <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
          </svg>
        </div>
      </div>`,
    iconSize: [52, 52],
    iconAnchor: [26, 26],
    tooltipAnchor: [0, -22],
  });
}

const STATUS_PROGRESS: Record<TrackingStatus, number> = {
  CREATED: 0.05,
  UNKNOWN: 0.0,
  IN_TRANSIT: 0.55,
  OUT_FOR_DELIVERY: 0.9,
  DELIVERED: 1.0,
  INCIDENT: 0.5,
};

function interpolate(a: GeoPoint, b: GeoPoint, t: number): LatLngExpression {
  return [a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t];
}

function FitBounds({ points }: { points: LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 1) return;
    if (points.length === 1) {
      map.setView(points[0], 10, { animate: false });
      return;
    }
    const bounds = new LatLngBounds(points as [number, number][]);
    map.fitBounds(bounds, { padding: [60, 60], animate: false, maxZoom: 9 });
  }, [map, points]);
  return null;
}

export default function TrackingMap({
  origin,
  destination,
  status,
}: {
  origin: GeoPoint;
  destination: GeoPoint | null;
  status: TrackingStatus;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const progress = STATUS_PROGRESS[status] ?? 0;
  const isDelivered = status === 'DELIVERED';
  const hasIncident = status === 'INCIDENT';

  const currentPos: LatLngExpression | null = useMemo(() => {
    if (!destination) return null;
    if (isDelivered) return [destination.lat, destination.lng];
    if (progress <= 0) return [origin.lat, origin.lng];
    return interpolate(origin, destination, progress);
  }, [origin, destination, progress, isDelivered]);

  const boundsPoints: LatLngExpression[] = useMemo(() => {
    const pts: LatLngExpression[] = [[origin.lat, origin.lng]];
    if (destination) pts.push([destination.lat, destination.lng]);
    return pts;
  }, [origin, destination]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[340px] md:h-[420px] bg-cream-warm"
    >
      <style>{`
        @keyframes biocultor-pulse {
          0%   { transform: scale(0.6); opacity: 0.55; }
          70%  { transform: scale(1.6); opacity: 0;    }
          100% { transform: scale(1.6); opacity: 0;    }
        }
        .leaflet-container {
          background: #F4F0E6;
          font-family: inherit;
          outline: none;
        }
        .leaflet-tooltip.biocultor-tip {
          background: #3B2314;
          color: #F4F0E6;
          border: none;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          box-shadow: 0 6px 16px -4px rgba(0,0,0,0.25);
        }
        .leaflet-tooltip.biocultor-tip::before { display: none; }
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.78) !important;
          font-size: 10px !important;
          color: #526040 !important;
        }
        .leaflet-control-attribution a { color: #4A6B1C !important; }
      `}</style>

      <MapContainer
        center={[origin.lat, origin.lng]}
        zoom={6}
        scrollWheelZoom={false}
        zoomControl={true}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={19}
        />
        <AttributionControl position="bottomright" prefix={false} />

        <FitBounds points={boundsPoints} />

        {destination && (
          <Polyline
            positions={[
              [origin.lat, origin.lng],
              [destination.lat, destination.lng],
            ]}
            pathOptions={{
              color: hasIncident ? '#B45309' : '#3B2314',
              weight: 2.5,
              opacity: 0.35,
              dashArray: '4 8',
              lineCap: 'round',
            }}
          />
        )}

        {destination && !isDelivered && currentPos && (
          <Polyline
            positions={[[origin.lat, origin.lng], currentPos]}
            pathOptions={{
              color: hasIncident ? '#B45309' : '#4A6B1C',
              weight: 3.5,
              opacity: 0.85,
              lineCap: 'round',
            }}
          />
        )}

        <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
          <Tooltip direction="top" offset={[0, -8]} className="biocultor-tip">
            {origin.label}
          </Tooltip>
        </Marker>

        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
            <Tooltip direction="top" offset={[0, -8]} className="biocultor-tip">
              {destination.label}
            </Tooltip>
          </Marker>
        )}

        {destination && currentPos && !isDelivered && (
          <Marker
            position={currentPos}
            icon={truckIcon(status === 'IN_TRANSIT' || status === 'OUT_FOR_DELIVERY')}
            zIndexOffset={1000}
          >
            <Tooltip direction="top" offset={[0, -12]} className="biocultor-tip">
              {status === 'OUT_FOR_DELIVERY' ? 'En reparto' : 'En camino'}
            </Tooltip>
          </Marker>
        )}
      </MapContainer>

      {!destination && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-brown-dark/85 via-brand-brown-dark/60 to-transparent px-5 py-4 pointer-events-none">
          <p className="text-[11px] font-bold uppercase tracking-widest text-cream/80">
            Destino pendiente
          </p>
          <p className="text-sm text-cream mt-0.5">
            Estamos procesando la dirección de envío. El destino aparecerá en el mapa en cuanto se
            confirme.
          </p>
        </div>
      )}
    </div>
  );
}
