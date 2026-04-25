'use client';

import { useState, useTransition } from 'react';
import { deleteProduct } from '../actions';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText !== productName) return;
    startTransition(async () => {
      await deleteProduct(productId);
    });
  };

  const armed = confirmText === productName;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm text-red-900 font-semibold">
        Para confirmar, escribe el nombre exacto del producto:
        <code className="ml-2 px-2 py-0.5 bg-red-100 border border-red-200 rounded text-red-900 font-mono text-xs">
          {productName}
        </code>
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={productName}
          className="flex-1 px-4 py-2.5 bg-white border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none text-sm"
        />
        <button
          type="button"
          onClick={handleDelete}
          disabled={!armed || pending}
          className="inline-flex items-center gap-2 bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {pending ? 'Eliminando…' : 'Eliminar producto'}
        </button>
      </div>
    </div>
  );
}
