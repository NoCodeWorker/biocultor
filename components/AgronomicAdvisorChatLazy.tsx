'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AgronomicAdvisorChat = dynamic(() => import('./AgronomicAdvisorChat'), {
  ssr: false,
});

export default function AgronomicAdvisorChatLazy() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const handleInteraction = () => setShouldLoad(true);
    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('mousemove', handleInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
    window.addEventListener('keydown', handleInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  if (!shouldLoad) return null;
  return <AgronomicAdvisorChat />;
}
