'use server';

import { sendContactFormEmail } from '@/lib/resend';

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const reason = formData.get('motivo') as string;
  const message = formData.get('mensaje') as string;

  if (!name || !email || !reason || !message) {
    return { error: 'Por favor, rellena todos los campos.' };
  }

  try {
    await sendContactFormEmail(name, email, reason, message);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Ocurrió un error al enviar el mensaje. Por favor, intenta de nuevo.' };
  }
}
