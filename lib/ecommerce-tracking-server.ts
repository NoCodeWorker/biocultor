import { z } from "zod"
import { ecommerceEventNames } from "@/lib/ecommerce-tracking-contract"

const MAX_STRING = 240
const MAX_TEXT = 1000

const ItemSchema = z.object({
  item_id: z.string().trim().max(MAX_STRING).optional(),
  item_name: z.string().trim().max(MAX_STRING).optional(),
  item_variant: z.string().trim().max(MAX_STRING).optional(),
  price: z.number().nonnegative().max(100_000).optional(),
  quantity: z.number().int().positive().max(99).optional(),
})

export const EcommerceEventSchema = z.object({
  eventName: z.enum(ecommerceEventNames),
  sessionId: z.string().trim().min(8).max(120),
  productSlug: z.string().trim().max(MAX_STRING).optional(),
  value: z.number().nonnegative().max(1_000_000).optional(),
  currency: z.literal("EUR").optional(),
  items: z.array(ItemSchema).max(8).optional(),
  device: z.enum(["mobile", "tablet", "desktop", "unknown"]).optional(),
  sourcePath: z.string().trim().max(MAX_STRING).optional(),
  referrer: z.string().trim().max(MAX_TEXT).optional(),
  interactionSource: z.string().trim().max(MAX_STRING).optional(),
  itemListName: z.string().trim().max(MAX_STRING).optional(),
  promotionName: z.string().trim().max(MAX_STRING).optional(),
  creativeSlot: z.string().trim().max(MAX_STRING).optional(),
  formName: z.string().trim().max(MAX_STRING).optional(),
  errorMessage: z.string().trim().max(MAX_TEXT).optional(),
  orderNumber: z.string().trim().max(MAX_STRING).optional(),
  stripeSession: z.string().trim().max(MAX_STRING).optional(),
  dedupeKey: z.string().trim().max(MAX_STRING).optional(),
})

export type ParsedEcommerceEvent = z.infer<typeof EcommerceEventSchema>

export function buildEcommerceEventCreateData(event: ParsedEcommerceEvent) {
  const firstItem = event.items?.[0]

  return {
    eventName: event.eventName,
    sessionId: event.sessionId,
    productSlug: event.productSlug || null,
    variantSku: firstItem?.item_id || null,
    variantSize: firstItem?.item_variant || null,
    itemName: firstItem?.item_name || null,
    quantity: firstItem?.quantity || null,
    value: event.value ?? firstItem?.price ?? null,
    currency: event.currency ?? "EUR",
    device: event.device || null,
    sourcePath: event.sourcePath || null,
    referrer: event.referrer || null,
    interactionSource: event.interactionSource || null,
    itemListName: event.itemListName || null,
    promotionName: event.promotionName || null,
    creativeSlot: event.creativeSlot || null,
    formName: event.formName || null,
    errorMessage: event.errorMessage || null,
    orderNumber: event.orderNumber || null,
    stripeSession: event.stripeSession || null,
    dedupeKey: event.dedupeKey || null,
    metadataJson: JSON.stringify({
      items: event.items ?? [],
    }),
  }
}
