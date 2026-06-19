import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ClipboardCheck, FileText, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import {
  breadcrumbSchema,
  buildMetadata,
  collectionPageSchema,
  organizationSchema,
  websiteSchema,
} from '@/lib/seo';
import { caseStudies, downloadResources } from '@/lib/authority-assets';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Casos y metodologia de jardineria biologica | Biocultor',
  description:
    'Hub de casos documentables, metodologia de campo y recursos para evaluar aplicaciones de humus liquido en jardines premium, comunidades y empresas.',
  path: '/casos',
  keywords: [
    'casos jardineria biologica',
    'metodologia aplicacion humus',
    'antes despues cesped',
    'mantenimiento jardines premium',
  ],
});

export default function CasosPage() {
  const breadcrumbs = [{ label: 'Inicio', href: '/' }, { label: 'Casos' }];
  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: 'Inicio', path: '/' },
        { name: 'Casos', path: '/casos' },
      ]),
      collectionPageSchema({
        name: 'Casos y metodologia Biocultor',
        description:
          'Casos documentables y recursos para evaluar intervenciones biologicas en jardines y zonas verdes.',
        path: '/casos',
        items: [
          ...caseStudies.map((item) => ({ name: item.title, path: `/casos/${item.slug}` })),
          ...downloadResources.map((item) => ({ name: item.title, path: `/recursos/${item.slug}` })),
        ],
      }),
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <StructuredData id="cases-hub-schema" data={graphSchema} />
      <div className="mx-auto w-[92%] py-8 lg:w-[80%] xl:w-[75%]">
        <Breadcrumbs items={breadcrumbs} />

        <section className="grid gap-10 py-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Prueba documentada, no promesas
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
              Casos y metodologia para jardines donde el resultado importa.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              La autoridad de Biocultor no debe apoyarse en fotos sueltas ni claims cerrados. Cada caso debe documentar problema, fecha, intervencion, limites y seguimiento antes de convertirse en prueba comercial.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-primary text-white hover:bg-brand-green-hover">
                <Link href="/contacto?servicio=caso-documentado">
                  Documentar un jardin
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/servicios">Ver servicios</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:col-span-5">
            {[
              'Fotos comparables antes/despues, no imagenes decorativas.',
              'Limitaciones visibles: riego, compactacion, resiembra, calor y uso.',
              'CTA claro: comprar producto si puedes aplicar; contratar servicio si necesitas ejecucion.',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border/60 bg-card p-5">
                <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 py-10">
          <div className="mb-8 max-w-3xl">
            <h2 className="font-heading text-3xl font-bold text-foreground">Fichas de caso documentables</h2>
            <p className="mt-3 text-muted-foreground">
              Estas paginas son activos de autoridad preparados para capturar datos reales. No presentan resultados cerrados hasta que exista evidencia verificable.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {caseStudies.map((item) => (
              <Link
                key={item.slug}
                href={`/casos/${item.slug}`}
                className="flex flex-col rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/50"
              >
                <span className="mb-4 w-fit rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  {item.segment}
                </span>
                <h3 className="font-heading text-xl font-bold leading-tight text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.problem}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Ver ficha
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 py-10">
          <div className="mb-8 max-w-3xl">
            <h2 className="font-heading text-3xl font-bold text-foreground">Descargables operativos</h2>
            <p className="mt-3 text-muted-foreground">
              Recursos pensados para propietarios, administradores y profesionales que necesitan decidir con criterio antes de comprar o contratar.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {downloadResources.map((item) => (
              <Link
                key={item.slug}
                href={`/recursos/${item.slug}`}
                className="rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/50"
              >
                <FileText className="mb-4 h-6 w-6 text-primary" />
                <h3 className="font-heading text-lg font-bold leading-tight text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Abrir recurso
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 py-10">
          <div className="rounded-3xl bg-primary px-6 py-8 text-white md:px-10">
            <h2 className="font-heading text-3xl font-bold">Quieres convertir tu jardin en caso documentado?</h2>
            <p className="mt-3 max-w-3xl text-white/80">
              Si el proyecto encaja, Biocultor puede documentar diagnostico, aplicacion y seguimiento con criterios publicables. Sin garantias infladas: datos, fotos, limites y decision tecnica.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6 rounded-full">
              <Link href="/contacto?servicio=caso-documentado">Proponer caso</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
