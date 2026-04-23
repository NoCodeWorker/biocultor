'use client';

import { useState } from 'react';
import { ChevronDown, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import Script from 'next/script';

const faqs = [
  {
    question: '¿El extracto de humus huele mal?',
    answer: 'Suele presentar un olor orgánico y terroso propio del producto. Si notas un cambio acusado de olor o estado, conviene revisar conservación, temperatura y tiempo de almacenamiento.'
  },
  {
    question: '¿Puedo quemar las raíces si me paso de dosis?',
    answer: 'Conviene respetar la dosis de uso recomendada. Aunque se trata de un producto orientado a manejo orgánico, una aplicación poco controlada nunca es la mejor práctica para suelo, riego o cultivo.'
  },
  {
    question: '¿Obstruirá mis sistemas de riego por goteo?',
    answer: 'Está pensado para aplicarse en sistemas de riego, pero la compatibilidad real depende del estado de la instalación, el filtrado del equipo y la forma de preparación. Si trabajas con goteo, conviene revisar la ficha técnica y hacer una primera prueba controlada.'
  },
  {
    question: '¿Cuánto tiempo tarda en hacer efecto?',
    answer: 'No hay un plazo universal. La respuesta depende del cultivo, el estado del suelo, la frecuencia de uso y el manejo general. Lo razonable es observar evolución dentro de una rutina de aplicación, no esperar un efecto instantáneo y aislado.'
  }
];

export default function FaqAioSeo() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generamos el JSON-LD para Google (Programa de "Rich Snippets" de FAQ)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="w-full py-20 md:py-28 bg-card relative z-10 border-t border-border/40">
      {/* Schema Injection */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 max-w-4xl">
        <div className="text-center mb-14">
          <div className="leaf-divider w-24 mx-auto mb-6">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground mb-5 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Todo lo que necesitas saber antes de elegir formato y modo de uso.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                className={cn(
                  "border rounded-2xl bg-background overflow-hidden transition-all duration-400",
                  isOpen 
                    ? "shadow-lg shadow-primary/5 border-primary/25" 
                    : "border-border/50 hover:border-primary/20 shadow-sm"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 md:py-6 flex items-center justify-between focus:outline-none group"
                >
                  <h3 className={cn(
                    "font-heading font-bold text-base md:text-lg pr-8 transition-colors leading-snug",
                    isOpen ? "text-primary" : "text-foreground group-hover:text-primary/80"
                  )}>
                    {faq.question}
                  </h3>
                  <div className={cn(
                    "p-2 rounded-full transition-all duration-300 shrink-0",
                    isOpen 
                      ? "rotate-180 bg-primary/10 text-primary" 
                      : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                
                <div 
                  className={cn(
                    "px-6 overflow-hidden transition-all duration-400 ease-in-out",
                    isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

