'use client';

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export function ImageComparison({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Antes del tratamiento',
  afterAlt = 'Después del tratamiento',
  className,
}: ImageComparisonProps) {
  return (
    <div className={cn('relative w-full overflow-hidden rounded-none select-none', className)}>
      <ReactCompareSlider
        itemOne={
          <div className="relative w-full h-full">
            <ReactCompareSliderImage
              src={beforeSrc}
              alt={beforeAlt}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
            {/* Label ANTES */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20 shadow-md">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Antes
            </div>
          </div>
        }
        itemTwo={
          <div className="relative w-full h-full">
            <ReactCompareSliderImage
              src={afterSrc}
              alt={afterAlt}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
            {/* Label DESPUÉS */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white" />
              Después
            </div>
          </div>
        }
        style={{ height: '100%', width: '100%', touchAction: 'none' }}
        handle={
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-xl border-2 border-primary cursor-ew-resize">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-primary"
            >
              <path d="m15 18 6-6-6-6" />
              <path d="m9 6-6 6 6 6" />
            </svg>
          </div>
        }
      />
    </div>
  );
}
