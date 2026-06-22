"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import {
  Check,
  Leaf,
  Droplet,
  Sprout,
  Tractor,
  ShoppingBag,
  ArrowRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useCartStore } from "@/store/cartStore"
import PremiumAudioPlayer from "@/components/PremiumAudioPlayer"
import { trackEcommerceEvent } from "@/lib/ecommerce-events"

// Metadatos de UI únicamente — sin precios. Los precios SIEMPRE vienen de dbVariants (base de datos).
const formats = [
  {
    id: "1L",
    size: "1 Litro",
    target: "Jardinero Urbano",
    icon: Leaf,
    popular: false,
    features: [
      "Para 100 litros de riego",
      "Aplicación foliar y radicular",
      "Perfecto para probar",
    ],
    image: "/1%20litro.jpg",
  },
  {
    id: "5L",
    size: "5 Litros",
    target: "Huerto Familiar",
    icon: Droplet,
    popular: true,
    features: [
      "Para 500 litros de riego",
      "Tratamiento de choque",
      "33% más barato por litro vs formato 1 L",
    ],
    image: "/5%20litros.jpg",
  },
  {
    id: "10L",
    size: "10 Litros",
    target: "Cultivador PRO",
    icon: Sprout,
    popular: false,
    features: [
      "Para 1000 litros de riego",
      "Formato de uso continuado",
      "46% más barato por litro vs formato 1 L",
    ],
    image: "/10%20litros.jpg",
  },
  {
    id: "25L",
    size: "25 Litros",
    target: "Finca Ecológica",
    icon: Tractor,
    popular: false,
    features: [
      "Para 2500 litros de riego",
      "Uso agrícola a gran escala",
      "60% más barato por litro vs formato 1 L",
    ],
    image: "/25%20litros.jpg",
  },
]

import type { Variant } from "@/generated/prisma"

interface MergedFormat {
  id: string
  size: string
  target: string
  price: number | null
  pricePerLiter: number | null
  popular: boolean
  features: string[]
  image: string
  sku?: string
  stock: number
  hasDbData: boolean
  icon: LucideIcon
}

export default function FormatSelector({
  dbVariants = [],
  productSlug = "te-humus-liquido-premium",
}: {
  dbVariants?: Variant[]
  productSlug?: string
}) {
  // Los precios y datos de negocio vienen EXCLUSIVAMENTE de dbVariants (base de datos).
  // Los metadatos de UI (iconos, imagen fallback, features base) vienen del array estático.
  const mergedFormats: MergedFormat[] = formats.map((f) => {
    const dbMatch = dbVariants.find((dbF) => dbF.size === f.size)
    if (dbMatch) {
      const literCount = parseInt(f.size.split(" ")[0]) || 1
      return {
        ...f,
        id: dbMatch.id,
        target: dbMatch.target,
        price: dbMatch.price as number, // precio de la DB — única fuente de verdad
        pricePerLiter: (dbMatch.price as number) / literCount,
        popular: dbMatch.popular,
        features: Array.isArray(dbMatch.features)
          ? dbMatch.features
          : (dbMatch.features as string)?.split(",") || [],
        image: dbMatch.imagePath || f.image,
        stock: dbMatch.stock ?? 12,
        sku: dbMatch.sku || undefined,
        hasDbData: true,
      }
    }
    // Sin match en DB: el formato se muestra pero sin precio
    return {
      ...f,
      price: null,
      pricePerLiter: null,
      stock: 0, // sin datos de DB = sin stock seguro
      hasDbData: false,
    }
  })

  const [selectedFormat, setSelectedFormat] = useState(
    mergedFormats.length > 1 ? mergedFormats[1].id : formats[0].id
  )
  const { addItem } = useCartStore()

  const handleAction = (format: MergedFormat) => {
    if (selectedFormat === format.id) {
      addItem({
        id: format.id,
        name: "Té de Humus Biocultor",
        size: format.size,
        price: format.price ?? 0,
        image: format.image,
      })
      trackEcommerceEvent("add_to_cart", {
        value: format.price ?? 0,
        items: [
          {
            item_id: format.sku ?? format.id,
            item_name: "Té de Humus Biocultor",
            item_variant: format.size,
            price: format.price ?? 0,
            quantity: 1,
          },
        ],
      })
    } else {
      setSelectedFormat(format.id)
    }
  }

  return (
    <section
      id="formatos"
      className="relative z-10 w-full border-t border-border/40 bg-card py-20 md:py-28"
    >
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(200,169,110,0.06),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(90,107,42,0.04),transparent_40%)] opacity-30" />

      <div className="relative z-10 mx-auto w-[92%] px-4 lg:w-[80%] xl:w-[75%]">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="leaf-divider mx-auto mb-6 w-24">
            <Leaf className="h-4 w-4 text-primary" />
          </div>
          <h2 className="mb-5 font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Elige el formato perfecto
            <br className="hidden md:block" /> para tu cultivo.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Cada formato está pensado para una escala distinta de uso, desde
            prueba doméstica hasta reposición profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {mergedFormats.map((format) => {
            const Icon = format.icon
            const isSelected = selectedFormat === format.id
            const isMaintenance =
              process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
            const isOutOfStock = !format.stock || format.stock <= 0

            return (
              <div
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={cn(
                  "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 bg-background p-6 transition-all duration-400 md:rounded-3xl",
                  isSelected
                    ? "-translate-y-2 border-primary shadow-xl ring-1 shadow-primary/8 ring-primary/15"
                    : "border-border/50 shadow-sm hover:-translate-y-1 hover:border-primary/25"
                )}
              >
                {/* Popular badge */}
                {format.popular && (
                  <div className="absolute top-0 right-0 z-20 rounded-bl-2xl bg-primary px-4 py-1.5 text-[10px] font-extrabold tracking-wide text-white uppercase">
                    Más Vendido
                  </div>
                )}

                {/* Gold corner accent when selected */}
                {isSelected && (
                  <div className="pointer-events-none absolute top-0 left-0 h-16 w-16 rounded-br-[2rem] bg-gradient-to-br from-primary/8 to-transparent" />
                )}

                {/* Product Image — clickable link to product page */}
                <Link
                  href={`/producto/${productSlug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="group/img relative mb-5 block aspect-square w-full cursor-pointer overflow-hidden rounded-2xl bg-cream-warm/50 p-3"
                  aria-label={`Ver ficha del producto ${format.size}`}
                >
                  <Image
                    src={format.image}
                    alt={`Formato ${format.size} — Té de Humus Biocultor`}
                    fill
                    sizes="(max-width: 480px) 380px, (max-width: 768px) 600px, (max-width: 1280px) 400px, 480px"
                    quality={80}
                    className="object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end justify-center bg-primary/0 pb-3 opacity-0 transition-colors duration-300 group-hover/img:bg-primary/5 group-hover/img:opacity-100">
                    <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-foreground shadow-md">
                      Ver producto <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>

                {/* Format Info */}
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={cn(
                      "rounded-xl p-2.5 transition-all",
                      isSelected
                        ? "bg-primary/12 text-primary"
                        : "bg-muted/60 text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      {format.size}
                    </h3>
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {format.target}
                    </p>
                  </div>
                </div>

                {/* Price — siempre desde la DB */}
                <div className="mt-2 mb-5">
                  {format.price != null ? (
                    <>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-extrabold tracking-tighter text-foreground md:text-4xl">
                          €{format.price.toFixed(2)}
                        </span>
                      </div>
                      {format.pricePerLiter != null && (
                        <p className="mt-1 text-sm font-medium text-primary">
                          {format.pricePerLiter.toFixed(2)}€ / litro
                        </p>
                      )}
                    </>
                  ) : (
                    <div
                      className="h-10 w-28 animate-pulse rounded-lg bg-muted/60"
                      aria-label="Cargando precio"
                    />
                  )}
                </div>

                {/* Features */}
                <ul className="mb-7 flex flex-1 flex-col gap-2.5">
                  {format.features.map((feature: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Reproductor de Audio Premium en cada tarjeta */}
                <div className="mb-5" onClick={(e) => e.stopPropagation()}>
                  <PremiumAudioPlayer
                    src={`/audio/${format.size.toLowerCase().replace(" ", "-")}.mp3`}
                    title="Explicación técnica"
                  />
                </div>

                {/* Botones de acción */}
                <div
                  className="flex flex-col gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isMaintenance ? (
                    <Button
                      size="lg"
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-border bg-muted/80 text-sm font-bold text-muted-foreground shadow-none transition-all"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4 opacity-50" />
                      Compras Suspendidas
                    </Button>
                  ) : isOutOfStock ? (
                    <Button
                      size="lg"
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-border bg-muted/80 text-sm font-bold text-muted-foreground shadow-none transition-all"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4 opacity-50" />
                      Agotado
                    </Button>
                  ) : !isSelected ? (
                    <Button
                      size="lg"
                      onClick={() => setSelectedFormat(format.id)}
                      className="w-full cursor-pointer rounded-xl border-2 border-primary/40 bg-transparent text-sm font-bold text-primary transition-all hover:border-primary hover:bg-primary/5"
                    >
                      Seleccionar Formato
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={() => handleAction(format)}
                      className="w-full cursor-pointer rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/10 transition-all hover:scale-[1.01] hover:bg-brand-green-hover active:scale-[0.99]"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Añadir al Carrito
                    </Button>
                  )}
                  <Link
                    href={`/producto/${productSlug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full rounded-xl border border-border/60 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    aria-label={`Ver ficha de producto - formato ${format.size}`}
                  >
                    Ver ficha de producto
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
