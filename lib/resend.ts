import { Resend } from 'resend';
import { siteConfig } from '@/lib/site-config';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Biocultor <pedidos@biocultor.com>';
const ADMIN_INBOX = process.env.ADMIN_EMAIL || siteConfig.supportEmail;

export async function sendOrderConfirmationEmail(customerEmail: string, customerName: string, orderNumber: string, totalAmount: number, trackUrl?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("No RESEND_API_KEY found, skipping order confirmation email");
    return;
  }

  const trackingHtml = trackUrl 
    ? `<div style="margin-top: 24px; margin-bottom: 24px;">
         <p>Ya hemos generado la etiqueta de envío. Puedes rastrear tu paquete aquí:</p>
         <a href="${trackUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Rastrear mi pedido</a>
       </div>` 
    : `<p>Te enviaremos el enlace de seguimiento en cuanto el paquete salga de nuestras instalaciones.</p>`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      replyTo: ADMIN_INBOX,
      subject: `¡Confirmación de tu pedido ${orderNumber} en Biocultor!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2F4F4F;">¡Hola ${customerName}!</h1>
          <p>Gracias por confiar en Biocultor. Tu pedido <strong>${orderNumber}</strong> ha sido confirmado y está en preparación.</p>
          <p>El total pagado es de <strong>${totalAmount.toFixed(2)}€</strong>.</p>
          
          ${trackingHtml}

          <hr style="border-top: 1px solid #ccc; margin-top: 32px; margin-bottom: 16px;" />
          <p style="font-size: 12px; color: #666;">
            Si tienes alguna duda técnica sobre la aplicación, responde a este correo o visita nuestras guías agronómicas.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error enviando email de confirmación:", error);
  }
}

export async function sendAdminOrderNotification(orderNumber: string, totalAmount: number, customerName: string) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_INBOX,
      subject: `Nuevo pedido recibido: ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>Nuevo pedido registrado</h2>
          <p><strong>Pedido:</strong> ${orderNumber}</p>
          <p><strong>Cliente:</strong> ${customerName}</p>
          <p><strong>Total:</strong> ${totalAmount.toFixed(2)}€</p>
          <p>Accede al panel de Stripe o la base de datos para ver los detalles y la dirección de envío.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error enviando email al admin:", error);
  }
}

export async function sendContactFormEmail(name: string, email: string, reason: string, message: string) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_INBOX,
      replyTo: email,
      subject: `Nueva consulta de contacto: ${reason}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>Nueva consulta desde la web</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Motivo:</strong> ${reason}</p>
          <h3>Mensaje:</h3>
          <p style="background: #f4f4f4; padding: 12px; border-radius: 8px;">${message.replace(/\n/g, '<br/>')}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error enviando email de contacto:", error);
    throw new Error('Error al enviar el correo');
  }
}
