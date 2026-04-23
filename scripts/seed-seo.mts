import { PrismaClient } from '../generated/prisma/index.js';
import {
  seoArticles,
  seoCommercialPages,
  seoGeoPages,
  seoSolutions,
} from '../lib/seo-content.ts';

const prisma = new PrismaClient();

async function main() {
  const operations = [
    ...seoSolutions.map((entry) =>
      prisma.seoPage.upsert({
        where: { slug: entry.slug },
        update: {
          kind: 'SOLUTION',
          title: entry.title,
          targetKeyword: entry.title.toLowerCase(),
          workflowStatus: 'READY',
          priorityScore: 76,
          metaTitle: entry.metaTitle,
          metaDescription: entry.metaDescription,
          intro: entry.intro,
          label: entry.audience,
          payloadJson: JSON.stringify({
            benefits: entry.benefits,
            applications: entry.applications,
          }),
          faqJson: JSON.stringify(entry.faq),
        },
        create: {
          kind: 'SOLUTION',
          slug: entry.slug,
          title: entry.title,
          targetKeyword: entry.title.toLowerCase(),
          workflowStatus: 'READY',
          priorityScore: 76,
          metaTitle: entry.metaTitle,
          metaDescription: entry.metaDescription,
          intro: entry.intro,
          label: entry.audience,
          payloadJson: JSON.stringify({
            benefits: entry.benefits,
            applications: entry.applications,
          }),
          faqJson: JSON.stringify(entry.faq),
        },
      })
    ),
    ...seoCommercialPages.map((entry) =>
      prisma.seoPage.upsert({
        where: { slug: entry.slug },
        update: {
          kind: 'COMMERCIAL',
          title: entry.title,
          targetKeyword: entry.keyword,
          workflowStatus: 'PRIORITY',
          priorityScore: 92,
          metaTitle: entry.metaTitle,
          metaDescription: entry.metaDescription,
          intro: entry.intro,
          label: entry.keyword,
          payloadJson: JSON.stringify({
            reasons: entry.reasons,
            bestFor: entry.bestFor,
          }),
          faqJson: JSON.stringify(entry.faq),
        },
        create: {
          kind: 'COMMERCIAL',
          slug: entry.slug,
          title: entry.title,
          targetKeyword: entry.keyword,
          workflowStatus: 'PRIORITY',
          priorityScore: 92,
          metaTitle: entry.metaTitle,
          metaDescription: entry.metaDescription,
          intro: entry.intro,
          label: entry.keyword,
          payloadJson: JSON.stringify({
            reasons: entry.reasons,
            bestFor: entry.bestFor,
          }),
          faqJson: JSON.stringify(entry.faq),
        },
      })
    ),
    ...seoArticles.map((entry) =>
      prisma.seoPage.upsert({
        where: { slug: entry.slug },
        update: {
          kind: 'ARTICLE',
          title: entry.title,
          targetKeyword: entry.title.toLowerCase(),
          workflowStatus: 'READY',
          priorityScore: 68,
          metaTitle: entry.metaTitle,
          metaDescription: entry.metaDescription,
          excerpt: entry.excerpt,
          image: entry.image,
          label: entry.category,
          readTime: entry.readTime,
          payloadJson: JSON.stringify({
            sections: entry.sections,
          }),
          faqJson: JSON.stringify(entry.faq),
          summaryJson: JSON.stringify(entry.summary),
        },
        create: {
          kind: 'ARTICLE',
          slug: entry.slug,
          title: entry.title,
          targetKeyword: entry.title.toLowerCase(),
          workflowStatus: 'READY',
          priorityScore: 68,
          metaTitle: entry.metaTitle,
          metaDescription: entry.metaDescription,
          excerpt: entry.excerpt,
          image: entry.image,
          label: entry.category,
          readTime: entry.readTime,
          payloadJson: JSON.stringify({
            sections: entry.sections,
          }),
          faqJson: JSON.stringify(entry.faq),
          summaryJson: JSON.stringify(entry.summary),
        },
      })
    ),
    ...seoGeoPages.map((entry) =>
      prisma.seoPage.upsert({
        where: { slug: entry.slug },
        update: {
          kind: 'GEO',
          title: entry.title,
          targetKeyword: `${entry.title.toLowerCase()} comprar online`,
          workflowStatus: 'READY',
          priorityScore: 74,
          metaTitle: entry.metaTitle,
          metaDescription: entry.metaDescription,
          intro: entry.intro,
          label: entry.region,
          payloadJson: JSON.stringify({
            crops: entry.crops,
            logistics: entry.logistics,
            quickAnswers: entry.quickAnswers,
          }),
          faqJson: JSON.stringify(entry.faq),
        },
        create: {
          kind: 'GEO',
          slug: entry.slug,
          title: entry.title,
          targetKeyword: `${entry.title.toLowerCase()} comprar online`,
          workflowStatus: 'READY',
          priorityScore: 74,
          metaTitle: entry.metaTitle,
          metaDescription: entry.metaDescription,
          intro: entry.intro,
          label: entry.region,
          payloadJson: JSON.stringify({
            crops: entry.crops,
            logistics: entry.logistics,
            quickAnswers: entry.quickAnswers,
          }),
          faqJson: JSON.stringify(entry.faq),
        },
      })
    ),
  ];

  const result = await prisma.$transaction(operations);
  console.log(JSON.stringify({ success: true, records: result.length }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
