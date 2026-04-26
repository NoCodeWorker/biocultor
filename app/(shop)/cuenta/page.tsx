import { getCustomerSession } from '@/lib/session';
import prisma from '@/lib/db';
import LoginForm from './LoginForm';
import { 
  Package, 
  ArrowRight, 
  ExternalLink, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  ShoppingBag, 
  CreditCard, 
  User as UserIcon,
  LifeBuoy,
  ChevronRight,
  Truck,
  Calendar,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { logout } from './actions';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CuentaPage() {
  const sessionId = await getCustomerSession();

  let customer = null;
  if (sessionId) {
    customer = await prisma.customer.findUnique({
      where: { id: sessionId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                variant: true
              }
            }
          }
        }
      }
    });
  }

  // Si no hay sesión válida, mostramos el login
  if (!customer) {
    return (
      <div className="min-h-[70vh] bg-accent/5 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-card rounded-3xl shadow-xl shadow-black/5 p-8 border border-border/60">
          <LoginForm />
        </div>
      </div>
    );
  }

  const totalSpent = customer.orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const lastOrder = customer.orders[0];

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      {/* Header Premium / Banner */}
      <div className="w-full bg-brand-brown-dark pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-cream shrink-0 shadow-2xl">
              <UserIcon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight">
                Hola, {customer.name.split(' ')[0]}
              </h1>
              <p className="text-cream/60 font-medium">
                {customer.email}
              </p>
            </div>
          </div>
          
          <form action={async () => {
            'use server';
            await logout();
            redirect('/cuenta');
          }}>
            <button className="flex items-center gap-2 text-sm font-bold text-cream hover:text-white bg-white/10 hover:bg-white/20 transition-all px-6 py-3 border border-white/10 rounded-2xl backdrop-blur-md shadow-lg">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-card border border-border/60 rounded-3xl p-3 shadow-sm sticky top-24">
              <nav className="flex flex-col gap-1">
                {[
                  { label: 'Mi Actividad', icon: Package, active: true },
                  { label: 'Soporte Técnico', icon: LifeBuoy, active: false, href: '/contacto' },
                ].map((item) => (
                  <Link 
                    key={item.label}
                    href={item.href || '#'}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl transition-all group",
                      item.active 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("w-5 h-5", item.active ? "text-white" : "text-primary/70")} />
                      <span className="font-bold text-sm">{item.label}</span>
                    </div>
                    {item.active && <ChevronRight className="w-4 h-4 opacity-50" />}
                  </Link>
                ))}
              </nav>
              
              <div className="mt-6 p-4 rounded-2xl bg-brand-brown-dark/5 border border-brand-brown-dark/5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-brown-dark/40 px-1">Estado de cuenta</p>
                <div className="flex items-center gap-3 px-1">
                  <div className="w-2 h-2 rounded-full bg-brand-green" />
                  <span className="text-xs font-bold text-brand-brown-dark/70 italic">Verificada</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Dashboard Body */}
          <main className="lg:col-span-9 space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pedidos</p>
                  <p className="text-2xl font-black text-foreground">{customer.orders.length}</p>
                </div>
              </div>
              
              <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-brand-brown-dark/5 flex items-center justify-center text-brand-brown-dark">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Inversión Total</p>
                  <p className="text-2xl font-black text-foreground">€{totalSpent.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estado Último</p>
                  <p className="text-sm font-bold text-foreground truncate max-w-[120px]">
                    {lastOrder ? (lastOrder.status === 'PAID' ? 'En Preparación' : 'Entregado') : 'Sin pedidos'}
                  </p>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white border border-border/60 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-border/50 flex items-center justify-between bg-cream-warm/30">
                <h2 className="text-xl font-heading font-black text-foreground flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" />
                  Historial de Pedidos
                </h2>
                {customer.orders.length > 0 && (
                  <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
                    {customer.orders.length} pedidos realizados
                  </span>
                )}
              </div>

              <div className="p-2 sm:p-6">
                {customer.orders.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Tu huerto aún está esperando</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                      Aún no has realizado ninguna compra en Biocultor. ¡Empieza hoy a mejorar tu suelo!
                    </p>
                    <Link href="/producto/te-humus-liquido-premium" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
                      Ir a la tienda
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {customer.orders.map((order) => (
                      <div key={order.id} className="group border border-border/50 rounded-[2rem] overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                        {/* Order Header */}
                        <div className="p-6 md:p-8 bg-card flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40">
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 flex-wrap">
                              <span className="font-mono font-black text-white bg-brand-brown-dark px-3 py-1.5 rounded-xl text-sm shadow-md">
                                {order.orderNumber}
                              </span>
                              {order.status === 'PAID' ? (
                                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 ring-4 ring-amber-50/50">
                                  <Clock className="w-3.5 h-3.5" /> Preparando envío
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 ring-4 ring-primary/5">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> {order.status === 'SHIPPED' ? 'Enviado' : 'Completado'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 opacity-50" />
                                {new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                              <span>·</span>
                              <span className="text-foreground font-bold">€{order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/seguimiento/${order.orderNumber}`}
                              className="flex items-center justify-center gap-2 flex-1 md:flex-none text-xs font-black uppercase tracking-widest bg-foreground text-background px-6 py-4 rounded-2xl hover:bg-brand-brown-dark transition-all shadow-lg active:scale-95"
                            >
                              Seguimiento <ArrowRight className="w-4 h-4" />
                            </Link>
                            {order.stripeSession && (
                              <Link
                                href={`https://checkout.stripe.com/c/pay/${order.stripeSession}`}
                                className="flex items-center justify-center gap-2 flex-1 md:flex-none text-xs font-black uppercase tracking-widest border border-border/80 bg-white text-muted-foreground px-6 py-4 rounded-2xl hover:bg-muted transition-all hover:text-foreground"
                              >
                                Recibo <ExternalLink className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="p-6 bg-accent/10 md:p-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/60 border border-border/30">
                                <div className="relative w-14 h-14 bg-cream-warm rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-border/40">
                                  <Image
                                    src={item.variant.imagePath || '/1 litro.jpg'}
                                    alt={item.variant.size}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-foreground truncate">Té de Humus Biocultor</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                                      {item.variant.size}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-medium">x{item.quantity}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Help / Support Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-brand-brown-dark rounded-[2.5rem] p-8 text-cream relative overflow-hidden group border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/10">
                    <LifeBuoy className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-black mb-3 leading-tight">¿Alguna duda técnica?</h3>
                  <p className="text-cream/60 text-sm leading-relaxed mb-6">
                    Nuestro equipo técnico está listo para ayudarte con la aplicación en tu cultivo específico.
                  </p>
                  <Link href="/contacto" className="inline-flex items-center gap-2 font-bold text-primary hover:text-white transition-colors group/link">
                    Contactar soporte <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-white/10 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-6 border border-white/15">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-black mb-3 leading-tight">Garantía Biocultor</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    Seguridad total en el envío y la trazabilidad de cada lote que sale de Toledo.
                  </p>
                  <Link href="/politica-de-envios-y-devoluciones" className="inline-flex items-center gap-2 font-bold text-white/90 hover:text-white transition-colors group/link">
                    Ver políticas <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
