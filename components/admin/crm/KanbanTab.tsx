'use client';

import { useState, useTransition } from 'react';
import {
  Plus,
  Briefcase,
  Layers,
  Euro,
  User,
  Trash2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { createCrmDeal, updateCrmDeal, deleteCrmDeal } from '@/app/admin/crm/actions';
import Panel from '../Panel';

interface KanbanTabProps {
  contacts: any[];
  deals: any[];
}

type Stage = 'NUEVO' | 'PROPUESTA' | 'NEGOCIACION' | 'GANADO' | 'PERDIDO';

const COLUMNS: { id: Stage; label: string; color: string }[] = [
  { id: 'NUEVO', label: 'Nuevo Lead', color: 'bg-blue-500' },
  { id: 'PROPUESTA', label: 'Propuesta / Presupuesto', color: 'bg-amber-500' },
  { id: 'NEGOCIACION', label: 'Negociación', color: 'bg-indigo-500' },
  { id: 'GANADO', label: 'Ganado / Cerrado', color: 'bg-emerald-500' },
  { id: 'PERDIDO', label: 'Perdido', color: 'bg-red-500' },
];

export default function KanbanTab({ contacts, deals }: KanbanTabProps) {
  const [pipelineType, setPipelineType] = useState<'SERVICIO' | 'PRODUCTO'>('SERVICIO');
  const [isPending, startTransition] = useTransition();

  // Create Deal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealAmount, setNewDealAmount] = useState('');
  const [newDealContactId, setNewDealContactId] = useState('');
  const [newDealStage, setNewDealStage] = useState<Stage>('NUEVO');

  // Filter deals by pipeline type
  const filteredDeals = deals.filter((d) => d.type === pipelineType);

  const handleMoveStage = (dealId: string, nextStage: Stage) => {
    startTransition(async () => {
      try {
        await updateCrmDeal(dealId, { stage: nextStage });
      } catch (error) {
        console.error(error);
        alert('Error al actualizar el estado del trato.');
      }
    });
  };

  const handleDeleteDeal = (dealId: string) => {
    if (confirm('¿Deseas eliminar este trato de forma permanente?')) {
      startTransition(async () => {
        try {
          await deleteCrmDeal(dealId);
        } catch (error) {
          console.error(error);
          alert('Error al eliminar el trato.');
        }
      });
    }
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealTitle || !newDealContactId) {
      alert('Por favor, rellena el título y selecciona un contacto.');
      return;
    }

    startTransition(async () => {
      try {
        await createCrmDeal({
          title: newDealTitle,
          amount: parseFloat(newDealAmount) || 0.0,
          type: pipelineType,
          stage: newDealStage,
          contactId: newDealContactId,
        });

        // Reset form
        setNewDealTitle('');
        setNewDealAmount('');
        setNewDealContactId('');
        setNewDealStage('NUEVO');
        setShowCreateModal(false);
      } catch (error) {
        console.error(error);
        alert('Error al crear el trato.');
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Filters and New Deal Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Pipeline selector */}
        <div className="inline-flex bg-muted p-1 rounded-xl border border-border/60">
          <button
            onClick={() => setPipelineType('SERVICIO')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all select-none cursor-pointer ${
              pipelineType === 'SERVICIO'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Servicios y Aplicaciones</span>
          </button>
          <button
            onClick={() => setPipelineType('PRODUCTO')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all select-none cursor-pointer ${
              pipelineType === 'PRODUCTO'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Venta de Productos</span>
          </button>
        </div>

        {/* Add Deal Button */}
        <button
          onClick={() => {
            if (contacts.length === 0) {
              alert('Debes crear al menos un contacto antes de crear un trato.');
              return;
            }
            setShowCreateModal(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-4 py-2.5 rounded-xl shadow-sm hover:scale-102 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Trato / Oportunidad</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colDeals = filteredDeals.filter((d) => d.stage === col.id);
          const colTotal = colDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div
              key={col.id}
              className="bg-card/40 border border-border/50 rounded-2xl p-4 flex flex-col gap-4 min-w-[200px]"
            >
              {/* Column header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.color}`} />
                    {col.label}
                  </h4>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mt-1">
                    €{colTotal.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  {colDeals.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex flex-col gap-3 min-h-[300px]">
                {colDeals.length === 0 ? (
                  <div className="text-center py-12 text-[10px] text-muted-foreground border border-dashed border-border/50 rounded-xl">
                    Arrastra o añade un trato aquí
                  </div>
                ) : (
                  colDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-card border border-border/75 hover:border-primary p-3 rounded-xl shadow-sm flex flex-col gap-2.5 transition-all group hover:scale-[1.01]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-foreground line-clamp-2 leading-relaxed">
                          {deal.title}
                        </h5>
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity p-0.5 cursor-pointer"
                          title="Eliminar trato"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Euro className="w-3 h-3 text-muted-foreground" />
                          {deal.amount.toFixed(0)}
                        </span>
                        {deal.contact && (
                          <span
                            className="text-[9px] font-semibold text-muted-foreground max-w-[100px] truncate flex items-center gap-0.5"
                            title={deal.contact.name}
                          >
                            <User className="w-2.5 h-2.5 shrink-0" />
                            {deal.contact.name}
                          </span>
                        )}
                      </div>

                      {/* Dropdown to change stage directly in card */}
                      <div className="border-t border-border/40 pt-2 flex items-center justify-between gap-1">
                        <span className="text-[9px] text-muted-foreground font-semibold">Etapa:</span>
                        <select
                          value={deal.stage}
                          disabled={isPending}
                          onChange={(e) => handleMoveStage(deal.id, e.target.value as Stage)}
                          className="text-[10px] font-bold bg-muted/60 hover:bg-muted border border-border/80 rounded-md py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer text-foreground"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Deal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-card border border-border/60 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-heading font-black text-foreground">
              Añadir Oportunidad de Venta ({pipelineType === 'SERVICIO' ? 'Servicio' : 'Producto'})
            </h3>

            <form onSubmit={handleCreateDeal} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Título del Trato *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Servicio Césped Chalet Pozuelo"
                  value={newDealTitle}
                  onChange={(e) => setNewDealTitle(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Importe (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="195.00"
                    value={newDealAmount}
                    onChange={(e) => setNewDealAmount(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Etapa Inicial
                  </label>
                  <select
                    value={newDealStage}
                    onChange={(e) => setNewDealStage(e.target.value as Stage)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Contacto Relacionado *
                </label>
                <select
                  required
                  value={newDealContactId}
                  onChange={(e) => setNewDealContactId(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="">-- Seleccionar Contacto --</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ''} - {c.email || c.phone || 'Sin datos'}
                    </option>
                  ))}
                </select>
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
                  Crear Oportunidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
