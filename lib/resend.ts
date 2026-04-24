import { Resend } from 'resend';
import { siteConfig } from '@/lib/site-config';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Biocultor <pedidos@biocultor.com>';
const ADMIN_INBOX = process.env.ADMIN_EMAIL || siteConfig.supportEmail;

const C = {
  cream: '#F5EFE0',
  card: '#FFFFFF',
  text: '#2B2118',
  muted: '#8A7762',
  soft: '#6B5D52',
  green: '#5A7A4A',
  greenDark: '#3F5A33',
  border: '#E5DED0',
  accent: '#F9F5EA',
};

function emailShell(title: string, preheader: string, inner: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:${C.cream}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:${C.text}; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.cream};">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">
          <tr>
            <td align="center" style="padding:0 0 36px 0;">
              <a href="${siteConfig.defaultUrl}" style="text-decoration:none;">
                <img src="${siteConfig.defaultUrl}/Logo.svg" alt="Biocultor" width="180" style="display:block; margin:0 auto; max-width:180px; height:auto; border:0; outline:none;" />
              </a>
              <div style="width:42px; height:2px; background-color:${C.green}; margin:16px auto 0 auto;"></div>
            </td>
          </tr>
          <tr>
            <td style="background-color:${C.card}; border-radius:14px; padding:48px 40px; border:1px solid ${C.border};">
              ${inner}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:32px 20px 0 20px;">
              <p style="margin:0 0 8px 0; font-size:12px; color:${C.muted}; line-height:1.5;">
                <strong style="color:${C.text};">Biocultor</strong> · ${siteConfig.city}, ${siteConfig.region}
              </p>
              <p style="margin:0 0 12px 0; font-size:12px; color:${C.muted};">
                <a href="${siteConfig.defaultUrl}" style="color:${C.green}; text-decoration:none;">biocultor.com</a>
                &nbsp;·&nbsp;
                <a href="mailto:${siteConfig.supportEmail}" style="color:${C.green}; text-decoration:none;">${siteConfig.supportEmail}</a>
              </p>
              <p style="margin:0 0 18px 0; font-size:12px; color:${C.muted};">
                <a href="${siteConfig.socials[0]}" style="color:${C.muted}; text-decoration:none; margin:0 6px;">Instagram</a>·
                <a href="${siteConfig.socials[1]}" style="color:${C.muted}; text-decoration:none; margin:0 6px;">LinkedIn</a>·
                <a href="${siteConfig.socials[2]}" style="color:${C.muted}; text-decoration:none; margin:0 6px;">Facebook</a>
              </p>
              <p style="margin:0; font-size:11px; color:#B3A696; line-height:1.5;">
                Has recibido este correo porque hay actividad asociada a tu cuenta de Biocultor.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export type OrderEmailItem = {
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  imagePath?: string | null;
};

function renderItemsTable(items: OrderEmailItem[]) {
  if (!items.length) return '';
  const rows = items.map((it) => {
    const lineTotal = (it.unitPrice * it.quantity).toFixed(2);
    const thumb = it.imagePath
      ? `<img src="${siteConfig.defaultUrl}${it.imagePath.startsWith('/') ? '' : '/'}${encodeURI(it.imagePath)}" alt="" width="56" height="56" style="display:block; border-radius:8px; border:1px solid ${C.border}; object-fit:cover;" />`
      : `<div style="width:56px; height:56px; border-radius:8px; background-color:${C.accent}; border:1px solid ${C.border};"></div>`;
    return `
      <tr>
        <td style="padding:14px 0; border-bottom:1px solid ${C.border}; vertical-align:top; width:72px;">${thumb}</td>
        <td style="padding:14px 12px; border-bottom:1px solid ${C.border}; vertical-align:top;">
          <div style="font-size:14px; font-weight:600; color:${C.text}; line-height:1.3; margin-bottom:3px;">${it.name}</div>
          <div style="font-size:12px; color:${C.muted};">${it.size} · ${it.quantity} ud${it.quantity > 1 ? 's' : ''}</div>
        </td>
        <td align="right" style="padding:14px 0; border-bottom:1px solid ${C.border}; vertical-align:top; white-space:nowrap;">
          <div style="font-family:Georgia,serif; font-size:15px; font-weight:700; color:${C.text};">${lineTotal}€</div>
        </td>
      </tr>`;
  }).join('');

  return `
    <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:${C.muted}; margin:0 0 12px 0;">Artículos</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px; border-top:1px solid ${C.border};">
      ${rows}
    </table>
  `;
}

export async function sendOrderConfirmationEmail(customerEmail: string, customerName: string, orderNumber: string, totalAmount: number, trackUrl?: string, items: OrderEmailItem[] = []) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("No RESEND_API_KEY found, skipping order confirmation email");
    return;
  }

  const trackingBlock = trackUrl
    ? `<div style="background-color:${C.accent}; border-radius:10px; padding:22px; margin:8px 0 0 0; border:1px solid ${C.border};">
         <p style="margin:0 0 14px 0; font-size:14px; color:${C.text}; line-height:1.5;">
           <strong>Tu paquete ya tiene etiqueta de envío.</strong><br/>
           <span style="color:${C.soft};">Consulta el seguimiento cuando quieras:</span>
         </p>
         <a href="${trackUrl}" style="display:inline-block; background-color:${C.green}; color:#FFFFFF; padding:13px 30px; text-decoration:none; border-radius:8px; font-weight:600; font-size:14px; letter-spacing:0.3px;">Rastrear envío →</a>
       </div>`
    : `<div style="background-color:${C.accent}; border-radius:10px; padding:20px; margin:8px 0 0 0; border:1px solid ${C.border};">
         <p style="margin:0; font-size:14px; color:${C.soft}; line-height:1.6;">
           En cuanto tu paquete salga de nuestras instalaciones, te enviaremos un segundo correo con el enlace de seguimiento.
         </p>
       </div>`;

  const inner = `
    <h1 style="margin:0 0 10px 0; font-family:Georgia,serif; font-size:28px; font-weight:600; color:${C.text}; line-height:1.3;">
      Gracias, ${customerName}
    </h1>
    <p style="margin:0 0 32px 0; font-size:15px; color:${C.soft}; line-height:1.5;">
      Hemos recibido tu pedido y ya está en preparación.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0; border-top:1px solid ${C.border}; border-bottom:1px solid ${C.border};">
      <tr>
        <td style="padding:22px 0;">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:${C.muted}; margin-bottom:6px;">Número de pedido</div>
          <div style="font-family:'Courier New',monospace; font-size:17px; font-weight:700; color:${C.text};">${orderNumber}</div>
        </td>
        <td align="right" style="padding:22px 0;">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:${C.muted}; margin-bottom:6px;">Total pagado</div>
          <div style="font-family:Georgia,serif; font-size:24px; font-weight:700; color:${C.green};">${totalAmount.toFixed(2)}€</div>
        </td>
      </tr>
    </table>

    ${renderItemsTable(items)}

    ${trackingBlock}

    <p style="margin:32px 0 0 0; font-size:14px; color:${C.soft}; line-height:1.6;">
      Si tienes cualquier duda sobre tu pedido o sobre la aplicación agronómica del producto, basta con <strong style="color:${C.text};">responder a este correo</strong> — te atiende una persona real.
    </p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      replyTo: ADMIN_INBOX,
      subject: `Pedido ${orderNumber} confirmado — Biocultor`,
      html: emailShell(
        `Pedido ${orderNumber} confirmado`,
        `Hemos recibido tu pedido ${orderNumber} por ${totalAmount.toFixed(2)}€ y ya está en preparación.`,
        inner
      ),
    });
  } catch (error) {
    console.error("Error enviando email de confirmación:", error);
  }
}

export async function sendAdminOrderNotification(orderNumber: string, totalAmount: number, customerName: string, items: OrderEmailItem[] = []) {
  if (!process.env.RESEND_API_KEY) return;

  const inner = `
    <div style="display:inline-block; padding:6px 12px; background-color:${C.accent}; border:1px solid ${C.border}; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:${C.green}; margin-bottom:20px;">
      Nueva venta
    </div>
    <h1 style="margin:0 0 28px 0; font-family:Georgia,serif; font-size:26px; font-weight:600; color:${C.text}; line-height:1.3;">
      Pedido ${orderNumber}
    </h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.border};">
      <tr>
        <td style="padding:18px 0; border-bottom:1px solid ${C.border};">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:${C.muted}; margin-bottom:4px;">Cliente</div>
          <div style="font-size:15px; color:${C.text};">${customerName}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 0; border-bottom:1px solid ${C.border};">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:${C.muted}; margin-bottom:4px;">Total</div>
          <div style="font-family:Georgia,serif; font-size:22px; font-weight:700; color:${C.green};">${totalAmount.toFixed(2)}€</div>
        </td>
      </tr>
    </table>

    <div style="margin-top:28px;">${renderItemsTable(items)}</div>

    <div style="margin-top:8px;">
      <a href="https://dashboard.stripe.com/payments" style="display:inline-block; background-color:${C.text}; color:#FFFFFF; padding:12px 24px; text-decoration:none; border-radius:8px; font-weight:600; font-size:13px; letter-spacing:0.3px;">Ver en Stripe →</a>
    </div>

    <p style="margin:28px 0 0 0; font-size:13px; color:${C.soft}; line-height:1.6;">
      La dirección de envío y el teléfono están en la tabla <code style="background:${C.accent}; padding:2px 6px; border-radius:4px; font-size:12px;">Order</code> y en Stripe Checkout.
    </p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_INBOX,
      subject: `Nueva venta ${orderNumber} — ${totalAmount.toFixed(2)}€`,
      html: emailShell(
        `Nueva venta ${orderNumber}`,
        `${customerName} acaba de realizar un pedido por ${totalAmount.toFixed(2)}€.`,
        inner
      ),
    });
  } catch (error) {
    console.error("Error enviando email al admin:", error);
  }
}

export async function sendContactFormEmail(name: string, email: string, reason: string, message: string) {
  if (!process.env.RESEND_API_KEY) return;

  const inner = `
    <div style="display:inline-block; padding:6px 12px; background-color:${C.accent}; border:1px solid ${C.border}; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:${C.green}; margin-bottom:20px;">
      Consulta entrante
    </div>
    <h1 style="margin:0 0 28px 0; font-family:Georgia,serif; font-size:24px; font-weight:600; color:${C.text}; line-height:1.3;">
      ${reason}
    </h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.border};">
      <tr>
        <td style="padding:16px 0; border-bottom:1px solid ${C.border};">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:${C.muted}; margin-bottom:4px;">De</div>
          <div style="font-size:15px; color:${C.text};">${name} · <a href="mailto:${email}" style="color:${C.green}; text-decoration:none;">${email}</a></div>
        </td>
      </tr>
    </table>

    <div style="margin-top:22px; background-color:${C.accent}; border-left:3px solid ${C.green}; padding:20px 22px; border-radius:6px;">
      <p style="margin:0; font-size:14px; color:${C.text}; line-height:1.7; white-space:pre-wrap;">${message.replace(/\n/g, '<br/>')}</p>
    </div>

    <p style="margin:24px 0 0 0; font-size:13px; color:${C.soft}; line-height:1.6;">
      Puedes responder directamente a este correo — irá a <strong style="color:${C.text};">${email}</strong>.
    </p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_INBOX,
      replyTo: email,
      subject: `Consulta: ${reason} · ${name}`,
      html: emailShell(
        `Consulta de ${name}`,
        `Nueva consulta desde el formulario de contacto: ${reason}`,
        inner
      ),
    });
  } catch (error) {
    console.error("Error enviando email de contacto:", error);
    throw new Error('Error al enviar el correo');
  }
}
