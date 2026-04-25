import Stripe from 'stripe';

// Cliente Stripe servidor-side compartido. Lo encapsulamos aquí para no
// duplicar `new Stripe(...)` y para tener un único sitio donde cambiar la
// versión de API.
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY no está configurado en el entorno.');
  }
  cached = new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
  return cached;
}

/**
 * Resuelve el `payment_intent` de un pedido a partir del `stripeSession`
 * (Checkout Session id) que guardamos en `Order.stripeSession`.
 *
 * Stripe Refunds API trabaja con `payment_intent`, no con `cs_...`.
 */
export async function getPaymentIntentFromSession(sessionId: string): Promise<string | null> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (typeof session.payment_intent === 'string') return session.payment_intent;
  if (session.payment_intent && 'id' in session.payment_intent) {
    return session.payment_intent.id;
  }
  return null;
}

/**
 * Crea un refund (total o parcial) sobre un payment intent.
 *
 * @param paymentIntentId  id `pi_...`
 * @param amountCents      importe en céntimos. Omitido = refund total.
 */
export async function refundPaymentIntent(
  paymentIntentId: string,
  amountCents?: number
): Promise<Stripe.Refund> {
  const stripe = getStripe();
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(amountCents !== undefined ? { amount: amountCents } : {}),
    reason: 'requested_by_customer',
  });
}
