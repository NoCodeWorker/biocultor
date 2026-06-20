'use server';

import prisma from '@/lib/db';
import { sendContactFormEmail } from '@/lib/resend';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const reason = formData.get('motivo') as string;
  const message = formData.get('mensaje') as string;
  const sourcePath = cleanOptional(formData.get('sourcePath')) || '/contacto';
  const sourceQuery = cleanOptional(formData.get('sourceQuery')) || '';
  const sourceReferrer = cleanOptional(formData.get('sourceReferrer')) || '';
  const estimatedM2 = cleanOptional(formData.get('estimatedM2')) || '';
  const estimatedPrice = cleanOptional(formData.get('estimatedPrice')) || '';

  if (!name || !email || !reason || !message) {
    return { error: 'Por favor, rellena todos los campos.' };
  }

  try {
    await sendContactFormEmail(name, email, reason, message);
    await syncContactLeadToCrm({
      name,
      email,
      reason,
      message,
      sourcePath,
      sourceQuery,
      sourceReferrer,
      estimatedM2,
      estimatedPrice,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Ocurrió un error al enviar el mensaje. Por favor, intenta de nuevo.' };
  }
}

function cleanOptional(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 500) : null;
}

function getLeadSource(sourceQuery: string, sourceReferrer: string) {
  const query = sourceQuery.toLowerCase();
  const referrer = sourceReferrer.toLowerCase();

  if (query.includes('utm_')) return 'Web Campaign';
  if (referrer.includes('google.') || referrer.includes('bing.') || referrer.includes('duckduckgo.')) {
    return 'Web Organic';
  }
  return 'Web Direct';
}

function isServiceLead(reason: string, message: string) {
  const text = `${reason} ${message}`.toLowerCase();
  return [
    'servicio',
    'presupuesto',
    'diagnóstico',
    'diagnostico',
    'jardin',
    'jardín',
    'paisajista',
    'comunidad',
    'cesped',
    'césped',
    'aplicación',
    'aplicacion',
  ].some((term) => text.includes(term));
}

async function syncContactLeadToCrm({
  name,
  email,
  reason,
  message,
  sourcePath,
  sourceQuery,
  sourceReferrer,
  estimatedM2,
  estimatedPrice,
}: {
  name: string;
  email: string;
  reason: string;
  message: string;
  sourcePath: string;
  sourceQuery: string;
  sourceReferrer: string;
  estimatedM2: string;
  estimatedPrice: string;
}) {
  try {
    const leadSource = getLeadSource(sourceQuery, sourceReferrer);
    const serviceLead = isServiceLead(reason, message);
    const attributionNote = [
      `Formulario web: ${reason}`,
      `URL origen: ${sourcePath}${sourceQuery}`,
      sourceReferrer ? `Referrer: ${sourceReferrer}` : 'Referrer: directo/no disponible',
      estimatedM2 ? `Superficie estimada: ${estimatedM2} m2` : null,
      estimatedPrice ? `Precio estimado: ${estimatedPrice} EUR` : null,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const existing = await prisma.crmContact.findFirst({
      where: { email },
      select: { id: true, notes: true, stage: true },
    });

    const contact = existing
      ? await prisma.crmContact.update({
          where: { id: existing.id },
          data: {
            name,
            source: leadSource,
            type: serviceLead ? 'B2B' : 'B2C',
            stage: existing.stage === 'CLIENTE' ? 'CLIENTE' : 'LEAD',
            notes: [existing.notes, attributionNote].filter(Boolean).join('\n\n---\n\n'),
          },
        })
      : await prisma.crmContact.create({
          data: {
            name,
            email,
            source: leadSource,
            type: serviceLead ? 'B2B' : 'B2C',
            stage: 'LEAD',
            notes: attributionNote,
          },
        });

    const amount = parseEstimatedAmount(estimatedPrice);
    const deal = await prisma.crmDeal.create({
      data: {
        title: serviceLead ? `Lead servicio: ${reason}` : `Lead contacto: ${reason}`,
        amount: Number.isFinite(amount) ? amount : 0,
        type: serviceLead ? 'SERVICIO' : 'PRODUCTO',
        stage: 'NUEVO',
        status: 'ABIERTO',
        contactId: contact.id,
      },
    });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    await prisma.crmTask.create({
      data: {
        title: serviceLead ? `Responder lead de servicio: ${name}` : `Responder consulta web: ${name}`,
        notes: `Origen: ${sourcePath}${sourceQuery}\nMotivo: ${reason}`,
        priority: serviceLead ? 'ALTA' : 'MEDIA',
        dueDate,
        contactId: contact.id,
        dealId: deal.id,
      },
    });

    await prisma.adminAction.create({
      data: {
        action: 'syncContactLeadToCrm',
        payload: JSON.stringify({
          contactId: contact.id,
          source: leadSource,
          sourcePath,
          serviceLead,
        }),
      },
    });

    revalidatePath('/admin/crm');
    revalidatePath('/admin/analytics');
  } catch (error) {
    console.error('Error al sincronizar lead de contacto con CRM:', error);
  }
}

function parseEstimatedAmount(value: string) {
  if (!value) return 0;
  const sanitized = value.replace(/[^\d,.-]/g, '');
  const withoutThousands = sanitized.replace(/\.(?=\d{3}(\D|$))/g, '');
  return Number.parseFloat(withoutThousands.replace(',', '.'));
}
