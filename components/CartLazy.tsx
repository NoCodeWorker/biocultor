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

    const triggerLoad = () => setShouldLoad(true);

    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const idleId =
      typeof w.requestIdleCallback === 'function'
        ? w.requestIdleCallback(triggerLoad, { timeout: 4000 })
        : (setTimeout(triggerLoad, 3000) as unknown as number);

    const onInteract = () => triggerLoad();
    window.addEventListener('pointerdown', onInteract, { once: true, passive: true });
    window.addEventListener('keydown', onInteract, { once: true });
    window.addEventListener('scroll', onInteract, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('scroll', onInteract);
      const w2 = window as unknown as { cancelIdleCallback?: (id: number) => void };
      if (typeof w2.cancelIdleCallback === 'function') {
        w2.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
    };
  }, []);

  if (!shouldLoad && !isOpen) return null;
  return <Cart />;
}
