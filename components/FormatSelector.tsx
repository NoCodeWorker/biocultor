'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Check, Leaf, Droplet, Sprout, Tractor, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import PremiumAudioPlayer from '@/components/PremiumAudioPlayer';

const formats = [
  {
    id: '1L',
    size: '1 Litro',
    target: 'Jardinero Urbano',
    price: 14.90,
    pricePerLiter: 14.90,
    icon: Leaf,
    popular: false,
    features: ['Para 100 litros de riego', 'Aplicación foliar y radicular', 'Perfecto para probar'],
    image: '/1%20litro.jpg',
  },
  {
    id: '5L',
    size: '5 Litros',
    target: 'Huerto Familiar',
    price: 49.90,
    pricePerLiter: 9.98,
    icon: Droplet,
    popular: true,
    features: ['Para 500 litros de riego', 'Tratamiento de choque', 'Ahorras un 33%'],
    image: '/5%20litros.jpg',
  },
  {
    id: '10L',
    size: '10 Litros',
    target: 'Cultivador PRO',
    price: 79.90,
    pricePerLiter: 7.99,
    icon: Sprout,
    popular: false,
    features: ['Para 1000 litros de riego', 'Formato de uso continuado', 'Ahorras un 46%'],
    image: '/10%20litros.jpg',
  },
  {
    id: '25L',
    size: '25 Litros',
    target: 'Finca Ecológica',
    price: 149.90,
    pricePerLiter: 5.99,
    icon: Tractor,
    popular: false,
    features: ['Para 2500 litros de riego', 'Uso agrícola a gran escala', 'Ahorras un 60%'],
    image: '/25%20litros.jpg',
  }
];

export default function FormatSelector({ dbVariants = [] }: { dbVariants?: any[] }) {
  // Fusionamos datos dinámicos de SQLite con los iconos locales
  const mergedFormats = formats.map(f => {
     const dbMatch = dbVariants.find(dbF => dbF.size === f.size);
     if (dbMatch) {
       const literCount = parseInt(f.size.split(' ')[0]) || 1;
       return {
         ...f,
         id: dbMatch.id,
         target: dbMatch.target,
         price: dbMatch.price,
         pricePerLiter: dbMatch.price / literCount,
         popular: dbMatch.popular,
         features: Array.isArray(dbMatch.features) ? dbMatch.features : dbMatch.features?.split(',') || [],
         image: dbMatch.imagePath || dbMatch.image || f.image
       }
     }
     return f;
  });

  const [selectedFormat, setSelectedFormat] = useState(mergedFormats.length > 1 ? mergedFormats[1].id : '1L');
  const { addItem } = useCartStore();

  const handleAction = (format: any) => {
    if (selectedFormat === format.id) {
       addItem({
         id: format.id,
         name: "Té de Humus Biocultor",
         size: format.size,
         price: format.price,
         image: format.image,
       });
    } else {
       setSelectedFormat(format.id);
    }
  };

  return (
    <section id="formatos" className="w-full py-20 md:py-28 bg-card relative z-10 border-t border-border/40">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_50%,rgba(200,169,110,0.06),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(90,107,42,0.04),transparent_40%)]" />

      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="leaf-divider w-24 mx-auto mb-6">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-5 text-foreground tracking-tight">
            Elige el formato perfecto
            <br className="hidden md:block" /> para tu cultivo.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Cada formato está pensado para una escala distinta de uso, desde prueba doméstica
            hasta reposición profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-6">
          {mergedFormats.map((format) => {
            const Icon = format.icon;
            const isSelected = selectedFormat === format.id;

            return (
              <div 
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={cn(
                  "relative flex flex-col p-6 rounded-2xl md:rounded-3xl border-2 transition-all duration-400 cursor-pointer bg-background overflow-hidden group",
                  isSelected 
                    ? "border-primary shadow-xl shadow-primary/8 -translate-y-2 ring-1 ring-primary/15" 
                    : "border-border/50 hover:border-primary/25 hover:-translate-y-1 shadow-sm"
                )}
              >
                {/* Popular badge */}
                {format.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-extrabold px-4 py-1.5 rounded-bl-2xl z-20 tracking-wide uppercase">
                    Más Vendido
                  </div>
                )}

                {/* Gold corner accent when selected */}
                {isSelected && (
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/8 to-transparent rounded-br-[2rem] pointer-events-none" />
                )}
                
                {/* Product Image */}
                <div className="w-full aspect-square relative mb-5 rounded-2xl overflow-hidden bg-cream-warm/50 flex items-center justify-center p-3">
                   <Image 
                     src={format.image} 
                     alt={`Formato ${format.size} — Té de Humus Biocultor`} 
                     fill 
                     className="object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover:scale-108" 
                   />
                </div>

                {/* Format Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "p-2.5 rounded-xl transition-all",
                    isSelected ? "bg-primary/12 text-primary" : "bg-muted/60 text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-foreground">{format.size}</h3>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{format.target}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-2 mb-5">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tighter">€{format.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm font-medium text-primary mt-1">{format.pricePerLiter.toFixed(2)}€ / litro</p>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {format.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Reproductor de Audio Premium en cada tarjeta */}
                <div className="mb-5" onClick={(e) => e.stopPropagation()}>
                  <PremiumAudioPlayer 
                    src={`/audio/${format.size.toLowerCase().replace(' ', '-')}.mp3`} 
                    title="Explicación técnica" 
                  />
                </div>

                {/* CTA Button */}
                <Button 
                  size="lg" 
                  onClick={(e) => { e.stopPropagation(); handleAction(format); }}
                  className={cn(
                    "w-full rounded-xl font-bold transition-all text-sm",
                    isSelected 
                      ? "bg-primary hover:bg-brand-green-hover text-white shadow-md shadow-primary/15" 
                      : "bg-muted/80 text-foreground hover:bg-muted"
                  )}
                >
                  {isSelected ? (
                    <><ShoppingBag className="w-4 h-4 mr-2" /> Añadir al Carrito</>
                  ) : (
                    "Seleccionar"
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

