'use client';

import dynamic from 'next/dynamic';
import { useCartStore } from '@/store/cartStore';

const Cart = dynamic(() => import('./Cart'), {
  ssr: false,
});

export default function CartLazy() {
  const isOpen = useCartStore((s) => s.isOpen);

  if (!isOpen) return null;
  return <Cart />;
}
