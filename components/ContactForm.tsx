'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitContactForm } from '@/app/(shop)/contacto/actions';

export default function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);

  async function action(formData: FormData) {
    setIsPending(true);
    setStatus(null);
    const result = await submitContactForm(formData);
    setStatus(result);
    setIsPending(false);
  }

  if (status?.success) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-primary/5 rounded-2xl border border-primary/20 h-full min-h-[300px]">
        <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-heading font-bold text-foreground mb-2">¡Mensaje enviado!</h3>
        <p className="text-muted-foreground max-w-md">
          Hemos recibido tu consulta técnica. Nuestro equipo agronómico la revisará y te contactaremos en menos de 24 horas hábiles.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      {status?.error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
          {status.error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-semibold text-foreground">Nombre completo</label>
          <input required type="text" name="name" id="name" className="w-full h-12 bg-background border border-border/50 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="Juan López" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-foreground">Correo electrónico</label>
          <input required type="email" name="email" id="email" className="w-full h-12 bg-background border border-border/50 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="juan@finca.com" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="motivo" className="text-sm font-semibold text-foreground">Motivo de la consulta</label>
        <select required name="motivo" id="motivo" className="w-full h-12 bg-background border border-border/50 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-muted-foreground">
          <option>Dudas sobre aplicación y dosis</option>
          <option>Estado de mi envío</option>
          <option>Distribución y venta al por mayor (&gt; 1000L)</option>
          <option>Otros motivos técnicos</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="mensaje" className="text-sm font-semibold text-foreground">Tu Mensaje</label>
        <textarea required name="mensaje" id="mensaje" rows={5} className="w-full bg-background border border-border/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none" placeholder="Cuéntanos más sobre tus necesidades..."></textarea>
      </div>

      <Button disabled={isPending} type="submit" size="lg" className="h-14 mt-4 w-full sm:w-auto self-start rounded-xl font-bold bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all">
        {isPending ? 'Enviando...' : 'Enviar mensaje'}
        {!isPending && <Send className="w-4 h-4 ml-2" />}
      </Button>
    </form>
  );
}
