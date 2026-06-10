'use client';

import { useState, useTransition } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Building,
  MapPin,
  ExternalLink,
  ChevronRight,
  User,
  Activity,
  FileText,
} from 'lucide-react';
import { createCrmContact, updateCrmContact, deleteCrmContact } from '@/app/admin/crm/actions';
import Panel from '../Panel';
import StatusBadge from '../StatusBadge';
import { cn } from '@/lib/utils';

interface ContactsTabProps {
  contacts: any[];
  storeCustomers: any[];
}

export default function ContactsTab({ contacts, storeCustomers }: ContactsTabProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [isPending, startTransition] = useTransition();

  // Selected contact detail sidebar
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactSource, setContactSource] = useState('Directo');
  const [contactType, setContactType] = useState('B2C');
  const [contactStage, setContactStage] = useState('LEAD');
  const [contactNotes, setContactNotes] = useState('');
  const [contactCustomerId, setContactCustomerId] = useState('');

  // Filtering contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.phone && c.phone.includes(search)) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType === 'ALL' || c.type === filterType;
    const matchesStage = filterStage === 'ALL' || c.stage === filterStage;

    return matchesSearch && matchesType && matchesStage;
  });

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName) {
      alert('El nombre es obligatorio.');
      return;
    }

    startTransition(async () => {
      try {
        await createCrmContact({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          company: contactCompany,
          source: contactSource,
          type: contactType,
          stage: contactStage,
          notes: contactNotes,
          customerId: contactCustomerId || undefined,
        });

        // Reset
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactCompany('');
        setContactSource('Directo');
        setContactType('B2C');
        setContactStage('LEAD');
        setContactNotes('');
        setContactCustomerId('');
        setShowCreateModal(false);
      } catch (error) {
        console.error(error);
        alert('Error al crear el contacto.');
      }
    });
  };

  const handleOpenEdit = (c: any) => {
    setContactName(c.name);
    setContactEmail(c.email || '');
    setContactPhone(c.phone || '');
    setContactCompany(c.company || '');
    setContactSource(c.source || 'Directo');
    setContactType(c.type || 'B2C');
    setContactStage(c.stage || 'LEAD');
    setContactNotes(c.notes || '');
    setContactCustomerId(c.customerId || '');
    setShowEditModal(true);
  };

  const handleEditContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    startTransition(async () => {
      try {
        await updateCrmContact(selectedContact.id, {
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          company: contactCompany,
          source: contactSource,
          type: contactType,
          stage: contactStage,
          notes: contactNotes,
          customerId: contactCustomerId || undefined,
        });

        // Sync local selected contact view
        setSelectedContact({
          ...selectedContact,
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          company: contactCompany,
          source: contactSource,
          type: contactType,
          stage: contactStage,
          notes: contactNotes,
          customerId: contactCustomerId || null,
        });

        setShowEditModal(false);
      } catch (error) {
        console.error(error);
        alert('Error al guardar los cambios.');
      }
    });
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('¿Deseas eliminar este contacto del CRM de forma permanente? Se eliminarán también sus tratos y tareas asociadas.')) {
      startTransition(async () => {
        try {
          await deleteCrmContact(id);
          setSelectedContact(null);
        } catch (error) {
          console.error(error);
          alert('Error al eliminar el contacto.');
        }
      });
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-fade-in">
      {/* List section */}
      <div className="flex-1 bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        {/* Table Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar contactos por nombre, email, teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-muted/40 border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs bg-muted/40 border border-border/80 rounded-xl py-2 px-3 focus:outline-none text-foreground cursor-pointer"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="B2C">B2C (Particular)</option>
              <option value="B2B">B2B (Profesional)</option>
            </select>

            {/* Filter by Stage */}
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="text-xs bg-muted/40 border border-border/80 rounded-xl py-2 px-3 focus:outline-none text-foreground cursor-pointer"
            >
              <option value="ALL">Todas las etapas</option>
              <option value="LEAD">Lead</option>
              <option value="CONTACTADO">Contactado</option>
              <option value="OPORTUNIDAD">Oportunidad</option>
              <option value="CLIENTE">Cliente</option>
              <option value="INACTIVO">Inactivo</option>
            </select>

            {/* New Contact Action */}
            <button
              onClick={() => {
                setContactName('');
                setContactEmail('');
                setContactPhone('');
                setContactCompany('');
                setContactSource('Directo');
                setContactType('B2C');
                setContactStage('LEAD');
                setContactNotes('');
                setContactCustomerId('');
                setShowCreateModal(true);
              }}
              className="inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:scale-102 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo</span>
            </button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="overflow-x-auto">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-16 text-sm text-muted-foreground border border-dashed border-border/50 rounded-2xl">
              No se han encontrado contactos que coincidan con la búsqueda.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/55 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="pb-3 pl-3">Nombre</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3">Contacto</th>
                  <th className="pb-3">Origen</th>
                  <th className="pb-3">Etapa</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="py-3.5 pl-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-normal">{contact.name}</p>
                          {contact.company && (
                            <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-0.5">
                              <Building className="w-3.5 h-3.5" />
                              {contact.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          contact.type === 'B2B'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        )}
                      >
                        {contact.type}
                      </span>
                    </td>
                    <td className="py-3.5 text-xs text-muted-foreground leading-relaxed">
                      {contact.email && (
                        <p className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> {contact.email}
                        </p>
                      )}
                      {contact.phone && (
                        <p className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {contact.phone}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 text-xs font-semibold text-muted-foreground">
                      {contact.source}
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={contact.stage} />
                    </td>
                    <td className="py-3.5 text-right pr-3">
                      <ChevronRight className="w-4 h-4 text-muted-foreground/45 group-hover:text-primary transition-colors inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedContact && (
        <div className="w-full xl:w-96 shrink-0 animate-fade-in">
          <Panel
            title="Detalle del Contacto"
            icon={User}
            action={{ label: 'Cerrar', onClick: () => setSelectedContact(null) }}
          >
            <div className="flex flex-col gap-5">
              {/* Header profile */}
              <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                  {selectedContact.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-foreground truncate">{selectedContact.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5" /> {selectedContact.company || 'Particular'}
                  </p>
                </div>
              </div>

              {/* Status and details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-muted/20 p-3.5 rounded-xl border border-border/40">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Etapa Lead
                  </span>
                  <div className="mt-1">
                    <StatusBadge status={selectedContact.stage} />
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Tipo de Cuenta
                  </span>
                  <div className="mt-1">
                    <span className="font-bold text-foreground">{selectedContact.type === 'B2B' ? 'Profesional (B2B)' : 'Particular (B2C)'}</span>
                  </div>
                </div>
              </div>

              {/* Phone, Email and Location */}
              <div className="flex flex-col gap-3 text-xs leading-normal">
                {selectedContact.email && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${selectedContact.email}`} className="hover:underline">
                      {selectedContact.email}
                    </a>
                  </div>
                )}
                {selectedContact.phone && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a href={`tel:${selectedContact.phone}`} className="hover:underline">
                      {selectedContact.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Origen: {selectedContact.source}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedContact.notes && (
                <div className="flex flex-col gap-1.5 border-t border-border/40 pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Notas y Seguimiento
                  </span>
                  <p className="text-xs text-foreground bg-muted/20 p-3 rounded-xl border border-border/40 whitespace-pre-wrap leading-relaxed">
                    {selectedContact.notes}
                  </p>
                </div>
              )}

              {/* Associated deals list */}
              <div className="flex flex-col gap-2 border-t border-border/40 pt-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Tratos / Oportunidades ({selectedContact.deals?.length || 0})
                </span>
                {selectedContact.deals?.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {selectedContact.deals.map((deal: any) => (
                      <li
                        key={deal.id}
                        className="bg-muted/15 border border-border/40 p-2.5 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{deal.title}</p>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {deal.stage} · {deal.type === 'SERVICIO' ? 'Servicio' : 'Producto'}
                          </span>
                        </div>
                        <span className="font-bold text-foreground">€{deal.amount.toFixed(0)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[10px] text-muted-foreground">Sin tratos asociados.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-border/40 mt-3">
                <button
                  onClick={() => handleOpenEdit(selectedContact)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-border/75"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDeleteContact(selectedContact.id)}
                  disabled={isPending}
                  className="inline-flex items-center justify-center p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-100 cursor-pointer"
                  title="Eliminar contacto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* Create Contact Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-card border border-border/60 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-heading font-black text-foreground">
              Añadir Nuevo Contacto / Lead CRM
            </h3>

            <form onSubmit={handleCreateContact} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Gómez"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="carlos@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    placeholder="600123456"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Empresa / Organización
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Jardinería Verde SL"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Origen del Lead
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Recomendación, Web, Instagram"
                    value={contactSource}
                    onChange={(e) => setContactSource(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Tipo de Lead
                  </label>
                  <select
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="B2C">B2C (Particular)</option>
                    <option value="B2B">B2B (Profesional)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Etapa del Ciclo
                  </label>
                  <select
                    value={contactStage}
                    onChange={(e) => setContactStage(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="LEAD">Lead</option>
                    <option value="CONTACTADO">Contactado</option>
                    <option value="OPORTUNIDAD">Oportunidad</option>
                    <option value="CLIENTE">Cliente</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Vincular a Cuenta de Tienda
                </label>
                <select
                  value={contactCustomerId}
                  onChange={(e) => setContactCustomerId(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground cursor-pointer focus:outline-none"
                >
                  <option value="">-- No vincular a cliente online --</option>
                  {storeCustomers.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name} ({sc.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Notas de Seguimiento
                </label>
                <textarea
                  rows={2}
                  placeholder="Añade detalles sobre la llamada, necesidades del jardín..."
                  value={contactNotes}
                  onChange={(e) => setContactNotes(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
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
                  Crear Contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-card border border-border/60 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-heading font-black text-foreground">
              Editar Contacto CRM
            </h3>

            <form onSubmit={handleEditContact} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Empresa / Organización
                  </label>
                  <input
                    type="text"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Origen del Lead
                  </label>
                  <input
                    type="text"
                    value={contactSource}
                    onChange={(e) => setContactSource(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Tipo de Lead
                  </label>
                  <select
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="B2C">B2C (Particular)</option>
                    <option value="B2B">B2B (Profesional)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                    Etapa del Ciclo
                  </label>
                  <select
                    value={contactStage}
                    onChange={(e) => setContactStage(e.target.value)}
                    className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="LEAD">Lead</option>
                    <option value="CONTACTADO">Contactado</option>
                    <option value="OPORTUNIDAD">Oportunidad</option>
                    <option value="CLIENTE">Cliente</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Vincular a Cuenta de Tienda
                </label>
                <select
                  value={contactCustomerId}
                  onChange={(e) => setContactCustomerId(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground cursor-pointer focus:outline-none"
                >
                  <option value="">-- No vincular a cliente online --</option>
                  {storeCustomers.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name} ({sc.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Notas de Seguimiento
                </label>
                <textarea
                  rows={2}
                  value={contactNotes}
                  onChange={(e) => setContactNotes(e.target.value)}
                  className="w-full text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground bg-muted hover:bg-muted/80 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/95 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
