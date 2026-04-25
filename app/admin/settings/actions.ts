'use server';

import { revalidatePath } from 'next/cache';

// En una app real estos ajustes irían a una tabla Settings en BD.
// Por ahora los exponemos como lectura del entorno y actualizamos lo
// que sea seguro actualizar en runtime (thresholds, labels, etc.)

export async function revalidateAll(): Promise<{ success: boolean }> {
  revalidatePath('/', 'layout');
  revalidatePath('/admin', 'layout');
  return { success: true };
}
