import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-[2rem] border border-border shadow-sm text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold font-heading mb-4 text-foreground">¡Pago Completado!</h1>
        <p className="text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
          Tu pedido ha sido procesado por Stripe con éxito. En un entorno real se enviaría el recibo a tu correo.
        </p>
        <Link 
          href="/" 
          className="w-full inline-flex justify-center items-center h-14 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
