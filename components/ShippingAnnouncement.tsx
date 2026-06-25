"use client"

import Link from "next/link"
import { ArrowRight, Truck } from "lucide-react"
import { trackEcommerceEvent } from "@/lib/ecommerce-events"

const PRODUCT_HREF = "/producto/te-humus-liquido-premium"

export default function ShippingAnnouncement() {
  return (
    <aside
      aria-label="Promoción de envío gratuito"
      className="shipping-announcement relative isolate overflow-hidden border-b border-white/10 bg-brand-olive-dark text-cream"
    >
      <div
        className="shipping-announcement__texture absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="shipping-announcement__glow absolute inset-y-0 left-0"
        aria-hidden="true"
      />

      <Link
        href={PRODUCT_HREF}
        onClick={() =>
          trackEcommerceEvent("select_promotion", {
            promotion_name: "envio_gratuito_todos_formatos",
            creative_slot: "top_banner",
          })
        }
        className="group relative mx-auto grid min-h-11 w-[92%] max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-3 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-brand-olive-dark md:min-h-12 md:grid-cols-[1fr_auto_1fr] md:gap-6 lg:w-[86%] xl:w-[80%]"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-cream/20 bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] md:absolute md:left-0">
          <Truck
            className="size-4 text-[#E9D8A6] transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>

        <span className="min-w-0 text-left md:col-start-2 md:row-start-1 md:text-center">
          <span className="block font-heading text-[13px] leading-tight font-bold tracking-[-0.01em] text-white sm:text-sm md:text-[15px]">
            <span className="sm:hidden">
              Envío gratis en todos los formatos
            </span>
            <span className="hidden sm:inline">
              Envío gratuito en todos los formatos
            </span>
          </span>
          <span className="mt-0.5 block text-[10px] leading-none font-semibold tracking-[0.12em] text-cream/65 uppercase md:hidden">
            Sin pedido mínimo · Entrega 24/48 h
          </span>
        </span>

        <span className="hidden items-center justify-self-end text-xs font-semibold text-cream/75 md:col-start-3 md:row-start-1 md:flex">
          <span>Sin pedido mínimo · Entrega 24/48 h</span>
          <span className="mx-3 h-3 w-px bg-white/20" aria-hidden="true" />
          <span className="text-[#F3E4B7] transition-colors group-hover:text-white">
            Ver formatos
          </span>
          <ArrowRight
            className="ml-1.5 size-3.5 text-[#F3E4B7] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
            aria-hidden="true"
          />
        </span>

        <ArrowRight
          className="size-4 shrink-0 text-[#F3E4B7] transition-transform duration-300 group-hover:translate-x-1 md:hidden"
          aria-hidden="true"
        />
      </Link>
    </aside>
  )
}
