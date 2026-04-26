'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getPaymentIntentFromSession, refundPaymentIntent } from '@/lib/stripe-admin';
import { createPacklinkShipment, getPacklinkLabelUrl } from '@/lib/packlink';
import { logAdminAction } from '@/lib/admin/audit';

export type ActionResult<T = unknown> =
  | { success: true; data?: T; error?: undefined }
  | { success: false; error: string; data?: undefined };

const ALLOWED_STATUS = new Set([
  'PENDING',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
]);

function revalidateOrder(orderNumber?: string) {
  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  if (orderNumber) revalidatePath(`/admin/orders/${orderNumber}`);
}

// -----------------------------------------------------------------------------
// 1. Cambiar estado manualmente
// -----------------------------------------------------------------------------

export async function bulkUpdateOrderStatus(
  orderNumbers: string[],
  newStatus: string
): Promise<ActionResult<{ updated: number }>> {
  const status = newStatus.toUpperCase().trim();
  if (!ALLOWED_STATUS.has(status)) {
    return { success: false, error: `Estado no permitido: ${status}` };
  }
  if (orderNumbers.length === 0) {
    return { success: false, error: 'Sin pedidos seleccionados.' };
  }

  const result = await prisma.order.updateMany({
    where: { orderNumber: { in: orderNumbers } },
    data: { status, lastStatusAt: new Date() },
  });

  await logAdminAction('bulkUpdateOrderStatus', { orderNumbers, status, updated: result.count });

  revalidateOrder();
  return { success: true, data: { updated: result.count } };
}

export async function updateOrderStatus(
  orderNumber: string,
  newStatus: string
): Promise<ActionResult> {
  const status = newStatus.toUpperCase().trim();
  if (!ALLOWED_STATUS.has(status)) {
    return { success: false, error: `Estado no permitido: ${status}` };
  }

  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) return { success: false, error: 'Pedido no encontrado.' };

  await prisma.order.update({
    where: { orderNumber },
    data: { status, lastStatusAt: new Date() },
  });

  await logAdminAction('updateOrderStatus', { orderNumber, status });

  revalidateOrder(orderNumber);
  return { success: true };
}

// -----------------------------------------------------------------------------
// 2. Refund Stripe (total o parcial)
// -----------------------------------------------------------------------------

export async function refundOrder(
  orderNumber: string,
  amountEuros?: number
): Promise<ActionResult<{ refundId: string }>> {
  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) return { success: false, error: 'Pedido no encontrado.' };
  if (!order.stripeSession) {
    return { success: false, error: 'Este pedido no tiene sesión de Stripe asociada.' };
  }
  if (order.refundId) {
    return { success: false, error: `Ya tiene un refund asociado (${order.refundId}). Si necesitas otro, hazlo desde el dashboard de Stripe.` };
  }

  let paymentIntentId: string | null;
  try {
    paymentIntentId = await getPaymentIntentFromSession(order.stripeSession);
  } catch (err: any) {
    return { success: false, error: `Stripe: ${err?.message ?? 'error obteniendo payment intent'}` };
  }
  if (!paymentIntentId) {
    return { success: false, error: 'No se pudo recuperar el payment intent de la sesión.' };
  }

  const totalCents = Math.round(order.totalAmount * 100);
  const customCents =
    amountEuros !== undefined && amountEuros > 0
      ? Math.min(totalCents, Math.round(amountEuros * 100))
      : undefined;

  try {
    const refund = await refundPaymentIntent(paymentIntentId, customCents);
    const refundedAmount = (refund.amount ?? customCents ?? totalCents) / 100;
    const isFull = refundedAmount >= order.totalAmount;

    await prisma.order.update({
      where: { orderNumber },
      data: {
        refundId: refund.id,
        refundedAmount,
        refundedAt: new Date(),
        ...(isFull ? { status: 'REFUNDED' } : {}),
      },
    });

    await logAdminAction('refundOrder', {
      orderNumber,
      refundId: refund.id,
      refundedAmount,
      isFull,
      paymentIntentId,
    });

    revalidateOrder(orderNumber);
    return { success: true, data: { refundId: refund.id } };
  } catch (err: any) {
    return { success: false, error: `Stripe refund falló: ${err?.message ?? 'error desconocido'}` };
  }
}

// -----------------------------------------------------------------------------
// 3. Crear envío en Packlink (manual / reintento)
// -----------------------------------------------------------------------------

export async function createShipmentForOrder(
  orderNumber: string
): Promise<ActionResult<{ reference: string }>> {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      customer: true,
      items: { include: { variant: true } },
    },
  });
  if (!order) return { success: false, error: 'Pedido no encontrado.' };
  if (order.packlinkReference) {
    return { success: false, error: `Este pedido ya tiene envío Packlink: ${order.packlinkReference}` };
  }

  // Parsear shippingAddress (string almacenado como "calle, ciudad, postal, país")
  const parts = order.shippingAddress.split(',').map((p) => p.trim());
  // Heurística de parsing: si no encaja, el admin puede editar luego.
  const line1 = parts[0] || 'Sin dirección';
  const city = parts[parts.length - 3] || '';
  const postalFromAddr = order.shippingPostalCode || parts[parts.length - 2] || '';
  const country = parts[parts.length - 1] || 'ES';

  if (!postalFromAddr) {
    return { success: false, error: 'Falta el código postal del envío.' };
  }

  // Peso aproximado a partir de las variantes (1 kg/litro para los formatos)
  const weightKg = order.items.reduce((acc, it) => {
    const litros = parseInt(it.variant.size.match(/\d+/)?.[0] ?? '1', 10);
    return acc + litros * it.quantity;
  }, 0);

  const result = await createPacklinkShipment({
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    customerPhone: order.customer.phone || '600000000',
    shippingAddress: { line1, city, postalCode: postalFromAddr, country },
    packageWeightKg: Math.max(1, weightKg),
  });

  if ('error' in result) return { success: false, error: result.error };

  await prisma.order.update({
    where: { orderNumber },
    data: {
      packlinkReference: result.reference,
      trackUrl: result.trackUrl,
      carrier: result.carrier,
      serviceName: result.serviceName,
      lastStatus: result.rawStatus,
      lastStatusAt: new Date(),
    },
  });

  await logAdminAction('createShipmentForOrder', {
    orderNumber,
    reference: result.reference,
    carrier: result.carrier,
    serviceName: result.serviceName,
  });

  revalidateOrder(orderNumber);
  return { success: true, data: { reference: result.reference } };
}

// -----------------------------------------------------------------------------
// 4. URL de etiqueta
// -----------------------------------------------------------------------------

export async function fetchLabelUrl(orderNumber: string): Promise<ActionResult<{ url: string }>> {
  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) return { success: false, error: 'Pedido no encontrado.' };
  if (!order.packlinkReference) {
    return { success: false, error: 'Este pedido no tiene envío Packlink. Créalo antes.' };
  }

  const url = await getPacklinkLabelUrl(order.packlinkReference);
  if (!url) {
    return {
      success: false,
      error: 'La etiqueta aún no está disponible (Packlink puede tardar unos minutos tras crear el envío).',
    };
  }
  return { success: true, data: { url } };
}
