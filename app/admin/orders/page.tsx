import prisma from '@/lib/db';
import OrdersFilters from './OrdersFilters';
import OrdersTable from './OrdersTable';
import OrdersPagination from './OrdersPagination';
import { buildOrdersWhere, paginationFromParams, type OrdersSearchParams } from './_query';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<OrdersSearchParams>;
}) {
  const params = await searchParams;
  const where = buildOrdersWhere(params);
  const { page, perPage, skip, take } = paginationFromParams(params);

  const [orders, totalResults] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        customer: true,
        items: { include: { variant: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  // Serializar fechas para el componente cliente
  const rows = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    totalAmount: o.totalAmount,
    refundedAmount: o.refundedAmount,
    createdAt: o.createdAt.toISOString(),
    shippingAddress: o.shippingAddress,
    packlinkReference: o.packlinkReference,
    trackUrl: o.trackUrl,
    carrier: o.carrier,
    trackingToken: o.trackingToken,
    customer: { name: o.customer.name, email: o.customer.email },
    items: o.items.map((it) => ({
      id: it.id,
      quantity: it.quantity,
      variant: { size: it.variant.size },
    })),
  }));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight">
          Pedidos
        </h1>
        <p className="text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          Filtra, busca y opera en lote. Click en el número de pedido para ver el detalle, cambiar
          estado, reembolsar o gestionar el envío.
        </p>
      </div>

      <OrdersFilters totalResults={totalResults} />
      <OrdersTable orders={rows} />
      <OrdersPagination page={page} perPage={perPage} totalResults={totalResults} />
    </div>
  );
}
