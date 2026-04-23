import prisma from "@/lib/db"
import { TrendingUp, Euro, ShoppingBasket, Users, Component, BarChart3, ReceiptEuro } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  // Consultas críticas a Base de Datos
  const orders = await prisma.order.findMany({
    where: { status: 'PAID' },
    include: { items: { include: { variant: true } }, customer: true }
  });

  // Cálculo de KPIs
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalOrders = orders.length;
  const customersSet = new Set(orders.map(o => o.customerId));
  const totalCustomers = customersSet.size;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Minería de datos: Ventas por formato
  const variantSales: Record<string, { name: string, qty: number, revenue: number, percentage: number }> = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const vId = item.variantId;
      if (!variantSales[vId]) {
        variantSales[vId] = { name: item.variant.size, qty: 0, revenue: 0, percentage: 0 };
      }
      variantSales[vId].qty += item.quantity;
      variantSales[vId].revenue += item.quantity * item.priceAt;
    });
  });

  const sortedVariants = Object.values(variantSales).sort((a, b) => b.revenue - a.revenue);
  
  // Calcular % sobre facturación total
  if (totalRevenue > 0) {
    sortedVariants.forEach(v => {
      v.percentage = Math.round((v.revenue / totalRevenue) * 100);
    });
  }

  // Tarjetas métricas
  const kpis = [
    { label: "Ingresos Brutos", value: `€${totalRevenue.toFixed(2)}`, icon: Euro, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Valor Medio Pedido", value: `€${averageOrderValue.toFixed(2)}`, icon: ReceiptEuro, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Pedidos (Pagados)", value: totalOrders, icon: ShoppingBasket, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Clientes Únicos", value: totalCustomers, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto relative z-10 antialiased">
      <div>
        <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight flex items-center gap-4">
          <BarChart3 className="w-10 h-10 text-primary" />
          Inteligencia de Negocio
        </h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Tus KPls financieros y rendimiento de producto en tiempo real, directamente desde el motor transaccional blindado.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-card border border-border shadow-xl shadow-black/5 p-6 rounded-3xl flex flex-col gap-4">
            <div className={`p-3 w-fit rounded-2xl ${kpi.bg}`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
              <p className="text-3xl font-heading font-black text-foreground mt-1">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deep-Dive: Ventas por formato */}
      <div className="bg-card border border-border shadow-2xl shadow-black/5 rounded-3xl p-8 mt-4">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
          <Component className="w-6 h-6 text-primary" /> Rendimiento de Formatos (Bestseller Map)
        </h2>
        
        {sortedVariants.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Aún no hay datos. Haz el primer checkout para iniciar los gráficos.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {sortedVariants.map((v, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="font-bold text-foreground block text-lg">{v.name}</span>
                    <span className="text-sm text-muted-foreground">{v.qty} unidades vendidas</span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-black text-2xl text-foreground">€{v.revenue.toFixed(2)}</span>
                    <span className="text-primary font-bold ml-3 bg-primary/10 px-2 py-0.5 rounded-md">{v.percentage}%</span>
                  </div>
                </div>
                {/* CSS Progress Bar */}
                <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out rounded-full relative"
                    style={{ width: `${v.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Espacio para GA4 GSC */}
      <div className="bg-muted/30 border border-border rounded-3xl p-8 flex items-center justify-between opacity-70 cursor-not-allowed">
        <div>
          <h3 className="font-bold text-xl text-foreground">Google Analytics 4 & Search Console</h3>
          <p className="text-muted-foreground mt-1">Conexión reservada para entorno de producción en nube.</p>
        </div>
        <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-bold text-sm">
          Próximamente
        </div>
      </div>
    </div>
  )
}
