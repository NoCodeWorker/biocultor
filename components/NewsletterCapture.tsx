'use client';

import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function NewsletterCapture() {
  return (
    <section className="w-full py-16 md:py-24 bg-background border-t border-border/40 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-48 h-48 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="w-[92%] lg:w-[70%] max-w-4xl mx-auto px-4 relative z-10">
        <div className="bg-card border border-border/60 rounded-3xl p-8 md:p-12 shadow-xl shadow-black/5 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5 border border-primary/20">
              <Mail className="w-3.5 h-3.5" />
              Suscripción Técnica
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground mb-4">
              Aprende a nutrir tu suelo.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Únete a 2.500+ agricultores y jardineros que reciben nuestros apuntes técnicos mensuales sobre manejo biológico.
            </p>
            <ul className="flex flex-col gap-2 text-sm text-foreground font-medium">
              <li className="flex items-center gap-2 md:justify-start justify-center">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Sin spam comercial.
              </li>
              <li className="flex items-center gap-2 md:justify-start justify-center">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Casos prácticos de aplicación.
              </li>
            </ul>
          </div>

          <div className="w-full md:w-[400px] shrink-0">
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="tu@email.com"
                required
                className="w-full px-5 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-green-hover transition-colors shadow-lg hover:shadow-primary/25"
              >
                Suscribirme ahora
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Puedes darte de baja en cualquier momento con un solo clic.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
