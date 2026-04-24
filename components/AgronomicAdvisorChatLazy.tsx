'use client';

import dynamic from 'next/dynamic';

const AgronomicAdvisorChat = dynamic(() => import('./AgronomicAdvisorChat'), {
  ssr: false,
});

export default function AgronomicAdvisorChatLazy() {
  return <AgronomicAdvisorChat />;
}
