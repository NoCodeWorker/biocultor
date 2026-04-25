'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AgronomicAdvisorChat = dynamic(() => import('./AgronomicAdvisorChat'), {
  ssr: false,
});

export default function AgronomicAdvisorChatLazy() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading the heavy chat bundle to improve TTI and TBT
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 4500);

    const handleInteraction = () => setShouldLoad(true);
    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('mousemove', handleInteraction, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
    };
  }, []);

  if (!shouldLoad) return null;
  return <AgronomicAdvisorChat />;
}
