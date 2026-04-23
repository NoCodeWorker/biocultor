import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata = {
  title: 'Política de Privacidad | Biocultor',
};

export default function PrivacidadPage() {
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24 flex-1">
      <div className="max-w-4xl mx-auto">
        <StructuredData
          id="privacidad-breadcrumb-schema"
          data={breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Política de Privacidad', path: '/privacidad' },
          ])}
        />
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Política de Privacidad' }]} />
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-8 tracking-tight">Política de Privacidad</h1>
        
        <div className="flex flex-col gap-8 text-muted-foreground leading-relaxed">
          <p>
            En Biocultor solo usamos los datos necesarios para gestionar pedidos, atención al cliente y funcionamiento básico de la tienda.
            Esta página resume de forma general qué información se utiliza y con qué finalidad.
          </p>

          <div className="p-6 bg-secondary/30 rounded-2xl border border-secondary my-4">
            <h3 className="font-bold text-foreground mb-2">Resumen Ejecutivo</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Solo recopilamos tu correo, nombre y dirección física para completar el envío logístico.</li>
              <li>Los datos de pago se gestionan mediante la pasarela habilitada en checkout.</li>
              <li>No vendemos tu base de datos a terceros anunciantes. Tu privacidad no es negociable.</li>
            </ul>
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">1. Datos que usamos para el pedido</h2>
            <p>
              Cuando haces un pedido, la tienda utiliza datos como nombre, dirección, correo electrónico y otra información necesaria para preparar el envío y comunicarse contigo sobre la compra.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">2. Solicitudes sobre tus datos</h2>
            <p>
              Si necesitas consultar, corregir o solicitar la eliminación de tus datos, puedes escribir a soporte@biocultor.com para revisar tu caso.
            </p>
          </section>

          <p className="text-sm font-semibold mt-12 opacity-50">Documentación actualizada en Abril de 2026.</p>
        </div>
      </div>
    </div>
  );
}
