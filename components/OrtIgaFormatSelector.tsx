'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Check, Leaf, Droplet, Sprout, Tractor, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import PremiumAudioPlayer from '@/components/PremiumAudioPlayer';

const formats = [
  {
    id: 'ORT-1L',
    size: '1 Litro',
    target: 'Jardinero Urbano',
    price: 9.95,
    pricePerLiter: 9.95,
    icon: Leaf,
    popular: false,
    features: ['Para 100L de riego', 'Aplicación foliar y radicular', 'Perfecto para probar'],
    image: '/1%20litro.jpg',
  },
  {
    id: 'ORT-5L',
    size: '5 Litros',
    target: 'Huerto Familiar',
    price: 19.95,
    pricePerLiter: 3.99,
    icon: Droplet,
    popular: true,
    features: ['Para 500L de riego', 'Tratamiento de choque', '40% más barato por litro vs 1 L'],
    image: '/5%20litros.jpg',
  },
  {
    id: 'ORT-10L',
    size: '10 Litros',
    target: 'Cultivador PRO',
    price: 34.95,
    pricePerLiter: 3.50,
    icon: Sprout,
    popular: false,
    features: ['Para 1000L de riego', 'Formato de uso continuado', '52% más barato por litro vs 1 L'],
    image: '/10%20litros.jpg',
  },
  {
    id: 'ORT-25L',
    size: '25 Litros',
    target: 'Finca Ecológica',
    price: 69.95,
    pricePerLiter: 2.80,
    icon: Tractor,
    popular: false,
    features: ['Para 2500L de riego', 'Uso agrícola a gran escala', '64% más barato por litro vs 1 L'],
    image: '/25%20litros.jpg',
  }
];

const PRODUCT_SLUG = 'purin-ortiga-concentrado';

export default function OrtIgaFormatSelector({ dbVariants = [] }: { dbVariants?: any[] }) {
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
        image: dbMatch.imagePath || dbMatch.image || f.image,
        sku: dbMatch.sku,
      };
    }
    return f;
  });

  const [selectedFormat, setSelectedFormat] = useState(mergedFormats.length > 1 ? mergedFormats[1].id : formats[0].id);
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent, format: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: format.id,
      name: 'Purín de Ortiga Concentrado',
      size: format.size,
      price: format.price,
      image: format.image,
      sku: format.sku,
    });
  };

  return (
    <section id="formatos-purin" className="w-full py-20 md:py-28 bg-cream-warm relative border-t border-border/40">
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_80%_50%,rgba(90,107,42,0.06),transparent_50%)]" />

      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="leaf-divider w-24 mx-auto mb-6">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/15">
            <Leaf className="w-3.5 h-3.5" />
            También en catálogo
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-5 text-foreground tracking-tight">
            Purín Concentrado de Ortiga.
            <br className="hidden md:block" />
            <span className="text-primary">4 formatos por escala.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Extracto vegetal concentrado para huerto urbano, rosales, frutales y explotaciones
            con manejo orgánico. Misma lógica de formato que el té de humus: elige por escala de uso.
          </p>
          <Link
            href="/purin-de-ortiga"
            className="inline-flex items-center mt-4 text-sm font-bold text-primary hover:text-primary/80 transition-colors gap-1"
          >
            Aplicaciones por cultivo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-6">
          {mergedFormats.map((format) => {
            const Icon = format.icon;
            const isSelected = selectedFormat === format.id;

            return (
              <div
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={cn(
                  "relative flex flex-col rounded-2xl md:rounded-3xl border-2 transition-all duration-400 cursor-pointer bg-background group",
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
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/8 to-transparent rounded-br-[2rem] pointer-events-none z-10" />
                )}

                {/* Image wrapper con padding igual que FormatSelector */}
                <div className="px-6 pt-6">
                <a
                  href={`/producto/${PRODUCT_SLUG}`}
                  onClick={(e) => e.stopPropagation()}
                  className="block w-full aspect-square relative mb-5 rounded-2xl overflow-hidden bg-cream-warm/50 p-3 group/img cursor-pointer"
                  aria-label={`Ver producto Purín de Ortiga ${format.size}`}
                >
                  <Image
                    src={format.image}
                    alt={`Purín de Ortiga Concentrado ${format.size} — Biocultor`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover/img:scale-105"
                  />
                  {/* Hover overlay to signal clickability */}
                  <div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/5 transition-colors duration-300 flex items-end justify-center pb-3 opacity-0 group-hover/img:opacity-100">
                    <span className="bg-white/90 text-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      Ver producto <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </a>
                </div>

                {/* Card content */}
                <div className="flex flex-col flex-1 px-6 pb-6">
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

                  {/* Audio Player */}
                  <div className="mb-5" onClick={(e) => e.stopPropagation()}>
                    <PremiumAudioPlayer
                      src={`/audio/${format.id}.mp3`}
                      title="Explicación técnica"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="lg"
                      disabled
                      className="w-full rounded-xl font-bold transition-all text-sm bg-muted/80 text-muted-foreground border border-border cursor-not-allowed shadow-none hover:bg-muted/80"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2 opacity-50" />
                      Agotado Temporalmente
                    </Button>
                    <a
                      href={`/producto/${PRODUCT_SLUG}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-center py-2.5 rounded-xl border border-border/60 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                      aria-label={`Ver ficha de producto - formato ${format.size}`}
                    >
                      Ver ficha de producto
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
