'use client';

import { CheckCircle2, FlaskConical, Leaf } from 'lucide-react';

const usageNotes = [
  {
    title: 'Antes de comprar',
    text: 'Define si tu necesidad es huerto doméstico, mantenimiento de suelo o uso continuo en riego. El formato correcto depende más del ritmo de aplicación que del tamaño nominal del envase.',
  },
  {
    title: 'Durante la aplicación',
    text: 'La mejor lectura del producto aparece cuando se integra en una rutina ordenada: dosis estables, agua limpia y seguimiento del cultivo, no improvisación.',
  },
  {
    title: 'Después del uso',
    text: 'Evalúa respuesta de suelo, manejo y cultivo con criterio agronómico básico. Si no hay contexto de uso, ninguna promesa comercial tiene valor real.',
  },
];

export default function ScienceProof() {
  return (
    <section className="w-full py-20 md:py-28 bg-background relative z-10 overflow-hidden border-t border-border/40">
      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          
          {/* Left Column: Science */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary font-bold text-xs uppercase tracking-widest mb-6 border border-primary/15">
                <FlaskConical className="w-3.5 h-3.5" /> La ciencia funciona
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground leading-tight mb-6 tracking-tight">
                Menos promesa,<br/><span className="text-primary">más criterio de uso.</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Biocultor tiene que explicarse desde aplicación, compatibilidad y contexto de cultivo.
                Si una marca necesita exagerar cifras o milagros, el problema no es de copy: es de producto o de rigor.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  title: 'Compatibilidad razonable',
                  text: 'La conversación útil no es “funciona con todo”, sino cómo encaja con tu sistema de riego, tu frecuencia de uso y el estado real del suelo.',
                },
                {
                  title: 'Expectativas realistas',
                  text: 'No conviene prometer resultados cerrados en horas o porcentajes fijos. La observación válida es progresiva y depende del cultivo, el manejo y el punto de partida.',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="card-lift p-6 md:p-7 rounded-2xl bg-card border border-border/50 overflow-hidden relative group"
                >
                  {/* Gold accent line */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/60 via-primary/30 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h4 className="text-lg font-heading font-bold text-foreground mb-3 flex items-center gap-3">
                    <span className="p-2 bg-primary/10 text-primary rounded-xl">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    {card.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">{card.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Usage notes */}
          <div className="relative">
            {/* Soft glow behind cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[80px] rounded-full pointer-events-none -z-10" />
            
            <div className="flex flex-col gap-6 stagger-children">
              <div className="flex items-center gap-3 mb-2">
                <div className="leaf-divider flex-1">
                  <Leaf className="w-4 h-4 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                Cómo leer el producto con rigor
              </h3>

              {usageNotes.map((item, i) => (
                <div
                  key={i}
                  className="card-lift p-7 md:p-8 rounded-2xl md:rounded-3xl bg-card border border-border/50 relative overflow-hidden"
                >
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  
                  <p className="text-lg font-heading font-bold text-foreground mb-3 pl-4">
                    {item.title}
                  </p>
                  <p className="text-base md:text-lg font-light text-foreground/85 mb-6 leading-relaxed pl-4">
                    {item.text}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-5 border-t border-border/40">
                    <div className="w-12 h-12 rounded-full bg-cream-warm flex items-center justify-center text-brand-brown font-heading font-bold text-sm border-2 border-primary/25 shadow-inner">
                      B
                    </div>
                    <div>
                      <h5 className="font-heading font-bold text-foreground">Biocultor</h5>
                      <p className="text-xs text-primary font-semibold tracking-wide uppercase">Lectura editorial</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

