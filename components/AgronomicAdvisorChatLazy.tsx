'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const AgronomicAdvisorChat = dynamic(() => import('./AgronomicAdvisorChat'), {
  ssr: false,
});

export default function AgronomicAdvisorChatLazy() {
  const [enabled, setEnabled] = useState(false);
  const cartItemsCount = useCartStore((s) => s.items.length);

  if (enabled) return <AgronomicAdvisorChat initialOpen />;

  return (
    <button
      onClick={() => setEnabled(true)}
      className="fixed bottom-[4.5rem] md:bottom-6 right-5 flex items-center justify-center w-14 h-14 bg-brand-brown-dark rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:scale-105 border border-brand-green/20 transition-all duration-300 z-50 group"
      aria-label="Abrir asesor agronómico"
    >
      <div className="relative w-8 h-8">
        <Image src="/favicon.svg" alt="Asesor Biocultor" fill className="object-contain brightness-0 invert opacity-90" />
      </div>
      {cartItemsCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-green rounded-full flex items-center justify-center">
          <ShoppingCart className="w-2.5 h-2.5 text-white" />
        </span>
      )}
    </button>
  );
}
