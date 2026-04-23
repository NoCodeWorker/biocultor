import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata = {
  title: 'Términos y Condiciones | Biocultor',
};

export default function TerminosPage() {
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24 flex-1">
      <div className="max-w-4xl mx-auto">
        <StructuredData
          id="terminos-breadcrumb-schema"
          data={breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Términos y Condiciones', path: '/terminos' },
          ])}
        />
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Términos y Condiciones' }]} />
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-8 tracking-tight">Términos y Condiciones de Venta</h1>
        
        <div className="flex flex-col gap-8 text-muted-foreground leading-relaxed">
          <p>
            Bienvenido a Biocultor®. Estos Términos y Condiciones resumen las reglas básicas de compra y uso del sitio.
            Al utilizar esta web y completar un pedido, aceptas estas condiciones.
          </p>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">1. Identidad del Vendedor</h2>
            <p>
              La venta de los productos de Biocultor se realiza a través de esta tienda online. Si necesitas información comercial o técnica adicional, debes solicitarla antes de completar la compra.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">2. Uso de los Bioproductos</h2>
            <p>
              El producto está destinado a uso agrícola o de jardinería según las indicaciones facilitadas por la tienda. No debe destinarse a fines distintos de los descritos en su información de uso.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">3. Transacciones y Pagos</h2>
            <p>
              Los pagos se procesan mediante la pasarela habilitada en la tienda. Tras confirmar la compra, recibirás la información correspondiente por correo electrónico.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">4. Modificaciones del Servicio</h2>
            <p>
              Los precios, formatos y disponibilidades pueden cambiar sin afectar a pedidos ya confirmados y pagados.
            </p>
          </section>

          <p className="text-sm font-semibold mt-12 opacity-50">Documentación actualizada en Abril de 2026.</p>
        </div>
      </div>
    </div>
  );
}
