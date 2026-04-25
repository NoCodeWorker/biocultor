import prisma from '@/lib/db';
import Link from 'next/link';
import { Boxes, AlertTriangle, PackageX, CheckCircle2, Package } from 'lucide-react';
import InventoryClient from './InventoryClient';

export const dynamic = 'force-dynamic';

const LOW = 10;
const CRITICAL = 3;

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; product?: string }>;
}) {
  const { filter, product: productFilter } = await searchParams;

  // Cargar todas las variantes con su producto
  const variants = await prisma.variant.findMany({
    orderBy: [{ product: { name: 'asc' } }, { price: 'asc' }],
    include: { product: true },
    where: productFilter ? { productId: productFilter } : undefined,
  });

  // Filtrado por estado de stock
  const filtered = (() => {
    if (filter === 'out') return variants.filter((v) => v.stock === 0);
    if (filter === 'critical') return variants.filter((v) => v.stock > 0 && v.stock <= CRITICAL);
    if (filter === 'low') return variants.filter((v) => v.stock > 0 && v.stock <= LOW);
    return variants;
  })();

  // KPIs
  const outOfStock = variants.filter((v) => v.stock === 0).length;
  const critical = variants.filter((v) => v.stock > 0 && v.stock <= CRITICAL).length;
  const low = variants.filter((v) => v.stock > LOW && v.stock <= LOW * 2).length;
  const healthy = variants.filter((v) => v.stock > LOW).length;
  const totalStock = variants.reduce((acc, v) => acc + v.stock, 0);

  // Lista de productos para el filtro lateral
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  const FILTERS = [
    { value: undefined, label: 'Todos', icon: Package, count: variants.length },
    { value: 'out', label: 'Agotados', icon: PackageX, count: outOfStock },
    { value: 'critical', label: 'Críticos (≤3)', icon: AlertTriangle, count: critical },
    { value: 'low', label: 'Bajos (≤10)', icon: AlertTriangle, count: low },
    { value: 'healthy', label: 'OK (>10)', icon: CheckCircle2, count: healthy },
  ];

  // Shape para el componente cliente
  const rows = filtered.map((v) => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    price: v.price,
    stock: v.stock,
    popular: v.popular,
    productId: v.productId,
    productName: v.product.name,
    productSlug: v.product.slug,
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">Catálogo</p>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mt-1 flex items-center gap-3">
            <Boxes className="w-8 h-8 text-primary" />
            Inventario
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
            Edición rápida de stock por variante. Los cambios se aplican en la tienda al instante.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          → Catálogo completo
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StockKpi label="Stock total" value={`${totalStock} ud`} color="neutral" />
        <StockKpi label="Agotados" value={outOfStock} color={outOfStock > 0 ? 'red' : 'neutral'} />
        <StockKpi label="Críticos ≤3" value={critical} color={critical > 0 ? 'red' : 'neutral'} />
        <StockKpi label="Bajos ≤10" value={low} color={low > 0 ? 'amber' : 'neutral'} />
        <StockKpi label="Saludables" value={healthy} color="green" />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const href = f.value
            ? `?filter=${f.value}${productFilter ? `&product=${productFilter}` : ''}`
            : productFilter
            ? `?product=${productFilter}`
            : '/admin/inventory';
          const active = (filter ?? undefined) === f.value;
          return (
            <Link
              key={f.label}
              href={href}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
                active
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card border-border/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-white/20' : 'bg-muted text-muted-foreground'
                }`}
              >
                {f.count}
              </span>
            </Link>
          );
        })}

        {/* Product filter */}
        {products.length > 1 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">Producto:</span>
            <div className="flex gap-1">
              <Link
                href={filter ? `?filter=${filter}` : '/admin/inventory'}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                  !productFilter
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-card border-border/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                Todos
              </Link>
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`?${filter ? `filter=${filter}&` : ''}product=${p.id}`}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors max-w-[120px] truncate ${
                    productFilter === p.id
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card border-border/60 text-muted-foreground hover:text-foreground'
                  }`}
                  title={p.name}
                >
                  {p.name.split(' ').slice(0, 2).join(' ')}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty */}
      {rows.length === 0 ? (
        <div className="bg-card border border-dashed border-border/60 rounded-2xl p-12 text-center">
          <Boxes className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-heading font-bold text-foreground">
            Sin variantes{filter ? ` en estado "${filter}"` : ''}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Prueba otro filtro o crea variantes desde el catálogo.
          </p>
        </div>
      ) : (
        <InventoryClient variants={rows} />
      )}
    </div>
  );
}

function StockKpi({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: 'red' | 'amber' | 'green' | 'neutral';
}) {
  const styles = {
    red: 'bg-red-50 border-red-200/80 text-red-700',
    amber: 'bg-amber-50 border-amber-200/80 text-amber-700',
    green: 'bg-emerald-50 border-emerald-200/80 text-emerald-700',
    neutral: 'bg-card border-border/60 text-foreground',
  };
  return (
    <div className={`rounded-2xl p-5 border ${styles[color]}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`text-2xl font-heading font-black mt-1`}>{value}</p>
    </div>
  );
}
