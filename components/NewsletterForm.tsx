"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react"
import { NEWSLETTER_CONSENT_TEXT } from "@/lib/newsletter-copy"
import { trackEcommerceEvent } from "@/lib/ecommerce-events"

export default function NewsletterForm() {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setMessage(null)
    setError(null)

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
          sourcePath: window.location.pathname,
          sourceQuery: window.location.search,
          sourceReferrer: document.referrer,
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        setError(result.error ?? "No se pudo completar la solicitud.")
        return
      }

      form.reset()
      setMessage(result.message)
      trackEcommerceEvent("newsletter_signup", {
        form_name: "footer_newsletter",
      })
    } catch {
      setError("No se pudo conectar. Inténtalo de nuevo.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Correo electrónico</span>
          <Mail
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-brand-olive"
            aria-hidden="true"
          />
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="tu@email.com"
            className="h-12 w-full rounded-xl border border-brand-olive-dark/20 bg-white py-3 pr-4 pl-11 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
        </label>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-olive-dark px-6 text-sm font-bold text-white transition hover:bg-brand-olive disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-4" aria-hidden="true" />
          )}
          Suscribirme
        </button>
      </div>

      <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-brand-brown-dark/75">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 shrink-0 accent-brand-olive-dark"
        />
        <span>
          {NEWSLETTER_CONSENT_TEXT}{" "}
          <Link href="/privacidad" className="font-semibold underline underline-offset-2">
            Privacidad
          </Link>
        </span>
      </label>

      <div aria-live="polite" className="mt-3 min-h-5 text-sm">
        {message && (
          <p className="flex items-center gap-2 font-semibold text-brand-olive-dark">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            {message}
          </p>
        )}
        {error && <p className="font-semibold text-red-700">{error}</p>}
      </div>
    </form>
  )
}
