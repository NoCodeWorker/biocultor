import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Envíos y Devoluciones · Biocultor',
  description: 'Información sobre envíos, plazos de entrega y política de devoluciones de Biocultor.',
};

export default function ShippingAndReturnsPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 min-h-screen pt-32">
      <h1 className="text-4xl font-heading font-bold text-brand-brown-dark mb-8">Política de Envíos y Devoluciones</h1>
      
      <div className="prose prose-stone max-w-none text-muted-foreground space-y-6">
        <p>
          En <strong>Biocultor</strong> queremos que tus abonos orgánicos lleguen en perfectas condiciones y en el menor tiempo posible para preservar su microbiología.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">1. Envíos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Origen:</strong> Todos nuestros paquetes salen directamente desde nuestro Almacén Central en Santa Cruz de la Zarza (Toledo), España.</li>
          <li><strong>Plazos de Entrega:</strong> Los pedidos suelen prepararse en 24h laborables y el envío estándar a Península toma entre 24 y 48 horas adicionales.</li>
          <li><strong>Costes:</strong> Los gastos de envío se calculan de manera automática en el carrito de compra mediante nuestro socio logístico Packlink, basándose en el peso y el destino.</li>
          <li><strong>Seguimiento:</strong> Una vez procesado, te enviaremos un correo electrónico con un enlace seguro para que puedas seguir la trayectoria de tu pedido en tiempo real.</li>
        </ul>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">2. Devoluciones</h2>
        <p>
          Debido a la naturaleza biológica activa de nuestros extractos y productos (como el té de humus de lombriz), <strong>no aceptamos devoluciones de envases abiertos o manipulados</strong> por razones de calidad y seguridad.
        </p>
        <p>
          Sin embargo, si tu pedido llega dañado, roto o el producto es defectuoso desde origen, contáctanos en un plazo máximo de <strong>48 horas</strong> tras la recepción del paquete a través de nuestro formulario de contacto o en <strong>contacto@biocultor.com</strong>, adjuntando fotografías del estado del paquete y del producto. Procederemos a reemplazártelo sin coste adicional.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">3. Cancelaciones</h2>
        <p>
          Puedes cancelar tu pedido siempre y cuando no haya sido procesado ni entregado a la agencia de transportes. Una vez que el pedido tenga el estado "Creado" o "En Tránsito", la cancelación no será posible.
        </p>
      </div>
    </main>
  );
}
