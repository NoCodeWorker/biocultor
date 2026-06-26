"use client"

import type {
  EcommerceEventName,
  EcommerceTrackingPayload,
} from "@/lib/ecommerce-tracking-contract"

type EcommerceEventPayload = EcommerceTrackingPayload

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      payload?: EcommerceEventPayload
    ) => void
  }
}

const SESSION_KEY = "biocultor_ecommerce_session_id"
const CONSENT_KEY = "biocultor_gdpr_consent"

function getAnonymousSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_KEY)
    if (existing) return existing

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `session_${Date.now()}_${Math.random().toString(36).slice(2)}`

    localStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
  }
}

function hasAnalyticsConsent() {
  try {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (consent === "all") return true
    if (!consent || consent === "necessary-only") return false

    const parsed = JSON.parse(consent) as { analytics?: unknown }
    return parsed.analytics === true
  } catch {
    return false
  }
}

function getDeviceType(): "mobile" | "tablet" | "desktop" | "unknown" {
  if (typeof window === "undefined") return "unknown"
  const width = window.innerWidth
  if (width < 768) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

function getProductSlugFromPath(pathname: string) {
  const match = pathname.match(/^\/producto\/([^/?#]+)/)
  return match?.[1]
}

function sendInternalEcommerceEvent(
  eventName: EcommerceEventName,
  payload: EcommerceEventPayload
) {
  if (!hasAnalyticsConsent()) return

  const sourcePath = `${window.location.pathname}${window.location.search}`
  const body = JSON.stringify({
    eventName,
    sessionId: getAnonymousSessionId(),
    productSlug:
      payload.product_slug ?? getProductSlugFromPath(window.location.pathname),
    value: payload.value,
    currency: payload.currency ?? "EUR",
    items: payload.items,
    device: payload.device ?? getDeviceType(),
    sourcePath: payload.source_path ?? sourcePath,
    referrer: payload.referrer ?? document.referrer,
    interactionSource: payload.interaction_source,
    itemListName: payload.item_list_name,
    promotionName: payload.promotion_name,
    creativeSlot: payload.creative_slot,
    formName: payload.form_name,
    errorMessage: payload.error_message,
    orderNumber: payload.order_number,
    stripeSession: payload.stripe_session,
    dedupeKey: payload.dedupe_key,
  })

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      "/api/events/ecommerce",
      new Blob([body], { type: "application/json" })
    )
    if (sent) return
  }

  fetch("/api/events/ecommerce", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Tracking must never break purchase UX.
  })
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
  sendInternalEcommerceEvent(eventName, detail)
}
