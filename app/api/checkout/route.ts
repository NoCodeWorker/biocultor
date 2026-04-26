import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import prisma from '@/lib/db';
import { PACKLINK_ORIGIN, variantWeightKg } from '@/lib/packlink';

// El cliente sólo puede elegir QUÉ comprar y CUÁNTAS unidades. Precio, nombre,
// peso y SKU se leen de la DB en este endpoint — nunca del body — para evitar
// price tampering desde DevTools.

const CartItemSchema = z.object({
  id: z.string().min(1).max(64),
  quantity: z.number().int().positive().max(99),
});

const BodySchema = z.object({
  items: z.array(CartItemSchema).min(1).max(8),
});

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Falta STRIPE_SECRET_KEY en .env' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
  });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Carrito inválido' }, { status: 400 });
  }
  const { items } = parsed.data;

  // Lookup atómico contra DB. Si algún id no existe, abortamos.
  const ids = [...new Set(items.map((i) => i.id))];
  const variants = await prisma.variant.findMany({
    where: { id: { in: ids } },
    include: { product: true },
  });
  if (variants.length !== ids.length) {
    return NextResponse.json(
      { error: 'Algún producto del carrito ya no está disponible.' },
      { status: 400 }
    );
  }
  const variantById = new Map(variants.map((v) => [v.id, v]));

  try {
    const line_items = items.map((item) => {
      const v = variantById.get(item.id)!;
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${v.product.name} - ${v.size}`,
            metadata: { variantId: v.id, sku: v.sku },
          },
          unit_amount: Math.round(v.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const totalAmountEur = items.reduce((acc, it) => {
      const v = variantById.get(it.id)!;
      return acc + v.price * it.quantity;
    }, 0);
    const totalWeight = items.reduce((acc, it) => {
      const v = variantById.get(it.id)!;
      return acc + variantWeightKg(v.size) * it.quantity;
    }, 0);

    type ShippingOption = NonNullable<Stripe.Checkout.SessionCreateParams['shipping_options']>[number];
    let shipping_options: ShippingOption[] = [];

    if (totalAmountEur >= 50) {
      shipping_options = [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'eur' },
          display_name: 'Envío Gratuito Packlink (Door-to-Door)',
          delivery_estimate: { minimum: { unit: 'business_day', value: 2 }, maximum: { unit: 'business_day', value: 4 } },
        },
      }];
    } else {
      try {
        const packlinkRes = await fetch('https://api.packlink.com/v1/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.PACKLINK_API_KEY}`,
          },
          body: JSON.stringify({
            // Origen real (Toledo) — antes había un 08001 (Barcelona) hardcoded
            // que cotizaba tarifas falsas. Destino: Madrid centro como
            // referencia para la cotización pre-checkout (el cliente no ha
            // dado aún su dirección; Stripe la pedirá en el siguiente paso).
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
            delivery_estimate: { minimum: { unit: 'business_day', value: 2 }, maximum: { unit: 'business_day', value: 5 } },
          },
        }));
      } catch {
        shipping_options = [
          { shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 499, currency: 'eur' }, display_name: 'Correos Express 24h (Door to Door)', delivery_estimate: { minimum: { unit: 'business_day', value: 1 }, maximum: { unit: 'business_day', value: 2 } } } },
          { shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 350, currency: 'eur' }, display_name: 'GLS Economy (Door to Door)', delivery_estimate: { minimum: { unit: 'business_day', value: 3 }, maximum: { unit: 'business_day', value: 5 } } } },
        ];
      }
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || 'http://localhost:3000';

    // Metadata: solo id+quantity+precio-de-DB. El webhook lee aquí precios ya
    // validados, no precios que puso el cliente.
    const metaCart = items.map((it) => ({
      id: it.id,
      q: it.quantity,
      p: variantById.get(it.id)!.price,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
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
        cartItems: JSON.stringify(metaCart),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error iniciando sesión Stripe:', error);
    return NextResponse.json({ error: 'Error iniciando pago' }, { status: 500 });
  }
}
