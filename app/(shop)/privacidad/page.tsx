import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Biocultor',
  description: 'Política de privacidad y protección de datos personales en Biocultor. Conoce cómo gestionamos de forma segura tus datos para envíos y pagos.',
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
        
        <div className="flex flex-col gap-8 text-muted-foreground leading-relaxed font-sans">
          <p>
            En <strong>Biocultor</strong> valoramos y respetamos tu privacidad. Esta política detalla cómo recopilamos, procesamos y protegemos tus datos de forma segura, de acuerdo con el Reglamento General de Protección de Datos (RGPD) y la legislación española aplicable.
          </p>

          <div className="p-6 bg-secondary/30 rounded-2xl border border-secondary my-4">
            <h3 className="font-bold text-foreground mb-2">Resumen Ejecutivo</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Recopilamos únicamente los datos necesarios para procesar tu envío logístico e identificar tu pedido.</li>
              <li>La pasarela de pago segura Stripe gestiona de forma cifrada tus datos bancarios; nosotros jamás almacenamos tu tarjeta.</li>
              <li>Tu privacidad no es comercializable: no vendemos ni alquilamos tus datos personales a anunciantes o terceros.</li>
            </ul>
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">1. Datos personales que recopilamos</h2>
            <p>
              Cuando interactúas con nuestra tienda, recopilamos la información estrictamente necesaria:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li><strong>Datos de Compra:</strong> Nombre, apellidos, dirección postal de entrega, número de teléfono y correo electrónico.</li>
              <li><strong>Datos de Sesión:</strong> Correo electrónico para el envío de códigos de acceso seguros de un solo uso (OTP).</li>
              <li><strong>Soporte Agronómico:</strong> Dudas o datos que facilites de forma voluntaria a nuestro chatbot asistente para resolver tus dudas de cultivo.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">2. Uso y finalidad de tus datos</h2>
            <p>
              Tus datos personales se tratan exclusivamente para los siguientes fines legítimos:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li><strong>Gestión logística:</strong> Tramitar tus compras y realizar la entrega física de tus abonos mediante nuestro socio integrador de transportes (Packlink).</li>
              <li><strong>Comunicación:</strong> Mantenerte informado sobre el estado de tu pedido o enviarte notificaciones transaccionales necesarias.</li>
              <li><strong>Mejora del sitio:</strong> Analizar de manera agregada y anónima el comportamiento de navegación para mejorar la experiencia de uso de la tienda.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">3. Compartir con Terceros autorizados</h2>
            <p>
              No compartimos tus datos excepto con los proveedores de servicios necesarios para materializar el servicio contratado, quienes actúan cumpliendo estrictas medidas de seguridad:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li><strong>Stripe:</strong> Pasarela segura para procesar el cobro cifrado con tarjeta.</li>
              <li><strong>Packlink / Agencias de Transporte (SEUR, Correos, etc.):</strong> Para tramitar el etiquetado y transporte a tu dirección.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">4. Ejercicio de tus derechos</h2>
            <p>
              De acuerdo al RGPD, posees el pleno derecho a acceder, rectificar, limitar el tratamiento, solicitar la portabilidad o suprimir tus datos personales de nuestros sistemas.
            </p>
            <p>
              Para ejercer cualquiera de estos derechos, o si tienes alguna consulta sobre la seguridad de tus datos, puedes enviarnos una solicitud formal a <strong>soporte@biocultor.com</strong> o <strong>contacto@biocultor.com</strong> y gestionaremos tu caso de inmediato.
            </p>
          </section>

          <p className="text-sm font-semibold mt-12 opacity-50">Documentación actualizada en Abril de 2026.</p>
        </div>
      </div>
    </div>
  );
}
