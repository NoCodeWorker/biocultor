import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Falta STRIPE_SECRET_KEY en las variables de entorno (.env)' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-03-25.dahlia',
  });

  try {
    const { items } = await req.json();

    // Usamos price_data dinámico para que el Admin Dashboard sea EL JEFE ABSOLUTO.
    // Cualquier cambio en la DB, se cobra directamente en Stripe.
    const line_items = items.map((item: any) => {
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Biocultor - ${item.size}`,
            images: item.image && item.image.startsWith('http') ? [item.image] : undefined 
          },
          unit_amount: Math.round(item.price * 100), // Lo que diga la base de datos manda
        },
        quantity: item.quantity,
      };
    });

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 1. Cálculos Base para Packlink (Pesos aproximados)
    const totalAmountEur = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    let totalWeight = 0;
    
    items.forEach((item: any) => {
      if (item.size === '1L') totalWeight += 1.2 * item.quantity;
      if (item.size === '5L') totalWeight += 5.5 * item.quantity;
      if (item.size === '10L') totalWeight += 11 * item.quantity;
      if (item.size === '25L') totalWeight += 26.5 * item.quantity;
    });

    // 2. Lógica de Envío Gratis (> 50€) o Cálculo Packlink
    let shipping_options: any[] = [];
    
    if (totalAmountEur >= 50) {
      // Envío Gratis Absoluto
      shipping_options = [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'eur' },
          display_name: 'Envío Gratuito Packlink (Door-to-Door)',
          delivery_estimate: { minimum: { unit: 'business_day', value: 2 }, maximum: { unit: 'business_day', value: 4 } }
        }
      }];
    } else {
      // Pedido inferior a 50€. Solicitamos tarifas a Packlink (simulado con precios lógicos si falla la API en vivo)
      // La API de Packlink '/v1/services' es estrictamente POST exigiendo un CP de destino final, con Stripe lo asumimos de la capital
      try {
        const packlinkRes = await fetch('https://api.packlink.com/v1/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.PACKLINK_API_KEY}`
          },
          body: JSON.stringify({
            "from": { "country": "ES", "zip": "08001" }, // Origen Biocultor asume Barcelona
            "to": { "country": "ES", "zip": "28001" }, // Destino estandar
            "packages": [{ "width": 20, "height": 20, "length": 20, "weight": totalWeight }]
          })
        });

        if (!packlinkRes.ok) throw new Error("Packlink Rate Limit");
        
        const services = await packlinkRes.json();
        // Filtramos 'door_to_door', ordenamos por precio
        const cheapestServices = services
          .filter((s: any) => s.delivery_type === 'door_to_door')
          .sort((a: any, b: any) => a.total_price - b.total_price)
          .slice(0, 4);

        shipping_options = cheapestServices.map((service: any) => ({
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(service.total_price * 100), currency: 'eur' },
            display_name: `${service.carrier_name} (${service.service_name})`,
            delivery_estimate: { minimum: { unit: 'business_day', value: 2 }, maximum: { unit: 'business_day', value: 5 } }
          }
        }));
      } catch (err) {
        // Fallback dinámico ultrarrápido si hay rate-limit para no bloquear la compra real
        shipping_options = [
          { shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 499, currency: 'eur' }, display_name: 'Correos Express 24h (Door to Door)', delivery_estimate: { minimum: { unit: 'business_day', value: 1 }, maximum: { unit: 'business_day', value: 2 } } } },
          { shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 350, currency: 'eur' }, display_name: 'GLS Economy (Door to Door)', delivery_estimate: { minimum: { unit: 'business_day', value: 3 }, maximum: { unit: 'business_day', value: 5 } } } }
        ];
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items,
      mode: 'payment',
      shipping_options,  // Inyectado
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      shipping_address_collection: {
        allowed_countries: ['ES', 'PT', 'FR', 'IT', 'DE'],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        // Guardamos las variantes exactas para que el Webhook lo recupere sin llamadas extra
        cartItems: JSON.stringify(items.map((i: any) => ({
          id: i.id, 
          q: i.quantity, 
          p: i.price
        })))
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error iniciando sesión Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
