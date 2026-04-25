'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CookieConsent = dynamic(() => import('./CookieConsent'), {
  ssr: false,
});

export default function CookieConsentLazy() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (localStorage.getItem('biocultor_gdpr_consent')) return;
    } catch {
      // localStorage no disponible — mostraremos igualmente, pero diferido.
    }

    const idle = (cb: () => void) => {
      const w = window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      };
      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(cb, { timeout: 3000 });
      } else {
        setTimeout(cb, 2500);
      }
    };

    idle(() => setShouldRender(true));
  }, []);

  if (!shouldRender) return null;
  return <CookieConsent />;
}
