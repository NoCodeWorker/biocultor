'use server';

import prisma from '@/lib/db';
import { sendContactFormEmail } from '@/lib/resend';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: FormData) {
  const name = cleanRequired(formData.get('name'));
  const email = cleanOptional(formData.get('email')) || '';
  const phone = cleanOptional(formData.get('phone')) || '';
  const reason = cleanRequired(formData.get('motivo'));
  const message = cleanRequired(formData.get('mensaje'));
  const sourcePath = cleanOptional(formData.get('sourcePath')) || '/contacto';
  const sourceQuery = cleanOptional(formData.get('sourceQuery')) || '';
  const sourceReferrer = cleanOptional(formData.get('sourceReferrer')) || '';
  const estimatedM2 = cleanOptional(formData.get('estimatedM2')) || '';
  const estimatedPrice = cleanOptional(formData.get('estimatedPrice')) || '';
  const serviceSlug = cleanOptional(formData.get('serviceSlug')) || extractServiceSlug(sourceQuery);
  const leadIntent = cleanOptional(formData.get('leadIntent')) || inferLeadIntent(reason, message, serviceSlug);

  if (!name || !reason || !message || (!email && !phone)) {
    return { error: 'Por favor, rellena todos los campos.' };
  }

  try {
    await sendContactFormEmail(name, email, reason, message, phone);
    await syncContactLeadToCrm({
      name,
      email,
      phone,
      reason,
      message,
      sourcePath,
      sourceQuery,
      sourceReferrer,
      estimatedM2,
      estimatedPrice,
      serviceSlug,
      leadIntent,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Ocurrió un error al enviar el mensaje. Por favor, intenta de nuevo.' };
  }
}

function cleanRequired(value: FormDataEntryValue | null) {
  return cleanOptional(value) || '';
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

function extractServiceSlug(sourceQuery: string) {
  const rawQuery = sourceQuery.startsWith('?') ? sourceQuery.slice(1) : sourceQuery;
  const params = new URLSearchParams(rawQuery);
  return params.get('servicio')?.slice(0, 120) || '';
}

function inferLeadIntent(reason: string, message: string, serviceSlug: string) {
  if (serviceSlug) return serviceSlug === 'calculadora' ? 'calculator' : 'service';
  return isServiceLead(reason, message) ? 'service' : 'product';
}

async function syncContactLeadToCrm({
  name,
  email,
  phone,
  reason,
  message,
  sourcePath,
  sourceQuery,
  sourceReferrer,
  estimatedM2,
  estimatedPrice,
  serviceSlug,
  leadIntent,
}: {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  sourcePath: string;
  sourceQuery: string;
  sourceReferrer: string;
  estimatedM2: string;
  estimatedPrice: string;
  serviceSlug: string;
  leadIntent: string;
}) {
  try {
    const leadSource = getLeadSource(sourceQuery, sourceReferrer);
    const serviceLead = leadIntent === 'service' || isServiceLead(reason, message);
    const attributionNote = [
      `Formulario web: ${reason}`,
      `URL origen: ${sourcePath}${sourceQuery}`,
      sourceReferrer ? `Referrer: ${sourceReferrer}` : 'Referrer: directo/no disponible',
      phone ? `Telefono: ${phone}` : null,
      serviceSlug ? `Servicio slug: ${serviceSlug}` : null,
      leadIntent ? `Intencion: ${leadIntent}` : null,
      estimatedM2 ? `Superficie estimada: ${estimatedM2} m2` : null,
      estimatedPrice ? `Precio estimado: ${estimatedPrice} EUR` : null,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const existing = await prisma.crmContact.findFirst({
      where: email ? { email } : { phone },
      select: { id: true, notes: true, stage: true },
    });

    const contact = existing
      ? await prisma.crmContact.update({
          where: { id: existing.id },
          data: {
            name,
            email: email || undefined,
            phone: phone || undefined,
            source: leadSource,
            sourcePath,
            sourceQuery,
            sourceReferrer,
            serviceSlug,
            leadIntent,
            estimatedM2,
            estimatedPrice,
            type: serviceLead ? 'B2B' : 'B2C',
            stage: existing.stage === 'CLIENTE' ? 'CLIENTE' : 'LEAD',
            notes: [existing.notes, attributionNote].filter(Boolean).join('\n\n---\n\n'),
          },
        })
      : await prisma.crmContact.create({
          data: {
            name,
            email: email || undefined,
            phone: phone || undefined,
            source: leadSource,
            sourcePath,
            sourceQuery,
            sourceReferrer,
            serviceSlug,
            leadIntent,
            estimatedM2,
            estimatedPrice,
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
