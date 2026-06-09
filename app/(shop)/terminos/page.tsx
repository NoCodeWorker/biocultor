import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Biocultor',
  description: 'Términos y condiciones de uso y venta en la tienda online Biocultor. Conoce las reglas comerciales, límites de responsabilidad y propiedad intelectual.',
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
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-8 tracking-tight">Términos y Condiciones de Uso y Venta</h1>
        
        <div className="flex flex-col gap-8 text-muted-foreground leading-relaxed font-sans">
          <p>
            Bienvenido a <strong>Biocultor®</strong>. Al acceder, navegar o realizar compras en esta tienda online, aceptas y te sometes a los términos y condiciones recogidos en este documento. Por favor, léelos con atención antes de realizar transacciones.
          </p>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">1. Identidad del Vendedor e Información de Productos</h2>
            <p>
              La venta de los abonos y extractos orgánicos se efectúa a través de esta tienda online oficial.
            </p>
            <p>
              Debido a la **naturaleza 100% orgánica y viva** de nuestros bioproductos (como el té de humus de lombriz o el purín de ortiga), pueden existir variaciones menores en la tonalidad, turbidez o presencia de sedimentos naturales entre lotes de fabricación, lo cual no merma su calidad microbiológica ni efectividad.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">2. Precios, Transacciones y Pagos Seguros</h2>
            <p>
              Todos los precios de venta al público mostrados están expresados en Euros (€) e incluyen los impuestos indirectos aplicables (IVA).
            </p>
            <p>
              Los pagos se gestionan de forma totalmente segura mediante la plataforma global de pagos **Stripe**. En ningún caso Biocultor almacena, visualiza ni procesa información financiera o de tarjetas bancarias del comprador en sus servidores locales. Tras confirmar y verificar el pago, recibirás un correo electrónico de confirmación automática de tu pedido.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">3. Asistente de IA Agronómico (Límites de Asesoramiento)</h2>
            <p>
              En Biocultor disponemos de un asistente interactivo basado en Inteligencia Artificial para consultas agronómicas rápidas.
            </p>
            <p>
              La información facilitada por esta herramienta de IA tiene **fines meramente informativos y de orientación educativa**. Biocultor no asume responsabilidad alguna por pérdidas de cosechas, daños en plantas, sobrefertilización o cualquier incidencia agronómica derivada de un uso inadecuado de los productos, o de interpretaciones erróneas de los consejos aportados por el asistente de IA. Aconsejamos revisar siempre las fichas técnicas oficiales y testear a pequeña escala.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">4. Propiedad Intelectual</h2>
            <p>
              Todo el contenido textual, gráfico, logotipos, vídeos, archivos de audio y diseño general expuesto en este sitio web es propiedad exclusiva de Biocultor® y se encuentra protegido por las leyes de propiedad intelectual e industrial nacionales e internacionales. Queda estrictamente prohibida la copia, reproducción o distribución comercial sin consentimiento previo y por escrito.
            </p>
          </section>

          <p className="text-sm font-semibold mt-12 opacity-50">Documentación actualizada en Abril de 2026.</p>
        </div>
      </div>
    </div>
  );
}
