'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type StockResult =
  | { success: true }
  | { success: false; error: string };

export async function patchVariantStock(
  variantId: string,
  newStock: number
): Promise<StockResult> {
  if (!Number.isInteger(newStock) || newStock < 0) {
    return { success: false, error: 'El stock debe ser un entero ≥ 0.' };
  }

  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });
  if (!variant) return { success: false, error: 'Variante no encontrada.' };

  await prisma.variant.update({
    where: { id: variantId },
    data: { stock: newStock },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/inventory');
  revalidatePath(`/admin/products/${variant.productId}`);
  revalidatePath(`/producto/${variant.product.slug}`);

  return { success: true };
}
