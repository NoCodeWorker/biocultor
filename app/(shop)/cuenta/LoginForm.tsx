'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requestLoginCode, verifyLoginCode, ActionState } from './actions';
import { Loader2, Mail, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';

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

  if (currentStep === 'EMAIL') {
    return (
      <form action={requestAction} className="flex flex-col gap-5">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-heading font-black text-foreground mb-2">Acceso sin contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Introduce tu correo electrónico y te enviaremos un código de acceso seguro de 6 dígitos.
          </p>
        </div>

        {requestState.error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{requestState.error}</p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@correo.com"
              className="w-full bg-background border-2 border-border/60 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isRequesting}
          className="mt-2 w-full flex justify-center items-center gap-2 bg-primary hover:bg-brand-green-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isRequesting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Recibir código por email'}
        </button>
      </form>
    );
  }

  if (currentStep === 'CODE') {
    return (
      <form action={verifyAction} className="flex flex-col gap-5">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-heading font-black text-foreground mb-2">Introduce tu código</h1>
          <p className="text-sm text-muted-foreground">
            Hemos enviado un código de 6 dígitos a <strong className="text-foreground">{email}</strong>.
          </p>
        </div>

        {verifyState.error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{verifyState.error}</p>
          </div>
        )}

        <input type="hidden" name="email" value={email} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">
            Código de 6 dígitos
          </label>
          <div className="relative max-w-[240px] mx-auto w-full">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              maxLength={6}
              placeholder="000000"
              className="w-full bg-background border-2 border-border/60 rounded-xl pl-9 pr-4 py-3 text-xl text-center tracking-[0.5em] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className="mt-2 w-full flex justify-center items-center gap-2 bg-primary hover:bg-brand-green-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verificar y Entrar'}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-2">
          ¿No lo has recibido? Revisa tu carpeta de spam.
        </p>
      </form>
    );
  }

  return (
    <div className="text-center py-10">
      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-sm font-semibold text-foreground">Accediendo a tu cuenta...</p>
    </div>
  );
}
