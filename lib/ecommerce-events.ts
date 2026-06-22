"use client"

type EcommerceEventName = "add_to_cart" | "begin_checkout" | "checkout_error"

type EcommerceEventPayload = {
  currency?: "EUR"
  value?: number
  items?: Array<{
    item_id?: string
    item_name?: string
    item_variant?: string
    price?: number
    quantity?: number
  }>
  error_message?: string
}

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      payload?: EcommerceEventPayload
    ) => void
  }
}

export function trackEcommerceEvent(
  eventName: EcommerceEventName,
  payload: EcommerceEventPayload = {}
) {
  if (typeof window === "undefined") return

  const detail = {
    currency: "EUR" as const,
    ...payload,
  }

  window.dispatchEvent(
    new CustomEvent(`biocultor:ecommerce:${eventName}`, {
      detail,
    })
  )

  window.gtag?.("event", eventName, detail)
}
