import prisma from "@/lib/db"
import { AlertCircle, Package } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  let orders: any[] = [];
  
  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        items: {
          include: { variant: true }
        }
      }
    });
  } catch (error) {
    console.error("Error cargando pedidos", error);
  }

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto relative z-10 antialiased">
      <div>
        <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight">Logística y Pedidos</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Historial absoluto de transacciones. Vigila el flujo de ventas, exporta direcciones y prepara los envíos directamente desde aquí.
        </p>
      </div>

      <div className="bg-card border border-border shadow-2xl shadow-black/5 rounded-3xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center gap-6 opacity-60">
            <Package className="w-16 h-16 text-muted-foreground" />
            <h2 className="text-xl font-bold font-heading">Sin pedidos todavía</h2>
            <p className="text-muted-foreground max-w-md">
              A la espera de que el primer cliente inicie y pague el checkout de Stripe. ¡Asegúrate de configurar el Webhook!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/30">
                <tr>
                  <th className="p-6 font-heading font-bold text-foreground text-sm uppercase tracking-wider">Pedido</th>
                  <th className="p-6 font-heading font-bold text-foreground text-sm uppercase tracking-wider">Cliente</th>
                  <th className="p-6 font-heading font-bold text-foreground text-sm uppercase tracking-wider">Dirección de Envío</th>
                  <th className="p-6 font-heading font-bold text-foreground text-sm uppercase tracking-wider">Conceptos</th>
                  <th className="p-6 font-heading font-bold text-foreground text-sm uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-6">
                      <span className="font-mono font-bold text-foreground bg-secondary px-2 py-1 rounded-md">{order.orderNumber}</span>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', { 
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                        })}
                      </p>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-foreground">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      {order.customer.phone && <p className="text-xs bg-primary/10 text-primary w-fit px-2 py-0.5 rounded-full mt-1">{order.customer.phone}</p>}
                    </td>
                    <td className="p-6 text-sm text-muted-foreground max-w-[250px] leading-relaxed">
                      {order.shippingAddress}
                    </td>
                    <td className="p-6">
                      <ul className="flex flex-col gap-1">
                        {order.items.map((item: any) => (
                          <li key={item.id} className="text-sm font-medium flex items-center gap-2">
                            <span className="text-xs bg-foreground text-background px-1.5 py-0.5 rounded-md font-bold">{item.quantity}x</span> 
                            {item.variant.size} 
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-6 text-right">
                      <p className="text-xl font-heading font-black text-foreground">€{order.totalAmount.toFixed(2)}</p>
                      <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full inline-block mt-1">
                        {order.status === "PAID" ? "PAGADO STRIPE" : order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
