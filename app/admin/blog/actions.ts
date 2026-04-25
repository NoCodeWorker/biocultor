'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type PostResult = { success?: boolean; error?: string };

function revalidateBlog(slug?: string) {
  revalidatePath('/admin/blog');
  revalidatePath('/aprende');
  if (slug) revalidatePath(`/aprende/${slug}`);
}

export async function createPost(formData: FormData): Promise<PostResult> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const excerpt = (formData.get('excerpt') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const category = (formData.get('category') as string)?.trim() || 'KNOWLEDGE';
  const metaTitle = (formData.get('metaTitle') as string)?.trim() || title;
  const metaDesc = (formData.get('metaDesc') as string)?.trim() || excerpt;
  const keywords = (formData.get('keywords') as string)?.trim() || '';
  const isPublished = formData.get('isPublished') === 'on';

  if (!title || !slug || !excerpt || !content) {
    return { error: 'Título, slug, extracto y contenido son obligatorios.' };
  }

  const collision = await prisma.post.findUnique({ where: { slug } });
  if (collision) return { error: `Ya existe un post con slug "${slug}".` };

  const post = await prisma.post.create({
    data: { title, slug, excerpt, content, category, metaTitle, metaDesc, keywords, isPublished },
  });

  revalidateBlog(slug);
  redirect(`/admin/blog/${post.id}`);
}

export async function updatePost(id: string, formData: FormData): Promise<PostResult> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const excerpt = (formData.get('excerpt') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const category = (formData.get('category') as string)?.trim() || 'KNOWLEDGE';
  const metaTitle = (formData.get('metaTitle') as string)?.trim() || title;
  const metaDesc = (formData.get('metaDesc') as string)?.trim() || excerpt;
  const keywords = (formData.get('keywords') as string)?.trim() || '';
  const isPublished = formData.get('isPublished') === 'on';

  if (!title || !slug || !excerpt || !content) {
    return { error: 'Título, slug, extracto y contenido son obligatorios.' };
  }

  const collision = await prisma.post.findFirst({ where: { slug, NOT: { id } } });
  if (collision) return { error: `El slug "${slug}" ya lo usa otro post.` };

  const prev = await prisma.post.findUnique({ where: { id } });
  await prisma.post.update({
    where: { id },
    data: { title, slug, excerpt, content, category, metaTitle, metaDesc, keywords, isPublished },
  });

  revalidateBlog(slug);
  if (prev && prev.slug !== slug) revalidateBlog(prev.slug);
  return { success: true };
}

export async function deletePost(id: string): Promise<PostResult> {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return { error: 'Post no encontrado.' };
  await prisma.post.delete({ where: { id } });
  revalidateBlog(post.slug);
  redirect('/admin/blog');
}

export async function togglePublished(id: string, isPublished: boolean): Promise<PostResult> {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return { error: 'Post no encontrado.' };
  await prisma.post.update({ where: { id }, data: { isPublished } });
  revalidateBlog(post.slug);
  return { success: true };
}
