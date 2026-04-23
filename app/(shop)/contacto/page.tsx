import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { breadcrumbSchema } from '@/lib/seo';

import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contacto | Soporte Biocultor',
  description: 'Háblanos sobre tu finca, tus cultivos o resuelve dudas de envío. El equipo técnico de Biocultor te asesorará en menos de 24 horas.',
};

export default function ContactoPage() {
  return (
    <div className="w-[92%] lg:w-[75%] mx-auto px-4 py-16 md:py-24 flex-1">
      <div className="max-w-5xl mx-auto">
        <StructuredData
          id="contacto-breadcrumb-schema"
          data={breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Contacto', path: '/contacto' },
          ])}
        />
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Contacto' }]} />
        
        {/* Cabecera */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-foreground mb-6 tracking-tight">
            Estamos a un <span className="text-primary">brote</span> de distancia.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Dudas sobre dosificaciones, pedidos al por mayor para grandes fincas o consultas técnicas agronómicas. Escríbenos, no usamos bots.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24">
          
          {/* Formulario */}
          <div className="lg:col-span-3 bg-card border border-border/50 rounded-[2rem] p-8 shadow-xl shadow-black/5">
            <ContactForm />
          </div>

          {/* Información Lateral */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-secondary/20">
              <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Contacta por Email</h3>
                <p className="text-primary font-medium">soporte@biocultor.com</p>
                <p className="text-sm text-muted-foreground mt-2">Respuesta en max. 24 horas hábiles.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl border border-border/50 bg-card">
              <div className="w-12 h-12 bg-background border border-border/50 text-muted-foreground rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Asesoría Agronómica</h3>
                <p className="text-foreground tracking-wide font-medium">+34 900 123 456</p>
                <p className="text-sm text-muted-foreground mt-2">Lunes a Viernes de 09:00 a 18:00h</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl border border-border/50 bg-card">
              <div className="w-12 h-12 bg-background border border-border/50 text-muted-foreground rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Instalaciones Centrales</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Laboratorios y planta de extracción.<br />
                  Sevilla, Andalucía (España).<br />
                  <span className="italic mt-1 block">Visitas exclusivamente con cita previa técnica.</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
