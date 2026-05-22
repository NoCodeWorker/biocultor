'use client';

import { useEffect } from 'react';

interface GoogleAnalyticsLazyProps {
  gaId: string;
}

export default function GoogleAnalyticsLazy({ gaId }: GoogleAnalyticsLazyProps) {
  useEffect(() => {
    if (!gaId) return;

    let loaded = false;

    const loadGA = () => {
      if (loaded) return;
      loaded = true;

      // Remove all event listeners immediately
      window.removeEventListener('scroll', loadGA);
      window.removeEventListener('mousemove', loadGA);
      window.removeEventListener('touchstart', loadGA);
      window.removeEventListener('keydown', loadGA);

      // 1. Create Google Tag Manager external script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      script.async = true;
      document.head.appendChild(script);

      // 2. Initialize gtag and push first page_view
      const inlineScript = document.createElement('script');
      inlineScript.id = 'google-analytics-init';
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', {
          page_path: window.location.pathname,
        });
      `;
      document.head.appendChild(inlineScript);
    };

    // Listen to major user interactions
    window.addEventListener('scroll', loadGA, { passive: true });
    window.addEventListener('mousemove', loadGA, { passive: true });
    window.addEventListener('touchstart', loadGA, { passive: true });
    window.addEventListener('keydown', loadGA, { passive: true });

    // Fallback: load GTM after 4 seconds if no interaction occurs (to avoid losing non-interactive users)
    const timeoutId = setTimeout(loadGA, 4000);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', loadGA);
      window.removeEventListener('mousemove', loadGA);
      window.removeEventListener('touchstart', loadGA);
      window.removeEventListener('keydown', loadGA);
    };
  }, [gaId]);

  return null;
}
