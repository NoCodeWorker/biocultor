import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, CircleAlert } from "lucide-react"
import NewsletterConfirmationEvent from "@/components/NewsletterConfirmationEvent"

export const metadata: Metadata = {
  title: "Suscripción a la newsletter | Biocultor",
  robots: { index: false, follow: false },
}

export default async function NewsletterConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const confirmed = status === "confirmed"

  return (
    <main className="flex min-h-[65vh] items-center justify-center px-4 py-20">
      {confirmed && <NewsletterConfirmationEvent />}
      <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card p-8 text-center shadow-xl shadow-foreground/5 md:p-12">
        {confirmed ? (
          <CheckCircle2 className="mx-auto size-12 text-primary" aria-hidden="true" />
        ) : (
          <CircleAlert className="mx-auto size-12 text-gold" aria-hidden="true" />
        )}
        <h1 className="mt-5 font-heading text-3xl font-bold text-foreground">
          {confirmed ? "Suscripción confirmada" : "Enlace no válido"}
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          {confirmed
            ? "Ya formas parte de la comunidad Biocultor. Recibirás contenidos prácticos y podrás darte de baja desde cualquier correo."
            : "El enlace ha caducado, ya se utilizó o no corresponde a una suscripción pendiente."}
        </p>
        <Link
          href={confirmed ? "/aprende" : "/"}
          className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 font-bold text-white transition hover:bg-brand-green-hover"
        >
          {confirmed ? "Explorar guías" : "Volver al inicio"}
        </Link>
      </div>
    </main>
  )
}
