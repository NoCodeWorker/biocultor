"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Bell, ChevronRight, ExternalLink, Search } from "lucide-react"
import { useEffect, useState } from "react"
import CommandPalette from "./CommandPalette"
import { ADMIN_NAV, isAdminNavActive } from "./nav-config"
import { cn } from "@/lib/utils"

const LABELS: Record<string, string> = {
  admin: "Inicio",
  products: "Productos",
  new: "Nuevo",
  orders: "Pedidos",
  customers: "Clientes",
  refunds: "Devoluciones",
  operations: "Operaciones",
  analytics: "Inteligencia",
  seo: "SEO Editorial",
  blog: "Blog",
  marketing: "Marketing",
  inventory: "Inventario",
  settings: "Ajustes",
  servicios: "Servicios",
}

function humanize(seg: string) {
  if (LABELS[seg]) return LABELS[seg]
  // ids: cmodxxxxx → muestra cm…12 truncado
  if (seg.length > 16) return seg.slice(0, 8) + "…"
  return seg
}

export default function AdminHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Cmd+K / Ctrl+K abre el command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Construye crumbs progresivos: ['admin', 'products', 'cmoXXX'] → /admin, /admin/products, /admin/products/cmoXXX
  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/")
    return { label: humanize(seg), href }
  })

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <header className="flex h-14 items-center gap-4 px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1.5 text-sm"
          >
            {crumbs.map((c, i) => {
              const isLast = i === crumbs.length - 1
              return (
                <div key={c.href} className="flex min-w-0 items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                  )}
                  {isLast ? (
                    <span className="truncate font-bold text-foreground">
                      {c.label}
                    </span>
                  ) : (
                    <Link
                      href={c.href}
                      className="truncate rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    >
                      {c.label}
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="flex-1" />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none lg:inline-flex"
          >
            Tienda
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/40 bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Buscar</span>
            <kbd className="ml-1 hidden items-center gap-0.5 text-[10px] font-bold text-muted-foreground/70 md:inline-flex">
              <span className="rounded border border-border/60 bg-background px-1 py-0.5">
                ⌘
              </span>
              <span className="rounded border border-border/60 bg-background px-1 py-0.5">
                K
              </span>
            </kbd>
          </button>

          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            title="Notificaciones operativas pendientes"
            aria-label="Notificaciones operativas pendientes"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </button>
        </header>

        <nav
          aria-label="Navegación admin móvil"
          className="flex gap-2 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
        >
          {ADMIN_NAV.flatMap((section) => section.items)
            .filter((item) =>
              [
                "/admin",
                "/admin/orders",
                "/admin/products",
                "/admin/seo",
                "/admin/blog",
              ].includes(item.href)
            )
            .map((item) => {
              const active = isAdminNavActive(pathname, item)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              )
            })}
        </nav>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  )
}
