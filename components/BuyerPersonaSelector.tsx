'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Home, Tractor, Leaf, TreePine, FlaskConical, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const personas = [
  {
    id: 'urbano',
    icon: Home,
    label: 'Jardinero Urbano',
    description: 'Tengo macetas, un huerto en el balcón o un jardín doméstico. Quiero una rutina de uso simple y un formato manejable.',
    pain: 'Necesito algo fácil de aplicar y proporcional al tamaño real de mi cultivo.',
    format: '1 Litro — el formato perfecto para empezar.',
    price: '14,90€',
    benefit: 'Pensado para prueba, macetas y huerto pequeño.',
    cta: 'Empezar con 1 Litro',
    href: '/producto/te-humus-liquido-premium',
    tabActive: 'border-green-600 text-green-700 bg-green-50',
    cardBg: 'bg-green-50',
    cardBorder: 'border-green-200',
    labelColor: 'text-green-700',
    benefitBg: 'bg-green-50 text-green-700',
    ctaBtn: 'bg-green-600 hover:bg-green-700',
    iconBox: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    tip: '1 litro trata hasta 100L de agua de riego — te dura toda la temporada en un huerto doméstico.',
  },
  {
    id: 'familiar',
    icon: TreePine,
    label: 'Huerto Familiar',
    description: 'Tengo un huerto de más de 20m² con tomates, pimientos y rotación de cultivos. Busco continuidad y una reposición razonable.',
    pain: 'Quiero evitar quedarme corto de producto a mitad de temporada.',
    format: '5 Litros — el más vendido, el más equilibrado.',
    price: '49,90€',
    benefit: '500 litros de riego. Ahorra un 33% vs. formato pequeño.',
    cta: 'El más vendido → 5 Litros',
    href: '/producto/te-humus-liquido-premium',
    tabActive: 'border-primary text-primary bg-primary/8',
    cardBg: 'bg-primary/5',
    cardBorder: 'border-primary/25',
    labelColor: 'text-primary',
    benefitBg: 'bg-primary/8 text-primary',
    ctaBtn: 'bg-primary hover:bg-brand-green-hover',
    iconBox: 'bg-primary/10 border-primary/20',
    iconColor: 'text-primary',
    tip: 'Nuestro formato más comprado. Rinde una temporada completa para huertos de hasta 50m².',
    featured: true,
  },
  {
    id: 'profesional',
    icon: FlaskConical,
    label: 'Cultivador PRO',
    description: 'Tengo un invernadero o finca pequeña. Trabajo con goteo y necesito un formato práctico para uso continuado.',
    pain: 'Me importa la compatibilidad operativa y la forma de aplicación, no el marketing inflado.',
    format: '10 Litros — para quien no quiere quedarse sin stock.',
    price: '79,90€',
    benefit: 'Formato pensado para reposición y uso recurrente.',
    cta: 'Uso Continuado → 10 Litros',
    href: '/producto/te-humus-liquido-premium',
    tabActive: 'border-brand-olive text-secondary bg-muted',
    cardBg: 'bg-muted',
    cardBorder: 'border-border/60',
    labelColor: 'text-secondary',
    benefitBg: 'bg-muted text-secondary',
    ctaBtn: 'bg-secondary hover:bg-brand-olive-dark',
    iconBox: 'bg-muted border-border/50',
    iconColor: 'text-secondary',
    tip: 'Si trabajas con riego, conviene revisar filtrado, mezcla y ficha técnica antes de escalar la aplicación.',
  },
  {
    id: 'finca',
    icon: Tractor,
    label: 'Finca Ecológica',
    description: 'Tengo olivar, cítricos o cultivos extensivos. Uso fertirrigación y necesito volumen, orden de compra y lectura técnica básica.',
    pain: 'Busco continuidad de suministro y un formato alineado con el ritmo de trabajo de la finca.',
    format: '25 Litros — pensado para continuidad de uso.',
    price: '149,90€',
    benefit: 'Mejor encaje cuando el consumo ya es recurrente.',
    cta: 'Uso Profesional → 25 Litros',
    href: '/producto/te-humus-liquido-premium',
    tabActive: 'border-brand-brown text-brand-brown bg-brand-brown-light',
    cardBg: 'bg-brand-brown-light',
    cardBorder: 'border-brand-brown/25',
    labelColor: 'text-brand-brown',
    benefitBg: 'bg-brand-brown-light text-brand-brown',
    ctaBtn: 'bg-brand-brown hover:bg-brand-brown-dark',
    iconBox: 'bg-brand-brown-light border-brand-brown/20',
    iconColor: 'text-brand-brown',
    tip: 'Útil si ya tienes una rutina clara de aplicación y necesitas comprar con lógica de explotación.',
  },
];

export default function BuyerPersonaSelector() {
  const [selected, setSelected] = useState('familiar');
  const persona = personas.find(p => p.id === selected)!;
  const Icon = persona.icon;

  return (
    <section className="w-full py-20 md:py-28 bg-background border-t border-border/40">
      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/20">
            <Leaf className="w-3.5 h-3.5 text-primary" />
            Tu Biocultor Perfecto
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground mb-5">
            ¿Cuál es tu situación?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Selecciona tu perfil y te mostramos el formato exacto, con la dosis correcta y el precio justo.
          </p>
        </div>

        {/* Persona Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {personas.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-bold transition-all",
                selected === p.id
                  ? p.tabActive
                  : "border-border/50 text-muted-foreground hover:border-primary/25 bg-card"
              )}
            >
              <p.icon className="w-5 h-5 shrink-0" />
              {p.label}
              {p.featured && (
                <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide font-extrabold">
                  Popular
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Persona Card */}
        <div className={cn(
          "max-w-4xl mx-auto rounded-3xl border-2 overflow-hidden transition-all duration-300",
          persona.cardBorder
        )}>
          <div className={cn("p-6 md:p-8", persona.cardBg)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

              {/* Left: Profile */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", persona.iconBox)}>
                    <Icon className={cn("w-6 h-6", persona.iconColor)} />
                  </div>
                  <div>
                    <p className={cn("text-xs font-bold uppercase tracking-widest", persona.labelColor)}>Tu perfil</p>
                    <h3 className="font-heading font-bold text-xl text-foreground">{persona.label}</h3>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-5">{persona.description}</p>

                {/* Pain point */}
                <div className="flex items-start gap-3 bg-background/80 rounded-2xl p-4 border border-border/40">
                  <AlertCircle className="w-5 h-5 shrink-0 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground italic">"{persona.pain}"</p>
                </div>
              </div>

              {/* Right: Recommendation */}
              <div className="flex flex-col gap-4">
                <div className="bg-background rounded-2xl border border-border/40 p-6">
                  <p className={cn("text-xs font-bold uppercase tracking-widest mb-3", persona.labelColor)}>
                    Te recomendamos
                  </p>
                  <p className="font-heading font-bold text-lg text-foreground mb-2">{persona.format}</p>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-display font-black text-foreground">{persona.price}</span>
                    <span className="text-sm text-muted-foreground">IVA incl.</span>
                  </div>

                  <div className={cn("text-sm font-medium px-3 py-2 rounded-xl mb-5", persona.benefitBg)}>
                    ✓ {persona.benefit}
                  </div>

                  <Link
                    href={persona.href}
                    className={cn(
                      "flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 hover:scale-[1.02]",
                      persona.ctaBtn
                    )}
                  >
                    {persona.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Pro tip */}
                <div className="bg-background/60 rounded-xl p-4 border border-border/30 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0 text-yellow-500 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {persona.tip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

