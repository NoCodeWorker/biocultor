'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import CommandPalette from './CommandPalette';

const LABELS: Record<string, string> = {
  admin: 'Inicio',
  products: 'Productos',
  new: 'Nuevo',
  orders: 'Pedidos',
  customers: 'Clientes',
  refunds: 'Devoluciones',
  operations: 'Operaciones',
  analytics: 'Inteligencia',
  seo: 'SEO Editorial',
  blog: 'Blog',
  marketing: 'Marketing',
  inventory: 'Inventario',
  settings: 'Ajustes',
};

function humanize(seg: string) {
  if (LABELS[seg]) return LABELS[seg];
  // ids: cmodxxxxx → muestra cm…12 truncado
  if (seg.length > 16) return seg.slice(0, 8) + '…';
  return seg;
}

export default function AdminHeader() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Cmd+K / Ctrl+K abre el command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Construye crumbs progresivos: ['admin', 'products', 'cmoXXX'] → /admin, /admin/products, /admin/products/cmoXXX
  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    return { label: humanize(seg), href };
  });

  return (
    <>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/60 px-6 lg:px-8 h-14 flex items-center gap-4">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <div key={c.href} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />}
                {isLast ? (
                  <span className="font-bold text-foreground truncate">{c.label}</span>
                ) : (
                  <Link
                    href={c.href}
                    className="text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    {c.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Cmd+K trigger */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground transition-colors text-sm border border-border/40"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Buscar…</span>
          <kbd className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-muted-foreground/70">
            <span className="px-1 py-0.5 bg-background border border-border/60 rounded">⌘</span>
            <span className="px-1 py-0.5 bg-background border border-border/60 rounded">K</span>
          </kbd>
        </button>

        <button
          type="button"
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted/60 text-muted-foreground"
          title="Notificaciones (próximamente)"
        >
          <Bell className="w-4 h-4" />
        </button>
      </header>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
