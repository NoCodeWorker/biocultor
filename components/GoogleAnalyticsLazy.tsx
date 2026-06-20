'use client';

import { useEffect } from 'react';

interface GoogleAnalyticsLazyProps {
  gaId: string;
}

const CONSENT_KEY = 'biocultor_gdpr_consent';
const CONSENT_EVENT = 'biocultor:cookie-consent';

function hasAnalyticsConsent() {
  try {
    const consent = window.localStorage.getItem(CONSENT_KEY);

    if (consent === 'all') return true;
    if (consent === 'necessary-only') return false;
    if (!consent) return false;

    const parsed = JSON.parse(consent) as { analytics?: boolean };
    return parsed.analytics === true;
  } catch {
    return false;
  }
}

export default function GoogleAnalyticsLazy({ gaId }: GoogleAnalyticsLazyProps) {
  useEffect(() => {
    if (!gaId) return;

    let loaded = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const loadGA = () => {
      if (loaded || !hasAnalyticsConsent()) return;
      loaded = true;

      // Remove all event listeners immediately
      window.removeEventListener('scroll', loadGA);
      window.removeEventListener('mousemove', loadGA);
      window.removeEventListener('touchstart', loadGA);
      window.removeEventListener('keydown', loadGA);
      window.removeEventListener(CONSENT_EVENT, scheduleGA);

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

    function scheduleGA() {
      if (loaded || !hasAnalyticsConsent()) return;

      // Listen to major user interactions after consent.
      window.addEventListener('scroll', loadGA, { passive: true });
      window.addEventListener('mousemove', loadGA, { passive: true });
      window.addEventListener('touchstart', loadGA, { passive: true });
      window.addEventListener('keydown', loadGA, { passive: true });

      // Fallback after the critical render path; preserves non-interactive visits.
      timeoutId = setTimeout(loadGA, 8000);
    }

    scheduleGA();
    window.addEventListener(CONSENT_EVENT, scheduleGA);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('scroll', loadGA);
      window.removeEventListener('mousemove', loadGA);
      window.removeEventListener('touchstart', loadGA);
      window.removeEventListener('keydown', loadGA);
      window.removeEventListener(CONSENT_EVENT, scheduleGA);
    };
  }, [gaId]);

  return null;
}
