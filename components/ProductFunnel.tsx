"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Calculator,
  Star,
  Truck,
  ShieldCheck,
  Check,
  Droplet,
  Sprout,
  Leaf,
  Zap,
  ShoppingBag,
} from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { cn } from "@/lib/utils"
import UrgencyModule from "@/components/UrgencyModule"
import AnchoringBanner from "@/components/AnchoringBanner"
import PremiumAudioPlayer from "@/components/PremiumAudioPlayer"
import SocialProofTicker from "@/components/SocialProofTicker"
import { useUserProfileStore, type CropProfile } from "@/store/userProfileStore"
import { trackEcommerceEvent } from "@/lib/ecommerce-events"

// ─── Copy contextual por perfil de cultivo ─────────────────────────────────
type VisualCard = { icon: React.ElementType; label: string; sub: string }

type ProductFunnelProduct = {
  name: string
  description: string
}

type ProductFunnelVariant = {
  id: string
  sku?: string | null
  size: string
  target: string
  price: number
  comparePrice?: number | null
  popular?: boolean
  stock?: number | null
  features: string[]
  imagePath?: string | null
  image?: string | null
}

function getContextualCards(profile: CropProfile): VisualCard[] {
  switch (profile) {
    case "olivicultor":
      return [
        {
          icon: Leaf,
          label: "Fertirrigación sin atascos",
          sub: "Compatible con goteo en olivar",
        },
        {
          icon: Droplet,
          label: "Activación de suelo calcáreo",
          sub: "Desbloquea nutrientes en suelo básico",
        },
        {
          icon: Sprout,
          label: "Escala por litro",
          sub: "Ahorro real en explotaciones grandes",
        },
      ]
    case "horticultor":
      return [
        {
          icon: Sprout,
          label: "Huerto activo todo el año",
          sub: "Ciclos cortos, suelo siempre vivo",
        },
        {
          icon: Leaf,
          label: "Suelo vivo desde raíz",
          sub: "Estimulación radicular continua",
        },
        {
          icon: Droplet,
          label: "Desde semillero a cosecha",
          sub: "Dosis adaptable a cada etapa",
        },
      ]
    case "viticultor":
      return [
        {
          icon: Leaf,
          label: "Inoculante de brotación",
          sub: "Activa el suelo antes de la brotación",
        },
        {
          icon: Sprout,
          label: "Perfil de suelo sostenido",
          sub: "Mejora progresiva temporada a temporada",
        },
        {
          icon: Droplet,
          label: "Aplicación en goteo",
          sub: "Compatible con sistemas de riego en viñedo",
        },
      ]
    case "citricos":
      return [
        {
          icon: Droplet,
          label: "Riego localizado",
          sub: "Óptimo para naranjo y limonero",
        },
        {
          icon: Sprout,
          label: "Disponibilidad de nutrientes",
          sub: "Desbloquea el suelo arcilloso",
        },
        {
          icon: Leaf,
          label: "Entrega en 36h a Levante",
          sub: "Logística directa a la finca",
        },
      ]
    case "jardinero":
      return [
        {
          icon: Leaf,
          label: "Plantas sanas sin químicos",
          sub: "Apto para jardín y terraza urbana",
        },
        {
          icon: Sprout,
          label: "Suelo vivo en maceta",
          sub: "Activa el sustrato compactado",
        },
        {
          icon: Droplet,
          label: "Aplicación directa",
          sub: "Sin cálculos complejos de dosis",
        },
      ]
    case "vivero":
      return [
        {
          icon: Sprout,
          label: "Producción profesional",
          sub: "Formatos de 25L para reposición fiable",
        },
        {
          icon: Leaf,
          label: "Planta ornamental",
          sub: "Integrado en calendario de vivero",
        },
        {
          icon: Droplet,
          label: "Packaging resistente",
          sub: "Aguanta el transporte sin mermas",
        },
      ]
    case "ecologico":
      return [
        {
          icon: Leaf,
          label: "Coherente con producción eco",
          sub: "Ficha técnica verificable",
        },
        {
          icon: Sprout,
          label: "Sin presión de venta",
          sub: "Asesoría técnica incluida",
        },
        {
          icon: Droplet,
          label: "Uso controlado",
          sub: "Dosis claras y documentadas",
        },
      ]
    default:
      return [
        { icon: Leaf, label: "Uso orientado", sub: "Huerto, jardín y cultivo" },
        {
          icon: Droplet,
          label: "Aplicación clara",
          sub: "Riego o pulverización",
        },
        {
          icon: Sprout,
          label: "Compra por formato",
          sub: "Escala doméstica o profesional",
        },
      ]
  }
}

export default function ProductFunnel({
  product,
  dbVariants,
}: {
  product: ProductFunnelProduct
  dbVariants: ProductFunnelVariant[]
}) {
  const { addItem } = useCartStore()
  const { cropProfile } = useUserProfileStore()
  const defaultVariant = dbVariants.find((v) => v.popular) || dbVariants[0]
  const [selected, setSelected] = useState(defaultVariant)
  const [activeTab, setActiveTab] = useState<"modo" | "envio" | "ciencia">(
    "modo"
  )
  const [quantity, setQuantity] = useState(1)
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
  const isOutOfStock = !selected || !selected.stock || selected.stock <= 0

  // Tarjetas de psicología visual adaptadas al perfil detectado
  const contextualCards = getContextualCards(cropProfile)

  const handleAddToCart = () => {
    addItem({
      id: selected.id,
      name: product.name,
      size: selected.size,
      price: selected.price,
      image: selected.imagePath || selected.image || "",
      quantity,
      sku: selected.sku || undefined,
    })
    trackEcommerceEvent("add_to_cart", {
      value: selected.price * quantity,
      items: [
        {
          item_id: selected.sku ?? selected.id,
          item_name: product.name,
          item_variant: selected.size,
          price: selected.price,
          quantity,
        },
      ],
    })
  }

  // `comparePrice` representa el coste equivalente si el cliente comprara
  // los mismos litros en envases de 1 L (ej. 5 L: 5 × precio del 1 L). NO es
  // un "precio anterior" — por eso evitamos el tachado con "Ahorra X%" y lo
  // mostramos como una comparación de tarifa unitaria (€/L), legal bajo
  // Directiva Omnibus 2019/2161 / RD 7/2021.
  const liters = parseInt(selected.size?.match(/\d+/)?.[0] ?? "1", 10)
  const pricePerLiter = liters > 0 ? selected.price / liters : selected.price

  // Buscamos automáticamente el precio de la variante de 1L (si existe)
  // para usarlo como precio de referencia por litro, evitando que el usuario
  // tenga que calcular el comparePrice multiplicando en el dashboard.
  const oneLiterVariant = dbVariants.find(
    (v) => parseInt(v.size?.match(/\d+/)?.[0] ?? "0", 10) === 1
  )
  const referencePerLiter = oneLiterVariant ? oneLiterVariant.price : null

  const perLiterDiscount =
    referencePerLiter && referencePerLiter > pricePerLiter
      ? Math.round(
          ((referencePerLiter - pricePerLiter) / referencePerLiter) * 100
        )
      : 0

  const getModoDeUso = () => {
    switch (selected.sku) {
      case "BIO-1L":
        return "Aplicación ideal para macetas y jardines pequeños. Diluye tapón y medio en 5 litros de agua y pulveriza directamente en hojas y base."
      case "BIO-5L":
        return "Pensado para huertos familiares. Conecta a la regadera o mochila sulfatadora. Dilución óptima: 1L por cada 100L de agua sin cloro."
      case "BIO-10L":
        return "Para invernaderos y cultivos avanzados. Formato pensado para uso continuado y preparación controlada en sistemas de riego."
      default:
        return "Formatos industriales (25L+). Uso directo en balsas de riego y sistemas de inyección Venturi a dosis calibrada según ficha técnica."
    }
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-24">
      {/* =========================================
          SECCIÓN HERO (2 COLUMNAS)
      ========================================= */}
      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:gap-20">
        {/* 📸 COLUMNA IZQUIERDA: GALERÍA (STICKY SOLO EN DESKTOP) */}
        <div className="relative order-2 flex w-full flex-col gap-3 md:gap-4 lg:sticky lg:top-36 lg:order-1 lg:w-[45%] lg:self-start">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-cream-warm p-6 shadow-sm transition-all hover:border-primary/20 md:rounded-3xl md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent" />
            <Image
              src={selected.imagePath || selected.image || "/5 litros.jpg"}
              alt={selected.size}
              fill
              sizes="(max-width: 1023px) calc(100vw - 48px), (max-width: 1279px) 40vw, (max-width: 1535px) 36vw, 560px"
              className="object-contain transition-transform duration-700 ease-out md:hover:scale-105"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {dbVariants.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelected(v)}
                className={cn(
                  "relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl border bg-cream-warm p-1.5 transition-all duration-300 md:rounded-2xl md:p-2",
                  selected.id === v.id
                    ? "border-primary/50 opacity-100 shadow-sm ring-2 ring-primary/15"
                    : "border-border/40 opacity-50 hover:border-border hover:opacity-100"
                )}
              >
                <Image
                  src={v.imagePath || v.image || "/1 litro.jpg"}
                  alt={v.size}
                  fill
                  sizes="(max-width: 1023px) calc((100vw - 72px) / 4), 120px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* Reproductor de Audio Premium (Bajo las Thumbnails) */}
          <div className="mt-2 w-full">
            <PremiumAudioPlayer
              src={
                selected.sku?.startsWith("ORT-")
                  ? `/audio/${selected.sku}.mp3`
                  : `/audio/${selected.size.toLowerCase().replace(" ", "-")}.mp3`
              }
              title={`Explicación formato ${selected.size}`}
            />
          </div>
        </div>

        {/* 🚀 COLUMNA DERECHA: EMBUDO DE CONVERSIÓN */}
        <div className="order-1 flex w-full flex-col gap-5 pt-1 md:gap-8 lg:order-2 lg:w-[55%] lg:pt-2">
          {/* Cabecera, Autoridad & Trust */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 md:mb-4">
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase md:text-xs">
                Uso Profesional
              </span>
              <span className="hidden text-border sm:block">|</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5">
                <Star className="h-4 w-4 text-primary" />
                <span className="ml-1 text-[11px] font-medium text-foreground/80 md:text-sm">
                  Formato y uso explicados con claridad
                </span>
              </div>
            </div>
            <h1 className="font-heading text-3xl leading-[1.10] font-bold tracking-tight text-foreground md:text-[2.5rem] md:leading-[1.15]">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-relaxed font-light text-muted-foreground md:mt-4 md:text-lg">
              {product.description}
            </p>
          </div>

          {/* Selector de Formatos */}
          <div className="mt-1 md:mt-2">
            <div className="mb-3 flex items-center justify-between md:mb-4">
              <h3 className="font-heading text-base font-bold text-foreground md:text-lg">
                Selecciona tu formato
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {dbVariants.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelected(v)}
                  className={cn(
                    "group relative flex cursor-pointer flex-col rounded-xl border p-2.5 transition-all md:rounded-2xl md:p-4",
                    selected.id === v.id
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-border/40 bg-transparent active:bg-muted/40 lg:hover:border-primary/25"
                  )}
                >
                  {v.popular && (
                    <div className="absolute -top-2.5 right-2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold tracking-wide whitespace-nowrap text-white uppercase shadow-sm md:right-3 md:text-[10px]">
                      Recomendado
                    </div>
                  )}
                  <span className="text-base font-semibold text-foreground md:text-lg">
                    {v.size}
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium text-muted-foreground md:text-xs">
                    {v.target}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Selector de cantidad */}
          <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-cream-warm p-3.5 md:p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Cantidad</p>
              <p className="text-xs text-muted-foreground">
                Ahorra más comprando varios
              </p>
            </div>
            <div className="flex items-center gap-0 overflow-hidden rounded-xl border border-border/60 bg-background">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-lg font-bold text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                aria-label="Reducir cantidad"
              >
                −
              </button>
              <span className="w-10 text-center text-base font-bold text-foreground">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="flex h-10 w-10 items-center justify-center text-lg font-bold text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          {/* Bloque Maestro de Compra */}
          <div className="relative mt-1 rounded-2xl border border-border/50 bg-cream-warm p-4 md:mt-2 md:rounded-3xl md:p-8">
            <div className="mb-3 flex items-end justify-between md:mb-8">
              <div className="flex flex-col">
                {perLiterDiscount > 0 && (
                  <div className="mb-1.5 flex items-center gap-2 md:mb-2 md:gap-3">
                    <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-bold tracking-wide text-secondary md:px-2.5 md:text-xs">
                      −{perLiterDiscount}% por litro vs formato 1 L
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-1 md:gap-2">
                  <span className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                    €{(selected.price * quantity).toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground md:text-sm">
                    IVA incl.
                  </span>
                </div>
                {liters > 1 && referencePerLiter ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {pricePerLiter.toFixed(2)} €/L · vs{" "}
                    {referencePerLiter.toFixed(2)} €/L del formato 1 L
                  </p>
                ) : liters > 1 ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {pricePerLiter.toFixed(2)} €/L
                  </p>
                ) : null}
                {quantity > 1 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {quantity}× €{selected.price.toFixed(2)} c/u
                  </p>
                )}
              </div>
            </div>

            {/* Social Proof Ticker reposicionado bajo el precio */}
            <div className="-mt-2 mb-6 hidden md:block">
              <SocialProofTicker />
            </div>

            {isMaintenance ? (
              <Button
                size="lg"
                disabled
                className="h-12 w-full cursor-not-allowed rounded-xl border border-border bg-muted/80 text-base font-bold text-muted-foreground shadow-none md:h-14 md:rounded-2xl md:text-lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5 opacity-50" />
                Compras Suspendidas (Mantenimiento)
              </Button>
            ) : isOutOfStock ? (
              <Button
                size="lg"
                disabled
                className="h-12 w-full cursor-not-allowed rounded-xl border border-border bg-muted/80 text-base font-bold text-muted-foreground shadow-none md:h-14 md:rounded-2xl md:text-lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5 opacity-50" />
                Agotado Temporalmente
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="h-12 w-full cursor-pointer rounded-xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/15 transition-all hover:scale-[1.01] hover:bg-brand-green-hover active:scale-[0.99] md:h-14 md:rounded-2xl md:text-lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Añadir al Carrito
              </Button>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/40 pt-3 md:mt-6 md:gap-4 md:pt-5">
              <div className="flex items-center gap-2 md:gap-3">
                <Truck className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                <div className="flex flex-col">
                  <span className="text-xs leading-tight font-medium text-foreground md:text-sm">
                    Envío 24/48h
                  </span>
                  <span className="text-[9px] text-muted-foreground md:text-[10px]">
                    Gratuito en todos los formatos
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <ShieldCheck className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                <div className="flex flex-col">
                  <span className="text-xs leading-tight font-medium text-foreground md:text-sm">
                    Garantía Segura
                  </span>
                  <span className="text-[9px] text-muted-foreground md:text-[10px]">
                    Pagos Cifrados
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pruebas y urgencia: quedan después de la decisión de compra para no tapar el CTA móvil */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-3">
            {contextualCards.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-row items-center gap-3 rounded-xl border border-border/60 bg-transparent p-3 text-left transition-colors hover:border-primary/25 sm:flex-col sm:items-start sm:gap-2 sm:text-left md:rounded-2xl md:p-4"
              >
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <span className="block text-[13px] font-semibold text-foreground/90 md:text-sm">
                    {label}
                  </span>
                  <span className="hidden text-[11px] text-muted-foreground sm:block md:text-xs">
                    {sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <UrgencyModule stock={0} />

          <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-5">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  ¿Comprar o contratar aplicación?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Si tienes más de 300 m², césped irregular o un jardín de alto
                  valor, calcula el servicio antes de decidir litros y dosis.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                className="rounded-full bg-primary text-white hover:bg-brand-green-hover"
              >
                <Link href="/calculadoras#presupuesto">
                  Calcular servicio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/servicios">Ver aplicación profesional</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          ANCHORING — Precio vs. competencia
      ========================================= */}
      <div className="mx-auto mt-2 w-full max-w-4xl px-0 sm:px-4">
        <AnchoringBanner />
      </div>

      {/* =========================================
          SECCIÓN TABS (FULL WIDTH OUTSIDE)
      ========================================= */}
      <div className="mx-auto mt-4 w-full max-w-4xl px-0 sm:px-4 md:mt-8">
        <div className="hide-scrollbar mb-6 flex items-center justify-start gap-2 overflow-x-auto border-b border-border/40 px-4 pb-0 sm:justify-center sm:gap-4 sm:px-0 md:mb-8">
          {[
            { key: "modo" as const, label: "Cómo Utilizarlo" },
            { key: "ciencia" as const, label: "Nuestra Ciencia" },
            { key: "envio" as const, label: "Envíos y Retornos" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "border-b-2 px-2 py-3 text-xs font-semibold whitespace-nowrap transition-all md:py-4 md:text-base",
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mx-4 min-h-[200px] rounded-2xl border border-border/30 bg-card p-5 py-2 shadow-sm sm:mx-0 md:rounded-3xl md:p-10">
          {activeTab === "modo" && (
            <div className="flex animate-in flex-col items-start gap-6 duration-500 fade-in md:flex-row md:gap-8">
              <div className="flex-1">
                <h4 className="mb-3 font-heading text-base font-bold text-foreground md:mb-4 md:text-lg">
                  Protocolo para formato de {selected.size}
                </h4>
                <p className="mb-5 text-sm leading-relaxed font-light text-muted-foreground md:mb-6 md:text-base">
                  {getModoDeUso()}
                </p>
                <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4 md:rounded-2xl md:p-5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary md:h-5 md:w-5" />
                  <p className="text-[13px] font-light text-foreground/80 md:text-base">
                    <strong className="mb-1 block font-medium text-foreground">
                      Compatibilidad a revisar caso por caso.
                    </strong>
                    Antes de mezclar con otros insumos conviene revisar la
                    combinación concreta y hacer una prueba pequeña.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ciencia" && (
            <div className="animate-in duration-500 fade-in">
              <h4 className="mb-4 font-heading text-base font-bold text-foreground md:mb-6 md:text-lg">
                Características del formato
              </h4>
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                {selected.features.map((feature: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/50 p-3 transition-colors md:gap-4 md:rounded-2xl md:p-4 md:hover:border-primary/20"
                  >
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary md:h-5 md:w-5" />
                    <span className="text-sm font-medium text-foreground/90 md:text-base">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "envio" && (
            <div className="flex animate-in flex-col gap-6 duration-500 fade-in md:flex-row md:gap-8">
              <div className="flex flex-1 flex-col gap-2">
                <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 md:mb-2 md:h-12 md:w-12 md:rounded-xl">
                  <Truck className="h-5 w-5 text-primary md:h-6 md:w-6" />
                </div>
                <h4 className="font-heading text-sm font-bold text-foreground md:text-lg">
                  Logística del pedido
                </h4>
                <p className="mt-1 text-sm leading-relaxed font-light text-muted-foreground md:text-base">
                  El pedido se gestiona con operadores logísticos disponibles
                  para la tienda. Los plazos concretos dependen del destino y
                  del servicio seleccionado.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 md:mb-2 md:h-12 md:w-12 md:rounded-xl">
                  <ShieldCheck className="h-5 w-5 text-primary md:h-6 md:w-6" />
                </div>
                <h4 className="font-heading text-sm font-bold text-foreground md:text-lg">
                  Incidencias y soporte
                </h4>
                <p className="mt-1 text-sm leading-relaxed font-light text-muted-foreground md:text-base">
                  Si el pedido llega con incidencia o necesitas soporte, la
                  gestión se hace según las condiciones publicadas y el canal de
                  atención disponible.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
