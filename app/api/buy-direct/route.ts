import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import prisma from '@/lib/db';
import { PACKLINK_ORIGIN, variantWeightKg } from '@/lib/packlink';

const QuerySchema = z.object({
  sku: z.string().min(1).max(64),
  qty: z.coerce.number().int().positive().max(99).default(1),
});

export async function GET(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return new Response(
      '<h1>Error de Configuración</h1><p>Falta STRIPE_SECRET_KEY en el servidor.</p>',
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const { searchParams } = new URL(req.url);
  const rawParams = {
    sku: searchParams.get('sku'),
    qty: searchParams.get('qty') || '1',
  };

  const parsed = QuerySchema.safeParse(rawParams);
  if (!parsed.success) {
    return new Response(
      '<h1>Parámetros de Compra Inválidos</h1><p>Por favor, comprueba el SKU y la cantidad solicitados.</p><p><a href="/">Volver a la Tienda</a></p>',
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const { sku, qty } = parsed.data;

  // Buscar la variante por SKU
  const variant = await prisma.variant.findFirst({
    where: { sku },
    include: { product: true },
  });

  if (!variant) {
    return new Response(
      `<h1>Producto No Encontrado</h1><p>El producto con SKU <strong>${sku}</strong> no existe o no está disponible en este momento.</p><p><a href="/">Volver a la Tienda</a></p>`,
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-04-22.dahlia',
  });

  try {
    const line_items = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${variant.product.name} - ${variant.size}`,
            metadata: { variantId: variant.id, sku: variant.sku },
          },
          unit_amount: Math.round(variant.price * 100),
        },
        quantity: qty,
      },
    ];

    const totalAmountEur = variant.price * qty;
    const totalWeight = variantWeightKg(variant.size) * qty;

    type ShippingOption = NonNullable<Stripe.Checkout.SessionCreateParams['shipping_options']>[number];
    let shipping_options: ShippingOption[] = [];

    if (totalAmountEur >= 50) {
      shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'Envío Gratuito Packlink (Door-to-Door)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 4 },
            },
          },
        },
      ];
    } else {
      try {
        const packlinkRes = await fetch('https://api.packlink.com/v1/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${process.env.PACKLINK_API_KEY}`,
          },
          body: JSON.stringify({
            from: { country: PACKLINK_ORIGIN.country, zip: PACKLINK_ORIGIN.zip },
            to: { country: 'ES', zip: '28001' },
            packages: [{ width: 20, height: 20, length: 20, weight: totalWeight }],
          }),
        });

        if (!packlinkRes.ok) throw new Error('Packlink Rate Limit');

        type PacklinkService = {
          delivery_type: string;
          total_price: number;
          carrier_name: string;
          service_name: string;
        };
        const services = (await packlinkRes.json()) as PacklinkService[];
        const cheapestServices = services
          .filter((s) => s.delivery_type === 'door_to_door')
          .sort((a, b) => a.total_price - b.total_price)
          .slice(0, 4);

        shipping_options = cheapestServices.map((service) => ({
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(service.total_price * 100), currency: 'eur' },
            display_name: `${service.carrier_name} (${service.service_name})`,
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        }));
      } catch {
        shipping_options = [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 499, currency: 'eur' },
              display_name: 'Correos Express 24h (Door to Door)',
              delivery_estimate: { minimum: { unit: 'business_day', value: 1 }, maximum: { unit: 'business_day', value: 2 } },
            },
          },
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 350, currency: 'eur' },
              display_name: 'GLS Economy (Door to Door)',
              delivery_estimate: { minimum: { unit: 'business_day', value: 3 }, maximum: { unit: 'business_day', value: 5 } },
            },
          },
        ];
      }
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || 'https://biocultor.com';

    // Persistir el carrito en DB
    const pendingCart = await prisma.pendingCart.create({
      data: {
        itemsJson: JSON.stringify([
          {
            id: variant.id,
            q: qty,
            p: variant.price,
          },
        ]),
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'bizum'] as Stripe.Checkout.SessionCreateParams['payment_method_types'],
      line_items,
      mode: 'payment',
      shipping_options,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      shipping_address_collection: {
        allowed_countries: ['ES', 'PT', 'FR', 'IT', 'DE'],
      },
      phone_number_collection: { enabled: true },
      metadata: {
        pendingCartId: pendingCart.id,
        customerId: '',
      },
    });

    if (!session.url) {
      throw new Error('No se pudo generar la URL de Stripe Checkout');
    }

    // Redirigir al usuario directamente con un 303 a Stripe
    return new Response(null, {
      status: 303,
      headers: {
        Location: session.url,
      },
    });
  } catch (error) {
    console.error('Error iniciando sesión Stripe directa:', error);
    return new Response(
      '<h1>Error de Procesamiento</h1><p>Hubo un fallo iniciando el pago seguro con Stripe. Por favor, inténtelo de nuevo.</p>',
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}
