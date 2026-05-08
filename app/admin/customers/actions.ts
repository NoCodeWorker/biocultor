'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateCustomerDiscount(customerId: string, discount: number) {
  try {
    // Validar el descuento
    const validDiscount = Math.max(0, Math.min(100, discount || 0));

    await prisma.customer.update({
      where: { id: customerId },
      data: { discount: validDiscount }
    });

    // Registrar la acción administrativa
    await prisma.adminAction.create({
      data: {
        action: 'updateCustomerDiscount',
        payload: JSON.stringify({ customerId, discount: validDiscount })
      }
    });

    revalidatePath('/admin/customers');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating customer discount:', error);
    return { error: 'Error al actualizar el descuento' };
  }
}
