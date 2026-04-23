import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-03-25.dahlia',
});

// Next.js: Necesitamos usar raw body para que Stripe valide la firma del webhook
// (Next.js App Router lee raw body mediante req.text() directamente)

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Filtrar el evento de checkout completado y pagado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === 'paid') {
      try {
        const customerEmail = session.customer_details?.email || 'anonimo@biocultor.com';
        const customerName = session.customer_details?.name || 'Cliente';
        const phone = session.customer_details?.phone || '';
        
        // Formatear dirección
        const addr = session.customer_details?.address;
        const addressString = addr ? `${addr.line1} ${addr.line2 || ''}, ${addr.city}, ${addr.postal_code}, ${addr.country}` : 'Desconocida';
        
        // Recuperar variantes del carrito
        const metaCartItems = session.metadata?.cartItems ? JSON.parse(session.metadata.cartItems) : [];

        // Inyectar o buscar Cliente
        const customer = await prisma.customer.upsert({
          where: { email: customerEmail },
          update: { name: customerName, phone },
          create: { email: customerEmail, name: customerName, phone },
        });

        const newOrderNumber = `BIO-${Math.floor(100000 + Math.random() * 900000)}`;

        // Crear Orden Transaccional
        await prisma.order.create({
          data: {
            orderNumber: newOrderNumber,
            customerId: customer.id,
            totalAmount: (session.amount_total || 0) / 100,
            stripeSession: session.id,
            shippingAddress: addressString,
            status: "PAID",
            items: {
              create: metaCartItems.map((item: any) => ({
                variantId: item.id,
                quantity: item.q,
                priceAt: item.p
              }))
            }
          }
        });

        // -------------------------------------------------------------
        // CREAR ENVÍO EN PACKLINK PRO
        // -------------------------------------------------------------
        let trackUrl: string | undefined = undefined;
        try {
          if (process.env.PACKLINK_API_KEY && addr?.postal_code) {
            let totalWeight = 0;
            // Calculamos peso estimado (aproximado basado en el ID de la variante, o asumimos un default)
            metaCartItems.forEach((item: any) => {
              if (item.id.includes('1L') || item.p < 20) totalWeight += 1.2 * item.q;
              else if (item.id.includes('5L') || item.p < 40) totalWeight += 5.5 * item.q;
              else if (item.id.includes('10L')) totalWeight += 11 * item.q;
              else totalWeight += 26 * item.q; // 25L fallback
            });
            if (totalWeight === 0) totalWeight = 5;

            // 1. Obtener el servicio más barato para este CP
            const ratesRes = await fetch('https://api.packlink.com/v1/services', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `${process.env.PACKLINK_API_KEY}` },
              body: JSON.stringify({
                from: { country: "ES", zip: "41001" }, // Origen Biocultor (Sevilla)
                to: { country: addr.country || "ES", zip: addr.postal_code },
                packages: [{ width: 20, height: 20, length: 20, weight: totalWeight }]
              })
            });

            if (ratesRes.ok) {
              const services = await ratesRes.json();
              const bestService = services.find((s: any) => s.delivery_type === 'door_to_door') || services[0];

              if (bestService) {
                // 2. Crear el envío
                const shipmentRes = await fetch('https://api.packlink.com/v1/shipments', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `${process.env.PACKLINK_API_KEY}` },
                  body: JSON.stringify({
                    service_id: bestService.id,
                    content: "Abono Biocultor",
                    packages: [{ weight: totalWeight, width: 20, length: 20, height: 20 }],
                    from: {
                      name: "Biocultor",
                      surname: "Logística",
                      street1: "Polígono Industrial",
                      zip: "41001",
                      city: "Sevilla",
                      country: "ES",
                      phone: "900123456",
                      email: "logistica@biocultor.com"
                    },
                    to: {
                      name: customerName.split(' ')[0] || "Cliente",
                      surname: customerName.split(' ').slice(1).join(' ') || "Biocultor",
                      street1: addr.line1 || "Desconocida",
                      street2: addr.line2 || "",
                      zip: addr.postal_code,
                      city: addr.city || "Desconocida",
                      country: addr.country || "ES",
                      phone: phone || "600000000",
                      email: customerEmail
                    }
                  })
                });

                if (shipmentRes.ok) {
                  const shipmentData = await shipmentRes.json();
                  trackUrl = shipmentData.track_url;
                  console.log(`Envío creado en Packlink: ${shipmentData.reference}`);
                } else {
                  console.error("Packlink Error creando envío:", await shipmentRes.text());
                }
              }
            }
          }
        } catch (packlinkError) {
          console.error("Error en flujo de Packlink Webhook:", packlinkError);
        }

        // -------------------------------------------------------------
        // Enviar correos transaccionales con Resend (incluyendo tracking)
        // -------------------------------------------------------------
        const { sendOrderConfirmationEmail, sendAdminOrderNotification } = await import('@/lib/resend');
        await Promise.all([
          sendOrderConfirmationEmail(customerEmail, customerName, newOrderNumber, (session.amount_total || 0) / 100, trackUrl),
          sendAdminOrderNotification(newOrderNumber, (session.amount_total || 0) / 100, customerName)
        ]);

      } catch (dbError) {
        console.error("Error insertando pedido en DB", dbError);
        return NextResponse.json({ error: "Error interno BD" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
