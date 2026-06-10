'use client';

import { useState, useTransition } from 'react';
import {
  LayoutDashboard,
  KanbanSquare,
  Calendar,
  Users,
  CheckSquare,
  RefreshCw,
} from 'lucide-react';
import { syncExistingStoreCustomers } from './actions';
import DashboardTab from '@/components/admin/crm/DashboardTab';
import KanbanTab from '@/components/admin/crm/KanbanTab';
import CalendarTab from '@/components/admin/crm/CalendarTab';
import ContactsTab from '@/components/admin/crm/ContactsTab';
import TasksTab from '@/components/admin/crm/TasksTab';
import { cn } from '@/lib/utils';

type TabId = 'dashboard' | 'pipeline' | 'calendar' | 'contacts' | 'tasks';

interface CrmContainerProps {
  initialContacts: any[];
  initialDeals: any[];
  initialTasks: any[];
  initialEvents: any[];
  storeCustomers: any[];
}

export default function CrmContainer({
  initialContacts,
  initialDeals,
  initialTasks,
  initialEvents,
  storeCustomers,
}: CrmContainerProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isPending, startTransition] = useTransition();
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline Ventas', icon: KanbanSquare },
    { id: 'calendar', label: 'Calendario & Servicios', icon: Calendar },
    { id: 'contacts', label: 'Contactos & Leads', icon: Users },
    { id: 'tasks', label: 'Tareas y Alertas', icon: CheckSquare },
  ] as const;

  const handleSyncCustomers = () => {
    if (confirm('¿Deseas sincronizar e importar todos los clientes y pedidos existentes de la tienda online hacia el CRM?')) {
      startTransition(async () => {
        try {
          const res = await syncExistingStoreCustomers();
          setSyncStatus(`Sincronización completada: ${res.count} nuevos clientes importados.`);
          setTimeout(() => setSyncStatus(null), 5000);
        } catch (error) {
          console.error(error);
          alert('Ocurrió un error al sincronizar los clientes.');
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs Navigation & Global Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card p-2 rounded-2xl border border-border/60">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 select-none cursor-pointer',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-102'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {syncStatus && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 animate-fade-in font-semibold">
              {syncStatus}
            </span>
          )}
          <button
            onClick={handleSyncCustomers}
            disabled={isPending}
            className="inline-flex items-center gap-2 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border/80 px-3.5 py-2.5 rounded-xl transition-all hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isPending && 'animate-spin')} />
            <span>Sincronizar Tienda</span>
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="min-h-[500px]">
        {activeTab === 'dashboard' && (
          <DashboardTab
            contacts={initialContacts}
            deals={initialDeals}
            tasks={initialTasks}
            events={initialEvents}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'pipeline' && (
          <KanbanTab
            contacts={initialContacts}
            deals={initialDeals}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarTab
            contacts={initialContacts}
            events={initialEvents}
          />
        )}
        {activeTab === 'contacts' && (
          <ContactsTab
            contacts={initialContacts}
            storeCustomers={storeCustomers}
          />
        )}
        {activeTab === 'tasks' && (
          <TasksTab
            contacts={initialContacts}
            tasks={initialTasks}
          />
        )}
      </div>
    </div>
  );
}
