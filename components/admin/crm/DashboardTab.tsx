'use client';

import {
  Euro,
  ClipboardList,
  CalendarDays,
  Target,
  ArrowRight,
  User,
  Clock,
  AlertCircle,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import Panel from '../Panel';
import StatusBadge from '../StatusBadge';
import { cn } from '@/lib/utils';

interface DashboardTabProps {
  contacts: any[];
  deals: any[];
  tasks: any[];
  events: any[];
  onNavigate: (tab: 'dashboard' | 'pipeline' | 'calendar' | 'contacts' | 'tasks') => void;
}

export default function DashboardTab({
  contacts,
  deals,
  tasks,
  events,
  onNavigate,
}: DashboardTabProps) {
  // KPIs calculation
  const openDeals = deals.filter((d) => d.status === 'ABIERTO');
  const totalOpenAmount = openDeals.reduce((sum, d) => sum + d.amount, 0);

  const pendingTasks = tasks.filter((t) => t.status === 'PENDIENTE');
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === 'ALTA');

  // Events of today (June 10, 2026, or current browser date)
  const today = new Date().toDateString();
  const todayEvents = events.filter((e) => new Date(e.startAt).toDateString() === today);

  const closedDeals = deals.filter((d) => d.stage === 'GANADO' || d.stage === 'PERDIDO');
  const wonDeals = deals.filter((d) => d.stage === 'GANADO');
  const conversionRate = closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-card border border-border/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Tratos Abiertos
            </span>
            <h3 className="text-2xl font-black font-heading mt-1 text-foreground">
              €{totalOpenAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </h3>
            <span className="text-[10px] text-primary font-bold mt-1 block">
              {openDeals.length} tratos en negociación
            </span>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Euro className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-card border border-border/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Tareas Pendientes
            </span>
            <h3 className="text-2xl font-black font-heading mt-1 text-foreground">
              {pendingTasks.length}
            </h3>
            <span className="text-[10px] text-red-600 font-bold mt-1 block flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {highPriorityTasks.length} prioridad alta
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-card border border-border/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Citas Hoy
            </span>
            <h3 className="text-2xl font-black font-heading mt-1 text-foreground">
              {todayEvents.length}
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
              {events.length} agendados en total
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-card border border-border/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Conversión Ventas
            </span>
            <h3 className="text-2xl font-black font-heading mt-1 text-foreground">
              {conversionRate.toFixed(1)}%
            </h3>
            <span className="text-[10px] text-indigo-600 font-bold mt-1 block">
              {wonDeals.length} ganados de {closedDeals.length} cerrados
            </span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Today's agenda & service appointments */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Panel
            title="Agenda de Servicios & Visitas (Hoy)"
            icon={CalendarDays}
            action={{ label: 'Ver Calendario', onClick: () => onNavigate('calendar') }}
            bodyClassName="px-0 pb-0"
          >
            {todayEvents.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No hay servicios ni citas agendadas para el día de hoy.
              </div>
            ) : (
              <ul className="divide-y divide-border/40">
                {todayEvents.map((event) => (
                  <li key={event.id} className="p-5 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-[10px] font-bold px-2 py-0.5 rounded-full',
                              event.type === 'APLICACION_SERVICIO'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-muted text-foreground border border-border'
                            )}
                          >
                            {event.type === 'APLICACION_SERVICIO' ? 'Aplicación' : event.type}
                          </span>
                          <h4 className="text-sm font-bold text-foreground">{event.title}</h4>
                        </div>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                        )}
                        {event.address && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{event.address}</span>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-0.5 ml-1.5 font-bold"
                            >
                              <span>Google Maps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 mt-2 sm:mt-0">
                        {event.contact && (
                          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            {event.contact.name}
                          </span>
                        )}
                        <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(event.startAt).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Pipeline value summary */}
          <Panel title="Resumen de Oportunidades por Etapa" icon={Target}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              {['NUEVO', 'PROPUESTA', 'NEGOCIACION', 'GANADO', 'PERDIDO'].map((stage) => {
                const stageDeals = deals.filter((d) => d.stage === stage);
                const sum = stageDeals.reduce((s, d) => s + d.amount, 0);

                return (
                  <div
                    key={stage}
                    className="p-4 rounded-xl border border-border/50 bg-muted/20 flex flex-col gap-1.5"
                  >
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      {stage}
                    </span>
                    <span className="text-base font-black text-foreground">
                      €{sum.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {stageDeals.length} tratos
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Right column: High priority tasks list */}
        <div className="flex flex-col gap-6">
          <Panel
            title="Tareas Prioritarias"
            icon={ClipboardList}
            action={{ label: 'Ver Tareas', onClick: () => onNavigate('tasks') }}
            bodyClassName="px-0 pb-0"
          >
            {highPriorityTasks.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No hay tareas pendientes de prioridad alta. ¡Buen trabajo!
              </div>
            ) : (
              <ul className="divide-y divide-border/40">
                {highPriorityTasks.slice(0, 6).map((task) => (
                  <li key={task.id} className="px-5 py-3.5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{task.title}</p>
                        {task.notes && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {task.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {task.dueDate && (
                            <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                              Vence:{' '}
                              {new Date(task.dueDate).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                              })}
                            </span>
                          )}
                          {task.contact && (
                            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-0.5">
                              <User className="w-3 h-3" /> {task.contact.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight
                        onClick={() => onNavigate('tasks')}
                        className="w-4 h-4 text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer shrink-0 mt-1"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
