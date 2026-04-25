import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  title: string;
  icon?: LucideIcon;
  hint?: string;
  /** Acción opcional en la esquina superior derecha. */
  action?: { href: string; label: string };
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
};

export default function Panel({
  title,
  icon: Icon,
  hint,
  action,
  className,
  bodyClassName,
  children,
}: Props) {
  return (
    <section
      className={cn(
        'bg-card border border-border/60 rounded-2xl flex flex-col overflow-hidden',
        className
      )}
    >
      <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div className="flex items-start gap-2.5 min-w-0">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground tracking-tight">{title}</h2>
            {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
          </div>
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0"
          >
            {action.label} <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </header>
      <div className={cn('px-5 pb-5', bodyClassName)}>{children}</div>
    </section>
  );
}
