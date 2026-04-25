'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Siempre activo
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Retrasar un poco la aparición para que no sea tan brusco al cargar
    const timer = setTimeout(() => {
      const consent = localStorage.getItem('biocultor_gdpr_consent');
      if (!consent) {
        setShow(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const acceptAll = () => {
    localStorage.setItem('biocultor_gdpr_consent', 'all');
    setShow(false);
  };

  const acceptSelected = () => {
    localStorage.setItem('biocultor_gdpr_consent', JSON.stringify(preferences));
    setShow(false);
  };

  const declineAll = () => {
    localStorage.setItem('biocultor_gdpr_consent', 'necessary-only');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 pointer-events-none">
      <div className="absolute inset-0 bg-brand-brown-dark/20 backdrop-blur-sm pointer-events-auto transition-opacity animate-in fade-in duration-500" />
      <div className="relative w-full max-w-2xl bg-cream-warm border border-border/80 shadow-2xl rounded-3xl pointer-events-auto overflow-hidden animate-fade-up">
        
        {/* Encabezado Premium */}
        <div className="p-6 md:p-8 bg-brand-brown-dark text-cream relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-cream" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-heading font-bold tracking-tight mb-2">Tu privacidad es nuestra prioridad</h2>
              <p className="text-sm md:text-base text-cream/80 leading-relaxed max-w-lg">
                Utilizamos cookies propias y de terceros para asegurar el correcto funcionamiento de nuestra web, aprender sobre cómo interactúas con ella y ofrecerte una experiencia de compra excepcional.
              </p>
            </div>
          </div>
        </div>

        {/* Panel de Configuración Detallado (Oculto por defecto) */}
        <div className={cn(
          "bg-white transition-all duration-500 ease-in-out overflow-hidden",
          showDetails ? "max-h-[500px] border-b border-border/50" : "max-h-0"
        )}>
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-muted/40 border border-border/50">
              <div>
                <h4 className="font-bold flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Estrictamente Necesarias</h4>
                <p className="text-xs text-muted-foreground mt-1">Garantizan funciones básicas como la navegación y el acceso a áreas seguras (como tu carrito o cuenta).</p>
              </div>
              <div className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">Siempre activas</div>
            </div>

            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-border/50 transition-colors hover:border-primary/30 cursor-pointer" onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}>
              <div>
                <h4 className="font-bold">Analíticas y Rendimiento</h4>
                <p className="text-xs text-muted-foreground mt-1">Nos ayudan a entender cómo usas Biocultor, para poder mejorar constantemente tu experiencia (datos anónimos).</p>
              </div>
              <div className={cn("w-12 h-6 rounded-full transition-colors relative", preferences.analytics ? "bg-primary" : "bg-muted-foreground/30")}>
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", preferences.analytics ? "left-7" : "left-1")} />
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-border/50 transition-colors hover:border-primary/30 cursor-pointer" onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}>
              <div>
                <h4 className="font-bold">Marketing y Personalización</h4>
                <p className="text-xs text-muted-foreground mt-1">Permiten mostrarte publicidad relevante y medir la eficacia de nuestras campañas.</p>
              </div>
              <div className={cn("w-12 h-6 rounded-full transition-colors relative", preferences.marketing ? "bg-primary" : "bg-muted-foreground/30")}>
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", preferences.marketing ? "left-7" : "left-1")} />
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="p-6 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm font-semibold text-muted-foreground hover:text-brand-brown-dark transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              {showDetails ? 'Ocultar ajustes' : 'Configurar cookies'}
            </button>
            <Link href="/politica-de-privacidad" className="text-xs text-muted-foreground/70 hover:underline">
              Leer Política
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {showDetails ? (
              <>
                <Button variant="outline" className="rounded-xl" onClick={declineAll}>
                  Rechazar opcionales
                </Button>
                <Button className="rounded-xl bg-brand-brown-dark hover:bg-brand-brown-dark/90 text-white" onClick={acceptSelected}>
                  Guardar preferencias
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="rounded-xl font-semibold border-border/80" onClick={declineAll}>
                  Rechazar no esenciales
                </Button>
                <Button className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={acceptAll}>
                  Aceptar todo
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
