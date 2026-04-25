'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavLink =
  | { kind: 'link'; href: string; label: string }
  | { kind: 'group'; label: string; matchPaths: string[]; items: { href: string; label: string; sub?: string }[] };

const navLinks: NavLink[] = [
  { kind: 'link', href: '/', label: 'Inicio' },
  {
    kind: 'group',
    label: 'Comprar',
    matchPaths: ['/producto/', '/comprar-te-de-humus-de-lombriz', '/comprar-purin-de-ortiga'],
    items: [
      {
        href: '/producto/te-humus-liquido-premium',
        label: 'Té de humus de lombriz',
        sub: 'Extracto biológico premium · 4 formatos',
      },
      {
        href: '/producto/purin-ortiga-concentrado',
        label: 'Purín concentrado de ortiga',
        sub: 'Extracto vegetal para manejo orgánico · 4 formatos',
      },
    ],
  },
  { kind: 'link', href: '/aprende', label: 'Blog' },
  { kind: 'link', href: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const { items, setIsOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const groupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isGroupActive = (matchPaths: string[]) =>
    matchPaths.some((path) => pathname.startsWith(path));

  const openGroupSoft = (label: string) => {
    if (groupTimer.current) clearTimeout(groupTimer.current);
    setOpenGroup(label);
  };

  const closeGroupSoft = () => {
    if (groupTimer.current) clearTimeout(groupTimer.current);
    groupTimer.current = setTimeout(() => setOpenGroup(null), 120);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "bg-background/90 backdrop-blur-2xl border-b border-border/60 shadow-sm"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0">
            <Image src="/Logo.svg" alt="Biocultor - Té de humus de lombriz premium" width={150} height={40} className="w-[100px] md:w-[140px] h-auto" priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navegación principal">
            {navLinks.map((link) => {
              if (link.kind === 'link') {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors rounded-lg group',
                      active
                        ? 'text-primary bg-primary/8 font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300',
                        active ? 'w-6' : 'w-0 group-hover:w-4'
                      )}
                    />
                  </Link>
                );
              }

              const groupActive = isGroupActive(link.matchPaths);
              const isOpen = openGroup === link.label;
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => openGroupSoft(link.label)}
                  onMouseLeave={closeGroupSoft}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() => setOpenGroup(isOpen ? null : link.label)}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-1.5',
                      groupActive
                        ? 'text-primary bg-primary/8 font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200',
                        isOpen ? 'rotate-180' : 'rotate-0'
                      )}
                    />
                    <span
                      className={cn(
                        'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300',
                        groupActive ? 'w-6' : 'w-0'
                      )}
                    />
                  </button>

                  <div
                    role="menu"
                    className={cn(
                      'absolute top-full left-0 mt-2 w-[320px] rounded-2xl border border-border/60 bg-background/98 backdrop-blur-xl shadow-xl shadow-foreground/5 p-2 transition-all duration-200 origin-top',
                      isOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                    )}
                  >
                    {link.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className={cn(
                            'block rounded-xl px-4 py-3 transition-colors',
                            active ? 'bg-primary/8' : 'hover:bg-muted/50'
                          )}
                        >
                          <p
                            className={cn(
                              'text-sm font-bold',
                              active ? 'text-primary' : 'text-foreground'
                            )}
                          >
                            {item.label}
                          </p>
                          {item.sub && (
                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                              {item.sub}
                            </p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-3">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full w-10 h-10"
              title="Mi cuenta"
            >
              <Link href="/cuenta">
                <User className="w-[20px] h-[20px]" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground hover:bg-muted/50 rounded-full w-10 h-10 transition-transform hover:scale-105"
              onClick={() => setIsOpen(true)}
              aria-label={`Carrito de compra, ${totalItems} artículos`}
            >
              <ShoppingBag className="w-[22px] h-[22px]" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm border-2 border-background animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Button>

            <Button
              asChild
              className="hidden lg:inline-flex rounded-full px-7 h-10 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/15 tracking-tight text-sm transition-all hover:shadow-xl"
            >
              <Link href="/producto/te-humus-liquido-premium">Comprar Ahora</Link>
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:bg-muted/50 rounded-full w-10 h-10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-background/92 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
        <nav className="relative z-10 flex flex-col items-center justify-center h-full gap-1 p-8 overflow-y-auto" aria-label="Menú móvil">
          {navLinks.map((link) => {
            if (link.kind === 'link') {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'text-2xl font-heading font-bold py-3.5 px-6 rounded-2xl w-full max-w-xs text-center transition-colors',
                    active
                      ? 'text-primary bg-primary/8'
                      : 'text-foreground hover:text-primary hover:bg-muted/50'
                  )}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <div key={link.label} className="w-full max-w-xs flex flex-col gap-1 mt-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground pt-3 pb-1 text-center">
                  {link.label}
                </p>
                {link.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'text-lg font-heading font-semibold py-3 px-5 rounded-2xl text-center transition-colors',
                        active
                          ? 'text-primary bg-primary/8'
                          : 'text-foreground hover:text-primary hover:bg-muted/50'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            );
          })}
          <div className="mt-6 pt-6 border-t border-border/50 w-full max-w-xs">
            <Button
              asChild
              className="w-full rounded-full h-14 font-bold text-base bg-primary text-white shadow-xl"
            >
              <Link href="/producto/te-humus-liquido-premium" onClick={() => setMobileOpen(false)}>
                Comprar Ahora →
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
