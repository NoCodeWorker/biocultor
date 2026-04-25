'use server';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' });

export type CouponRow = {
  id: string;
  name: string | null;
  percentOff: number | null;
  amountOff: number | null;
  currency: string | null;
  duration: string;
  durationMonths: number | null;
  valid: boolean;
  timesRedeemed: number;
};

export type ActionResult<T = unknown> =
  | { success: true; coupon?: T; error?: undefined }
  | { success: false; error: string; coupon?: undefined };

function mapCoupon(c: Stripe.Coupon): CouponRow {
  return {
    id: c.id,
    name: c.name,
    percentOff: c.percent_off ?? null,
    amountOff: c.amount_off ?? null,
    currency: c.currency ?? null,
    duration: c.duration,
    durationMonths: c.duration_in_months ?? null,
    valid: c.valid,
    timesRedeemed: c.times_redeemed,
  };
}

export async function listCoupons(): Promise<CouponRow[]> {
  try {
    const list = await stripe.coupons.list({ limit: 100 });
    return list.data.map(mapCoupon);
  } catch {
    return [];
  }
}

export async function createCoupon(params: {
  name: string;
  type: 'percent' | 'amount';
  value: number;
  duration: 'once' | 'repeating' | 'forever';
  durationMonths?: number;
}): Promise<ActionResult<CouponRow>> {
  try {
    const coupon = await stripe.coupons.create({
      name: params.name,
      ...(params.type === 'percent'
        ? { percent_off: params.value }
        : { amount_off: Math.round(params.value * 100), currency: 'eur' }),
      duration: params.duration,
      ...(params.duration === 'repeating'
        ? { duration_in_months: params.durationMonths }
        : {}),
    });
    return { success: true, coupon: mapCoupon(coupon) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error creando el cupón en Stripe.';
    return { success: false, error: message };
  }
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  try {
    await stripe.coupons.del(id);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error eliminando el cupón.';
    return { success: false, error: message };
  }
}
