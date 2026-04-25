'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingBag,
  LineChart,
  Search as SearchIcon,
  Plus,
  ExternalLink,
} from 'lucide-react';

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ACTIONS = [
  { group: 'Navegar', label: 'Inicio', href: '/admin', icon: Home },
  { group: 'Navegar', label: 'Productos', href: '/admin/products', icon: Package },
  { group: 'Navegar', label: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
  { group: 'Navegar', label: 'Inteligencia', href: '/admin/analytics', icon: LineChart },
  { group: 'Navegar', label: 'SEO Editorial', href: '/admin/seo', icon: SearchIcon },
  { group: 'Crear', label: 'Nuevo producto', href: '/admin/products/new', icon: Plus },
  { group: 'Externos', label: 'Tienda pública', href: '/', icon: ExternalLink, external: true },
] as const;

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const go = (href: string, external?: boolean) => {
    onOpenChange(false);
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(href);
    }
  };

  if (!open) return null;

  const groups = Array.from(new Set(ACTIONS.map((a) => a.group)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      onClick={() => onOpenChange(false)}
    >
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <Command
        className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        loop
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
          <SearchIcon className="w-4 h-4 text-muted-foreground" />
          <Command.Input
            placeholder="Saltar a una sección o acción…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
          />
          <kbd className="text-[10px] text-muted-foreground/70 px-1.5 py-0.5 bg-muted rounded">esc</kbd>
        </div>

        <Command.List className="max-h-[50vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-sm text-center text-muted-foreground">
            Sin resultados.
          </Command.Empty>

          {groups.map((group) => (
            <Command.Group
              key={group}
              heading={
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-2 py-1 block">
                  {group}
                </span>
              }
            >
              {ACTIONS.filter((a) => a.group === group).map((a) => {
                const Icon = a.icon;
                return (
                  <Command.Item
                    key={a.href}
                    value={`${a.group} ${a.label}`}
                    onSelect={() => go(a.href, 'external' in a ? a.external : undefined)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm cursor-pointer aria-selected:bg-primary/10 aria-selected:text-foreground transition-colors"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span>{a.label}</span>
                    {'external' in a && a.external && (
                      <ExternalLink className="ml-auto w-3.5 h-3.5 text-muted-foreground/60" />
                    )}
                  </Command.Item>
                );
              })}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
