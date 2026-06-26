import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import {
  buildEcommerceEventCreateData,
  EcommerceEventSchema,
} from "@/lib/ecommerce-tracking-server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const ip = getClientIp(req.headers)
  const rateLimit = await checkRateLimit(`ecommerce-events:${ip}`, 120, 60_000)

  if (!rateLimit.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 }
    )
  }

  const parsed = EcommerceEventSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_event" },
      { status: 400 }
    )
  }

  const event = parsed.data

  try {
    await prisma.ecommerceEvent.create({
      data: buildEcommerceEventCreateData(event),
    })
  } catch (error: unknown) {
    const code = (error as { code?: string } | null)?.code
    if (code === "P2002") {
      return NextResponse.json({ ok: true, deduplicated: true })
    }

    console.error("Error persisting ecommerce event", error)
    return NextResponse.json(
      { ok: false, error: "persist_failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
