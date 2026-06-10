import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function checkPosts() {
  try {
    const count = await prisma.post.count();
    console.log(`Total posts en DB: ${count}`);
    
    const posts = await prisma.post.findMany({
      select: { id: true, slug: true, content: true },
      take: 20
    });
    
    for (const post of posts) {
      const hasPrices = /\(\d+\.\d+ €\)/.test(post.content);
      if (hasPrices) {
        const matches = post.content.match(/\(\d+\.\d+ €\)/g);
        console.log(`⚠️  ${post.slug}: precios encontrados: ${matches?.join(', ')}`);
      }
    }
    
    if (count > 0 && posts.every((p: { id: string; slug: string; content: string }) => !/\(\d+\.\d+ €\)/.test(p.content))) {
      console.log('✅ Ningún post tiene precios hardcodeados en el contenido.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();
