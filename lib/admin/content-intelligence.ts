import "server-only"
import prisma from "@/lib/db"

type EditorialPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  isPublished: boolean
  coverImage: string | null
  coverImageAlt: string | null
  metaTitle: string | null
  metaDesc: string | null
  keywords: string
}

type EditorialSeoPage = {
  kind: string
  slug: string
  title: string
  targetKeyword: string | null
  workflowStatus: string
  priorityScore: number
  notes: string | null
  metaTitle: string | null
  metaDescription: string | null
  intro: string | null
  excerpt: string | null
  image: string | null
  label: string | null
  payloadJson: string
  faqJson: string
  summaryJson: string
  isPublished: boolean
}

export type ContentPillar = "cro" | "seo" | "geo" | "aio" | "visual"

export type ContentIntelligenceSummary = {
  generatedAt: string
  totals: {
    posts: number
    seoPages: number
    editable: number
  }
  pillars: Record<
    ContentPillar,
    {
      label: string
      score: number
      ready: number
      total: number
      focus: string
    }
  >
  visualContract: {
    withImage: number
    missingImage: number
    webpImages: number
    manualUploads: number
    weakAltText: number
    genericImages: number
  }
  priorityActions: Array<{
    pillar: ContentPillar
    title: string
    detail: string
    href: string
    severity: "high" | "medium"
  }>
}

const GENERIC_IMAGE_PATTERNS = [
  "/1 litro.jpg",
  "/5 litros.jpg",
  "/10 litros.jpg",
  "/25 litros.jpg",
  "/servicios-cesped-antes.webp",
  "/servicios-cesped-despues.webp",
]

const LOCAL_TERMS = [
  "madrid",
  "toledo",
  "castilla",
  "mancha",
  "valencia",
  "andalucia",
  "alicante",
  "ciudad real",
  "guadalajara",
  "españa",
]

export async function getContentIntelligenceSummary(): Promise<ContentIntelligenceSummary> {
  const [posts, seoPages] = await Promise.all([
    prisma.post.findMany({
      select: {
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        category: true,
        isPublished: true,
        coverImage: true,
        coverImageAlt: true,
        metaTitle: true,
        metaDesc: true,
        keywords: true,
      },
    }),
    prisma.seoPage.findMany({
      select: {
        kind: true,
        slug: true,
        title: true,
        targetKeyword: true,
        workflowStatus: true,
        priorityScore: true,
        notes: true,
        metaTitle: true,
        metaDescription: true,
        intro: true,
        excerpt: true,
        image: true,
        label: true,
        payloadJson: true,
        faqJson: true,
        summaryJson: true,
        isPublished: true,
      },
    }),
  ])

  const editableSeoPages = seoPages.filter((page) =>
    ["LANDING", "SERVICIO", "GEO"].includes(page.kind)
  )
  const editableTotal = posts.length + editableSeoPages.length

  const pillarStats = {
    cro: countReady([
      ...posts.map(scorePostCro),
      ...editableSeoPages.map(scoreSeoPageCro),
    ]),
    seo: countReady([
      ...posts.map(scorePostSeo),
      ...editableSeoPages.map(scoreSeoPageSeo),
    ]),
    geo: countReady(editableSeoPages.map(scoreSeoPageGeo)),
    aio: countReady([
      ...posts.map(scorePostAio),
      ...editableSeoPages.map(scoreSeoPageAio),
    ]),
    visual: countReady([
      ...posts.map(scorePostVisual),
      ...editableSeoPages.map(scoreSeoPageVisual),
    ]),
  }

  const allImages = [
    ...posts.map((post) => ({
      image: post.coverImage,
      alt: post.coverImageAlt,
    })),
    ...editableSeoPages.map((page) => ({
      image: page.image || getPayloadImage(page.payloadJson),
      alt: page.title,
    })),
  ]

  const priorityActions = buildPriorityActions(posts, editableSeoPages)

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      posts: posts.length,
      seoPages: editableSeoPages.length,
      editable: editableTotal,
    },
    pillars: {
      cro: {
        label: "CRO",
        score: pillarStats.cro.score,
        ready: pillarStats.cro.ready,
        total: pillarStats.cro.total,
        focus: "CTA, intención de compra/lead y claridad de siguiente paso.",
      },
      seo: {
        label: "SEO",
        score: pillarStats.seo.score,
        ready: pillarStats.seo.ready,
        total: pillarStats.seo.total,
        focus:
          "Metadata, keyword objetivo, indexabilidad y estructura editorial.",
      },
      geo: {
        label: "GEO",
        score: pillarStats.geo.score,
        ready: pillarStats.geo.ready,
        total: pillarStats.geo.total,
        focus:
          "Señales locales, zona, servicio recomendado y justificación territorial.",
      },
      aio: {
        label: "AIO",
        score: pillarStats.aio.score,
        ready: pillarStats.aio.ready,
        total: pillarStats.aio.total,
        focus:
          "FAQ, resumen semántico y respuestas extraíbles por motores de IA.",
      },
      visual: {
        label: "Imagen",
        score: pillarStats.visual.score,
        ready: pillarStats.visual.ready,
        total: pillarStats.visual.total,
        focus:
          "Contrato visual: imagen asignada, WebP, alt específico y no genérica.",
      },
    },
    visualContract: {
      withImage: allImages.filter((item) => Boolean(item.image)).length,
      missingImage: allImages.filter((item) => !item.image).length,
      webpImages: allImages.filter((item) =>
        item.image?.toLowerCase().endsWith(".webp")
      ).length,
      manualUploads: allImages.filter((item) =>
        item.image?.startsWith("/uploads/")
      ).length,
      weakAltText: allImages.filter(
        (item) => item.image && !hasStrongAlt(item.alt)
      ).length,
      genericImages: allImages.filter((item) => isGenericImage(item.image))
        .length,
    },
    priorityActions,
  }
}

function countReady(scores: number[]) {
  const total = scores.length
  const ready = scores.filter((score) => score >= 80).length
  const score =
    total === 0
      ? 100
      : Math.round(scores.reduce((sum, item) => sum + item, 0) / total)
  return { ready, total, score }
}

function scorePostSeo(post: EditorialPost) {
  return weighted([
    [isLengthBetween(post.metaTitle, 35, 70), 25],
    [isLengthBetween(post.metaDesc, 110, 170), 25],
    [Boolean(post.keywords.trim()), 15],
    [post.isPublished, 15],
    [hasReadableHeadings(post.content), 20],
  ])
}

function scoreSeoPageSeo(page: EditorialSeoPage) {
  return weighted([
    [isLengthBetween(page.metaTitle, 35, 70), 25],
    [isLengthBetween(page.metaDescription, 110, 170), 25],
    [Boolean(page.targetKeyword?.trim()), 20],
    [page.isPublished, 15],
    [page.workflowStatus !== "HOLD", 15],
  ])
}

function scorePostCro(post: EditorialPost) {
  const text = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase()
  return weighted([
    [
      mentionsAny(text, [
        "comprar",
        "pedido",
        "servicio",
        "contacto",
        "presupuesto",
        "calculadora",
      ]),
      35,
    ],
    [
      mentionsAny(text, [
        "cuándo",
        "cuando",
        "precio",
        "coste",
        "dosis",
        "aplicación",
        "aplicacion",
      ]),
      25,
    ],
    [Boolean(post.excerpt.trim()), 15],
    [hasReadableHeadings(post.content), 15],
    [Boolean(post.coverImage), 10],
  ])
}

function scoreSeoPageCro(page: EditorialSeoPage) {
  const text =
    `${page.title} ${page.intro ?? ""} ${page.excerpt ?? ""} ${page.payloadJson}`.toLowerCase()
  return weighted([
    [
      mentionsAny(text, [
        "precio",
        "presupuesto",
        "contratar",
        "comprar",
        "servicio",
        "contacto",
      ]),
      35,
    ],
    [Boolean(page.intro?.trim() || page.excerpt?.trim()), 20],
    [Boolean(page.image || getPayloadImage(page.payloadJson)), 20],
    [page.priorityScore >= 70, 15],
    [page.workflowStatus !== "HOLD", 10],
  ])
}

function scoreSeoPageGeo(page: EditorialSeoPage) {
  const summary = parseJsonRecord(page.summaryJson)
  const text =
    `${page.kind} ${page.slug} ${page.title} ${page.targetKeyword ?? ""} ${page.label ?? ""} ${page.intro ?? ""} ${page.excerpt ?? ""} ${page.summaryJson}`.toLowerCase()
  return weighted([
    [
      page.kind === "GEO" ||
        page.label?.toLowerCase().includes("geo") ||
        mentionsAny(text, LOCAL_TERMS),
      30,
    ],
    [mentionsAny(text, LOCAL_TERMS), 25],
    [hasStringField(summary, ["zone", "localJustification", "reference"]), 25],
    [Boolean(page.targetKeyword?.trim()), 10],
    [Boolean(page.image || getPayloadImage(page.payloadJson)), 10],
  ])
}

function scorePostAio(post: EditorialPost) {
  const text = `${post.excerpt}\n${post.content}`.toLowerCase()
  return weighted([
    [
      mentionsAny(text, [
        "faq",
        "pregunta",
        "respuesta",
        "para aio",
        "motores de respuesta",
      ]),
      25,
    ],
    [hasReadableHeadings(post.content), 25],
    [isLengthBetween(post.excerpt, 80, 260), 20],
    [
      mentionsAny(text, [
        "qué es",
        "cuando",
        "cuándo",
        "cómo",
        "por qué",
        "dosis",
      ]),
      20,
    ],
    [Boolean(post.metaDesc?.trim()), 10],
  ])
}

function scoreSeoPageAio(page: EditorialSeoPage) {
  const faqItems = parseJsonArray(page.faqJson)
  const summary = parseJson(page.summaryJson)
  return weighted([
    [faqItems.length >= 2, 35],
    [hasMeaningfulJson(summary), 30],
    [Boolean(page.metaDescription?.trim()), 15],
    [Boolean(page.intro?.trim() || page.excerpt?.trim()), 10],
    [page.isPublished, 10],
  ])
}

function scorePostVisual(post: EditorialPost) {
  return weighted([
    [Boolean(post.coverImage), 30],
    [post.coverImage?.toLowerCase().endsWith(".webp") ?? false, 25],
    [hasStrongAlt(post.coverImageAlt), 25],
    [!isGenericImage(post.coverImage), 20],
  ])
}

function scoreSeoPageVisual(page: EditorialSeoPage) {
  const image = page.image || getPayloadImage(page.payloadJson)
  return weighted([
    [Boolean(image), 35],
    [image?.toLowerCase().endsWith(".webp") ?? false, 25],
    [!isGenericImage(image), 25],
    [Boolean(getPayloadImage(page.payloadJson)), 15],
  ])
}

function buildPriorityActions(
  posts: EditorialPost[],
  pages: EditorialSeoPage[]
) {
  const actions: ContentIntelligenceSummary["priorityActions"] = []

  const genericVisuals = [
    ...posts
      .filter(
        (post) =>
          !post.coverImage ||
          isGenericImage(post.coverImage) ||
          !hasStrongAlt(post.coverImageAlt)
      )
      .map((post) => ({
        title: post.title,
        href: `/admin/blog?q=${encodeURIComponent(post.slug)}`,
        detail: "Artículo con imagen ausente, genérica o alt débil.",
      })),
    ...pages
      .filter((page) => ["LANDING", "SERVICIO", "GEO"].includes(page.kind))
      .filter((page) => {
        const image = page.image || getPayloadImage(page.payloadJson)
        return !image || isGenericImage(image)
      })
      .map((page) => ({
        title: page.title,
        href: `/admin/seo?open=${encodeURIComponent(page.slug)}`,
        detail:
          "Landing/servicio pendiente de visual propio asignado al dashboard.",
      })),
  ]

  for (const item of genericVisuals.slice(0, 3)) {
    actions.push({
      pillar: "visual",
      title: item.title,
      detail: item.detail,
      href: item.href,
      severity: "high",
    })
  }

  const weakAio = pages
    .filter((page) => ["LANDING", "SERVICIO", "GEO"].includes(page.kind))
    .filter((page) => scoreSeoPageAio(page) < 80)
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 2)

  for (const page of weakAio) {
    actions.push({
      pillar: "aio",
      title: page.title,
      detail: "Reforzar FAQ y summaryJson para respuestas extraíbles por IA.",
      href: `/admin/seo?open=${encodeURIComponent(page.slug)}`,
      severity: "medium",
    })
  }

  const weakGeo = pages
    .filter((page) => ["GEO", "SERVICIO"].includes(page.kind))
    .filter((page) => scoreSeoPageGeo(page) < 80)
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 2)

  for (const page of weakGeo) {
    actions.push({
      pillar: "geo",
      title: page.title,
      detail:
        "Añadir zona, justificación local y señal territorial en summaryJson.",
      href: `/admin/seo?open=${encodeURIComponent(page.slug)}`,
      severity: "medium",
    })
  }

  return actions.slice(0, 6)
}

function weighted(checks: Array<[boolean, number]>) {
  return checks.reduce(
    (score, [passes, weight]) => score + (passes ? weight : 0),
    0
  )
}

function isLengthBetween(value: string | null, min: number, max: number) {
  const length = value?.trim().length ?? 0
  return length >= min && length <= max
}

function hasReadableHeadings(content: string) {
  return /^#{2,3}\s+\S+/m.test(content)
}

function mentionsAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term))
}

function hasStrongAlt(value: string | null | undefined) {
  const normalized = value?.trim() ?? ""
  return (
    normalized.length >= 24 &&
    !["imagen", "foto", "biocultor"].includes(normalized.toLowerCase())
  )
}

function isGenericImage(image: string | null | undefined) {
  if (!image) return false
  const normalized = image.toLowerCase()
  return GENERIC_IMAGE_PATTERNS.some((pattern) =>
    normalized.endsWith(pattern.toLowerCase())
  )
}

function getPayloadImage(payloadJson: string) {
  const payload = parseJsonRecord(payloadJson)
  for (const key of ["afterImage", "heroImage", "image", "beforeImage"]) {
    const value = payload[key]
    if (typeof value === "string" && value.trim()) return value
  }
  return null
}

function parseJson(value: string) {
  try {
    return JSON.parse(value || "null") as unknown
  } catch {
    return null
  }
}

function parseJsonRecord(value: string): Record<string, unknown> {
  const parsed = parseJson(value)
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as Record<string, unknown>)
    : {}
}

function parseJsonArray(value: string): unknown[] {
  const parsed = parseJson(value)
  return Array.isArray(parsed) ? parsed : []
}

function hasMeaningfulJson(value: unknown) {
  if (Array.isArray(value)) return value.length > 0
  if (!value || typeof value !== "object") return false
  return Object.keys(value).length > 0
}

function hasStringField(record: Record<string, unknown>, fields: string[]) {
  return fields.some((field) => {
    const value = record[field]
    return typeof value === "string" && value.trim().length > 0
  })
}
