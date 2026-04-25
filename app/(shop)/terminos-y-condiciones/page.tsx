import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones · Biocultor',
  description: 'Términos y condiciones de uso de la tienda online Biocultor.',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 min-h-screen pt-32">
      <h1 className="text-4xl font-heading font-bold text-brand-brown-dark mb-8">Términos y Condiciones</h1>
      
      <div className="prose prose-stone max-w-none text-muted-foreground space-y-6">
        <p>
          Bienvenido a <strong>Biocultor</strong>. Al acceder y realizar compras en nuestra web, aceptas los siguientes términos y condiciones. Por favor, léelos con detenimiento.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">1. Información de Productos</h2>
        <p>
          En Biocultor nos esforzamos por garantizar que las descripciones e imágenes de nuestros productos (como el té de humus de lombriz) sean lo más precisas posible. Debido a la naturaleza orgánica de nuestros productos, pueden existir variaciones menores en el color o el sedimento.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">2. Precios y Pagos</h2>
        <p>
          Todos los precios están indicados en Euros (€) e incluyen los impuestos aplicables. Nos reservamos el derecho a modificar los precios en cualquier momento. Los pagos se procesan de forma segura a través de Stripe, y no almacenamos tu información financiera.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">3. Propiedad Intelectual</h2>
        <p>
          Todo el contenido de este sitio web, incluyendo textos, gráficos, logotipos, e imágenes, es propiedad de Biocultor y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción sin consentimiento explícito.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">4. Asistente Agronómico (Chatbot)</h2>
        <p>
          El asesoramiento proporcionado por nuestro asistente agronómico basado en IA tiene fines orientativos y educativos. Biocultor no se hace responsable de las pérdidas de cosecha derivadas del mal uso de los productos o interpretaciones incorrectas de la información proporcionada.
        </p>
      </div>
    </main>
  );
}
