import type { Prisma } from '@/generated/prisma';

// Helpers compartidos entre la página server (que aplica el `where` a Prisma)
// y los componentes cliente de filtros/paginación (que solo usan
// `ALLOWED_PER_PAGE` y los tipos). NO marcar este fichero como `server-only`:
// rompería la importación desde Client Components.

export type OrdersSearchParams = {
  q?: string;          // texto libre: orderNumber, email, nombre
  status?: string;     // CSV: "PAID,SHIPPED"
  from?: string;       // YYYY-MM-DD
  to?: string;         // YYYY-MM-DD
  shipping?: string;   // "with" | "without"
  minTotal?: string;   // €
  maxTotal?: string;   // €
  page?: string;       // 1-indexed
  perPage?: string;    // default 25
};

export const ALLOWED_PER_PAGE = [25, 50, 100];

export function buildOrdersWhere(params: OrdersSearchParams): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};

  if (params.q && params.q.trim()) {
    const q = params.q.trim();
    where.OR = [
      { orderNumber: { contains: q, mode: 'insensitive' } },
      { customer: { email: { contains: q, mode: 'insensitive' } } },
      { customer: { name: { contains: q, mode: 'insensitive' } } },
    ];
  }

  if (params.status) {
    const list = params.status.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
    if (list.length > 0) where.status = { in: list };
  }

  if (params.from || params.to) {
    where.createdAt = {};
    if (params.from) where.createdAt.gte = new Date(params.from + 'T00:00:00.000Z');
    if (params.to) where.createdAt.lte = new Date(params.to + 'T23:59:59.999Z');
  }

  if (params.shipping === 'with') {
    where.packlinkReference = { not: null };
  } else if (params.shipping === 'without') {
    where.packlinkReference = null;
  }

  if (params.minTotal || params.maxTotal) {
    where.totalAmount = {};
    if (params.minTotal) where.totalAmount.gte = parseFloat(params.minTotal);
    if (params.maxTotal) where.totalAmount.lte = parseFloat(params.maxTotal);
  }

  return where;
}

export function paginationFromParams(params: OrdersSearchParams) {
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const requestedPer = parseInt(params.perPage ?? '25', 10) || 25;
  const perPage = ALLOWED_PER_PAGE.includes(requestedPer) ? requestedPer : 25;
  return { page, perPage, skip: (page - 1) * perPage, take: perPage };
}
