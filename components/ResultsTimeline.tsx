'use client';

import { Clock, Droplets, Sprout, Sun, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    time: '0h',
    label: 'Aplicación',
    icon: Droplets,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    headline: 'El momento en que todo empieza',
    description:
      'La primera fase es operativa: preparar la mezcla, respetar la dosis y aplicarla con un sistema limpio y coherente con el cultivo.',
    detail: 'Aplicación foliar o radicular según uso.',
  },
  {
    time: 'Primeros días',
    label: 'Seguimiento',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    headline: 'Primera respuesta visible',
    description:
      'En esta etapa toca observar cómo responde el cultivo dentro de su contexto real: riego, temperatura, manejo previo y estado del suelo.',
    detail: 'Observación de manejo y respuesta.',
  },
  {
    time: 'Semanas',
    label: 'Continuidad',
    icon: Sprout,
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/15',
    headline: 'El suelo despierta',
    headline: 'Uso con continuidad',
    description:
      'Los cambios útiles, cuando los hay, se leen mejor en continuidad de uso que en impactos instantáneos. La referencia debe ser la evolución del manejo, no una promesa cerrada.',
    detail: 'Rutina, constancia y lectura de cultivo.',
    featured: true,
  },
  {
    time: 'Ciclo completo',
    label: 'Evaluación',
    icon: Sun,
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/15',
    headline: 'Evaluación de continuidad',
    headline: 'Evaluación del ciclo',
    description:
      'La decisión correcta llega al final de un ciclo: repetir, ajustar dosis o cambiar formato. Sin seguimiento real, cualquier cifra fija sería publicidad, no criterio.',
    detail: 'Revisión de uso y siguiente compra.',
  },
];

export default function ResultsTimeline() {
  return (
    <section className="w-full py-20 md:py-28 bg-cream-warm border-t border-border/40 relative overflow-hidden">
      {/* Decorative vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent hidden lg:block" />

      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/15">
            <Clock className="w-3.5 h-3.5" />
            Uso responsable
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground mb-5">
            Cómo seguir el uso de Biocultor.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            La respuesta no se puede fijar en horas ni porcentajes universales. Lo útil es entender
            cómo introducir el producto, qué observar y cuándo reevaluar.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.time}
                className={`relative flex flex-col rounded-2xl md:rounded-3xl border-2 p-6 md:p-7 transition-all duration-300 card-lift
                  ${step.featured
                    ? 'border-primary/40 bg-white shadow-xl shadow-primary/8'
                    : `border-border/50 bg-card ${step.border}`
                  }`}
              >
                {/* Featured badge */}
                {step.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                    Momento clave
                  </div>
                )}

                {/* Step number */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${step.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <span className={`text-3xl font-display font-black ${step.featured ? 'text-primary' : 'text-primary'}`}>
                    {step.time}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${step.featured ? 'text-primary' : 'text-primary'}`}>
                    {step.label}
                  </p>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-3 leading-tight">
                    {step.headline}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Detail badge */}
                <div className={`mt-5 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${step.bg}`}>
                  <CheckCircle2 className={`w-4 h-4 ${step.color} shrink-0`} />
                  <span className={step.color}>{step.detail}</span>
                </div>

                {/* Connector arrow (desktop) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-background border-2 border-border/50 flex items-center justify-center text-muted-foreground text-xs font-bold shadow-sm">
                      →
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom disclaimer */}
        <p className="text-center text-xs text-muted-foreground mt-10 opacity-70">
          Referencia editorial orientativa. La respuesta puede variar según cultivo, suelo, clima, riego y manejo previo.
        </p>
      </div>
    </section>
  );
}

