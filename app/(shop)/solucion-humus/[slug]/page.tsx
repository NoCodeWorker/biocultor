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
  const post = await prisma.post.findFirst({
    where: { 
      slug: resolvedParams.slug,
      category: 'GEO_LANDING',
      isPublished: true
    }
  });

  if (!post) return { title: 'Solución Biocultor' };

  return buildMetadata({
    title: `${post.title} | Biocultor`,
    description: post.excerpt,
    path: `/solucion-humus/${post.slug}`,
    image: post.image || '/Logo.svg',
    type: 'article'
  });
}

export default async function GeoLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findFirst({
    where: { 
      slug: resolvedParams.slug,
      category: 'GEO_LANDING',
      isPublished: true
    }
  });

  if (!post) notFound();

  return (
    <article className="w-full bg-background relative z-10 antialiased pb-20">
      {/* Hero Transaccional GEO */}
      <div className="w-full bg-cream-warm border-b border-border/40 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="w-[92%] lg:w-[80%] xl:w-[65%] mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-4">
            Solución Agronómica Biocultor
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
            {post.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-8">
            {post.excerpt}
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
        {post.image && (
          <div className="w-full aspect-[21/9] relative rounded-3xl overflow-hidden mb-12 shadow-lg border border-border/50">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        )}
        
        <div className="prose prose-lg prose-headings:font-heading prose-headings:font-bold prose-h2:text-3xl prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl max-w-none text-muted-foreground">
          <Markdown>{post.content}</Markdown>
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
