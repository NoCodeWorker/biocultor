import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Scale, ShieldAlert } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import {
  absoluteUrl,
  breadcrumbSchema,
  buildMetadata,
  organizationSchema,
  websiteSchema,
} from '@/lib/seo';
import { comparisonPages, getComparisonPage } from '@/lib/leadership-assets';

export const revalidate = 3600;

export function generateStaticParams() {
  return comparisonPages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getComparisonPage(slug);
  if (!item) return {};

  return buildMetadata({
    title: item.metaTitle,
    description: item.metaDescription,
    path: `/comparativas/${item.slug}`,
    keywords: [item.title, item.alternative, item.audience, 'comparativa humus liquido'],
  });
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getComparisonPage(slug);
  if (!item) notFound();

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Biblioteca', href: '/biblioteca' },
    { label: item.title },
  ];

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: 'Inicio', path: '/' },
        { name: 'Biblioteca', path: '/biblioteca' },
        { name: item.title, path: `/comparativas/${item.slug}` },
      ]),
      {
        '@type': 'Article',
        headline: item.title,
        description: item.metaDescription,
        url: absoluteUrl(`/comparativas/${item.slug}`),
        author: { '@id': 'https://biocultor.com/#organization' },
        publisher: { '@id': 'https://biocultor.com/#organization' },
        citation: item.reference.url,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <StructuredData id={`comparison-${item.slug}-schema`} data={graphSchema} />
      <div className="mx-auto w-[92%] py-8 lg:w-[80%] xl:w-[75%]">
        <Breadcrumbs items={breadcrumbs} />

        <article className="py-10">
          <header className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Scale className="h-3.5 w-3.5" />
              Comparativa honesta
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
              {item.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{item.summary}</p>
          </header>

          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <DecisionBlock title="Cuando Biocultor encaja" items={item.whenBiocultorFits} />
            <DecisionBlock title={`Cuando encaja ${item.alternative}`} items={item.whenAlternativeFits} muted />
          </section>

          <section className="mt-10 overflow-hidden rounded-3xl border border-border/60 bg-card">
            <div className="grid grid-cols-3 border-b border-border/60 bg-muted/30 px-5 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Criterio</span>
              <span>Biocultor</span>
              <span>{item.alternative}</span>
            </div>
            {item.decisionMatrix.map((row) => (
              <div key={row.criterion} className="grid grid-cols-3 gap-4 border-b border-border/40 px-5 py-4 last:border-b-0">
                <p className="text-sm font-bold text-foreground">{row.criterion}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{row.biocultor}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{row.alternative}</p>
              </div>
            ))}
          </section>

          <section className="mt-10 rounded-3xl border border-amber-200/70 bg-amber-50 p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-700" />
              <h2 className="font-heading text-2xl font-bold text-foreground">Limites honestos</h2>
            </div>
            <ul className="space-y-3">
              {item.limits.map((limit) => (
                <li key={limit} className="text-sm leading-relaxed text-amber-900/80">
                  {limit}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">Referencia usada</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.reference.note}</p>
            <a
              href={item.reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              {item.reference.source}
              <ArrowRight className="h-4 w-4" />
            </a>
          </section>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-primary text-white hover:bg-brand-green-hover">
              <Link href={item.ctaHref}>{item.ctaLabel}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/biblioteca">Volver a biblioteca</Link>
            </Button>
          </div>
        </article>
      </div>
    </main>
  );
}

function DecisionBlock({
  title,
  items,
  muted = false,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 ${muted ? 'border-border/60 bg-card' : 'border-primary/20 bg-primary/5'}`}>
      <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
