"use client"

import { useCartStore } from "@/store/cartStore"
import { X, Plus, Minus, ShoppingBag, Loader2, Leaf } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { trackEcommerceEvent } from "@/lib/ecommerce-events"

type CrossSellVariant = {
  id: string
  sku: string
  size: string
  price: number
  image?: string | null
  imagePath?: string | null
  product: {
    name: string
  }
}

type CrossSellData = {
  ort1L?: CrossSellVariant
  bio1L?: CrossSellVariant
  ort5L?: CrossSellVariant
  bio5L?: CrossSellVariant
}

export default function Cart() {
  const { items, isOpen, setIsOpen, updateQuantity, addItem } = useCartStore()
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [crossSellData, setCrossSellData] = useState<CrossSellData | null>(null)
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const freeShipping = total >= 50

  const hasBIO5L = items.some((item) => item.sku === "BIO-5L")
  const hasORT5L = items.some((item) => item.sku === "ORT-5L")
  const isBundle = hasBIO5L && hasORT5L

  // Si tiene el bundle, aplicamos 5% de descuento al frontend (en checkout ya se aplica)
  const cartTotalWithDiscount = items.reduce((acc, item) => {
    let unitPrice = item.price
    if (isBundle && (item.sku === "BIO-5L" || item.sku === "ORT-5L")) {
      unitPrice = unitPrice * 0.95
    }
    return acc + unitPrice * item.quantity
  }, 0)

  const hasBIO = items.some((item) => item.sku?.startsWith("BIO"))
  const hasORT = items.some((item) => item.sku?.startsWith("ORT"))
  const hasBIO1L = items.some((item) => item.sku === "BIO-1L")
  const hasORT1L = items.some((item) => item.sku === "ORT-1L")

  let boosterVariant = null
  if (hasBIO && !hasORT && !hasORT1L && crossSellData?.ort1L) {
    boosterVariant = crossSellData.ort1L
  } else if (hasORT && !hasBIO && !hasBIO1L && crossSellData?.bio1L) {
    boosterVariant = crossSellData.bio1L
  } else if (!hasBIO1L && crossSellData?.bio1L) {
    boosterVariant = crossSellData.bio1L
  } else if (!hasORT1L && crossSellData?.ort1L) {
    boosterVariant = crossSellData.ort1L
  }

  const percentage = Math.min((total / 50) * 100, 100)
  let milestoneText = ""
  let milestoneSubtext = ""
  if (total < 15) {
    milestoneText = `Te faltan €${(50 - total).toFixed(2)} para envío gratis`
    milestoneSubtext =
      "Puedes completar el pedido ahora o añadir otro formato para ahorrar el envío."
  } else if (total >= 15 && total < 35) {
    milestoneText = `Te faltan €${(50 - total).toFixed(2)} para envío gratis`
    milestoneSubtext =
      "El envío gratis se activa automáticamente al llegar a 50 €."
  } else if (total >= 35 && total < 50) {
    milestoneText = `Estás a €${(50 - total).toFixed(2)} del envío gratis`
    milestoneSubtext =
      "Añadir un formato pequeño suele compensar frente al coste de transporte."
  } else {
    milestoneText = "Envío gratuito incluido"
    milestoneSubtext =
      "Tu pedido ya supera el mínimo para transporte sin coste."
  }

  // Fetch cross-sell variants when Cart opens
  useEffect(() => {
    if (isOpen && !crossSellData) {
      fetch("/api/cross-sell")
        .then((res) => res.json())
        .then((data) => setCrossSellData(data))
        .catch(console.error)
    }
  }, [isOpen, crossSellData])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, setIsOpen])

  const handleCheckout = async () => {
    setIsCheckoutLoading(true)
    setCheckoutError(null)
    trackEcommerceEvent("begin_checkout", {
      value: isBundle ? cartTotalWithDiscount : total,
      items: items.map((item) => ({
        item_id: item.sku ?? item.id,
        item_name: item.name,
        item_variant: item.size,
        price: item.price,
        quantity: item.quantity,
      })),
    })
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.assign(data.url)
      } else {
        const message =
          data.error ||
          "No hemos podido iniciar el pago seguro. Inténtalo de nuevo."
        setCheckoutError(message)
        trackEcommerceEvent("checkout_error", {
          value: total,
          error_message: message,
        })
      }
    } catch (e) {
      console.error(e)
      const message =
        "No hemos podido conectar con el pago seguro. Revisa la conexión e inténtalo de nuevo."
      setCheckoutError(message)
      trackEcommerceEvent("checkout_error", {
        value: total,
        error_message: message,
      })
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  return (
    <>
      {/* Custom Keyframes for Premium Shimmer Effect */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes cartShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .cart-shimmer-bg {
          animation: cartShimmer 2.5s infinite linear;
        }
      `,
        }}
      />

      {/* Overlay Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-earth-dark/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-full transform flex-col border-l border-border/50 bg-background shadow-2xl transition-transform duration-400 ease-in-out sm:w-[440px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 bg-cream-warm p-6">
          <h2 className="flex items-center gap-3 font-heading text-xl font-bold text-foreground">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
            Tu Pedido
            {totalItems > 0 && (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full bg-muted/50 p-2 text-foreground transition-colors hover:bg-muted"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Unified Free Shipping Progress & Milestone Booster */}
        {items.length > 0 && (
          <div className="border-b border-border/40 bg-cream-warm px-6 py-4 shadow-inner">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf
                  className={cn(
                    "h-4 w-4 text-primary transition-transform duration-500",
                    freeShipping ? "scale-110 rotate-12" : "animate-pulse"
                  )}
                />
                <span
                  className={cn(
                    "font-heading text-sm font-bold",
                    freeShipping ? "text-primary" : "text-foreground"
                  )}
                >
                  {milestoneText}
                </span>
              </div>
              {!freeShipping && (
                <span className="rounded-md bg-muted/60 px-2 py-0.5 text-xs font-bold text-muted-foreground">
                  {percentage.toFixed(0)}%
                </span>
              )}
            </div>

            {/* Elegant Custom Animated Progress Bar */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted/70 shadow-inner">
              <div
                className={cn(
                  "relative h-full overflow-hidden rounded-full transition-all duration-700 ease-out",
                  freeShipping
                    ? "bg-gradient-to-r from-primary to-brand-green-hover"
                    : "bg-gradient-to-r from-brand-olive to-primary"
                )}
                style={{ width: `${percentage}%` }}
              >
                {/* Shiny gloss wave effect on progress bar */}
                <div className="cart-shimmer-bg pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>

            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {milestoneSubtext}
            </p>
          </div>
        )}

        {/* Items */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-warm">
                <ShoppingBag className="h-10 w-10 opacity-20" />
              </div>
              <p className="font-heading text-lg text-foreground/60">
                Tu carrito está vacío.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-full border border-primary/30 px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-primary/8"
              >
                Ver Formatos
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-cream-warm">
                    <Image
                      src={item.image}
                      fill
                      className="object-contain p-2"
                      alt={item.name}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div>
                      <h3 className="text-sm leading-tight font-bold text-foreground">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-[10px] font-bold tracking-wider text-primary uppercase">
                        {item.size}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-cream-warm p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="rounded-md p-1.5 text-foreground transition-colors hover:bg-background"
                          aria-label={`Reducir cantidad de ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[20px] text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="rounded-md p-1.5 text-foreground transition-colors hover:bg-background"
                          aria-label={`Aumentar cantidad de ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Contextual AOV Booster (1L Quick-Add for Free Shipping) */}
              {!freeShipping && 50 - total <= 10 && boosterVariant && (
                <div className="mt-2 flex animate-in flex-col gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-cream-warm/50 to-brand-olive/5 p-4 shadow-sm transition-all duration-300 fade-in slide-in-from-bottom-2 hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-border/40 bg-background">
                      <Image
                        src={
                          boosterVariant.imagePath ||
                          boosterVariant.image ||
                          (boosterVariant.sku?.startsWith("BIO")
                            ? "/1 litro.jpg"
                            : "/1 litro.jpg")
                        }
                        fill
                        className="object-contain p-1"
                        alt={boosterVariant.product.name}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                          Recomendado
                        </span>
                        <span className="text-[10px] font-bold tracking-wider text-brand-olive-dark uppercase">
                          Ahorra envío
                        </span>
                      </div>
                      <h4 className="mt-1 truncate text-xs font-bold text-foreground">
                        {boosterVariant.product.name} - 1L
                      </h4>
                      <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
                        Añade este formato de 1L para conseguir el{" "}
                        <strong>Envío Gratis</strong>.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-heading text-sm font-black text-foreground">
                        €{boosterVariant.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addItem({
                        id: boosterVariant.id,
                        name: boosterVariant.product.name,
                        size: boosterVariant.size,
                        price: boosterVariant.price,
                        image:
                          boosterVariant.imagePath ||
                          boosterVariant.image ||
                          (boosterVariant.sku?.startsWith("BIO")
                            ? "/1 litro.jpg"
                            : "/1 litro.jpg"),
                        quantity: 1,
                        sku: boosterVariant.sku,
                      })
                      trackEcommerceEvent("add_to_cart", {
                        value: boosterVariant.price,
                        items: [
                          {
                            item_id: boosterVariant.sku,
                            item_name: boosterVariant.product.name,
                            item_variant: boosterVariant.size,
                            price: boosterVariant.price,
                            quantity: 1,
                          },
                        ],
                      })
                    }}
                    className="flex w-full items-center justify-center gap-1 rounded-xl bg-primary py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:scale-[1.01] hover:bg-brand-green-hover active:scale-[0.99]"
                  >
                    <span>
                      Añadir y activar envío gratis (+€
                      {boosterVariant.price.toFixed(2)})
                    </span>
                  </button>
                </div>
              )}

              {/* Módulo Cross-Sell Purín de Ortiga 5L */}
              {hasBIO5L && !hasORT5L && crossSellData?.ort5L && (
                <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-brand-olive-dark/20 bg-brand-olive-dark/10 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        Completa tu tratamiento
                      </h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Añade 5L de Purín de Ortiga y obtén un 5% de descuento
                        en el pack.
                      </p>
                    </div>
                    <Leaf className="h-5 w-5 flex-shrink-0 text-brand-olive-dark" />
                  </div>
                  <button
                    onClick={() => {
                      const ort = crossSellData.ort5L
                      if (!ort) return
                      addItem({
                        id: ort.id,
                        name: ort.product.name,
                        size: ort.size,
                        price: ort.price,
                        image: ort.imagePath || ort.image || "/5-litros.jpg",
                        quantity: 1,
                        sku: ort.sku,
                      })
                      trackEcommerceEvent("add_to_cart", {
                        value: ort.price,
                        items: [
                          {
                            item_id: ort.sku,
                            item_name: ort.product.name,
                            item_variant: ort.size,
                            price: ort.price,
                            quantity: 1,
                          },
                        ],
                      })
                    }}
                    className="w-full rounded-xl bg-brand-olive-dark py-2 text-sm font-bold text-white transition-colors hover:bg-brand-olive-dark/90"
                  >
                    Añadir Purín de Ortiga 5L (+€{crossSellData.ort5L.price})
                  </button>
                </div>
              )}

              {/* Módulo Cross-Sell Té de Humus 5L (Inverso) */}
              {hasORT5L && !hasBIO5L && crossSellData?.bio5L && (
                <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-brand-olive-dark/20 bg-brand-olive-dark/10 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        Completa tu nutrición
                      </h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Añade 5L de Té de Humus y obtén un 5% de descuento en el
                        pack.
                      </p>
                    </div>
                    <Leaf className="h-5 w-5 flex-shrink-0 text-brand-olive-dark" />
                  </div>
                  <button
                    onClick={() => {
                      const bio = crossSellData.bio5L
                      if (!bio) return
                      addItem({
                        id: bio.id,
                        name: bio.product.name,
                        size: bio.size,
                        price: bio.price,
                        image: bio.imagePath || bio.image || "/5-litros.jpg",
                        quantity: 1,
                        sku: bio.sku,
                      })
                      trackEcommerceEvent("add_to_cart", {
                        value: bio.price,
                        items: [
                          {
                            item_id: bio.sku,
                            item_name: bio.product.name,
                            item_variant: bio.size,
                            price: bio.price,
                            quantity: 1,
                          },
                        ],
                      })
                    }}
                    className="w-full rounded-xl bg-brand-olive-dark py-2 text-sm font-bold text-white transition-colors hover:bg-brand-olive-dark/90"
                  >
                    Añadir Té de Humus 5L (+€{crossSellData.bio5L.price})
                  </button>
                </div>
              )}

              {/* Mensaje de Éxito de Bundle */}
              {isBundle && (
                <div className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 p-3 text-center">
                  <span className="text-sm font-bold text-primary">
                    Pack de tratamiento completo: 5% de descuento aplicado.
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer CTA */}
        {items.length > 0 && (
          <div className="border-t border-border/50 bg-cream-warm p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-base text-muted-foreground">
                Total (IVA incl.)
              </span>
              <div className="flex items-baseline gap-2">
                {isBundle && (
                  <span className="text-lg font-medium text-muted-foreground line-through">
                    €{total.toFixed(2)}
                  </span>
                )}
                <span className="font-heading text-3xl font-extrabold tracking-tighter text-foreground">
                  €
                  {isBundle
                    ? cartTotalWithDiscount.toFixed(2)
                    : total.toFixed(2)}
                </span>
              </div>
            </div>
            {isMaintenance ? (
              <button
                disabled={true}
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border bg-muted py-4 text-base font-bold text-muted-foreground transition-all"
              >
                Compras Suspendidas (Mantenimiento)
              </button>
            ) : (
              <>
                {checkoutError && (
                  <div
                    role="alert"
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
                  >
                    {checkoutError}
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/10 transition-all hover:scale-[1.01] hover:bg-brand-green-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCheckoutLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Iniciando pago seguro...
                    </>
                  ) : (
                    "Tramitar Pedido Seguro"
                  )}
                </button>
              </>
            )}
            <p className="mt-3 text-center text-xs text-muted-foreground opacity-70">
              Pagos encriptados con seguridad bancaria mediante Stripe®
            </p>
          </div>
        )}
      </div>
    </>
  )
}
