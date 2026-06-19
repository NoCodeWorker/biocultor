import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Download, Users } from 'lucide-react';
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
import { downloadResources, getDownloadResource } from '@/lib/authority-assets';

export const revalidate = 3600;

export function generateStaticParams() {
  return downloadResources.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getDownloadResource(slug);
  if (!item) return {};

  return buildMetadata({
    title: item.metaTitle,
    description: item.metaDescription,
    path: `/recursos/${item.slug}`,
    keywords: [item.audience, 'checklist jardineria', 'humus liquido jardines'],
  });
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getDownloadResource(slug);
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
        { name: item.title, path: `/recursos/${item.slug}` },
      ]),
      {
        '@type': 'HowTo',
        name: item.title,
        description: item.metaDescription,
        url: absoluteUrl(`/recursos/${item.slug}`),
        publisher: { '@id': 'https://biocultor.com/#organization' },
        step: item.checklist.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          text: step,
        })),
        citation: item.reference.url,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <StructuredData id={`resource-${item.slug}-schema`} data={graphSchema} />
      <div className="mx-auto w-[92%] py-8 lg:w-[80%] xl:w-[75%]">
        <Breadcrumbs items={breadcrumbs} />

        <article className="py-10">
          <header className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Download className="h-3.5 w-3.5" />
              Recurso operativo
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
              {item.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{item.summary}</p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
              <Users className="h-5 w-5 shrink-0 text-primary" />
              {item.audience}
            </div>
          </header>

          <section className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-card p-6 lg:col-span-2">
              <h2 className="font-heading text-2xl font-bold text-foreground">Checklist</h2>
              <ol className="mt-5 space-y-4">
                {item.checklist.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <h2 className="font-heading text-xl font-bold text-foreground">Cuando usarlo</h2>
              <ul className="mt-5 space-y-3">
                {item.whenToUse.map((entry) => (
                  <li key={entry} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {entry}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full rounded-full bg-primary text-white hover:bg-brand-green-hover">
                <Link href={item.ctaHref}>{item.cta}</Link>
              </Button>
            </aside>
          </section>

          <section className="mt-8 rounded-3xl border border-border/60 bg-card p-6 md:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">Base de autoridad</h2>
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
