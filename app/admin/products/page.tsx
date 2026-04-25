import prisma from "@/lib/db";
import Link from "next/link";
import { Plus, Package, Tag, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      variants: { orderBy: { price: 'asc' } },
    },
  }).catch(() => []);

  const totalVariants = products.reduce((acc, p) => acc + p.variants.length, 0);
  const totalStock = products.reduce(
    (acc, p) => acc + p.variants.reduce((sum, v) => sum + v.stock, 0),
    0
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight">
            Catálogo
          </h1>
          <p className="text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Gestión de productos y variantes. Cualquier cambio aquí se aplica al frontend en directo
            tras revalidar la cache de Next.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-2xl shadow-lg shadow-primary/20 hover:bg-brand-green-hover transition-colors"
        >
          <Plus className="w-5 h-5" /> Nuevo producto
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <KpiCard label="Productos" value={products.length} icon={Package} />
        <KpiCard label="Variantes totales" value={totalVariants} icon={Tag} />
        <KpiCard label="Stock acumulado" value={totalStock} icon={Package} suffix="ud" />
      </div>

      {products.length === 0 ? (
        <div className="bg-card border border-dashed border-border/60 rounded-3xl p-16 text-center flex flex-col items-center gap-4">
          <Package className="w-16 h-16 text-muted-foreground/40" />
          <h2 className="text-2xl font-heading font-bold">Sin productos en catálogo</h2>
          <p className="text-muted-foreground max-w-md">
            Crea el primer producto desde cero o ejecuta un seed para inyectar los productos base.
          </p>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            <Link
              href="/admin/products/new"
              className="bg-primary text-primary-foreground font-bold px-5 py-3 rounded-xl"
            >
              Nuevo producto
            </Link>
            <a
              href="/api/seed"
              className="bg-foreground text-background font-bold px-5 py-3 rounded-xl"
            >
              Seed té de humus
            </a>
            <a
              href="/api/seed/ortiga"
              className="bg-foreground text-background font-bold px-5 py-3 rounded-xl"
            >
              Seed purín de ortiga
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((p) => {
            const prices = p.variants.map((v) => v.price);
            const lowest = prices.length ? Math.min(...prices) : null;
            const highest = prices.length ? Math.max(...prices) : null;
            const totalStockProduct = p.variants.reduce((s, v) => s + v.stock, 0);

            return (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="group bg-card border border-border/60 rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-foreground/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                      Producto
                    </p>
                    <h2 className="mt-1.5 text-lg md:text-xl font-heading font-bold text-foreground leading-tight truncate">
                      {p.name}
                    </h2>
                    <p className="mt-1 text-xs font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded w-fit">
                      {p.slug}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <CardStat label="Variantes" value={p.variants.length.toString()} />
                  <CardStat
                    label="Precio"
                    value={
                      lowest !== null
                        ? `${lowest.toFixed(0)}-${highest!.toFixed(0)}€`
                        : '—'
                    }
                  />
                  <CardStat label="Stock" value={`${totalStockProduct} ud`} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  suffix,
}: {
  label: string;
  value: number;
  icon: typeof Package;
  suffix?: string;
}) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-2xl font-heading font-black text-foreground">
          {value}
          {suffix && <span className="text-xs text-muted-foreground font-normal ml-1">{suffix}</span>}
        </p>
      </div>
    </div>
  );
}

function CardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/40 rounded-lg px-2 py-1.5">
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-xs font-heading font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
}
