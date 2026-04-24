import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/db';
import {
  fetchShipmentSnapshot,
  geocodeSpanishPostalCode,
  ORIGIN_POINT,
  normalizeStatus,
  type ShipmentSnapshot,
} from '@/lib/packlink';
import EmailGate from '@/components/tracking/EmailGate';
import TrackingView from '@/components/tracking/TrackingView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Seguimiento de pedido · Biocultor',
  description: 'Sigue el estado y la ubicación de tu pedido Biocultor en tiempo real.',
  robots: { index: false, follow: false },
};

export default async function TrackingPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { orderNumber } = await params;
  const { token, email } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      customer: true,
      items: {
        include: { variant: { include: { product: true } } },
      },
    },
  });

  if (!order) notFound();

  const providedEmail = email?.toLowerCase().trim();
  const authorized =
    (!!token && !!order.trackingToken && token === order.trackingToken) ||
    (!!providedEmail && order.customer.email.toLowerCase() === providedEmail);

  if (!authorized) {
    return (
      <EmailGate
        orderNumber={orderNumber}
        wrongEmail={Boolean(providedEmail) && !authorized}
      />
    );
  }

  let snapshot: ShipmentSnapshot | null = null;
  if (order.packlinkReference) {
    snapshot = await fetchShipmentSnapshot(order.packlinkReference);
  }

  const destinationZip = order.shippingPostalCode ?? '';
  const destination = destinationZip ? await geocodeSpanishPostalCode(destinationZip) : null;

  const status = snapshot?.status ?? normalizeStatus(order.lastStatus ?? order.status);

  const items = order.items.map((it) => ({
    name: it.variant.product.name,
    size: it.variant.size,
    quantity: it.quantity,
    priceAt: it.priceAt,
    imagePath: it.variant.imagePath ?? null,
  }));

  return (
    <TrackingView
      orderNumber={order.orderNumber}
      customerName={order.customer.name}
      createdAt={order.createdAt.toISOString()}
      totalAmount={order.totalAmount}
      shippingAddress={order.shippingAddress}
      status={status}
      snapshot={snapshot}
      fallbackCarrier={order.carrier}
      fallbackTrackUrl={order.trackUrl}
      fallbackService={order.serviceName}
      origin={ORIGIN_POINT}
      destination={destination}
      items={items}
      token={order.trackingToken ?? null}
    />
  );
}
