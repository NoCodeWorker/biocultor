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

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">2. Devoluciones y Derecho de Desistimiento</h2>
        <p>
          Conforme a la legislación de consumo de la Unión Europea y de España, dispones de un plazo de <strong>14 días naturales</strong> desde la recepción de tu pedido para ejercer tu derecho de desistimiento y solicitar la devolución del producto.
        </p>
        <p>
          <strong>Condiciones de devolución:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Por razones de protección de la salud, higiene y seguridad (al tratarse de abonos orgánicos y extractos biológicamente activos), <strong>solo se aceptará la devolución de productos que estén completamente precintados, sin abrir y en su embalaje original intacto</strong>. No se admiten devoluciones de botellas o bidones abiertos, manipulados o parcialmente consumidos.</li>
          <li><strong>Gastos de envío de la devolución:</strong> Los costes asociados al envío del producto devuelto hasta nuestras instalaciones correrán <strong>íntegramente a cargo del cliente</strong> (comprador), salvo que la devolución se deba a un error de envío o a un producto defectuoso.</li>
        </ul>
        <p>
          <strong>Incidencias de transporte y productos dañados:</strong>
        </p>
        <p>
          Si tu pedido llega dañado, roto, con pérdidas de líquido o el producto es defectuoso desde origen, procederemos a reemplazártelo sin coste adicional. Para gestionarlo, debes notificárnoslo en un plazo máximo de <strong>48 horas</strong> tras la recepción del paquete escribiéndonos a <strong>contacto@biocultor.com</strong> o mediante nuestro formulario de contacto, adjuntando fotografías del paquete externo y del producto afectado.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">3. Cancelaciones</h2>
        <p>
          Puedes cancelar tu pedido siempre y cuando no haya sido procesado ni entregado a la agencia de transportes. Una vez que el pedido tenga el estado "Creado" o "En Tránsito", la cancelación no será posible.
        </p>
      </div>
    </main>
  );
}
