import { getCustomerSession } from '@/lib/session';
import prisma from '@/lib/db';
import LoginForm from './LoginForm';
import { Package, ArrowRight, ExternalLink, LogOut, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { logout } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CuentaPage() {
  const sessionId = await getCustomerSession();

  let customer = null;
  if (sessionId) {
    customer = await prisma.customer.findUnique({
      where: { id: sessionId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  // Si no hay sesión válida, mostramos el login
  if (!customer) {
    return (
      <div className="min-h-[70vh] bg-accent/30 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-card rounded-3xl shadow-xl shadow-black/5 p-8 border border-border/60">
          <LoginForm />
        </div>
      </div>
    );
  }

  // Dashboard de cliente
  return (
    <div className="min-h-screen bg-accent/30 py-16 px-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight">
              Hola, {customer.name.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              {customer.email}
            </p>
          </div>
          <form action={async () => {
            'use server';
            await logout();
            redirect('/cuenta');
          }}>
            <button className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2 border border-border/60 bg-card rounded-xl shadow-sm">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </form>
        </div>

        <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-10 shadow-sm">
          <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Historial de Pedidos
          </h2>

          {customer.orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-foreground font-semibold">Aún no tienes pedidos.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Cuando realices una compra, aparecerá aquí.
              </p>
              <Link href="/tienda" className="inline-block mt-4 text-sm font-bold bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-brand-green-hover transition-colors">
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {customer.orders.map((order) => (
                <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-border/60 hover:border-primary/30 hover:bg-muted/20 transition-all">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-foreground bg-accent px-2 py-1 rounded">
                        {order.orderNumber}
                      </span>
                      {order.status === 'PAID' ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> Preparando
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {order.status === 'SHIPPED' ? 'Enviado' : 'Completado'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <span>{new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span>·</span>
                      <span className="font-bold text-foreground">€{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
                    <Link
                      href={`/seguimiento/${order.orderNumber}`}
                      className="flex items-center justify-center gap-2 flex-1 md:flex-none text-xs font-bold uppercase tracking-wider bg-foreground text-background px-4 py-2.5 rounded-xl hover:bg-foreground/90 transition-all"
                    >
                      Seguimiento <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {order.stripeSession && (
                      <Link
                        href={`https://checkout.stripe.com/c/pay/${order.stripeSession}`}
                        className="flex items-center justify-center gap-2 flex-1 md:flex-none text-xs font-bold uppercase tracking-wider border border-border/60 bg-card text-foreground px-4 py-2.5 rounded-xl hover:bg-muted transition-all"
                      >
                        Recibo <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
