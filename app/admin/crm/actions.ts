'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// -----------------------------------------------------------------------------
// CONTACTS ACTIONS
// -----------------------------------------------------------------------------

export async function getCrmContacts() {
  return await prisma.crmContact.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      deals: true,
      tasks: true,
      events: true,
    },
  });
}

export async function createCrmContact(data: {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  type?: string;
  stage?: string;
  notes?: string;
  customerId?: string;
}) {
  const contact = await prisma.crmContact.create({
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      company: data.company || null,
      source: data.source || 'Directo',
      type: data.type || 'B2C',
      stage: data.stage || 'LEAD',
      notes: data.notes || null,
      customerId: data.customerId || null,
    },
  });

  // Log action
  await prisma.adminAction.create({
    data: {
      action: 'createCrmContact',
      payload: JSON.stringify({ id: contact.id, name: contact.name }),
    },
  });

  revalidatePath('/admin/crm');
  return contact;
}

export async function updateCrmContact(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    type?: string;
    stage?: string;
    notes?: string;
    customerId?: string;
  }
) {
  const contact = await prisma.crmContact.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email !== undefined ? data.email || null : undefined,
      phone: data.phone !== undefined ? data.phone || null : undefined,
      company: data.company !== undefined ? data.company || null : undefined,
      source: data.source,
      type: data.type,
      stage: data.stage,
      notes: data.notes !== undefined ? data.notes || null : undefined,
      customerId: data.customerId !== undefined ? data.customerId || null : undefined,
    },
  });

  revalidatePath('/admin/crm');
  return contact;
}

export async function deleteCrmContact(id: string) {
  await prisma.crmContact.delete({
    where: { id },
  });

  revalidatePath('/admin/crm');
  return { success: true };
}

// -----------------------------------------------------------------------------
// DEALS ACTIONS
// -----------------------------------------------------------------------------

export async function getCrmDeals() {
  return await prisma.crmDeal.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      contact: true,
    },
  });
}

export async function createCrmDeal(data: {
  title: string;
  amount: number;
  type: string;
  stage: string;
  contactId: string;
}) {
  const deal = await prisma.crmDeal.create({
    data: {
      title: data.title,
      amount: data.amount || 0.0,
      type: data.type || 'PRODUCTO',
      stage: data.stage || 'NUEVO',
      contactId: data.contactId,
      status: data.stage === 'GANADO' ? 'GANADO' : data.stage === 'PERDIDO' ? 'PERDIDO' : 'ABIERTO',
    },
  });

  revalidatePath('/admin/crm');
  return deal;
}

export async function updateCrmDeal(
  id: string,
  data: {
    title?: string;
    amount?: number;
    type?: string;
    stage?: string;
    status?: string;
  }
) {
  const updateData: any = { ...data };
  if (data.stage) {
    if (data.stage === 'GANADO') updateData.status = 'GANADO';
    else if (data.stage === 'PERDIDO') updateData.status = 'PERDIDO';
    else updateData.status = 'ABIERTO';
  }

  const deal = await prisma.crmDeal.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/admin/crm');
  return deal;
}

export async function deleteCrmDeal(id: string) {
  await prisma.crmDeal.delete({
    where: { id },
  });

  revalidatePath('/admin/crm');
  return { success: true };
}

// -----------------------------------------------------------------------------
// TASKS ACTIONS
// -----------------------------------------------------------------------------

export async function getCrmTasks() {
  return await prisma.crmTask.findMany({
    orderBy: [{ status: 'asc' }, { priority: 'desc' }, { dueDate: 'asc' }],
    include: {
      contact: true,
    },
  });
}

export async function createCrmTask(data: {
  title: string;
  notes?: string;
  priority?: string;
  dueDate?: Date;
  contactId?: string;
}) {
  const task = await prisma.crmTask.create({
    data: {
      title: data.title,
      notes: data.notes || null,
      priority: data.priority || 'MEDIA',
      dueDate: data.dueDate || null,
      contactId: data.contactId || null,
    },
  });

  revalidatePath('/admin/crm');
  return task;
}

export async function updateCrmTask(
  id: string,
  data: {
    title?: string;
    notes?: string;
    status?: string;
    priority?: string;
    dueDate?: Date | null;
    contactId?: string | null;
  }
) {
  const task = await prisma.crmTask.update({
    where: { id },
    data: {
      title: data.title,
      notes: data.notes !== undefined ? data.notes || null : undefined,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      contactId: data.contactId,
    },
  });

  revalidatePath('/admin/crm');
  return task;
}

export async function deleteCrmTask(id: string) {
  await prisma.crmTask.delete({
    where: { id },
  });

  revalidatePath('/admin/crm');
  return { success: true };
}

// -----------------------------------------------------------------------------
// EVENTS ACTIONS
// -----------------------------------------------------------------------------

export async function getCrmEvents() {
  return await prisma.crmEvent.findMany({
    orderBy: { startAt: 'asc' },
    include: {
      contact: true,
    },
  });
}

export async function createCrmEvent(data: {
  title: string;
  description?: string;
  address?: string;
  startAt: Date;
  endAt: Date;
  type?: string;
  contactId?: string;
}) {
  const event = await prisma.crmEvent.create({
    data: {
      title: data.title,
      description: data.description || null,
      address: data.address || null,
      startAt: data.startAt,
      endAt: data.endAt,
      type: data.type || 'REUNION',
      contactId: data.contactId || null,
    },
  });

  revalidatePath('/admin/crm');
  return event;
}

export async function updateCrmEvent(
  id: string,
  data: {
    title?: string;
    description?: string;
    address?: string;
    startAt?: Date;
    endAt?: Date;
    type?: string;
    contactId?: string | null;
  }
) {
  const event = await prisma.crmEvent.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description !== undefined ? data.description || null : undefined,
      address: data.address !== undefined ? data.address || null : undefined,
      startAt: data.startAt,
      endAt: data.endAt,
      type: data.type,
      contactId: data.contactId,
    },
  });

  revalidatePath('/admin/crm');
  return event;
}

export async function deleteCrmEvent(id: string) {
  await prisma.crmEvent.delete({
    where: { id },
  });

  revalidatePath('/admin/crm');
  return { success: true };
}

// -----------------------------------------------------------------------------
// CRM UTILITIES / PRE-POPULATION / AUTOMATION
// -----------------------------------------------------------------------------

/**
 * Importa clientes existentes en la e-commerce como contactos del CRM.
 * Evita duplicidades comprobando por email o vinculación previa.
 */
export async function syncExistingStoreCustomers() {
  const customers = await prisma.customer.findMany({
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  let importedCount = 0;

  for (const c of customers) {
    // Verificar si ya existe en CRM
    const existing = await prisma.crmContact.findFirst({
      where: {
        OR: [{ email: c.email }, { customerId: c.id }],
      },
    });

    if (!existing) {
      // Determinar origen y etapa del lead
      const source = c.orders.length > 0 ? 'Tienda Online' : 'Registro Web';
      const stage = c.orders.length > 0 ? 'CLIENTE' : 'CONTACTADO';

      const contact = await prisma.crmContact.create({
        data: {
          name: c.name,
          email: c.email,
          phone: c.phone || null,
          source,
          type: 'B2C', // Default,
          stage,
          customerId: c.id,
        },
      });

      // Si tiene pedidos, crear tratos cerrados ganados
      for (const order of c.orders) {
        await prisma.crmDeal.create({
          data: {
            title: `Pedido ${order.orderNumber}`,
            amount: order.totalAmount,
            type: 'PRODUCTO',
            stage: 'GANADO',
            status: 'GANADO',
            contactId: contact.id,
            orderId: order.id,
            createdAt: order.createdAt,
          },
        });
      }

      importedCount++;
    }
  }

  revalidatePath('/admin/crm');
  return { success: true, count: importedCount };
}
