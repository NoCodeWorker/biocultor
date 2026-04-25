'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  RefreshCw,
  LineChart,
  Search,
  PenSquare,
  Settings,
  Mail,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Si está deshabilitado se muestra con badge "Próx." */
  comingSoon?: boolean;
  /** Match exacto en lugar de startsWith. Para `/admin` que no debe activarse en subrutas. */
  exact?: boolean;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const NAV: NavSection[] = [
  {
    label: 'Vista',
    items: [{ href: '/admin', label: 'Inicio', icon: Home, exact: true }],
  },
  {
    label: 'Catálogo',
    items: [
      { href: '/admin/products', label: 'Productos', icon: Package },
      { href: '/admin/inventory', label: 'Inventario', icon: Boxes },
    ],
  },
  {
    label: 'Ventas',
    items: [
      { href: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
      { href: '/admin/customers', label: 'Clientes', icon: Users },
      { href: '/admin/refunds', label: 'Devoluciones', icon: RefreshCw },
      { href: '/admin/operations', label: 'Operaciones', icon: Truck },
    ],
  },
  {
    label: 'Analítica',
    items: [{ href: '/admin/analytics', label: 'Inteligencia', icon: LineChart }],
  },
  {
    label: 'Contenido',
    items: [
      { href: '/admin/seo', label: 'SEO Editorial', icon: Search },
      { href: '/admin/blog', label: 'Blog', icon: PenSquare },
    ],
  },
  {
    label: 'Marketing',
    items: [{ href: '/admin/marketing', label: 'Email & cupones', icon: Mail }],
  },
  {
    label: 'Sistema',
    items: [{ href: '/admin/settings', label: 'Ajustes', icon: Settings }],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <aside className="hidden md:flex w-60 lg:w-64 shrink-0 bg-card border-r border-border/60 flex-col h-full">
      <div className="px-6 py-6 border-b border-border/60">
        <Link href="/" className="block opacity-90 hover:opacity-100 transition-opacity">
          <Image
            src="/Logo.svg"
            alt="Biocultor OS"
            width={180}
            height={40}
            className="w-auto h-7"
          />
        </Link>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.18em] mt-2.5">
          Modo administrador
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {NAV.map((section) => (
          <div key={section.label} className="mb-5 last:mb-0">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
              {section.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;

                if (item.comingSoon) {
                  return (
                    <li key={item.href}>
                      <span
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground/60 cursor-not-allowed"
                        title="Próximamente"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        <span className="text-[9px] font-bold bg-muted text-muted-foreground/70 px-1.5 py-0.5 rounded">
                          PRÓX
                        </span>
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors group',
                        active
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0', active ? '' : 'opacity-80')} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border/60">
        <div className="flex items-center gap-2.5 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-700">Stripe en producción</span>
        </div>
      </div>
    </aside>
  );
}
