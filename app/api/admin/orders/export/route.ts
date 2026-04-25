import prisma from '@/lib/db';
import { buildOrdersWhere, type OrdersSearchParams } from '@/app/admin/orders/_query';

export const dynamic = 'force-dynamic';

// CSV "bien hecho" para Excel ES: BOM UTF-8, separador `;`, escape de comillas.
function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s.includes(';') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toRow(values: unknown[]) {
  return values.map(csvEscape).join(';');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const params: OrdersSearchParams = Object.fromEntries(searchParams.entries());
  const where = buildOrdersWhere(params);

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      items: { include: { variant: { include: { product: true } } } },
    },
  });

  const headers = [
    'orderNumber',
    'createdAt',
    'status',
    'totalAmount',
    'refundedAmount',
    'customerName',
    'customerEmail',
    'customerPhone',
    'shippingAddress',
    'shippingPostalCode',
    'carrier',
    'serviceName',
    'packlinkReference',
    'trackUrl',
    'items',
  ];

  const rows = orders.map((o) =>
    toRow([
      o.orderNumber,
      o.createdAt.toISOString(),
      o.status,
      o.totalAmount.toFixed(2),
      o.refundedAmount?.toFixed(2) ?? '',
      o.customer.name,
      o.customer.email,
      o.customer.phone ?? '',
      o.shippingAddress,
      o.shippingPostalCode ?? '',
      o.carrier ?? '',
      o.serviceName ?? '',
      o.packlinkReference ?? '',
      o.trackUrl ?? '',
      o.items
        .map((it) => `${it.quantity}x ${it.variant.product.name} (${it.variant.size})`)
        .join(' | '),
    ])
  );

  const csv = '﻿' + [toRow(headers), ...rows].join('\r\n');
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="biocultor-pedidos-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
