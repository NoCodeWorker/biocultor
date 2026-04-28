'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

const Cart = dynamic(() => import('./Cart'), {
  ssr: false,
});

export default function CartLazy() {
  const isOpen = useCartStore((s) => s.isOpen);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const triggerLoad = () => {
      setShouldLoad(true);
      window.removeEventListener('pointerdown', triggerLoad);
      window.removeEventListener('keydown', triggerLoad);
      window.removeEventListener('scroll', triggerLoad);
      window.removeEventListener('mousemove', triggerLoad);
    };

    window.addEventListener('pointerdown', triggerLoad, { once: true, passive: true });
    window.addEventListener('keydown', triggerLoad, { once: true });
    window.addEventListener('scroll', triggerLoad, { once: true, passive: true });
    window.addEventListener('mousemove', triggerLoad, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', triggerLoad);
      window.removeEventListener('keydown', triggerLoad);
      window.removeEventListener('scroll', triggerLoad);
      window.removeEventListener('mousemove', triggerLoad);
    };
  }, []);

  if (!shouldLoad && !isOpen) return null;
  return <Cart />;
}
