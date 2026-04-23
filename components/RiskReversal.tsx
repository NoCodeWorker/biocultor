'use client';

import { ShieldCheck, RefreshCw, Phone, Award, Leaf } from 'lucide-react';

const guarantees = [
  {
    icon: RefreshCw,
    title: 'Devolución dentro de plazo',
    description:
      'Si necesitas desistir dentro del plazo aplicable, la compra se gestiona según las condiciones publicadas por la tienda.',
    badge: 'Condiciones claras',
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    iconColor: 'text-primary bg-primary/10',
  },
  {
    icon: ShieldCheck,
    title: 'Incidencias de transporte',
    description:
      'Si el pedido llega con daños de transporte, la incidencia debe comunicarse para poder revisarla y gestionarla correctamente.',
    badge: 'Gestión de incidencia',
    badgeColor: 'text-brand-green-mid bg-brand-green-light border-brand-green/25',
    iconColor: 'text-brand-green-mid bg-brand-green-light',
  },
  {
    icon: Phone,
    title: 'Soporte Agronómico Incluido',
    description:
      'La tienda puede orientar sobre formato, aplicación y dudas básicas de uso antes o después de la compra.',
    badge: 'Acompañamiento',
    badgeColor: 'text-secondary bg-secondary/8 border-secondary/20',
    iconColor: 'text-secondary bg-secondary/8',
  },
  {
    icon: Award,
    title: 'Evidencia científica aplicada',
    description:
      'Las decisiones de compra deben apoyarse en contexto agronómico y fuentes primarias, huyendo de promesas mágicas y claims comerciales inflados.',
    badge: 'Criterio agronómico',
    badgeColor: 'text-brand-brown bg-brand-brown-light border-brand-brown/20',
    iconColor: 'text-brand-brown bg-brand-brown-light',
  },
];

export default function RiskReversal() {
  return (
    <section className="w-full py-20 md:py-28 bg-brand-brown-dark text-cream relative overflow-hidden">
      {/* Subtle decorative glows */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Compra sin riesgo
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-cream mb-5">
            Compra con contexto.
            <br />
            <span className="text-primary">Sin teatralidad comercial.</span>
          </h2>
          <p className="text-base md:text-lg text-cream/55 leading-relaxed">
            Esta sección deja fuera el lenguaje inflado. Lo que importa es que las condiciones,
            la logística y el soporte sean comprensibles antes de pagar.
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-14">
          {guarantees.map(({ icon: Icon, title, description, badge, badgeColor, iconColor }) => (
            <div
              key={title}
              className="flex gap-5 p-6 md:p-7 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-2xl ${iconColor} flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-110 duration-300`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-heading font-bold text-lg text-cream leading-tight">{title}</h3>
                <span className={`inline-flex self-start text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${badgeColor}`}>
                  {badge}
                </span>
                <p className="text-cream/55 text-sm leading-relaxed mt-1">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 bg-white/5 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xl font-display font-black text-cream">Compra informada</p>
            <p className="text-cream/40 text-xs">Sin métricas simuladas</p>
          </div>

          <div className="w-px h-16 bg-white/10 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {[
              { text: 'Consulta formato, envío y condiciones antes de comprar si tu uso es doméstico o profesional.', name: 'Decisión de compra' },
              { text: 'Si necesitas compatibilidad con riego o volumen alto, conviene revisar condiciones de aplicación y disponibilidad real.', name: 'Uso y logística' },
            ].map((note) => (
              <div key={note.name} className="flex flex-col gap-2">
                <p className="text-cream/65 text-sm leading-relaxed">{note.text}</p>
                <div className="flex items-center gap-2">
                  <Leaf className="w-3 h-3 text-primary" />
                  <span className="text-cream/40 text-xs font-semibold">{note.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="w-px h-16 bg-white/10 hidden md:block" />

          <div className="text-center shrink-0">
            <p className="text-cream/40 text-xs uppercase tracking-widest mb-3">Antes de pagar</p>
            <div className="w-16 h-16 rounded-full bg-primary/15 border-2 border-primary/30 flex flex-col items-center justify-center mx-auto">
              <span className="text-2xl font-display font-black text-primary">Info</span>
              <span className="text-[9px] text-primary/70 uppercase tracking-wide leading-none">clara</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
