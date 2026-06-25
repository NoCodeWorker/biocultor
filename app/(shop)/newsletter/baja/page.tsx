import type { Metadata } from "next"
import NewsletterUnsubscribeForm from "@/components/NewsletterUnsubscribeForm"

export const metadata: Metadata = {
  title: "Baja de newsletter | Biocultor",
  robots: { index: false, follow: false },
}

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token = "" } = await searchParams

  return (
    <main className="flex min-h-[65vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card p-8 text-center shadow-xl shadow-foreground/5 md:p-12">
        <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
          Preferencias de comunicación
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-foreground">
          Darme de baja
        </h1>
        <p className="mx-auto mt-4 mb-7 max-w-md leading-relaxed text-muted-foreground">
          Al confirmar dejarás de recibir la newsletter de Biocultor. Los correos
          necesarios sobre pedidos o acceso a tu cuenta no se verán afectados.
        </p>
        <NewsletterUnsubscribeForm token={token} />
      </div>
    </main>
  )
}
