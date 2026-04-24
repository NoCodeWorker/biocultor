import prisma from '@/lib/db';
import {
  seoArticles,
  seoArticlesOrtiga,
  seoCommercialPages,
  seoCommercialPagesOrtiga,
  seoGeoPages,
  seoSolutions,
  seoSolutionsOrtiga,
  type SeoArticle,
  type SeoCommercialPage,
  type SeoGeoPage,
  type SeoSolution,
} from '@/lib/seo-content';

type SeoKind =
  | 'ARTICLE'
  | 'COMMERCIAL'
  | 'GEO'
  | 'SOLUTION'
  | 'ARTICLE_ORTIGA'
  | 'COMMERCIAL_ORTIGA'
  | 'SOLUTION_ORTIGA';

type DbSeoPage = {
  kind: string;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  intro: string | null;
  excerpt: string | null;
  image: string | null;
  label: string | null;
  readTime: string | null;
  payloadJson: string;
  faqJson: string;
  summaryJson: string;
};

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function getSeoOverrides(kind: SeoKind): Promise<Map<string, DbSeoPage>> {
  try {
    const rows = await prisma.seoPage.findMany({
      where: { kind, isPublished: true },
      orderBy: { updatedAt: 'desc' },
    });

    return new Map(rows.map((row) => [row.slug, row]));
  } catch {
    return new Map();
  }
}

function mergeSolution(base: SeoSolution, override?: DbSeoPage): SeoSolution {
  if (!override) return base;
  const payload = parseJson<{ benefits?: string[]; applications?: string[] }>(override.payloadJson, {});
  return {
    ...base,
    title: override.title || base.title,
    metaTitle: override.metaTitle || base.metaTitle,
    metaDescription: override.metaDescription || base.metaDescription,
    intro: override.intro || base.intro,
    audience: override.label || base.audience,
    benefits: payload.benefits || base.benefits,
    applications: payload.applications || base.applications,
    faq: parseJson(override.faqJson, base.faq),
  };
}

function mergeCommercial(base: SeoCommercialPage, override?: DbSeoPage): SeoCommercialPage {
  if (!override) return base;
  const payload = parseJson<{ reasons?: string[]; bestFor?: string[] }>(override.payloadJson, {});
  return {
    ...base,
    title: override.title || base.title,
    metaTitle: override.metaTitle || base.metaTitle,
    metaDescription: override.metaDescription || base.metaDescription,
    intro: override.intro || base.intro,
    keyword: override.label || base.keyword,
    reasons: payload.reasons || base.reasons,
    bestFor: payload.bestFor || base.bestFor,
    faq: parseJson(override.faqJson, base.faq),
  };
}

function mergeArticle(base: SeoArticle, override?: DbSeoPage): SeoArticle {
  if (!override) return base;
  const payload = parseJson<{ sections?: SeoArticle['sections'] }>(override.payloadJson, {});
  return {
    ...base,
    category: override.label || base.category,
    title: override.title || base.title,
    metaTitle: override.metaTitle || base.metaTitle,
    metaDescription: override.metaDescription || base.metaDescription,
    excerpt: override.excerpt || base.excerpt,
    readTime: override.readTime || base.readTime,
    image: override.image || base.image,
    sections: payload.sections || base.sections,
    summary: parseJson(override.summaryJson, base.summary),
    faq: parseJson(override.faqJson, base.faq),
  };
}

function mergeGeo(base: SeoGeoPage, override?: DbSeoPage): SeoGeoPage {
  if (!override) return base;
  const payload = parseJson<{
    crops?: string[];
    logistics?: string[];
    quickAnswers?: string[];
  }>(override.payloadJson, {});
  return {
    ...base,
    region: override.label || base.region,
    title: override.title || base.title,
    metaTitle: override.metaTitle || base.metaTitle,
    metaDescription: override.metaDescription || base.metaDescription,
    intro: override.intro || base.intro,
    crops: payload.crops || base.crops,
    logistics: payload.logistics || base.logistics,
    quickAnswers: payload.quickAnswers || base.quickAnswers,
    faq: parseJson(override.faqJson, base.faq),
  };
}

export async function getSeoSolutions() {
  const overrides = await getSeoOverrides('SOLUTION');
  return seoSolutions.map((entry) => mergeSolution(entry, overrides.get(entry.slug)));
}

export async function getSeoCommercialPages() {
  const overrides = await getSeoOverrides('COMMERCIAL');
  return seoCommercialPages.map((entry) => mergeCommercial(entry, overrides.get(entry.slug)));
}

export async function getSeoArticles() {
  const overrides = await getSeoOverrides('ARTICLE');
  return seoArticles.map((entry) => mergeArticle(entry, overrides.get(entry.slug)));
}

export async function getSeoGeoPages() {
  const overrides = await getSeoOverrides('GEO');
  return seoGeoPages.map((entry) => mergeGeo(entry, overrides.get(entry.slug)));
}

// -----------------------------------------------------------------------------
// Purín de ortiga — getters paralelos con kind propio para permitir overrides
// editoriales sin colisión con los slugs del clúster del té de humus.
// -----------------------------------------------------------------------------

export async function getSeoSolutionsOrtiga() {
  const overrides = await getSeoOverrides('SOLUTION_ORTIGA');
  return seoSolutionsOrtiga.map((entry) => mergeSolution(entry, overrides.get(entry.slug)));
}

export async function getSeoCommercialPagesOrtiga() {
  const overrides = await getSeoOverrides('COMMERCIAL_ORTIGA');
  return seoCommercialPagesOrtiga.map((entry) =>
    mergeCommercial(entry, overrides.get(entry.slug))
  );
}

export async function getSeoArticlesOrtiga() {
  const overrides = await getSeoOverrides('ARTICLE_ORTIGA');
  return seoArticlesOrtiga.map((entry) => mergeArticle(entry, overrides.get(entry.slug)));
}
