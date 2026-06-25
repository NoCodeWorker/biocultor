import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { hashNewsletterToken } from "@/lib/newsletter"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const token = typeof body?.token === "string" ? body.token : ""

  if (token.length < 40) {
    return NextResponse.json({ error: "El enlace de baja no es válido." }, { status: 400 })
  }

  const limit = await checkRateLimit(
    `newsletter-unsubscribe:ip:${getClientIp(request.headers)}`,
    10,
    60 * 60_000
  )
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Prueba más tarde." },
      { status: 429 }
    )
  }

  const tokenHash = hashNewsletterToken(token)
  const subscriber = await prisma.newsletterSubscriber.findFirst({
    where: { unsubscribeTokenHash: tokenHash, status: "ACTIVE" },
    select: { id: true },
  })

  if (subscriber) {
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "UNSUBSCRIBED",
        unsubscribedAt: new Date(),
        unsubscribeTokenHash: null,
      },
    })
  }

  return NextResponse.json({ success: true })
}
