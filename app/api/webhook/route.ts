import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import Stripe from 'stripe';
import prisma from '@/lib/db';
import { createPacklinkShipment, variantWeightKg } from '@/lib/packlink';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
  });

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
      // ── Idempotencia (1/2): si ya creamos el Order para este checkout
      // session, salimos con 200 antes de tocar nada. Stripe reintenta el
      // webhook hasta 3 días si no recibe 2xx; sin este guard, cada reintento
      // duplicaba customer upsert, Packlink y correos.
      const alreadyProcessed = await prisma.order.findUnique({
        where: { stripeSession: session.id },
        select: { id: true },
      });
      if (alreadyProcessed) {
        return NextResponse.json({ received: true, deduplicated: true });
      }

      try {
        // M9: si Stripe no devuelve email, generamos uno único por sesión para
        // que cada pedido sin email sea un Customer distinto. Antes todos
        // caían en `anonimo@biocultor.com` y se fusionaban en un único Customer
        // gigante, perdiendo trazabilidad.
        const customerEmail = session.customer_details?.email || `anon-${session.id}@biocultor.local`;
        const customerName = session.customer_details?.name || 'Cliente';
        const phone = session.customer_details?.phone || '';
        
        // Formatear dirección
        const addr = session.customer_details?.address;
        const addressString = addr ? `${addr.line1} ${addr.line2 || ''}, ${addr.city}, ${addr.postal_code}, ${addr.country}` : 'Desconocida';
        
        // Recuperar variantes del carrito desde PendingCart (vía pendingCartId
        // en metadata). Caemos a `cartItems` legacy si recibimos un evento que
        // se encoló con el formato anterior — ventana de migración.
        let metaCartItems: { id: string; q: number; p: number }[] = [];
        const pendingCartId = session.metadata?.pendingCartId;
        if (pendingCartId) {
          const pending = await prisma.pendingCart.findUnique({
            where: { id: pendingCartId },
            select: { itemsJson: true },
          });
          if (pending) {
            metaCartItems = JSON.parse(pending.itemsJson);
          } else {
            console.warn(`PendingCart ${pendingCartId} no encontrado (¿ya consumido y purgado?).`);
          }
        } else if (session.metadata?.cartItems) {
          metaCartItems = JSON.parse(session.metadata.cartItems);
        }

        // Inyectar o buscar Cliente
        const customer = await prisma.customer.upsert({
          where: { email: customerEmail },
          update: { name: customerName, phone },
          create: { email: customerEmail, name: customerName, phone },
        });

        const trackingToken = randomBytes(24).toString('hex');

        // Crear Orden con número correlativo atómico. El upsert del Counter y
        // el INSERT del Order van en la misma $transaction: si el INSERT falla
        // (P2002, etc.) el contador NO avanza. Y dos webhooks simultáneos
        // jamás reciben el mismo número porque el upsert se serializa.
        let createdOrder;
        try {
          createdOrder = await prisma.$transaction(async (tx) => {
            const counter = await tx.counter.upsert({
              where: { name: 'order' },
              update: { value: { increment: 1 } },
              // Arrancamos en 1_000_001 para que los nuevos pedidos sean
              // disjuntos del rango antiguo (BIO-100000..BIO-999999).
              create: { name: 'order', value: 1_000_001 },
            });
            const orderNumber = `BIO-${counter.value}`;
            return tx.order.create({
              data: {
                orderNumber,
                customerId: customer.id,
                totalAmount: (session.amount_total || 0) / 100,
                stripeSession: session.id,
                shippingAddress: addressString,
                status: "PAID",
                trackingToken,
                shippingPostalCode: addr?.postal_code ?? null,
                items: {
                  create: metaCartItems.map((item: any) => ({
                    variantId: item.id,
                    quantity: item.q,
                    priceAt: item.p
                  }))
                }
              }
            });
          });
        } catch (e: unknown) {
          // ── Idempotencia (2/2): si dos deliveries del webhook entraron casi a
          // la vez, ambas pasaron el findUnique inicial pero solo uno gana el
          // INSERT. El segundo recibe P2002 (unique violation en stripeSession
          // u orderNumber) y debe responder 200, no 500, para que Stripe no
          // siga reintentando algo ya hecho por la otra delivery.
          const code = (e as { code?: string } | null)?.code;
          if (code === 'P2002') {
            return NextResponse.json({ received: true, deduplicated: true });
          }
          throw e;
        }

        // PendingCart consumido — borramos para no acumular filas. Si falla
        // (otro delivery lo borró), no es crítico: el Order ya está creado.
        if (pendingCartId) {
          prisma.pendingCart.deleteMany({ where: { id: pendingCartId } }).catch(() => {});
        }

        // -------------------------------------------------------------
        // Lookup de variants reales (un solo query reusado para peso + emails)
        // -------------------------------------------------------------
        const variantIds: string[] = metaCartItems.map((i: any) => i.id);
        const variantRows = variantIds.length
          ? await prisma.variant.findMany({
              where: { id: { in: variantIds } },
              include: { product: true },
            })
          : [];

        // -------------------------------------------------------------
        // CREAR ENVÍO EN PACKLINK PRO
        // -------------------------------------------------------------
        // Peso real desde DB (no heurística por substring de id ni precio).
        // Si por algún motivo no encontramos la variant, asumimos 5 kg conservador.
        const totalWeight = metaCartItems.reduce((acc: number, item: any) => {
          const v = variantRows.find((x) => x.id === item.id);
          if (!v) return acc + 5 * item.q;
          return acc + variantWeightKg(v.size) * item.q;
        }, 0);

        try {
          if (process.env.PACKLINK_API_KEY && addr?.postal_code) {
            const result = await createPacklinkShipment({
              customerName,
              customerEmail,
              customerPhone: phone,
              shippingAddress: {
                line1: addr.line1 || 'Desconocida',
                line2: addr.line2 ?? '',
                city: addr.city || 'Desconocida',
                postalCode: addr.postal_code,
                country: addr.country || 'ES',
              },
              packageWeightKg: Math.max(1, totalWeight),
            });

            if ('error' in result) {
              console.error('Packlink Error creando envío:', result.error);
            } else {
              await prisma.order.update({
                where: { id: createdOrder.id },
                data: {
                  packlinkReference: result.reference,
                  trackUrl: result.trackUrl,
                  carrier: result.carrier,
                  serviceName: result.serviceName,
                  lastStatus: result.rawStatus ?? 'CREATED',
                  lastStatusAt: new Date(),
                },
              });
              console.log(`Envío creado en Packlink: ${result.reference}`);
            }
          }
        } catch (packlinkError) {
          console.error('Error en flujo de Packlink Webhook:', packlinkError);
        }

        // -------------------------------------------------------------
        // Enviar correos transaccionales con Resend (incluyendo tracking)
        // -------------------------------------------------------------
        const emailItems = metaCartItems.map((item: any) => {
          const v = variantRows.find((x) => x.id === item.id);
          return {
            name: v?.product.name ?? 'Producto Biocultor',
            size: v?.size ?? '',
            quantity: item.q,
            unitPrice: item.p,
            imagePath: v?.imagePath ?? null,
          };
        });

        // Emails: aislados en su propio try/catch. Si Resend falla, el pedido
        // YA está en DB y Packlink ya está creado — no queremos que Stripe
        // reintente el webhook (duplicaría side effects ya hechos). Log y vamos.
        try {
          const { sendOrderConfirmationEmail, sendAdminOrderNotification } = await import('@/lib/resend');
          const { getBaseUrl } = await import('@/lib/site-config');
          const trackingPageUrl = `${getBaseUrl()}/seguimiento/${createdOrder.orderNumber}?token=${trackingToken}`;
          await Promise.all([
            sendOrderConfirmationEmail(customerEmail, customerName, createdOrder.orderNumber, (session.amount_total || 0) / 100, trackingPageUrl, emailItems),
            sendAdminOrderNotification(createdOrder.orderNumber, (session.amount_total || 0) / 100, customerName, emailItems)
          ]);
        } catch (emailErr) {
          console.error('Error enviando correos transaccionales (no se reintenta el webhook):', emailErr);
        }

      } catch (dbError) {
        console.error("Error insertando pedido en DB", dbError);
        return NextResponse.json({ error: "Error interno BD" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
