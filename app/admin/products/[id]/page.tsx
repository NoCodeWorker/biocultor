import prisma from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import ProductForm from './ProductForm';
import VariantsEditor from './VariantsEditor';
import DeleteProductButton from './DeleteProductButton';

export const dynamic = 'force-dynamic';

export default async function ProductEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { price: 'asc' } },
    },
  });

  if (!product) notFound();

  const variantsForClient = product.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    target: v.target,
    price: v.price,
    comparePrice: v.comparePrice,
    stock: v.stock,
    features: v.features,
    popular: v.popular,
    imagePath: v.imagePath,
  }));

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto relative z-10 antialiased">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Catálogo
        </Link>

        <Link
          href={`/producto/${product.slug}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Ver ficha pública <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary/80">
          Editar producto
        </p>
        <h1 className="mt-2 text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight">
          {product.name}
        </h1>
        <p className="mt-3 text-sm font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded w-fit">
          {product.slug}
        </p>
      </div>

      <section className="bg-card border border-border/60 rounded-3xl p-8">
        <h2 className="text-2xl font-heading font-bold mb-6">Datos del producto</h2>
        <ProductForm product={product} />
      </section>

      <section className="bg-card border border-border/60 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold">Variantes ({product.variants.length})</h2>
        </div>
        <VariantsEditor productId={product.id} initialVariants={variantsForClient} />
      </section>

      <section className="bg-red-50/40 border border-red-200/60 rounded-3xl p-8">
        <h2 className="text-xl font-heading font-bold text-red-900 mb-2">Zona de peligro</h2>
        <p className="text-sm text-red-800/80 leading-relaxed mb-5">
          Eliminar este producto borra también sus {product.variants.length} variantes y los OrderItems
          asociados (cascade delete del schema). Los pedidos antiguos pueden quedar incompletos. Hazlo
          solo si nunca se vendió o si vas a recrearlo.
        </p>
        <DeleteProductButton productId={product.id} productName={product.name} />
      </section>
    </div>
  );
}
