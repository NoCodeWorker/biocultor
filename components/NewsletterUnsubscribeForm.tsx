"use client"

import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function NewsletterUnsubscribeForm({ token }: { token: string }) {
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function unsubscribe() {
    setPending(true)
    setError(null)
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error ?? "No se pudo completar la baja.")
        return
      }
      setDone(true)
    } catch {
      setError("No se pudo conectar. Inténtalo de nuevo.")
    } finally {
      setPending(false)
    }
  }

  if (done) {
    return (
      <p className="flex items-center justify-center gap-2 font-semibold text-primary">
        <CheckCircle2 className="size-5" aria-hidden="true" />
        La baja se ha procesado correctamente.
      </p>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={unsubscribe}
        disabled={pending || token.length < 40}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-brown-dark px-7 font-bold text-white transition hover:bg-brand-brown disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Confirmar baja
      </button>
      {error && <p className="mt-4 font-semibold text-red-700">{error}</p>}
    </div>
  )
}
