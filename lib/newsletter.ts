import { createHash, randomBytes } from "crypto"
export { NEWSLETTER_CONSENT_TEXT } from "@/lib/newsletter-copy"

export function normalizeNewsletterEmail(value: unknown) {
  if (typeof value !== "string") return null
  const email = value.trim().toLowerCase()
  if (email.length > 254) return null
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
}

export function createNewsletterToken() {
  return randomBytes(32).toString("base64url")
}

export function hashNewsletterToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function cleanNewsletterAttribution(value: unknown, max = 500) {
  if (typeof value !== "string") return null
  const cleaned = value.trim()
  return cleaned ? cleaned.slice(0, max) : null
}
