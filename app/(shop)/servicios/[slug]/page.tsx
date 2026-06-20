import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  HelpCircle,
  Leaf,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { ImageComparison } from '@/components/ui/image-comparison';
import prisma from '@/lib/db';
import { absoluteUrl, breadcrumbSchema, buildMetadata, faqSchema, organizationSchema, websiteSchema } from '@/lib/seo';
import { getPremiumServicePage, premiumServicePages } from '@/lib/premium-service-pages';

export const revalidate = 3600;

export async function generateStaticParams() {
  return premiumServicePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPremiumServicePage(slug);
  const seoOverride = await getServiceSeoOverride(slug);

  if (!page) {
    return buildMetadata({
      title: 'Servicio no encontrado | Biocultor',
      description: 'El servicio solicitado no está disponible.',
      path: '/servicios',
    });
  }

  return buildMetadata({
    title: seoOverride?.metaTitle || page.metaTitle,
    description: seoOverride?.metaDescription || page.metaDescription,
    path: `/servicios/${page.slug}`,
    image: seoOverride?.image || getVisualOverrides(page, seoOverride).after,
    keywords: [
      page.targetKeyword,
      page.segment,
      page.zone,
      'servicio aplicacion te de humus',
      'jardineria biologica',
      'Biocultor',
    ],
  });
}

export default async function PremiumServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPremiumServicePage(slug);
  const seoOverride = await getServiceSeoOverride(slug);

  if (!page) {
    notFound();
  }

  const servicePath = `/servicios/${page.slug}`;
  const budgetHref = `/contacto?servicio=${page.slug}`;
  const productHref = '/producto/te-humus-liquido-premium';
  const visualProof = getVisualOverrides(page, seoOverride);
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: page.title },
  ];

  const serviceSchema = {
    '@type': 'Service',
    '@id': `${absoluteUrl(servicePath)}#service`,
    name: page.title,
    serviceType: page.targetKeyword,
    description: seoOverride?.metaDescription || page.metaDescription,
    provider: { '@id': `${absoluteUrl('/')}#organization` },
    url: absoluteUrl(servicePath),
    areaServed: {
      '@type': 'AdministrativeArea',
      name: page.zone,
    },
    audience: {
      '@type': 'Audience',
      audienceType: page.segment,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      url: absoluteUrl(budgetHref),
      itemOffered: {
        '@type': 'Service',
        name: page.serviceRecommended,
      },
    },
    subjectOf: {
      '@type': 'CreativeWork',
      name: page.reference.title,
      publisher: page.reference.authority,
      url: page.reference.url,
    },
  };

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: 'Inicio', path: '/' },
        { name: 'Servicios', path: '/servicios' },
        { name: page.title, path: servicePath },
      ]),
      faqSchema(page.faqs),
      serviceSchema,
    ],
  };

  return (
    <main className="bg-background min-h-screen">
      <StructuredData id="premium-service-schema" data={graphSchema} />

      <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto py-8">
        <Breadcrumbs items={breadcrumbs} />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center py-10 md:py-14">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider self-start border border-primary/20">
              <Leaf className="w-3.5 h-3.5" />
              {page.kind === 'geo' ? 'Servicio premium local' : 'Servicio premium por segmento'}
            </div>

            <div className="space-y-4">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
                {page.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {page.intent}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="border border-border/60 bg-card rounded-2xl p-4">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Users className="w-4 h-4" />
                  Segmento
                </div>
                <p className="mt-2 text-muted-foreground leading-relaxed">{page.segment}</p>
              </div>
              <div className="border border-border/60 bg-card rounded-2xl p-4">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <MapPin className="w-4 h-4" />
                  Zona
                </div>
                <p className="mt-2 text-muted-foreground leading-relaxed">{page.zone}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-brand-green-hover text-white">
                <Link href={budgetHref}>
                  Solicitar presupuesto
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href={productHref}>Comprar té de humus</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-[320px] md:h-[460px] rounded-3xl overflow-hidden border border-border/50 shadow-xl shadow-foreground/5">
              <ImageComparison
                beforeSrc={visualProof.before}
                afterSrc={visualProof.after}
                beforeAlt={`Visual de diagnóstico para ${page.title}`}
                afterAlt={`Visual de metodología de aplicación para ${page.title}`}
                className="h-full w-full"
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-3">
              {visualProof.caption}
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14 border-t border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <article className="border border-border/60 bg-card rounded-3xl p-6 md:p-8">
              <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                Problema real
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground mt-3">
                Antes de aplicar, hay que leer el jardín.
              </h2>
              <p className="text-muted-foreground leading-relaxed mt-4">{page.problem}</p>
            </article>

            <article className="border border-primary/20 bg-primary/5 rounded-3xl p-6 md:p-8">
              <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                Servicio recomendado
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground mt-3">
                Intervención biológica con trazabilidad.
              </h2>
              <p className="text-muted-foreground leading-relaxed mt-4">{page.serviceRecommended}</p>
            </article>
          </div>
        </section>

        {page.localJustification && (
          <section className="py-10 md:py-14 border-t border-border/60">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                  <MapPin className="w-4 h-4" />
                  Señal local
                </div>
                <h2 className="font-heading text-3xl font-bold text-foreground mt-3">
                  {page.localJustification.title}
                </h2>
              </div>
              <div className="lg:col-span-7 grid grid-cols-1 gap-4">
                {page.localJustification.points.map((point) => (
                  <div key={point} className="flex items-start gap-3 border border-border/60 bg-card rounded-2xl p-5">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-10 md:py-14 border-t border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                  <ClipboardCheck className="w-4 h-4" />
                  Metodología
                </div>
                <h2 className="font-heading text-3xl font-bold text-foreground mt-3">
                  Cómo se ejecuta el servicio
                </h2>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  La aplicación se adapta a superficie, riego, tránsito, objetivo visual y capacidad del cliente para continuar el mantenimiento.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 gap-4">
              {page.methodology.map((step, index) => (
                <div key={step} className="flex gap-4 border border-border/60 bg-card rounded-2xl p-5">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 border-t border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Límites honestos
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground mt-3">
                Qué no conviene prometer
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-3">
              {page.honestLimits.map((limit) => (
                <div key={limit} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="leading-relaxed">{limit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 border-t border-border/60">
          <div className="border border-border/60 bg-card rounded-3xl p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Referencia técnica</p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-2">
                  {page.reference.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  {page.reference.authority}: {page.reference.takeaway}
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full shrink-0">
                <a href={page.reference.url} target="_blank" rel="noopener noreferrer">
                  Ver fuente
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 border-t border-border/60">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
              <HelpCircle className="w-4 h-4" />
              FAQ transaccional
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground mt-3">
              Preguntas antes de pedir presupuesto
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="border border-border/60 bg-card rounded-2xl p-5">
                <h3 className="font-heading font-bold text-base text-foreground">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-10 md:py-14 border-t border-border/60">
          <div className="bg-primary text-white rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Siguiente paso</p>
              <h2 className="font-heading text-3xl font-bold mt-2">Presupuesto o compra directa, según capacidad de aplicación.</h2>
              <p className="text-white/85 leading-relaxed mt-3 max-w-2xl">
                Si necesitas diagnóstico y ejecución, pide presupuesto. Si ya tienes equipo y criterio de aplicación, compra el producto y mantén la rutina.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <Link href={budgetHref}>Solicitar presupuesto</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent border-white/40 text-white hover:bg-white hover:text-primary">
                <Link href={productHref}>Comprar producto</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

async function getServiceSeoOverride(slug: string) {
  try {
    const page = await prisma.seoPage.findUnique({
      where: { slug },
      select: {
        metaTitle: true,
        metaDescription: true,
        image: true,
        payloadJson: true,
      },
    });
    return page;
  } catch {
    return null;
  }
}

function getVisualOverrides(
  page: NonNullable<ReturnType<typeof getPremiumServicePage>>,
  seoOverride: Awaited<ReturnType<typeof getServiceSeoOverride>>
) {
  let payload: Record<string, unknown> = {};
  try {
    payload = seoOverride?.payloadJson ? JSON.parse(seoOverride.payloadJson) : {};
  } catch {
    payload = {};
  }

  const before = typeof payload.beforeImage === 'string' && payload.beforeImage.trim()
    ? payload.beforeImage
    : page.visualProof.before;
  const after = typeof payload.afterImage === 'string' && payload.afterImage.trim()
    ? payload.afterImage
    : seoOverride?.image || page.visualProof.after;
  const caption = typeof payload.visualCaption === 'string' && payload.visualCaption.trim()
    ? payload.visualCaption
    : page.visualProof.caption;

  return { before, after, caption };
}
