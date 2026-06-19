import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, ShieldAlert } from 'lucide-react';
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
import { caseStudies, getCaseStudy } from '@/lib/authority-assets';

export const revalidate = 3600;

export function generateStaticParams() {
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getCaseStudy(slug);
  if (!item) return {};

  return buildMetadata({
    title: item.metaTitle,
    description: item.metaDescription,
    path: `/casos/${item.slug}`,
    keywords: [item.segment, item.location, 'caso jardineria biologica', 'humus liquido jardines'],
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCaseStudy(slug);
  if (!item) notFound();

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Casos', href: '/casos' },
    { label: item.title },
  ];

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: 'Inicio', path: '/' },
        { name: 'Casos', path: '/casos' },
        { name: item.title, path: `/casos/${item.slug}` },
      ]),
      {
        '@type': 'Article',
        headline: item.title,
        description: item.metaDescription,
        url: absoluteUrl(`/casos/${item.slug}`),
        author: { '@id': 'https://biocultor.com/#organization' },
        publisher: { '@id': 'https://biocultor.com/#organization' },
        about: item.segment,
        citation: item.reference.url,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <StructuredData id={`case-${item.slug}-schema`} data={graphSchema} />
      <div className="mx-auto w-[92%] py-8 lg:w-[80%] xl:w-[75%]">
        <Breadcrumbs items={breadcrumbs} />

        <article className="py-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <header className="lg:col-span-8">
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  {item.segment}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  {item.status === 'captacion' ? 'Caso en captacion' : 'Documentable'}
                </span>
              </div>
              <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
                {item.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{item.problem}</p>
            </header>

            <aside className="lg:col-span-4">
              <div className="rounded-2xl border border-border/60 bg-card p-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {item.location}
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Fechas y mediciones pendientes de caso real
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <Button asChild className="rounded-full bg-primary text-white hover:bg-brand-green-hover">
                    <Link href={item.primaryHref}>{item.primaryCta}</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={item.secondaryHref}>{item.secondaryCta}</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-12 grid gap-6 lg:grid-cols-3">
            <ContentBlock title="Intervencion prevista" items={item.intervention} />
            <ContentBlock title="Evidencia a recoger" items={item.evidenceToCollect} />
            <ContentBlock title="Limites honestos" items={item.limits} warning />
          </section>

          <section className="mt-12 rounded-3xl border border-border/60 bg-card p-6 md:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">Encaje comercial</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {item.commercialFit}
            </p>
          </section>

          <section className="mt-8 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">Referencia tecnica</h2>
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
        </article>
      </div>
    </main>
  );
}

function ContentBlock({
  title,
  items,
  warning = false,
}: {
  title: string;
  items: string[];
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        {warning ? (
          <ShieldAlert className="h-5 w-5 text-amber-600" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        )}
        <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
      </div>
      <ul className="space-y-3">
        {items.map((entry) => (
          <li key={entry} className="text-sm leading-relaxed text-muted-foreground">
            {entry}
          </li>
        ))}
      </ul>
    </div>
  );
}
