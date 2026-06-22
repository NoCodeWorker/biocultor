import {
  Boxes,
  Briefcase,
  Calculator,
  Home,
  Leaf,
  LineChart,
  Mail,
  Package,
  PenSquare,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react"

export type AdminNavItem = {
  href: string
  label: string
  icon: LucideIcon
  comingSoon?: boolean
  exact?: boolean
}

export type AdminNavSection = {
  label: string
  items: AdminNavItem[]
}

export const ADMIN_NAV: AdminNavSection[] = [
  {
    label: "Vista",
    items: [{ href: "/admin", label: "Inicio", icon: Home, exact: true }],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/products", label: "Productos", icon: Package },
      { href: "/admin/inventory", label: "Inventario", icon: Boxes },
    ],
  },
  {
    label: "Ventas",
    items: [
      { href: "/admin/orders", label: "Pedidos", icon: ShoppingBag },
      { href: "/admin/customers", label: "Clientes", icon: Users },
      { href: "/admin/crm", label: "CRM ventas & servicios", icon: Briefcase },
      { href: "/admin/refunds", label: "Devoluciones", icon: RefreshCw },
      { href: "/admin/operations", label: "Operaciones", icon: Truck },
    ],
  },
  {
    label: "Analítica",
    items: [
      { href: "/admin/analytics", label: "Inteligencia", icon: LineChart },
      { href: "/admin/calculadora", label: "Calculadora", icon: Calculator },
    ],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/seo", label: "Landings & SEO", icon: Search },
      { href: "/admin/servicios", label: "Servicios", icon: Leaf },
      { href: "/admin/blog", label: "Blog", icon: PenSquare },
    ],
  },
  {
    label: "Marketing",
    items: [{ href: "/admin/marketing", label: "Email & cupones", icon: Mail }],
  },
  {
    label: "Sistema",
    items: [{ href: "/admin/settings", label: "Ajustes", icon: Settings }],
  },
]

export const ADMIN_COMMAND_ITEMS = ADMIN_NAV.flatMap((section) =>
  section.items
    .filter((item) => !item.comingSoon)
    .map((item) => ({
      group: section.label === "Vista" ? "Navegar" : section.label,
      label: item.label,
      href: item.href,
      icon: item.icon,
    }))
)

export function isAdminNavActive(pathname: string, item: AdminNavItem) {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}
