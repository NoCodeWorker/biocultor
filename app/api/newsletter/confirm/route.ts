import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { hashNewsletterToken } from "@/lib/newsletter"
import { sendNewsletterWelcomeEmail } from "@/lib/resend"
import { siteConfig } from "@/lib/site-config"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token") ?? ""
  const destination = new URL("/newsletter/confirmada", siteConfig.defaultUrl)

  if (token.length < 40) {
    destination.searchParams.set("status", "invalid")
    return NextResponse.redirect(destination)
  }

  const tokenHash = hashNewsletterToken(token)
  const subscriber = await prisma.newsletterSubscriber.findFirst({
    where: {
      OR: [
        {
          confirmationTokenHash: tokenHash,
          confirmationExpiresAt: { gt: new Date() },
          status: "PENDING",
        },
        { unsubscribeTokenHash: tokenHash, status: "ACTIVE" },
      ],
    },
  })

  if (!subscriber) {
    destination.searchParams.set("status", "invalid")
    return NextResponse.redirect(destination)
  }

  if (subscriber.status === "PENDING") {
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "ACTIVE",
        confirmedAt: new Date(),
        confirmationTokenHash: null,
        confirmationExpiresAt: null,
        unsubscribeTokenHash: tokenHash,
      },
    })

    await sendNewsletterWelcomeEmail(subscriber.email, token).catch((error) => {
      console.error("No se pudo enviar la bienvenida de newsletter:", error)
    })
  }

  destination.searchParams.set("status", "confirmed")
  return NextResponse.redirect(destination)
}
