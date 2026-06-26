"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Star, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store/cartStore"
import { trackEcommerceEvent } from "@/lib/ecommerce-events"
import { useProductVariantSelection } from "@/components/ProductVariantSelectionContext"

type StickyCartVariant = {
  id: string
  sku?: string | null
  size: string
  price: number
  stock?: number | null
  popular?: boolean | null
  imagePath?: string | null
  image?: string | null
}

interface StickyCartBarProps {
  variants: StickyCartVariant[]
  productName: string
}

export default function StickyCartBar({
  variants,
  productName,
}: StickyCartBarProps) {
  const [visible, setVisible] = useState(false)
  const { selectedVariantId, selectVariant } = useProductVariantSelection()
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0]
  const { addItem } = useCartStore()
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
  const isOutOfStock =
    !selectedVariant || !selectedVariant.stock || selectedVariant.stock <= 0

  const handleSelectVariant = (
    variant: StickyCartVariant,
    interactionSource: string
  ) => {
    selectVariant(variant.id)
    trackEcommerceEvent("select_item", {
      value: variant.price,
      item_list_name: "sticky_cart_format_selector",
      interaction_source: interactionSource,
      items: [
        {
          item_id: variant.sku ?? variant.id,
          item_name: productName,
          item_variant: variant.size,
          price: variant.price,
          quantity: 1,
        },
      ],
    })
  }

  useEffect(() => {
    let ticking = false
    let rafId: number | null = null
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      rafId = window.requestAnimationFrame(() => {
        // Show after scrolling past 600px (after the main CTA)
        setVisible((current) => {
          const next = window.scrollY > 600
          return current === next ? current : next
        })
        ticking = false
        rafId = null
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant.id,
      name: productName,
      size: selectedVariant.size,
      price: selectedVariant.price,
      image: selectedVariant.imagePath || selectedVariant.image || "",
      sku: selectedVariant.sku || undefined,
    })
    trackEcommerceEvent("add_to_cart", {
      value: selectedVariant.price,
      items: [
        {
          item_id: selectedVariant.sku ?? selectedVariant.id,
          item_name: productName,
          item_variant: selectedVariant.size,
          price: selectedVariant.price,
          quantity: 1,
        },
      ],
    })
  }

  return (
    <div
      className={cn(
        "fixed right-0 bottom-0 left-0 z-40 transition-all duration-500 ease-in-out",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      )}
    >
      {/* Mobile sticky bar */}
      <div className="pb-safe block border-t border-border/60 bg-background px-3 py-2.5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:hidden">
        <div className="flex items-center justify-between gap-2.5">
          {/* Columna 1: Precio */}
          <div className="flex min-w-[50px] shrink-0 flex-col">
            <span className="mb-0.5 text-[9px] leading-none font-medium tracking-wider text-muted-foreground uppercase">
              Total
            </span>
            <p
              className="text-base leading-none font-extrabold tracking-tight text-foreground"
              data-testid="sticky-total"
            >
              <span className="sr-only">Total sticky </span>€
              {selectedVariant.price.toFixed(2)}
            </p>
          </div>

          {/* Columna 2: Pills (Scroll horizontal if needed) */}
          <div className="hide-scrollbar mask-linear-edges flex flex-1 items-center gap-1 overflow-x-auto px-1">
            {variants.map((v) => {
              const shortSize = v.size.replace(/ Litros?/gi, "L")
              return (
                <button
                  key={v.id}
                  onClick={() => handleSelectVariant(v, "sticky_mobile")}
                  data-testid={`sticky-variant-${v.size.replace(/\s+/g, "-").toLowerCase()}`}
                  className={cn(
                    "shrink-0 rounded-md border px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap transition-all",
                    selectedVariant.id === v.id
                      ? "border-primary bg-primary/8 text-secondary"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {shortSize}
                </button>
              )
            })}
          </div>

          {/* Columna 3: Botón Añadir */}
          {isMaintenance ? (
            <button
              disabled
              className="flex shrink-0 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-border bg-muted px-3.5 py-2 font-bold text-muted-foreground"
            >
              <ShoppingBag className="h-4 w-4 opacity-50" />
              <span className="text-xs">Mantenimiento</span>
            </button>
          ) : isOutOfStock ? (
            <button
              disabled
              className="flex shrink-0 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-border bg-muted px-3.5 py-2 font-bold text-muted-foreground"
            >
              <ShoppingBag className="h-4 w-4 opacity-50" />
              <span className="text-xs">Agotado</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              data-testid="sticky-add-to-cart"
              className="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 font-bold text-white shadow-md shadow-primary/10 transition-transform active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs">Añadir</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop sticky bar */}
      <div className="hidden border-t border-border/50 bg-background/95 shadow-xl shadow-earth-dark/10 backdrop-blur-xl md:block">
        <div className="mx-auto flex w-[80%] items-center justify-between gap-6 px-4 py-3 xl:w-[75%]">
          {/* Product info */}
          <div className="flex items-center gap-4">
            <div>
              <p className="font-heading leading-tight font-bold text-foreground">
                {productName}
              </p>
              <div className="mt-0.5 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                ))}
                <span className="ml-1 text-xs text-muted-foreground">
                  4.9 (148)
                </span>
              </div>
            </div>
          </div>

          {/* Format selector */}
          <div className="flex items-center gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => handleSelectVariant(v, "sticky_desktop")}
                data-testid={`sticky-desktop-variant-${v.size.replace(/\s+/g, "-").toLowerCase()}`}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all",
                  selectedVariant.id === v.id
                    ? "border-primary bg-primary/8 text-secondary"
                    : "border-border/50 text-muted-foreground hover:border-primary/25"
                )}
              >
                {v.size}
              </button>
            ))}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p
                className="text-2xl font-extrabold text-foreground"
                data-testid="sticky-desktop-total"
              >
                €{selectedVariant.price.toFixed(2)}
              </p>
              <div className="flex items-center justify-end gap-1.5 text-xs text-primary">
                <Truck className="h-3 w-3" />
                Envío gratis 24/48h
              </div>
            </div>
            {isMaintenance ? (
              <button
                disabled
                className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-border bg-muted px-8 py-3 font-bold whitespace-nowrap text-muted-foreground"
              >
                <ShoppingBag className="h-5 w-5 opacity-50" />
                Mantenimiento
              </button>
            ) : isOutOfStock ? (
              <button
                disabled
                className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-border bg-muted px-8 py-3 font-bold whitespace-nowrap text-muted-foreground"
              >
                <ShoppingBag className="h-5 w-5 opacity-50" />
                Agotado
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                data-testid="sticky-desktop-add-to-cart"
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold whitespace-nowrap text-white shadow-lg shadow-primary/15 transition-all hover:scale-[1.02] hover:bg-brand-green-hover active:scale-95"
              >
                <ShoppingBag className="h-5 w-5" />
                Añadir al Carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
