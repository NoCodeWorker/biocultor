"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ADMIN_NAV, isAdminNavActive } from "./nav-config"

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-border/60 bg-card md:flex lg:w-64">
      <div className="border-b border-border/60 px-6 py-6">
        <Link
          href="/"
          className="block opacity-90 transition-opacity hover:opacity-100"
        >
          <Image
            src="/Logo.svg"
            alt="Biocultor OS"
            width={180}
            height={40}
            className="h-7 w-auto"
          />
        </Link>
        <p className="mt-2.5 text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Modo administrador
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {ADMIN_NAV.map((section) => (
          <div key={section.label} className="mb-5 last:mb-0">
            <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-muted-foreground/70 uppercase">
              {section.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isAdminNavActive(pathname, item)
                const Icon = item.icon

                if (item.comingSoon) {
                  return (
                    <li key={item.href}>
                      <span
                        className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground/60"
                        title="Próximamente"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground/70">
                          PRÓX
                        </span>
                      </span>
                    </li>
                  )
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "" : "opacity-80"
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/60 px-4 py-4">
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs font-bold text-emerald-700">
            Stripe en producción
          </span>
        </div>
      </div>
    </aside>
  )
}
