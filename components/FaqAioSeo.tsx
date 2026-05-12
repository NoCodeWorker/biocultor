'use client';

import { useState } from 'react';
import { ChevronDown, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import StructuredData from './StructuredData';

const faqs = [
  {
    question: '¿Qué es el té de humus de lombriz y para qué sirve?',
    answer: 'El té de humus de lombriz es un extracto líquido obtenido del vermicompost. Se usa como bioestimulante radicular y foliar para mejorar la actividad microbiana del suelo, la disponibilidad de nutrientes y la tolerancia de la planta al estrés. Es compatible con agricultura ecológica y fertirrigación. El resultado depende del cultivo, el suelo y la forma de aplicación.'
  },
  {
    question: '¿Cuánto cuesta el té de humus de lombriz en España?',
    answer: 'En Biocultor los precios son: 1 Litro — 14,90€ · 5 Litros — 49,90€ · 10 Litros — 79,90€ · 25 Litros — 149,90€ (todos con IVA incluido). El envío es gratuito para pedidos superiores a 50€ a toda la Península. La entrega estimada es de 24 a 48 horas en días laborables.'
  },
  {
    question: '¿Cuál es la diferencia entre té de humus líquido y humus sólido?',
    answer: 'El humus sólido (vermicompost) se incorpora directamente al sustrato o al suelo. El té de humus líquido se aplica disuelto en agua, lo que permite distribuirlo mediante sistemas de riego por goteo, aspersión o riego manual. El formato líquido es más práctico para aplicaciones foliares y para cultivos en riego localizado. Ambos aportan microorganismos beneficiosos, pero el líquido actúa de forma más inmediata en la zona radicular.'
  },
  {
    question: '¿El té de humus es apto para agricultura ecológica certificada?',
    answer: 'El vermicompost y sus extractos son compatibles con los principios de la agricultura ecológica regulada por el Reglamento (UE) 2018/848. Sin embargo, la certificación ecológica depende del organismo de control de cada finca y de su pliego de condiciones. Recomendamos verificar la ficha técnica del producto con el asesor o la entidad certificadora antes de la aplicación.'
  },
  {
    question: '¿El extracto de humus huele mal?',
    answer: 'Suele presentar un olor orgánico y terroso propio del producto biológico. No es un olor agresivo en condiciones normales. Si notas un cambio acusado de olor, coloración inusual o separación excesiva, conviene revisar las condiciones de conservación: temperatura, luz directa y tiempo desde la apertura del envase.'
  },
  {
    question: '¿Puedo aplicarlo en sistemas de riego por goteo?',
    answer: 'Está formulado para ser compatible con sistemas de riego, incluido el goteo. La compatibilidad real depende del estado de la instalación, el nivel de filtrado del equipo y la correcta dilución. La recomendación general es realizar una primera prueba controlada en un sector pequeño, verificar que no hay sedimentación ni obstrucción, y ajustar la dosis antes de escalar.'
  },
  {
    question: '¿Con qué frecuencia se aplica y cuál es la dosis?',
    answer: 'La dosis estándar orientativa es de 1 parte de concentrado por cada 100 partes de agua de riego (1%). La frecuencia depende del cultivo y del ciclo vegetativo: en fases activas de crecimiento, cada 7-14 días; en mantenimiento, cada 15-30 días. No hay una fórmula universal: lo recomendable es seguir la guía de uso e ir ajustando según la respuesta del cultivo.'
  },
  {
    question: '¿Se puede usar en huerto urbano y macetas?',
    answer: 'Sí. El formato de 1 Litro está específicamente pensado para huerto urbano, balcón y macetas. Una botella trata hasta 100 litros de agua de riego, lo que equivale a una temporada completa para huertos de menos de 15 m². Se aplica con regadera o pulverizador a la dosis recomendada, sin riesgo de quemar raíces si se respetan las proporciones.'
  },
  {
    question: '¿Cuándo se envía y cuánto tarda en llegar?',
    answer: 'Los pedidos realizados antes de las 13h en días laborables se procesan el mismo día. La entrega estimada es de 24 a 48 horas laborables para toda la Península Ibérica (España continental y Portugal). Las Islas Baleares, Canarias, Ceuta y Melilla tienen plazos y condiciones de envío diferenciadas. El envío es gratuito a partir de 50€ de pedido.'
  },
  {
    question: '¿Qué hago si mi pedido llega con algún problema?',
    answer: 'Si el pedido llega con daños visibles de transporte o en mal estado, contacta con nosotros en soporte@biocultor.com adjuntando fotos del packaging y el número de pedido. Revisamos cada incidencia de forma individual y te indicamos los pasos a seguir según las condiciones de la compra. La comunicación dentro del plazo aplicable es clave para poder gestionarlo.'
  },
];

export default function FaqAioSeo({ suppressSchema = false }: { suppressSchema?: boolean }) {
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
      {/* Schema Injection — solo cuando no está ya en la página padre */}
      {!suppressSchema && (
        <StructuredData
          id="faq-schema"
          data={faqSchema}
        />
      )}
      
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

