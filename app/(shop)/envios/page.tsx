import { Truck, Clock, PackageCheck, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Envíos, Entregas y Devoluciones | Biocultor',
  description: 'Consulta los tiempos de entrega, costes de envío, política de devoluciones (derecho de desistimiento de 14 días) y cancelaciones de Biocultor.',
};

export default function EnviosPage() {
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24 flex-1">
      <div className="max-w-4xl mx-auto">
        <StructuredData
          id="envios-breadcrumb-schema"
          data={breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Envíos y Devoluciones', path: '/envios' },
          ])}
        />
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Envíos y Devoluciones' }]} />
        
        {/* Cabecera */}
        <div className="mb-16 text-center md:text-left font-sans">
          <div className="inline-flex items-center justify-center p-3 bg-secondary/30 rounded-2xl mb-6">
            <Truck className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-6 tracking-tight">
            Envíos, Entregas y Devoluciones
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Este documento detalla los plazos de entrega, costes de transporte, política de devoluciones y cancelaciones de Biocultor® para asegurar una compra totalmente transparente e informada antes de pasar por checkout.
          </p>
        </div>

        <div className="flex flex-col gap-12 font-sans">
          
          {/* Seccion 1: Tiempos de Entrega */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
            <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-3 text-foreground">
               Tiempos y Logística de Entrega
               <Clock className="w-6 h-6 text-primary" />
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                Todos los pedidos se procesan y envían directamente desde nuestro Almacén Central ubicado en **Santa Cruz de la Zarza (Toledo), España**.
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-sm">
                <li>Los pedidos realizados antes de las **13:00h** (días hábiles) salen de nuestro almacén el mismo día.</li>
                <li><strong>Plazo estimado de entrega:</strong> De 24 a 48 horas hábiles en Península.</li>
                <li>Una vez que el transportista recoja tu paquete, recibirás por correo electrónico un enlace de seguimiento de nuestro socio logístico (Packlink) para traquear el estado de tu entrega en tiempo real.</li>
              </ul>
            </div>
          </section>

          {/* Seccion 2: Costes de Envío */}
          <section className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-10 shadow-sm relative">
            <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-3 text-foreground">
               Costes de Envío y Gratuidad
               <PackageCheck className="w-6 h-6 text-primary" />
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                Los costes de envío se calculan automáticamente en el carrito de compra basándose en el peso de los bidones seleccionados y la dirección de entrega.
              </p>
              <div className="mt-6 p-6 bg-background rounded-2xl border border-border/50">
                <p className="font-bold text-foreground text-lg mb-2">Envío gratuito a partir de 50€</p>
                <p className="text-sm">
                  Cualquier pedido con un importe total en carrito igual o superior a **50,00€** (impuestos incluidos) se beneficiará de **envío gratuito** a Península.
                </p>
              </div>
              <p className="mt-4 text-sm">
                Para pedidos inferiores a 50€, se aplicará la tarifa calculada en checkout según el destino.
              </p>
            </div>
          </section>

          {/* Seccion 3: Garantía Anti-Fugas */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm relative">
             <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-3 text-foreground">
               Garantía Anti-Fugas en Transporte
               <AlertCircle className="w-6 h-6 text-orange-500" />
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                Envasamos nuestros abonos biológicos en bidones opacos de Polietileno de Alta Densidad (PEAD) de grado industrial con tapones sellados mediante inducción térmica para asegurar que la microbiología viva llegue intacta.
              </p>
              <p className="mt-4 text-sm">
                Si detectas cualquier tipo de pérdida de líquido, derrame o bidón roto al recibir tu envío, notifícalo dentro de las **48 horas** siguientes escribiendo a **soporte@biocultor.com** o mediante nuestro formulario de contacto, adjuntando fotografías del embalaje externo y del producto afectado. Procederemos a un reemplazo inmediato y gratuito.
              </p>
            </div>
          </section>

          {/* Seccion 4: Devoluciones */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm relative">
             <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-3 text-foreground">
               Derecho de Desistimiento y Devoluciones
               <RefreshCw className="w-6 h-6 text-primary" />
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
              <p>
                De acuerdo con la normativa española de consumo, dispones de un plazo de **14 días naturales** desde la entrega de tu pedido para solicitar la devolución y ejercer tu derecho de desistimiento de la compra.
              </p>
              <p className="mt-3 font-semibold text-foreground">Condiciones estrictas de devolución:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  Por cuestiones de protección de la salud, higiene y seguridad (al tratarse de extractos fermentados orgánicos microbiológicamente activos), <strong>únicamente se aceptarán devoluciones de envases que estén completamente precintados, sin abrir y en su embalaje original intacto</strong>.
                </li>
                <li>No se admitirá la devolución de bidones o botellas abiertas, parcialmente consumidas o con sellos de inducción retirados.</li>
                <li><strong>Gastos de devolución:</strong> Los costes del envío de retorno de los productos devueltos a nuestras instalaciones en Santa Cruz de la Zarza (Toledo) correrán **íntegramente a cargo del cliente (comprador)**, excepto si se debe a un error de envío imputable a la tienda.</li>
              </ul>
            </div>
          </section>

          {/* Seccion 5: Cancelaciones */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm relative">
             <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-3 text-foreground">
               Cancelación de Pedidos
               <XCircle className="w-6 h-6 text-red-500" />
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
              <p>
                Puedes solicitar la cancelación y reembolso total de tu pedido siempre y cuando no haya sido preparado o entregado a la agencia de transportes.
              </p>
              <p className="mt-3">
                Una vez que el paquete ha sido etiquetado en nuestro almacén y se encuentra "En Tránsito", no es posible cancelar el envío. En tal caso, deberás esperar a recibirlo y tramitarlo como una devolución de producto precintado (bajo las condiciones del desistimiento).
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
