import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({
  items,
  className = '',
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-8 overflow-x-auto ${className}`.trim()}
    >
      <ol className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="truncate hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`truncate ${isLast ? 'font-medium text-foreground' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span className="opacity-40">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
