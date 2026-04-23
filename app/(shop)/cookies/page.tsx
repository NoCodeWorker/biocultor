import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata = {
  title: 'Política de Cookies | Biocultor',
};

export default function CookiesPage() {
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24 flex-1">
      <div className="max-w-4xl mx-auto">
        <StructuredData
          id="cookies-breadcrumb-schema"
          data={breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Política de Cookies', path: '/cookies' },
          ])}
        />
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Política de Cookies' }]} />
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-8 tracking-tight">Política de Cookies</h1>
        
        <div className="flex flex-col gap-8 text-muted-foreground leading-relaxed">
          <p>
            Esta web utiliza pequeños archivos de texto llamados "Cookies" para mejorar tu navegación y el funcionamiento básico de la tienda.
          </p>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">¿Qué tipos de Cookies usamos?</h2>
            
            <div className="grid gap-4 mt-2">
              <div className="bg-card border border-border/50 p-6 rounded-2xl">
                <h3 className="font-bold text-foreground mb-2">Cookies Técnicas Estríctamente Necesarias</h3>
                <p>Obligatorias. Permiten mantener tu sesión abierta de forma segura durante el pago y no perder el carrito de la compra si cierras la pestaña por error.</p>
              </div>
              
              <div className="bg-card border border-border/50 p-6 rounded-2xl">
                <h3 className="font-bold text-foreground mb-2">Cookies Analíticas</h3>
                <p>Las usamos para entender qué contenidos y páginas reciben más atención y mejorar la experiencia general del sitio. No están pensadas para perfilarte de forma individual.</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-foreground">Gestión y Revocación</h2>
            <p>
              Si no estás de acuerdo con las cookies opcionales, puedes gestionarlas desde la configuración de tu navegador.
            </p>
          </section>

          <p className="text-sm font-semibold mt-12 opacity-50">Documentación actualizada en Abril de 2026.</p>
        </div>
      </div>
    </div>
  );
}
