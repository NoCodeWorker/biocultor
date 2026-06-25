import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import {
  cleanNewsletterAttribution,
  createNewsletterToken,
  hashNewsletterToken,
  NEWSLETTER_CONSENT_TEXT,
  normalizeNewsletterEmail,
} from "@/lib/newsletter"
import { sendNewsletterConfirmationEmail } from "@/lib/resend"

const GENERIC_RESPONSE =
  "Revisa tu correo. Si la dirección puede suscribirse, recibirás un enlace de confirmación."

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = normalizeNewsletterEmail(body?.email)

  if (body?.website) {
    return NextResponse.json({ success: true, message: GENERIC_RESPONSE })
  }

  if (!email || body?.consent !== true) {
    return NextResponse.json(
      { error: "Introduce un email válido y acepta el consentimiento." },
      { status: 400 }
    )
  }

  const ip = getClientIp(request.headers)
  const [ipLimit, emailLimit] = await Promise.all([
    checkRateLimit(`newsletter:ip:${ip}`, 6, 60 * 60_000),
    checkRateLimit(`newsletter:email:${email}`, 3, 60 * 60_000),
  ])

  if (!ipLimit.ok || !emailLimit.ok) {
    const retryAfter = Math.max(
      ipLimit.ok ? 0 : ipLimit.retryAfterSeconds,
      emailLimit.ok ? 0 : emailLimit.retryAfterSeconds
    )
    return NextResponse.json(
      { error: "Demasiados intentos. Espera antes de volver a probar." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    )
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
    select: { status: true },
  })

  if (existing?.status === "ACTIVE") {
    return NextResponse.json({ success: true, message: GENERIC_RESPONSE })
  }

  const rawToken = createNewsletterToken()
  const tokenHash = hashNewsletterToken(rawToken)
  const now = new Date()
  const confirmationExpiresAt = new Date(now.getTime() + 24 * 60 * 60_000)

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: {
      email,
      status: "PENDING",
      sourcePath: cleanNewsletterAttribution(body?.sourcePath, 300),
      sourceQuery: cleanNewsletterAttribution(body?.sourceQuery, 500),
      sourceReferrer: cleanNewsletterAttribution(body?.sourceReferrer, 500),
      consentText: NEWSLETTER_CONSENT_TEXT,
      consentAt: now,
      confirmationTokenHash: tokenHash,
      confirmationExpiresAt,
      confirmationSentAt: now,
    },
    update: {
      status: "PENDING",
      sourcePath: cleanNewsletterAttribution(body?.sourcePath, 300),
      sourceQuery: cleanNewsletterAttribution(body?.sourceQuery, 500),
      sourceReferrer: cleanNewsletterAttribution(body?.sourceReferrer, 500),
      consentText: NEWSLETTER_CONSENT_TEXT,
      consentAt: now,
      confirmationTokenHash: tokenHash,
      confirmationExpiresAt,
      unsubscribeTokenHash: null,
      confirmationSentAt: now,
      confirmedAt: null,
      unsubscribedAt: null,
    },
  })

  try {
    await sendNewsletterConfirmationEmail(email, rawToken)
  } catch {
    return NextResponse.json(
      { error: "No hemos podido enviar el correo. Inténtalo de nuevo más tarde." },
      { status: 503 }
    )
  }

  return NextResponse.json({ success: true, message: GENERIC_RESPONSE })
}
