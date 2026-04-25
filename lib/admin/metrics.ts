import 'server-only';
import prisma from '@/lib/db';
import { startOfDay, subDays, eachDayOfInterval, format } from 'date-fns';

const PAID_STATUSES = ['PAID', 'SHIPPED', 'DELIVERED'];

// -----------------------------------------------------------------------------
// Helpers de período
// -----------------------------------------------------------------------------

function periodRange(days: number) {
  const end = new Date();
  const start = subDays(startOfDay(end), days - 1);
  const previousEnd = subDays(start, 1);
  const previousStart = subDays(previousEnd, days - 1);
  return { start, end, previousStart, previousEnd };
}

function pctChange(now: number, prev: number): number | null {
  if (prev === 0) return now === 0 ? 0 : null;
  return ((now - prev) / prev) * 100;
}

// -----------------------------------------------------------------------------
// KPIs principales (period vs período anterior)
// -----------------------------------------------------------------------------

export type DashboardKpis = {
  revenue: { value: number; previous: number; pct: number | null };
  orders: { value: number; previous: number; pct: number | null };
  aov: { value: number; previous: number; pct: number | null };
  newCustomers: { value: number; previous: number; pct: number | null };
  refundRate: { value: number; previous: number; pct: number | null };
  lowStockCount: number;
};

export async function getDashboardKpis(days = 30): Promise<DashboardKpis> {
  const { start, end, previousStart, previousEnd } = periodRange(days);

  const [currOrders, prevOrders, newCustomersCurr, newCustomersPrev, lowStock] =
    await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: start, lte: end } },
        select: { totalAmount: true, status: true, refundedAmount: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: previousStart, lte: previousEnd } },
        select: { totalAmount: true, status: true, refundedAmount: true },
      }),
      prisma.customer.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.customer.count({
        where: { createdAt: { gte: previousStart, lte: previousEnd } },
      }),
      prisma.variant.count({ where: { stock: { lt: 10 } } }),
    ]);

  const paidCurr = currOrders.filter((o) => PAID_STATUSES.includes(o.status));
  const paidPrev = prevOrders.filter((o) => PAID_STATUSES.includes(o.status));

  const revenueCurr = paidCurr.reduce(
    (acc, o) => acc + o.totalAmount - (o.refundedAmount ?? 0),
    0
  );
  const revenuePrev = paidPrev.reduce(
    (acc, o) => acc + o.totalAmount - (o.refundedAmount ?? 0),
    0
  );

  const ordersCurr = paidCurr.length;
  const ordersPrev = paidPrev.length;

  const aovCurr = ordersCurr > 0 ? revenueCurr / ordersCurr : 0;
  const aovPrev = ordersPrev > 0 ? revenuePrev / ordersPrev : 0;

  const refundedCurr = currOrders.filter((o) => (o.refundedAmount ?? 0) > 0).length;
  const refundedPrev = prevOrders.filter((o) => (o.refundedAmount ?? 0) > 0).length;
  const refundRateCurr = currOrders.length ? (refundedCurr / currOrders.length) * 100 : 0;
  const refundRatePrev = prevOrders.length ? (refundedPrev / prevOrders.length) * 100 : 0;

  return {
    revenue: { value: revenueCurr, previous: revenuePrev, pct: pctChange(revenueCurr, revenuePrev) },
    orders: { value: ordersCurr, previous: ordersPrev, pct: pctChange(ordersCurr, ordersPrev) },
    aov: { value: aovCurr, previous: aovPrev, pct: pctChange(aovCurr, aovPrev) },
    newCustomers: {
      value: newCustomersCurr,
      previous: newCustomersPrev,
      pct: pctChange(newCustomersCurr, newCustomersPrev),
    },
    refundRate: {
      value: refundRateCurr,
      previous: refundRatePrev,
      pct: pctChange(refundRateCurr, refundRatePrev),
    },
    lowStockCount: lowStock,
  };
}

// -----------------------------------------------------------------------------
// Serie diaria de ingresos (chart principal)
// -----------------------------------------------------------------------------

export type RevenuePoint = {
  date: string; // ISO yyyy-MM-dd
  revenue: number;
  orders: number;
  previousRevenue: number;
};

export async function getRevenueSeries(days = 30): Promise<RevenuePoint[]> {
  const { start, end, previousStart, previousEnd } = periodRange(days);

  const [curr, prev] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end }, status: { in: PAID_STATUSES } },
      select: { createdAt: true, totalAmount: true, refundedAmount: true },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: previousStart, lte: previousEnd },
        status: { in: PAID_STATUSES },
      },
      select: { createdAt: true, totalAmount: true, refundedAmount: true },
    }),
  ]);

  const buckets = new Map<string, { revenue: number; orders: number }>();
  const prevBuckets = new Map<string, number>();

  // Inicializar con todos los días para que la curva no salte
  eachDayOfInterval({ start, end }).forEach((d) => {
    const key = format(d, 'yyyy-MM-dd');
    buckets.set(key, { revenue: 0, orders: 0 });
    prevBuckets.set(key, 0);
  });

  curr.forEach((o) => {
    const key = format(o.createdAt, 'yyyy-MM-dd');
    const cell = buckets.get(key);
    if (cell) {
      cell.revenue += o.totalAmount - (o.refundedAmount ?? 0);
      cell.orders += 1;
    }
  });

  // Mapear fechas del período previo a las del actual (mismo offset)
  prev.forEach((o) => {
    const offset = Math.floor(
      (o.createdAt.getTime() - previousStart.getTime()) / (24 * 60 * 60 * 1000)
    );
    const mappedDate = new Date(start.getTime() + offset * 24 * 60 * 60 * 1000);
    const key = format(mappedDate, 'yyyy-MM-dd');
    const prevCell = prevBuckets.get(key) ?? 0;
    prevBuckets.set(key, prevCell + o.totalAmount - (o.refundedAmount ?? 0));
  });

  return Array.from(buckets.entries()).map(([date, cell]) => ({
    date,
    revenue: cell.revenue,
    orders: cell.orders,
    previousRevenue: prevBuckets.get(date) ?? 0,
  }));
}

// -----------------------------------------------------------------------------
// Top variantes por revenue
// -----------------------------------------------------------------------------

export type TopVariant = {
  variantId: string;
  sku: string;
  size: string;
  productName: string;
  qty: number;
  revenue: number;
};

export async function getTopVariants(days = 30, limit = 8): Promise<TopVariant[]> {
  const { start, end } = periodRange(days);
  const items = await prisma.orderItem.findMany({
    where: {
      order: { createdAt: { gte: start, lte: end }, status: { in: PAID_STATUSES } },
    },
    include: { variant: { include: { product: true } } },
  });

  const map = new Map<string, TopVariant>();
  items.forEach((it) => {
    const key = it.variantId;
    const prev = map.get(key);
    if (prev) {
      prev.qty += it.quantity;
      prev.revenue += it.priceAt * it.quantity;
    } else {
      map.set(key, {
        variantId: it.variantId,
        sku: it.variant.sku,
        size: it.variant.size,
        productName: it.variant.product.name,
        qty: it.quantity,
        revenue: it.priceAt * it.quantity,
      });
    }
  });

  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

// -----------------------------------------------------------------------------
// Últimos N pedidos
// -----------------------------------------------------------------------------

export async function getLatestOrders(limit = 10) {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { customer: true, items: { include: { variant: true } } },
  });
}

// -----------------------------------------------------------------------------
// Stock crítico (variantes <10 ud)
// -----------------------------------------------------------------------------

export async function getStockAlerts(threshold = 10) {
  return prisma.variant.findMany({
    where: { stock: { lt: threshold } },
    orderBy: { stock: 'asc' },
    include: { product: true },
  });
}

// -----------------------------------------------------------------------------
// Distribución por código postal (provincia ES por los 2 primeros dígitos)
// -----------------------------------------------------------------------------

const PROVINCIAS_ES: Record<string, string> = {
  '01': 'Álava', '02': 'Albacete', '03': 'Alicante', '04': 'Almería',
  '05': 'Ávila', '06': 'Badajoz', '07': 'Baleares', '08': 'Barcelona',
  '09': 'Burgos', '10': 'Cáceres', '11': 'Cádiz', '12': 'Castellón',
  '13': 'Ciudad Real', '14': 'Córdoba', '15': 'A Coruña', '16': 'Cuenca',
  '17': 'Girona', '18': 'Granada', '19': 'Guadalajara', '20': 'Gipuzkoa',
  '21': 'Huelva', '22': 'Huesca', '23': 'Jaén', '24': 'León',
  '25': 'Lleida', '26': 'La Rioja', '27': 'Lugo', '28': 'Madrid',
  '29': 'Málaga', '30': 'Murcia', '31': 'Navarra', '32': 'Ourense',
  '33': 'Asturias', '34': 'Palencia', '35': 'Las Palmas', '36': 'Pontevedra',
  '37': 'Salamanca', '38': 'S.C. Tenerife', '39': 'Cantabria', '40': 'Segovia',
  '41': 'Sevilla', '42': 'Soria', '43': 'Tarragona', '44': 'Teruel',
  '45': 'Toledo', '46': 'Valencia', '47': 'Valladolid', '48': 'Bizkaia',
  '49': 'Zamora', '50': 'Zaragoza', '51': 'Ceuta', '52': 'Melilla',
};

export type GeoBucket = { province: string; orders: number; revenue: number };

export async function getGeoDistribution(days = 90, limit = 10): Promise<GeoBucket[]> {
  const { start, end } = periodRange(days);
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: start, lte: end },
      status: { in: PAID_STATUSES },
      shippingPostalCode: { not: null },
    },
    select: { shippingPostalCode: true, totalAmount: true, refundedAmount: true },
  });

  const map = new Map<string, GeoBucket>();
  orders.forEach((o) => {
    const cp = (o.shippingPostalCode ?? '').slice(0, 2);
    if (!cp) return;
    const province = PROVINCIAS_ES[cp] ?? `CP ${cp}`;
    const prev = map.get(province);
    const revenue = o.totalAmount - (o.refundedAmount ?? 0);
    if (prev) {
      prev.orders += 1;
      prev.revenue += revenue;
    } else {
      map.set(province, { province, orders: 1, revenue });
    }
  });

  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}
