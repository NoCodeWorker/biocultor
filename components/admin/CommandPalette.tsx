"use client"

import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { ExternalLink, Plus, Search as SearchIcon } from "lucide-react"
import { ADMIN_COMMAND_ITEMS } from "./nav-config"

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ACTIONS = [
  ...ADMIN_COMMAND_ITEMS,
  {
    group: "Crear",
    label: "Nuevo producto",
    href: "/admin/products/new",
    icon: Plus,
  },
  {
    group: "Externos",
    label: "Tienda pública",
    href: "/",
    icon: ExternalLink,
    external: true,
  },
] as const

export default function CommandPalette({
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const router = useRouter()

  const go = (href: string, external?: boolean) => {
    onOpenChange(false)
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer")
    } else {
      router.push(href)
    }
  }

  if (!open) return null

  const groups = Array.from(new Set(ACTIONS.map((a) => a.group)))

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      onClick={() => onOpenChange(false)}
    >
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <Command
        label="Command palette admin"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        loop
      >
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <Command.Input
            placeholder="Saltar a una sección o acción…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground/70">
            esc
          </kbd>
        </div>

        <Command.List className="max-h-[50vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
            Sin resultados.
          </Command.Empty>

          {groups.map((group) => (
            <Command.Group
              key={group}
              heading={
                <span className="block px-2 py-1 text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
                  {group}
                </span>
              }
            >
              {ACTIONS.filter((a) => a.group === group).map((a) => {
                const Icon = a.icon
                return (
                  <Command.Item
                    key={a.href}
                    value={`${a.group} ${a.label}`}
                    onSelect={() =>
                      go(a.href, "external" in a ? a.external : undefined)
                    }
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors aria-selected:bg-primary/10 aria-selected:text-foreground"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{a.label}</span>
                    {"external" in a && a.external && (
                      <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground/60" />
                    )}
                  </Command.Item>
                )
              })}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  )
}
