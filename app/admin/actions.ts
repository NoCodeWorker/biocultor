'use server';

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

function revalidateSeoPaths(kind: string, slug: string) {
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/seo');
  revalidatePath('/sitemap.xml');

  if (kind === 'ARTICLE') {
    revalidatePath('/aprende');
    revalidatePath(`/aprende/${slug}`);
    return;
  }

  if (kind === 'COMMERCIAL') {
    revalidatePath('/comprar-te-de-humus-de-lombriz');
    revalidatePath(`/comprar-te-de-humus-de-lombriz/${slug}`);
    return;
  }

  if (kind === 'GEO') {
    revalidatePath('/espana');
    revalidatePath(`/espana/${slug}`);
    return;
  }

  if (kind === 'SOLUTION') {
    revalidatePath('/te-de-humus-de-lombriz');
    revalidatePath(`/te-de-humus-de-lombriz/${slug}`);
  }
}

export async function updateVariantPrice(id: string, price: number, comparePrice: number | null) {
  try {
    await prisma.variant.update({
      where: { id },
      data: { 
        price, 
        comparePrice 
      }
    });
    
    // Purga de la cache extrema de Next.js para forzar la actualización en toda la app
    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error updating price", error);
    return { success: false, error: "Error en base de datos" };
  }
}

export async function updateSeoPage(input: {
  id: string;
  kind: string;
  slug: string;
  title: string;
  targetKeyword: string;
  workflowStatus: string;
  priorityScore: number;
  notes: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  excerpt: string;
  image: string;
  label: string;
  readTime: string;
  payloadJson: string;
  faqJson: string;
  summaryJson: string;
  isPublished: boolean;
}) {
  try {
    JSON.parse(input.payloadJson || '{}');
    JSON.parse(input.faqJson || '[]');
    JSON.parse(input.summaryJson || '[]');
  } catch {
    return { success: false, error: 'JSON inválido en payload, FAQ o summary' };
  }

  try {
    await prisma.seoPage.update({
      where: { id: input.id },
      data: {
        title: input.title,
        targetKeyword: input.targetKeyword || null,
        workflowStatus: input.workflowStatus,
        priorityScore: input.priorityScore,
        notes: input.notes || null,
        metaTitle: input.metaTitle || null,
        metaDescription: input.metaDescription || null,
        intro: input.intro || null,
        excerpt: input.excerpt || null,
        image: input.image || null,
        label: input.label || null,
        readTime: input.readTime || null,
        payloadJson: input.payloadJson || '{}',
        faqJson: input.faqJson || '[]',
        summaryJson: input.summaryJson || '[]',
        isPublished: input.isPublished,
      },
    });

    revalidateSeoPaths(input.kind, input.slug);
    return { success: true };
  } catch (error) {
    console.error('Error updating SEO page', error);
    return { success: false, error: 'Error guardando la página SEO' };
  }
}
