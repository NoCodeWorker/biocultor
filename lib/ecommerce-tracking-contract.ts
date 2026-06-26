export const ecommerceEventNames = [
  "view_item",
  "select_item",
  "add_to_cart",
  "begin_checkout",
  "checkout_error",
  "purchase",
  "select_promotion",
  "contact_click",
  "newsletter_signup",
  "newsletter_confirmed",
] as const

export type EcommerceEventName = (typeof ecommerceEventNames)[number]

export type EcommerceTrackingItem = {
  item_id?: string
  item_name?: string
  item_variant?: string
  price?: number
  quantity?: number
}

export type EcommerceTrackingPayload = {
  currency?: "EUR"
  value?: number
  items?: EcommerceTrackingItem[]
  error_message?: string
  promotion_name?: string
  creative_slot?: string
  form_name?: string
  item_list_name?: string
  interaction_source?: string
  product_slug?: string
  session_id?: string
  source_path?: string
  referrer?: string
  device?: "mobile" | "tablet" | "desktop" | "unknown"
  order_number?: string
  stripe_session?: string
  dedupe_key?: string
}
