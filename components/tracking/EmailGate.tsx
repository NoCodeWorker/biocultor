'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Package } from 'lucide-react';

export default function EmailGate({
  orderNumber,
  wrongEmail,
}: {
  orderNumber: string;
  wrongEmail: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const params = new URLSearchParams({ email: email.trim().toLowerCase() });
    router.push(`/seguimiento/${orderNumber}?${params.toString()}`);
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-cream-warm py-20 px-4">
      <div className="w-full max-w-md bg-card border border-border/60 rounded-3xl p-8 md:p-10 shadow-sm">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-brand-green-light flex items-center justify-center mb-5 border border-brand-green/15">
            <Package className="w-7 h-7 text-brand-green" strokeWidth={1.6} />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-brown-dark leading-tight">
            Accede a tu seguimiento
          </h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Introduce el email con el que hiciste el pedido{' '}
            <span className="font-mono text-brand-brown-dark font-semibold">{orderNumber}</span>{' '}
            para ver su estado.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full pl-11 pr-4 py-3.5 bg-cream-warm border border-border rounded-xl text-sm focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all text-brand-brown-dark placeholder:text-muted-foreground"
            />
          </div>

          {wrongEmail && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              El email no coincide con el registrado en este pedido.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full h-12 rounded-xl bg-brand-brown-dark text-cream font-bold text-sm tracking-wide hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando…' : 'Ver seguimiento'}
          </button>
        </form>

        <div className="flex items-center gap-2 mt-7 pt-6 border-t border-border/60">
          <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Pedimos tu email para proteger la información de envío. El acceso directo por enlace
            funciona sin este paso.
          </p>
        </div>
      </div>
    </section>
  );
}
