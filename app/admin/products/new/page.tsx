import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NewProductForm from './NewProductForm';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto relative z-10 antialiased">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
      </Link>

      <div>
        <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight">
          Nuevo producto
        </h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Crea el producto sin variantes. En cuanto lo guardes, te lleva al editor donde podrás
          añadir formatos, precios, imágenes y stock.
        </p>
      </div>

      <NewProductForm />
    </div>
  );
}
