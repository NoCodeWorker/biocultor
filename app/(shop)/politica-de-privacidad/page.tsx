import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad · Biocultor',
  description: 'Política de privacidad y protección de datos de Biocultor.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 min-h-screen pt-32">
      <h1 className="text-4xl font-heading font-bold text-brand-brown-dark mb-8">Política de Privacidad</h1>
      
      <div className="prose prose-stone max-w-none text-muted-foreground space-y-6">
        <p>
          En <strong>Biocultor</strong>, valoramos y respetamos tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tus datos personales cuando visitas nuestra web y compras nuestros productos.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">1. Información que recopilamos</h2>
        <p>
          Recopilamos información que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, dirección de envío y número de teléfono al realizar una compra o contactarnos. También utilizamos cookies para mejorar tu experiencia de navegación.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">2. Uso de la información</h2>
        <p>
          Utilizamos tu información para:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Procesar y gestionar tus pedidos (envíos mediante Packlink).</li>
          <li>Comunicarnos contigo sobre el estado de tus compras.</li>
          <li>Proporcionar soporte a través de nuestro asistente agronómico (Chatbot).</li>
          <li>Enviar correos electrónicos con tu código de acceso seguro (OTP).</li>
        </ul>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">3. Compartir información</h2>
        <p>
          No vendemos ni alquilamos tus datos personales a terceros. Solo compartimos la información estrictamente necesaria con proveedores de servicios de confianza, como pasarelas de pago (Stripe) y empresas de logística (Packlink/Transportistas), exclusivamente para cumplir con tu pedido.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">4. Tus Derechos</h2>
        <p>
          Tienes derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento. Si deseas ejercer estos derechos, ponte en contacto con nosotros en <strong>contacto@biocultor.com</strong>.
        </p>
      </div>
    </main>
  );
}
