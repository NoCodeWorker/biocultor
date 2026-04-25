'use client';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requestLoginCode, verifyLoginCode, ActionState } from './actions';
import { Loader2, Mail, KeyRound, ArrowRight, AlertCircle, ShieldCheck, Leaf } from 'lucide-react';
import Image from 'next/image';

export default function LoginForm() {
  const router = useRouter();
  const [requestState, requestAction, isRequesting] = useActionState<ActionState, FormData>(
    requestLoginCode,
    { step: 'EMAIL' }
  );
  
  const [verifyState, verifyAction, isVerifying] = useActionState<ActionState, FormData>(
    verifyLoginCode,
    { step: 'CODE' }
  );

  const currentStep = requestState.step === 'EMAIL' ? 'EMAIL' : verifyState.step === 'CODE' ? 'CODE' : 'LOGGED_IN';
  const email = requestState.email || verifyState.email;

  useEffect(() => {
    if (verifyState.success && verifyState.step === 'LOGGED_IN') {
      router.refresh();
    }
  }, [verifyState, router]);

  const Logo = () => (
    <div className="flex flex-col items-center mb-8">
      <div className="w-16 h-16 bg-brand-brown-dark rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-brand-brown-dark/20 relative">
        <Image src="/Favicon.svg" alt="Biocultor" width={32} height={32} className="brightness-0 invert opacity-90" />
      </div>
      <h2 className="text-2xl font-heading font-black text-foreground tracking-tight">Acceso Cliente</h2>
      <div className="h-1 w-8 bg-primary rounded-full mt-2" />
    </div>
  );

  if (currentStep === 'EMAIL') {
    return (
      <form action={requestAction} className="flex flex-col gap-6">
        <Logo />
        
        <div className="text-center px-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sin contraseñas. Solo tu correo para acceder a tus pedidos y seguimiento.
          </p>
        </div>

        {requestState.error && (
          <div className="flex items-center gap-3 p-4 text-sm text-red-800 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{requestState.error}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Correo electrónico
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nombre@ejemplo.com"
              className="w-full bg-[#FAFAF9] border-2 border-border/40 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-muted-foreground/40"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isRequesting}
          className="mt-2 w-full flex justify-center items-center gap-3 bg-brand-brown-dark hover:bg-foreground text-cream font-bold py-4 rounded-2xl shadow-xl shadow-brand-brown-dark/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isRequesting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              Enviar código seguro
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/40">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Conexión Segura SSL</span>
        </div>
      </form>
    );
  }

  if (currentStep === 'CODE') {
    return (
      <form action={verifyAction} className="flex flex-col gap-6">
        <Logo />

        <div className="text-center px-4">
          <p className="text-sm text-muted-foreground">
            Código enviado a <span className="text-foreground font-bold">{email}</span>
          </p>
        </div>

        {verifyState.error && (
          <div className="flex items-center gap-3 p-4 text-sm text-red-800 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{verifyState.error}</p>
          </div>
        )}

        <input type="hidden" name="email" value={email} />

        <div className="flex flex-col gap-2">
          <label htmlFor="code" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
            Código de 6 dígitos
          </label>
          <div className="relative max-w-[260px] mx-auto w-full group">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              autoFocus
              maxLength={6}
              placeholder="000000"
              className="w-full bg-[#FAFAF9] border-2 border-border/40 rounded-2xl pl-12 pr-4 py-4 text-2xl text-center tracking-[0.5em] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-black text-foreground font-mono placeholder:text-muted-foreground/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className="mt-2 w-full flex justify-center items-center gap-3 bg-primary hover:bg-brand-green-hover text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              Verificar y Acceder
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          ¿No lo has recibido? Revisa tu carpeta de spam.
        </p>
      </form>
    );
  }

  return (
    <div className="text-center py-16 flex flex-col items-center">
      <div className="w-16 h-16 relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
        <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      </div>
      <h3 className="text-xl font-heading font-black text-foreground">Accediendo...</h3>
      <p className="text-sm text-muted-foreground mt-2">Sincronizando tus datos con Biocultor</p>
    </div>
  );
}
