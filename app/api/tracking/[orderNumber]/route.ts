import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchShipmentSnapshot, normalizeStatus } from '@/lib/packlink';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email')?.toLowerCase().trim();

  if (!token && !email) {
    return NextResponse.json({ error: 'Falta token o email' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { customer: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
  }

  const authorized =
    (token && order.trackingToken && token === order.trackingToken) ||
    (email && order.customer.email.toLowerCase() === email);

  if (!authorized) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 403 });
  }

  if (!order.packlinkReference) {
    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: normalizeStatus(order.status),
      shipment: null,
      message: 'Pedido registrado. Todavía no tenemos etiqueta de envío.',
    });
  }

  const snapshot = await fetchShipmentSnapshot(order.packlinkReference);

  if (snapshot && snapshot.rawStatus && snapshot.rawStatus !== order.lastStatus) {
    await prisma.order
      .update({
        where: { id: order.id },
        data: { lastStatus: snapshot.rawStatus, lastStatusAt: new Date() },
      })
      .catch(() => {});
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: snapshot?.status ?? normalizeStatus(order.lastStatus),
    shipment: snapshot,
  });
}
