const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const patterns = [
  [/ \(149\.90 €\)/g, ''],
  [/ \(49\.90 €\)/g, ''],
  [/ \(16\.90 €\)/g, ''],
  [/ \(9\.95 €\)/g, ''],
  [/ \(19\.95 €\)/g, ''],
  [/ \(49\.95 €\)/g, ''],
];

async function run() {
  const posts = await p.post.findMany({ select: { id: true, slug: true, content: true } });
  console.log('Total posts:', posts.length);
  let updated = 0;
  for (const post of posts) {
    let content = post.content;
    let changed = false;
    for (const [regex, repl] of patterns) {
      const before = content;
      content = content.replace(regex, repl);
      if (content !== before) changed = true;
    }
    if (changed) {
      await p.post.update({ where: { id: post.id }, data: { content } });
      console.log('Updated:', post.slug);
      updated++;
    }
  }
  console.log('Done. Updated:', updated);
}

run().catch(console.error).finally(() => p.$disconnect());
