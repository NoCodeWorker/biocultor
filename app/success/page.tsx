import Link from "next/link"
import { CheckCircle } from "lucide-react"
import ClearCartOnSuccess from "./ClearCartOnSuccess"

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <ClearCartOnSuccess />
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="mb-4 font-heading text-3xl font-bold text-foreground">
          Pago confirmado
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground md:text-base">
          Hemos recibido tu pedido correctamente. Recibirás la confirmación y
          los datos de seguimiento en el correo indicado durante la compra.
        </p>
        <Link
          href="/"
          className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  )
}
