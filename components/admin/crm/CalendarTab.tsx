'use client';

import { useState, useTransition } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ExternalLink,
  Trash2,
  FileText,
} from 'lucide-react';
import { createCrmEvent, deleteCrmEvent } from '@/app/admin/crm/actions';
import Panel from '../Panel';
import { cn } from '@/lib/utils';
import { CrmContactWithRelations, CrmEventWithRelations } from '@/types/crm';

interface CalendarTabProps {
  contacts: CrmContactWithRelations[];
  events: CrmEventWithRelations[];
}

export default function CalendarTab({ contacts, events }: CalendarTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPending, startTransition] = useTransition();

  // Create Event state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('APLICACION_SERVICIO');
  const [eventDescription, setEventDescription] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventContactId, setEventContactId] = useState('');
  const [eventStartHour, setEventStartHour] = useState('09:00');
  const [eventEndHour, setEventEndHour] = useState('10:00');

  // Selected event details state (for view modal)
  const [selectedEvent, setSelectedEvent] = useState<CrmEventWithRelations | null>(null);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calculate days in month
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Adjust firstDayIndex to make Monday first (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Helper to generate calendar days array
  const calendarDays = [];
  // Fill empty slots from prev month
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }
  // Fill current month days
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowCreateModal(true);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !selectedDay) {
      alert('Por favor, ingresa el título.');
      return;
    }

    // Parse dates
    const startAt = new Date(year, month, selectedDay);
    const [startH, startM] = eventStartHour.split(':');
    startAt.setHours(parseInt(startH), parseInt(startM));

    const endAt = new Date(year, month, selectedDay);
    const [endH, endM] = eventEndHour.split(':');
    endAt.setHours(parseInt(endH), parseInt(endM));

    startTransition(async () => {
      try {
        await createCrmEvent({
          title: eventTitle,
          description: eventDescription,
          address: eventAddress,
          startAt,
          endAt,
          type: eventType,
          contactId: eventContactId || undefined,
        });

        // Reset form
        setEventTitle('');
        setEventDescription('');
        setEventAddress('');
        setEventContactId('');
        setEventStartHour('09:00');
        setEventEndHour('10:00');
        setShowCreateModal(false);
      } catch (error) {
        console.error(error);
        alert('Error al agendar la cita.');
      }
    });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('¿Deseas eliminar esta cita/evento de forma permanente?')) {
      startTransition(async () => {
        try {
          await deleteCrmEvent(id);
          setSelectedEvent(null);
        } catch (error) {
          console.error(error);
          alert('Error al eliminar la cita.');
        }
      });
    }
  };

  // Google Calendar URL Generator helper
  const getGoogleCalendarUrl = (event: CrmEventWithRelations) => {
    const startStr = new Date(event.startAt).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endStr = new Date(event.endAt).toISOString().replace(/-|:|\.\d\d\d/g, '');

    const details = `${event.description || ''}\n\nContacto: ${event.contact ? `${event.contact.name} (${event.contact.phone || event.contact.email})` : 'N/A'}\nCRM: https://biocultor.com/admin/crm`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.address || '')}`;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-fade-in">
      {/* Calendar Grid Container */}
      <div className="flex-1 bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        {/* Calendar Header / Navigation */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              {monthNames[month]} {year}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-muted rounded-xl transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-xs font-bold bg-muted hover:bg-muted/80 rounded-xl transition-all cursor-pointer"
            >
              Hoy
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-muted rounded-xl transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center border-b border-border/20 pb-2">
          {daysOfWeek.map((day) => (
            <span key={day} className="text-xs font-bold text-muted-foreground">
              {day}
            </span>
          ))}
        </div>

        {/* Month grid squares */}
        <div className="grid grid-cols-7 gap-1.5 grow">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square bg-muted/10 rounded-xl" />;
            }

            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year;

            // Get events of this specific day
            const dateStr = new Date(year, month, day).toDateString();
            const dayEvents = events.filter((e) => new Date(e.startAt).toDateString() === dateStr);

            return (
              <div
                key={`day-${day}`}
                className={cn(
                  'aspect-square border border-border/30 rounded-xl p-1.5 flex flex-col gap-1 transition-all overflow-hidden relative group hover:border-primary/50 cursor-pointer min-h-[75px]',
                  isToday ? 'bg-primary/5 border-primary/50 ring-1 ring-primary/20' : 'bg-card'
                )}
                onClick={() => handleDayClick(day)}
              >
                {/* Day number */}
                <span
                  className={cn(
                    'text-[11px] font-bold self-start w-5 h-5 flex items-center justify-center rounded-full',
                    isToday ? 'bg-primary text-primary-foreground font-black' : 'text-muted-foreground'
                  )}
                >
                  {day}
                </span>

                {/* Day events badges */}
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto mt-0.5 no-scrollbar">
                  {dayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                      className={cn(
                        'text-[8px] font-bold px-1 py-0.5 rounded-md text-left truncate cursor-pointer select-none hover:scale-[1.02] active:scale-[0.98] transition-all w-full block border',
                        event.type === 'APLICACION_SERVICIO'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100/50'
                          : event.type === 'REUNION'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-100/50'
                            : 'bg-muted text-foreground border-border/50'
                      )}
                    >
                      {new Date(event.startAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} - {event.title}
                    </button>
                  ))}
                </div>

                {/* Hover Add Button Indicator */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground p-0.5 rounded-full scale-90">
                  <Plus className="w-2.5 h-2.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Detail Panel (If an event is selected) */}
      {selectedEvent && (
        <div className="w-full xl:w-80 shrink-0 animate-fade-in">
          <Panel
            title="Detalle de Cita"
            icon={FileText}
            action={{ label: 'Cerrar', onClick: () => setSelectedEvent(null) }}
          >
            <div className="flex flex-col gap-4">
              <div>
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    selectedEvent.type === 'APLICACION_SERVICIO'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  )}
                >
                  {selectedEvent.type === 'APLICACION_SERVICIO'
                    ? 'Aplicación de Servicio'
                    : selectedEvent.type}
                </span>
                <h4 className="text-sm font-bold text-foreground mt-2">{selectedEvent.title}</h4>
                {selectedEvent.description && (
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                )}
              </div>

              {/* Time details */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>
                  {new Date(selectedEvent.startAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  de{' '}
                  {new Date(selectedEvent.startAt).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  a{' '}
                  {new Date(selectedEvent.endAt).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Address with Google Maps link */}
              {selectedEvent.address && (
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">
                    Ubicación del Servicio
                  </span>
                  <div className="flex items-start gap-1.5 text-foreground mt-0.5">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground leading-normal">{selectedEvent.address}</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1 font-bold mt-1"
                      >
                        <span>Ver en Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact associated */}
              {selectedEvent.contact && (
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">
                    Contacto Relacionado
                  </span>
                  <div className="flex items-center gap-2 mt-1 bg-muted/30 p-2 rounded-xl border border-border/40">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {selectedEvent.contact.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0 text-[11px]">
                      <p className="font-bold text-foreground truncate">{selectedEvent.contact.name}</p>
                      <p className="text-muted-foreground truncate">{selectedEvent.contact.phone || selectedEvent.contact.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-4 border-t border-border/40 mt-2">
                {/* Google Calendar export button */}
                <a
                  href={getGoogleCalendarUrl(selectedEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-foreground text-background hover:bg-foreground/90 px-4 py-2.5 rounded-xl transition-all w-full text-center"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Añadir a Google Calendar</span>
                </a>

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-all w-full cursor-pointer border border-red-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Cita</span>
                </button>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-card border border-border/60 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-heading font-black text-foreground">
              Agendar Cita / Servicio ({selectedDay} de {monthNames[month]})
            </h3>

            <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Título de la Cita *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Aplicación Té Humus - Jardín Juan M."
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Tipo de Evento
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="APLICACION_SERVICIO">Aplicación de Servicio</option>
                    <option value="REUNION">Reunión</option>
                    <option value="LLAMADA">Llamada</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Contacto Relacionado
                  </label>
                  <select
                    value={eventContactId}
                    onChange={(e) => setEventContactId(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="">-- Ninguno --</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    required
                    value={eventStartHour}
                    onChange={(e) => setEventStartHour(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Hora de Fin
                  </label>
                  <input
                    type="time"
                    required
                    value={eventEndHour}
                    onChange={(e) => setEventEndHour(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Dirección física (Google Maps)
                </label>
                <input
                  type="text"
                  placeholder="Calle de la Haya, 12, Pozuelo de Alarcón, Madrid"
                  value={eventAddress}
                  onChange={(e) => setEventAddress(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Notas / Descripción
                </label>
                <textarea
                  rows={2}
                  placeholder="Instrucciones adicionales para el técnico..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground bg-muted hover:bg-muted/80 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/95 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Agendar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
