'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitContactForm } from '@/app/(shop)/contacto/actions';
import { useSearchParams } from 'next/navigation';

function getServiceDefaults({
  servicioParam,
  m2Param,
  precioParam,
  tipoParam,
  litrosParam,
}: {
  servicioParam: string | null;
  m2Param: string | null;
  precioParam: string | null;
  tipoParam: string | null;
  litrosParam: string | null;
}) {
  if (servicioParam === 'cesped') {
    return {
      motivo: 'Servicio de Regeneración de Césped',
      mensaje:
        m2Param && precioParam
          ? `Hola, estoy interesado en el servicio de regeneración de césped y jardines con té de humus de lombriz para mi jardín de ${m2Param} m². El presupuesto estimado calculado en la web es de ${precioParam} €.`
          : 'Hola, estoy interesado en el servicio de regeneración de césped y jardines con té de humus de lombriz para mi jardín de aprox. ______ m².',
    };
  }

  if (servicioParam === 'paisajistas') {
    const serviceLabel =
      tipoParam === 'suministro'
        ? `solo suministro de té de humus (${litrosParam} litros recomendados)`
        : 'suministro y aplicación técnica de té de humus';

    return {
      motivo: 'Servicio Profesional (Jardineros/Paisajistas)',
      mensaje:
        m2Param && precioParam
          ? `Hola, soy profesional (jardinero/paisajista) y estoy interesado en el servicio de ${serviceLabel} para una superficie de ${m2Param} m² en Madrid / Castilla-La Mancha. El presupuesto estimado en la web es de ${precioParam} €.`
          : 'Hola, soy profesional (jardinero/paisajista) y estoy interesado en el servicio de suministro y aplicación de Té de Humus de Lombriz para mi proyecto.',
    };
  }

  if (servicioParam) {
    const readableService = servicioParam.replaceAll('-', ' ');
    return {
      motivo: 'Solicitud de diagnóstico o presupuesto',
      mensaje: `Hola, estoy interesado en ${readableService}. Me gustaría que me indiquéis el siguiente paso.`,
    };
  }

  return {
    motivo: 'Dudas sobre aplicación y dosis',
    mensaje: '',
  };
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const servicioParam = searchParams.get('servicio');
  const m2Param = searchParams.get('m2');
  const precioParam = searchParams.get('precio');
  const tipoParam = searchParams.get('tipo');
  const litrosParam = searchParams.get('litros');
  const serviceDefaults = getServiceDefaults({
    servicioParam,
    m2Param,
    precioParam,
    tipoParam,
    litrosParam,
  });
  const formDefaultsKey = [
    servicioParam,
    m2Param,
    precioParam,
    tipoParam,
    litrosParam,
  ].join(':');

  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  const [attribution] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        sourcePath: '/contacto',
        sourceQuery: '',
        sourceReferrer: '',
      };
    }

    return {
      sourcePath: window.location.pathname,
      sourceQuery: window.location.search,
      sourceReferrer: document.referrer,
    };
  });

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
      <input type="hidden" name="sourcePath" value={attribution.sourcePath} />
      <input type="hidden" name="sourceQuery" value={attribution.sourceQuery} />
      <input type="hidden" name="sourceReferrer" value={attribution.sourceReferrer} />
      <input type="hidden" name="estimatedM2" value={m2Param ?? ''} />
      <input type="hidden" name="estimatedPrice" value={precioParam ?? ''} />
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
        <select
          required
          name="motivo"
          id="motivo"
          key={`motivo-${formDefaultsKey}`}
          defaultValue={serviceDefaults.motivo}
          className="w-full h-12 bg-background border border-border/50 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-muted-foreground"
        >
          <option>Dudas sobre aplicación y dosis</option>
          <option>Servicio de Regeneración de Césped</option>
          <option>Servicio Profesional (Jardineros/Paisajistas)</option>
          <option>Solicitud de diagnóstico o presupuesto</option>
          <option>Estado de mi envío</option>
          <option>Distribución y venta al por mayor (&gt; 1000L)</option>
          <option>Otros motivos técnicos</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="mensaje" className="text-sm font-semibold text-foreground">Tu Mensaje</label>
        <textarea
          required
          name="mensaje"
          id="mensaje"
          key={`mensaje-${formDefaultsKey}`}
          defaultValue={serviceDefaults.mensaje}
          rows={5}
          className="w-full bg-background border border-border/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
          placeholder="Cuéntanos más sobre tus necesidades..."
        />
      </div>

      <Button disabled={isPending} type="submit" size="lg" className="h-14 mt-4 w-full sm:w-auto self-start rounded-xl font-bold bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all">
        {isPending ? 'Enviando...' : 'Enviar mensaje'}
        {!isPending && <Send className="w-4 h-4 ml-2" />}
      </Button>
    </form>
  );
}
