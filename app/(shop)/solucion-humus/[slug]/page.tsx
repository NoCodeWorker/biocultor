import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { buildMetadata, faqSchema } from "@/lib/seo";
import StructuredData from "@/components/StructuredData";
import Markdown from 'react-markdown';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const page = await prisma.seoPage.findFirst({
    where: { 
      slug: resolvedParams.slug,
      kind: 'LANDING',
      isPublished: true
    }
  });

  if (!page) return { title: 'Solución Biocultor' };

  let payload: any = {};
  try { payload = JSON.parse(page.payloadJson || '{}'); } catch (e) {}

  return buildMetadata({
    title: `${page.title} | Biocultor`,
    description: page.excerpt || '',
    path: `/solucion-humus/${page.slug}`,
    image: payload.heroImage || page.image || '/Logo.svg',
    type: 'article'
  });
}

export default async function GeoLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const page = await prisma.seoPage.findFirst({
    where: { 
      slug: resolvedParams.slug,
      kind: 'LANDING',
      isPublished: true
    }
  });

  if (!page) notFound();

  let payload: any = {};
  try { payload = JSON.parse(page.payloadJson || '{}'); } catch (e) {}

  const heroImage = payload.heroImage;
  const sectionImages = [payload.section1Image, payload.section2Image, payload.section3Image].filter(Boolean);
  const markdownContent = payload.markdownContent || '';

  return (
    <article className="w-full bg-background relative z-10 antialiased pb-20">
      {/* Hero Transaccional GEO */}
      <div className="w-full bg-cream-warm border-b border-border/40 py-16 md:py-24 relative overflow-hidden min-h-[400px] flex items-center justify-center">
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <Image src={heroImage} alt={page.title} fill className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none z-0" />
        <div className="w-[92%] lg:w-[80%] xl:w-[65%] mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-4 bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm border border-primary/20">
            Solución Agronómica Biocultor
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
            {page.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-8 font-medium bg-background/50 p-4 rounded-2xl backdrop-blur-sm">
            {page.excerpt}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/producto/te-humus-liquido-premium"
              className="bg-brand-brown-dark hover:bg-brand-brown text-cream font-bold px-8 py-4 rounded-full shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Ver Formatos Profesionales <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Bar Rápid */}
      <div className="w-full bg-background border-b border-border/40 py-6">
        <div className="w-[92%] lg:w-[80%] xl:w-[65%] mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium text-foreground/80">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 100% Ecológico y Certificado</div>
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Fabricación en España</div>
          <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Envíos 24/48h</div>
        </div>
      </div>

      {/* Contenido Técnico (ADR-002) */}
      <div className="w-[92%] lg:w-[80%] xl:w-[60%] mx-auto px-4 py-16">
        
        {/* Galería de Secciones si existen */}
        {sectionImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {sectionImages.map((img, i) => (
              <div key={i} className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-md border border-border/50">
                <Image src={img} alt={`Fase ${i+1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-lg prose-headings:font-heading prose-headings:font-bold prose-h2:text-3xl prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl max-w-none text-muted-foreground">
          <Markdown>{markdownContent}</Markdown>
        </div>
      </div>

      {/* CTA Final */}
      <div className="w-[92%] lg:w-[80%] xl:w-[60%] mx-auto px-4 py-12 bg-cream-warm rounded-3xl border border-border/40 text-center mt-8">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">¿Preparado para regenerar tu cultivo?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Adquiere el Té de Humus Líquido directamente del fabricante. Formatos desde 1L hasta IBC de 1000L.
        </p>
        <Link 
          href="/producto/te-humus-liquido-premium"
          className="inline-flex bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all hover:scale-[1.02]"
        >
          Comprar Té de Humus Líquido
        </Link>
      </div>
    </article>
  );
}
