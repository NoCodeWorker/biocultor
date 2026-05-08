'use client';

import { useState, useTransition } from 'react';
import { Percent, Check, Loader2, Edit2 } from 'lucide-react';
import { updateCustomerDiscount } from './actions';

export function DiscountEditor({ customerId, currentDiscount }: { customerId: string, currentDiscount: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentDiscount.toString());
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

    startTransition(async () => {
      await updateCustomerDiscount(customerId, numValue);
      setIsEditing(false);
    });
  };

  if (!isEditing) {
    return (
      <div 
        onClick={() => setIsEditing(true)}
        className="group flex items-center gap-1.5 cursor-pointer hover:bg-muted/50 px-2 py-1 -ml-2 rounded-md transition-colors"
      >
        <span className={`text-xs font-bold ${currentDiscount > 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
          {currentDiscount}% Dto.
        </span>
        <Edit2 className="w-3 h-3 text-muted-foreground/30 group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <input 
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') {
              setValue(currentDiscount.toString());
              setIsEditing(false);
            }
          }}
          autoFocus
          className="w-16 h-7 text-xs bg-background border border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded pl-2 pr-5 outline-none text-foreground font-bold"
        />
        <Percent className="w-3 h-3 text-muted-foreground absolute right-1.5 top-1/2 -translate-y-1/2" />
      </div>
      <button 
        onClick={handleSave}
        disabled={isPending}
        className="w-7 h-7 flex items-center justify-center bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
