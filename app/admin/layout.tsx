import { Package, LineChart, Settings, ShoppingCart, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background border-t border-border">
      {/* Sidebar Admin Apple-Style */}
      <aside className="w-72 bg-card border-r border-border/50 flex flex-col hidden md:flex">
        <div className="p-8 border-b border-border/50">
          <Link href="/" className="block opacity-90 hover:opacity-100 transition-opacity">
            <Image src="/Logo.svg" alt="Biocultor OS" width={180} height={40} className="w-auto h-8" />
          </Link>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-3 pl-1">Modo Administrador</p>
        </div>
        
        <nav className="flex-1 p-6 flex flex-col gap-3">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-secondary/80 text-secondary-foreground rounded-2xl font-bold transition-all shadow-sm">
            <Package className="w-5 h-5"/> Catálogo
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-2xl font-semibold transition-all">
            <ShoppingCart className="w-5 h-5"/> Pedidos
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-2xl font-semibold transition-all">
            <LineChart className="w-5 h-5"/> Inteligencia (GA4)
          </Link>
          <Link href="/admin/seo" className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-2xl font-semibold transition-all">
            <Search className="w-5 h-5"/> SEO Editorial
          </Link>
        </nav>
        
        <div className="p-6 border-t border-border/50">
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer text-muted-foreground rounded-2xl font-semibold transition-all mb-4">
            <Settings className="w-5 h-5"/> Ajustes GSC
          </div>
          <div className="flex items-center gap-3 bg-primary/10 px-4 py-3 rounded-2xl border border-primary/20 cursor-help">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"/>
            <span className="text-sm font-bold text-primary">Stripe en Producción</span>
          </div>
        </div>
      </aside>
      
      {/* Panel Central */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12 bg-muted/10 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
        {children}
      </main>
    </div>
  )
}
