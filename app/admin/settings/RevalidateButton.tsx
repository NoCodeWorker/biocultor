'use client';

import { useState, useTransition } from 'react';
import { RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import { revalidateAll } from './actions';

export default function RevalidateButton() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleClick() {
    setDone(false);
    startTransition(async () => {
      await revalidateAll();
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center gap-2 text-xs font-bold bg-foreground text-background px-3 py-2 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 shrink-0"
    >
      {pending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : done ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <RefreshCw className="w-3.5 h-3.5" />
      )}
      {done ? '¡Listo!' : 'Revalidar'}
    </button>
  );
}
