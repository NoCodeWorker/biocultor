import { Truck, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata = {
  title: 'Envíos y Entregas | Biocultor',
  description: 'Consulta la política de envíos, tiempos orientativos de entrega e incidencias de transporte en Biocultor.',
};

export default function EnviosPage() {
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24 flex-1">
      <div className="max-w-4xl mx-auto">
        <StructuredData
          id="envios-breadcrumb-schema"
          data={breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Envíos', path: '/envios' },
          ])}
        />
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Envíos' }]} />
        
        {/* Cabecera */}
        <div className="mb-16 text-center md:text-left">
          <div className="inline-flex items-center justify-center p-3 bg-secondary/30 rounded-2xl mb-6">
            <Truck className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-6 tracking-tight">
            Logística de Envíos
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Esta página resume plazos orientativos, costes de envío e incidencias de transporte para que la compra sea clara antes de pasar por checkout.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          
          {/* Seccion 1 */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
            <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-3">
               Tiempos de Entrega
               <Clock className="w-6 h-6 text-primary" />
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                Los pedidos dentro de la península ibérica se gestionan mediante operadores logísticos disponibles para la tienda, con asignación según destino, volumen y servicio.
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>Pedidos realizados antes de las 13:00h salen de la planta el mismo día hábil.</li>
                <li><strong>Tiempo estimado de llegada:</strong> 24 a 48 horas hábiles.</li>
                <li>Podrás traquear el envío con el número de seguimiento que te enviaremos por email tras el pago seguro mediante Stripe.</li>
              </ul>
            </div>
          </section>

          {/* Seccion 2 */}
          <section className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-10 shadow-sm relative">
            <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-3 text-foreground">
               Costes de Envío y Gratuidad
               <PackageCheck className="w-6 h-6 text-primary" />
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                Los costes de envío se calculan para mantener una política clara entre formatos pequeños y pedidos de mayor volumen.
              </p>
              <div className="mt-6 p-6 bg-background rounded-2xl border border-border/50">
                <p className="font-bold text-foreground text-lg mb-2">Envío gratuito a partir de 50€</p>
                <p>Los pedidos cuyo importe supere los <strong>50,00€</strong> disponen de envío gratuito a península, según las condiciones activas de la tienda en el momento de compra.</p>
              </div>
              <p className="mt-4 text-sm">
                Para pedidos inferiores a 50€, el coste se calcula en checkout según la tarifa vigente.
              </p>
            </div>
          </section>

          {/* Seccion 3 */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm relative">
             <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-3 text-foreground">
               Garantía Anti-Fugas
               <AlertCircle className="w-6 h-6 text-orange-500" />
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                Envasamos el extracto de humus en bidones de Polietileno de Alta Densidad (PEAD) opacos para proteger las bacterias foto-sensibles del sol. 
                Los tapones cuentan con una junta de seguridad por termo-inducción.
              </p>
              <p className="mt-4">
                Si por una incidencia de transporte recibes un bidón con derrame o rotura, contáctanos desde la página de <a href="/contacto" className="text-primary hover:underline font-medium">Soporte</a> dentro del plazo indicado, aportando una fotografía para poder revisar y gestionar el caso.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
