import { NextResponse } from "next/server"
import Stripe from "stripe"
import { z } from "zod"
import prisma from "@/lib/db"
import { getCustomerSession } from "@/lib/session"

// El cliente sólo puede elegir QUÉ comprar y CUÁNTAS unidades. Precio, nombre,
// peso y SKU se leen de la DB en este endpoint — nunca del body — para evitar
// price tampering desde DevTools.

const CartItemSchema = z.object({
  id: z.string().min(1).max(64),
  quantity: z.number().int().positive().max(99),
})

const BodySchema = z.object({
  items: z.array(CartItemSchema).min(1).max(8),
})

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Falta STRIPE_SECRET_KEY en .env" },
      { status: 500 }
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  })

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 })
  }
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: "Carrito inválido" }, { status: 400 })
  }
  const { items } = parsed.data

  // Lookup atómico contra DB. Si algún id no existe, abortamos.
  const ids = [...new Set(items.map((i) => i.id))]
  const variants = await prisma.variant.findMany({
    where: { id: { in: ids } },
    include: { product: true },
  })
  if (variants.length !== ids.length) {
    return NextResponse.json(
      { error: "Algún producto del carrito ya no está disponible." },
      { status: 400 }
    )
  }
  const variantById = new Map(variants.map((v) => [v.id, v]))

  for (const item of items) {
    const variant = variantById.get(item.id)
    if (!variant || variant.stock <= 0) {
      return NextResponse.json(
        { error: "Uno de los formatos seleccionados está agotado." },
        { status: 409 }
      )
    }
    if (item.quantity > variant.stock) {
      return NextResponse.json(
        {
          error: `Solo quedan ${variant.stock} unidades de ${variant.product.name} - ${variant.size}.`,
        },
        { status: 409 }
      )
    }
  }

  // Obtener el cliente logueado (si existe) para aplicarle su descuento persistente
  const customerId = await getCustomerSession()
  const customer = customerId
    ? await prisma.customer.findUnique({ where: { id: customerId } })
    : null

  const customerDiscountMultiplier =
    customer && customer.discount > 0 ? 1 - customer.discount / 100 : 1

  try {
    const hasBIO5L = items.some(
      (it) => variantById.get(it.id)?.sku === "BIO-5L"
    )
    const hasORT5L = items.some(
      (it) => variantById.get(it.id)?.sku === "ORT-5L"
    )
    const isBundle = hasBIO5L && hasORT5L

    const line_items = items.map((item) => {
      const v = variantById.get(item.id)!
      let unitPrice = v.price

      // Venta cruzada: 5% de descuento si llevan ambos de 5L
      if (isBundle && (v.sku === "BIO-5L" || v.sku === "ORT-5L")) {
        unitPrice = unitPrice * 0.95
      }

      // Aplicamos el descuento persistente del cliente (ej. 20% B2B)
      unitPrice = unitPrice * customerDiscountMultiplier

      const discountLabel =
        customer && customer.discount > 0 ? ` (Dto. ${customer.discount}%)` : ""

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${v.product.name} - ${v.size}${discountLabel}`,
            metadata: { variantId: v.id, sku: v.sku },
          },
          unit_amount: Math.round(unitPrice * 100),
        },
        quantity: item.quantity,
      }
    })

    type ShippingOption = NonNullable<
      Stripe.Checkout.SessionCreateParams["shipping_options"]
    >[number]
    const shipping_options: ShippingOption[] = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "eur" },
          display_name: "Envío gratuito 24/48h",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 1 },
            maximum: { unit: "business_day", value: 2 },
          },
        },
      },
    ]

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000"

    // Persistimos el carrito completo en DB y metemos solo su `id` (cuid 25c)
    // en metadata de Stripe. Antes serializábamos hasta 8 items en el campo
    // `cartItems` (~400 chars), peligrosamente cerca del límite de 500. Ahora
    // el metadata son ~30 chars fijos pase lo que pase con el carrito.
    const pendingCart = await prisma.pendingCart.create({
      data: {
        itemsJson: JSON.stringify(
          items.map((it) => ({
            id: it.id,
            q: it.quantity,
            p: variantById.get(it.id)!.price,
          }))
        ),
      },
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        "card",
        "paypal",
        "bizum",
      ] as Stripe.Checkout.SessionCreateParams["payment_method_types"],
      line_items,
      mode: "payment",
      shipping_options,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      shipping_address_collection: {
        allowed_countries: ["ES", "PT", "FR", "IT", "DE"],
      },
      phone_number_collection: { enabled: true },
      metadata: {
        pendingCartId: pendingCart.id,
        customerId: customer?.id || "",
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error iniciando sesión Stripe:", error)
    return NextResponse.json({ error: "Error iniciando pago" }, { status: 500 })
  }
}
