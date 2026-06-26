import { MapPin, MessageCircle } from "lucide-react"
import { Suspense } from "react"
import Breadcrumbs from "@/components/Breadcrumbs"
import StructuredData from "@/components/StructuredData"
import { breadcrumbSchema, buildMetadata } from "@/lib/seo"

import ContactForm from "@/components/ContactForm"
import TrackedContactLink from "@/components/TrackedContactLink"

export const metadata = buildMetadata({
  title: "Contacto | Soporte Biocultor",
  description:
    "Habla con Biocultor sobre compra de te de humus, purin de ortiga o servicios de aplicacion profesional para jardines, fincas y empresas.",
  path: "/contacto",
  keywords: [
    "contacto Biocultor",
    "presupuesto aplicacion humus jardin",
    "asesoramiento te de humus",
    "servicio aplicacion humus liquido",
  ],
})

export default function ContactoPage() {
  return (
    <div className="mx-auto w-[92%] flex-1 px-4 py-16 md:py-24 lg:w-[75%]">
      <div className="mx-auto max-w-5xl">
        <StructuredData
          id="contacto-breadcrumb-schema"
          data={breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Contacto", path: "/contacto" },
          ])}
        />
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]}
        />

        {/* Cabecera */}
        <div className="mb-16">
          <h1 className="mb-6 font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Estamos a un <span className="text-primary">brote</span> de
            distancia.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Dudas sobre dosificaciones, pedidos al por mayor para grandes fincas
            o consultas técnicas agronómicas. Escríbenos, no usamos bots.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-24">
          {/* Formulario */}
          <div className="rounded-[2rem] border border-border/50 bg-card p-8 shadow-xl shadow-black/5 lg:col-span-3">
            <Suspense
              fallback={
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Cargando formulario...
                </div>
              }
            >
              <ContactForm />
            </Suspense>
          </div>

          {/* Información Lateral */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Contacto y Soporte */}
            <div className="flex items-start gap-4 rounded-2xl bg-secondary/20 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-foreground">
                  Contacto y Soporte
                </h3>
                <TrackedContactLink
                  href="tel:+34601144399"
                  channel="phone"
                  className="font-medium tracking-wide text-primary hover:underline"
                >
                  +34 601 144 399
                </TrackedContactLink>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lunes a Viernes de 09:00 a 18:00h
                </p>
                <p className="text-sm text-muted-foreground">
                  Respuesta en max. 24 horas hábiles.
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <TrackedContactLink
              href="https://wa.me/34601144399"
              channel="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 p-6 transition-colors hover:bg-[#25D366]/10"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.534 5.843L.057 23.213a.75.75 0 0 0 .921.921l5.37-1.477A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.694-.512-5.228-1.404l-.374-.218-3.882 1.068 1.036-3.786-.237-.389A9.961 9.961 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-bold text-foreground">WhatsApp</h3>
                <p className="font-medium tracking-wide text-[#25D366]">
                  +34 601 144 399
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Escríbenos directamente
                </p>
              </div>
            </TrackedContactLink>

            {/* Instalaciones Centrales */}
            <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/50 bg-background text-muted-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-foreground">
                  Instalaciones Centrales
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Laboratorios y planta de extracción.
                  <br />
                  Santa Cruz de la Zarza,
                  <br />
                  Toledo (España).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
