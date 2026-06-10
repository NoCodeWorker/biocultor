'use client';

import { useState, useTransition } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { createCrmTask, updateCrmTask, deleteCrmTask } from '@/app/admin/crm/actions';
import Panel from '../Panel';
import { cn } from '@/lib/utils';

interface TasksTabProps {
  contacts: any[];
  tasks: any[];
}

export default function TasksTab({ contacts, tasks }: TasksTabProps) {
  const [filterStatus, setFilterStatus] = useState<string>('PENDIENTE');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isPending, startTransition] = useTransition();

  // Create Task Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIA');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskContactId, setTaskContactId] = useState('');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = t.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const handleToggleTask = (task: any) => {
    const nextStatus = task.status === 'PENDIENTE' ? 'COMPLETADA' : 'PENDIENTE';
    startTransition(async () => {
      try {
        await updateCrmTask(task.id, { status: nextStatus });
      } catch (error) {
        console.error(error);
        alert('Error al actualizar el estado de la tarea.');
      }
    });
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('¿Deseas eliminar esta tarea de forma permanente?')) {
      startTransition(async () => {
        try {
          await deleteCrmTask(id);
        } catch (error) {
          console.error(error);
          alert('Error al eliminar la tarea.');
        }
      });
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) {
      alert('Por favor, ingresa el título.');
      return;
    }

    startTransition(async () => {
      try {
        await createCrmTask({
          title: taskTitle,
          notes: taskNotes || undefined,
          priority: taskPriority,
          dueDate: taskDueDate ? new Date(taskDueDate) : undefined,
          contactId: taskContactId || undefined,
        });

        // Reset
        setTaskTitle('');
        setTaskNotes('');
        setTaskPriority('MEDIA');
        setTaskDueDate('');
        setTaskContactId('');
        setShowCreateModal(false);
      } catch (error) {
        console.error(error);
        alert('Error al crear la tarea.');
      }
    });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-fade-in">
      {/* Task List Section */}
      <div className="flex-1 bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status buttons */}
          <div className="inline-flex bg-muted p-1 rounded-xl border border-border/60 self-start">
            <button
              onClick={() => setFilterStatus('PENDIENTE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer ${
                filterStatus === 'PENDIENTE'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Pendientes ({tasks.filter((t) => t.status === 'PENDIENTE').length})</span>
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETADA')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer ${
                filterStatus === 'COMPLETADA'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completadas ({tasks.filter((t) => t.status === 'COMPLETADA').length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Priority filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-xs bg-muted/40 border border-border/80 rounded-xl py-2 px-3 focus:outline-none text-foreground cursor-pointer"
            >
              <option value="ALL">Todas las prioridades</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:scale-102 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Tarea</span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex flex-col gap-2 mt-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 text-sm text-muted-foreground border border-dashed border-border/50 rounded-2xl">
              No hay tareas en esta categoría.
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  'flex items-start justify-between gap-4 p-4 border border-border/55 rounded-xl transition-all hover:bg-muted/15 group',
                  task.status === 'COMPLETADA' && 'opacity-65'
                )}
              >
                {/* Toggle checkbox & details */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    disabled={isPending}
                    onClick={() => handleToggleTask(task)}
                    className="mt-0.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {task.status === 'PENDIENTE' ? (
                      <Square className="w-5 h-5" />
                    ) : (
                      <CheckSquare className="w-5 h-5 text-primary" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-bold text-foreground truncate',
                        task.status === 'COMPLETADA' && 'line-through text-muted-foreground'
                      )}
                    >
                      {task.title}
                    </p>
                    {task.notes && (
                      <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                        {task.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      {/* Priority Badge */}
                      <span
                        className={cn(
                          'text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-0.5',
                          task.priority === 'ALTA'
                            ? 'bg-red-50 text-red-700 border-red-100'
                            : task.priority === 'MEDIA'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                        )}
                      >
                        {task.priority === 'ALTA' && <AlertCircle className="w-2.5 h-2.5" />}
                        Prioridad {task.priority}
                      </span>

                      {/* Due Date */}
                      {task.dueDate && (
                        <span className="text-[9px] font-semibold text-muted-foreground bg-muted border border-border/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span>
                            Vence:{' '}
                            {new Date(task.dueDate).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                            })}
                          </span>
                        </span>
                      )}

                      {/* Associated Contact */}
                      {task.contact && (
                        <span className="text-[9px] font-semibold text-muted-foreground bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <User className="w-3 h-3 text-primary" />
                          <span>Contacto: {task.contact.name}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-all p-1.5 cursor-pointer shrink-0"
                  title="Eliminar tarea"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Side Quick Help Panel */}
      <div className="w-full xl:w-72 shrink-0">
        <Panel title="Organización CRM" icon={CheckSquare}>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Las tareas del CRM te ayudan a mantener al día los seguimientos comerciales:
          </p>
          <ul className="list-disc list-inside text-xs text-muted-foreground mt-3 flex flex-col gap-2 leading-relaxed">
            <li>
              Usa la prioridad <strong className="text-red-700">ALTA</strong> para llamadas de cierre de presupuestos de servicios.
            </li>
            <li>
              Vincular tareas a un contacto te permite verlas directamente desde su ficha.
            </li>
            <li>
              Las tareas vencidas aparecerán destacadas en la pestaña de Dashboard general.
            </li>
          </ul>
        </Panel>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-card border border-border/60 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-heading font-black text-foreground">
              Añadir Nueva Tarea / Recordatorio
            </h3>

            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Título de la Tarea *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Llamar a Juan para confirmar presupuesto"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Prioridad
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Contacto Relacionado
                </label>
                <select
                  value={taskContactId}
                  onChange={(e) => setTaskContactId(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground cursor-pointer focus:outline-none"
                >
                  <option value="">-- No vincular a contacto --</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Notas / Descripción
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre el recordatorio o llamada..."
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
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
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
