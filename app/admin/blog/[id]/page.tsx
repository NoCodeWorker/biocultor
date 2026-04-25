import prisma from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PostEditor from '../PostEditor';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Blog
      </Link>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">Editando</p>
        <h1 className="text-2xl md:text-3xl font-heading font-black text-foreground tracking-tight mt-1 truncate">
          {post.title}
        </h1>
      </div>

      <PostEditor
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          isPublished: post.isPublished,
          author: post.author,
          metaTitle: post.metaTitle,
          metaDesc: post.metaDesc,
          keywords: post.keywords,
        }}
      />
    </div>
  );
}
