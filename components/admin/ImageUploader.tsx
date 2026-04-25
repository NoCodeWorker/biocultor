'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Loader2, AlertCircle, ImageIcon } from 'lucide-react';
import { uploadImage } from '@/app/admin/upload-action';
import { cn } from '@/lib/utils';

type Props = {
  value: string | null;
  onChange: (next: string | null) => void;
  label?: string;
  hint?: string;
  /** Tamaño del cuadro de preview. Por defecto 'sm' (compatible con filas de tabla). */
  size?: 'sm' | 'md' | 'lg';
  /** Permite escribir/pegar la URL a mano además de subir un archivo. */
  allowManual?: boolean;
  className?: string;
};

const SIZES: Record<NonNullable<Props['size']>, string> = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-36 h-36',
};

export default function ImageUploader({
  value,
  onChange,
  label,
  hint,
  size = 'sm',
  allowManual = false,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const triggerPicker = () => inputRef.current?.click();

  const handleFile = (file: File) => {
    setError(null);
    const fd = new FormData();
    fd.set('file', file);
    startTransition(async () => {
      const result = await uploadImage(fd);
      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setError(result.error || 'Error subiendo la imagen');
      }
    });
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      )}

      <div className="flex items-start gap-3">
        {/* Preview cuadrado */}
        <div
          className={cn(
            'relative shrink-0 rounded-xl overflow-hidden border border-border/60 bg-muted/30',
            SIZES[size]
          )}
        >
          {value ? (
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="160px"
              unoptimized={value.endsWith('.svg')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
            </div>
          )}

          {pending && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={triggerPicker}
              disabled={pending}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-foreground text-background px-3 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {value ? 'Cambiar' : 'Subir'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setError(null);
                }}
                disabled={pending}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Quitar
              </button>
            )}
          </div>

          {allowManual && (
            <input
              type="text"
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value || null)}
              placeholder="/uploads/xxx.jpg ó /1 litro.jpg"
              className="w-full px-2.5 py-1.5 bg-card border border-border/60 rounded-lg font-mono text-[11px] focus:border-primary focus:outline-none"
            />
          )}

          {hint && !error && (
            <span className="text-[10px] text-muted-foreground leading-snug">{hint}</span>
          )}
          {error && (
            <span className="text-[10px] text-red-700 bg-red-50 px-2 py-1 rounded-lg flex items-start gap-1">
              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
              {error}
            </span>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
