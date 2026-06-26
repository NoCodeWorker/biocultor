import { describe, expect, it } from "vitest"
import {
  buildEcommerceEventCreateData,
  EcommerceEventSchema,
} from "../../lib/ecommerce-tracking-server"

describe("EcommerceEventSchema", () => {
  it("accepts a valid add-to-cart event and normalizes persistence data", () => {
    const parsed = EcommerceEventSchema.parse({
      eventName: "add_to_cart",
      sessionId: "session_123456",
      productSlug: "te-humus-liquido-premium",
      value: 49.95,
      currency: "EUR",
      device: "mobile",
      sourcePath: "/producto/te-humus-liquido-premium",
      interactionSource: "sticky_mobile",
      items: [
        {
          item_id: "BIO-25L",
          item_name: "Té de Humus de Lombriz Biocultor",
          item_variant: "25 Litros",
          price: 49.95,
          quantity: 1,
        },
      ],
    })

    expect(buildEcommerceEventCreateData(parsed)).toMatchObject({
      eventName: "add_to_cart",
      sessionId: "session_123456",
      productSlug: "te-humus-liquido-premium",
      variantSku: "BIO-25L",
      variantSize: "25 Litros",
      itemName: "Té de Humus de Lombriz Biocultor",
      quantity: 1,
      value: 49.95,
      currency: "EUR",
      device: "mobile",
      interactionSource: "sticky_mobile",
    })
  })

  it("rejects unknown event names", () => {
    expect(() =>
      EcommerceEventSchema.parse({
        eventName: "random_event",
        sessionId: "session_123456",
      })
    ).toThrow()
  })

  it("rejects payloads that exceed item limits", () => {
    expect(() =>
      EcommerceEventSchema.parse({
        eventName: "begin_checkout",
        sessionId: "session_123456",
        items: Array.from({ length: 9 }, (_, index) => ({
          item_id: `BIO-${index}`,
          quantity: 1,
        })),
      })
    ).toThrow()
  })

  it("rejects invalid quantities and negative values", () => {
    expect(() =>
      EcommerceEventSchema.parse({
        eventName: "add_to_cart",
        sessionId: "session_123456",
        value: -1,
        items: [{ item_id: "BIO-1L", quantity: 0 }],
      })
    ).toThrow()
  })

  it("keeps purchase dedupe keys available for idempotent persistence", () => {
    const parsed = EcommerceEventSchema.parse({
      eventName: "purchase",
      sessionId: "cs_test_123456",
      value: 59.9,
      orderNumber: "BIO-1000001",
      stripeSession: "cs_test_123456",
      dedupeKey: "purchase:cs_test_123456",
    })

    expect(buildEcommerceEventCreateData(parsed)).toMatchObject({
      eventName: "purchase",
      orderNumber: "BIO-1000001",
      stripeSession: "cs_test_123456",
      dedupeKey: "purchase:cs_test_123456",
    })
  })
})
