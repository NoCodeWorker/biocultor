import prisma from '@/lib/db';
import CrmContainer from './CrmContainer';
import {
  getCrmContacts,
  getCrmDeals,
  getCrmTasks,
  getCrmEvents,
} from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminCrmPage() {
  const [contacts, deals, tasks, events, storeCustomers] = await Promise.all([
    getCrmContacts(),
    getCrmDeals(),
    getCrmTasks(),
    getCrmEvents(),
    prisma.customer.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, email: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
          Ventas
        </p>
        <h1 className="text-2xl md:text-3xl font-heading font-black text-foreground tracking-tight mt-1">
          CRM Ventas & Servicios
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Gestiona tus clientes potenciales, presupuestos de servicios, calendario de visitas y ventas.
        </p>
      </div>

      <CrmContainer
        initialContacts={contacts}
        initialDeals={deals}
        initialTasks={tasks}
        initialEvents={events}
        storeCustomers={storeCustomers}
      />
    </div>
  );
}
