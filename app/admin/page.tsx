import prisma from "@/lib/db"
import AdminVariantsTable from "./AdminVariantsTable"
import { AlertCircle } from "lucide-react"

// Forzamos que el panel admin siempre sea dinámico (no se cachea estáticamente)
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  let product = null;
  let dbError = false;
  let seoPagesCount = 0;

  try {
    const [productResult, seoCount] = await Promise.all([
      prisma.product.findUnique({
        where: { slug: "te-humus-liquido-premium" },
        include: { variants: { orderBy: { price: 'asc' } } }
      }),
      prisma.seoPage.count().catch(() => 0),
    ]);
    product = productResult;
    seoPagesCount = seoCount;
  } catch (error) {
    dbError = true;
  }

  if (dbError || !product) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center gap-6">
        <AlertCircle className="w-16 h-16 text-amber-500" />
        <h2 className="text-2xl font-black font-heading">Base de Datos Sin Inicializar</h2>
        <p className="text-muted-foreground max-w-md">
          El sistema está limpio y purgado. Ejecuta el Seed para inyectar los 4 formatos de producto originales.
        </p>
        <a href="/api/seed" className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:opacity-90">
          Inyectar DB (Seed)
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto relative z-10 antialiased">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight">Gestión Táctica</h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl leading-relaxed">
            Ajusta los precios y simula anclajes cognitivos (Precio Tachado) en tiempo real. 
            Cualquier cambio inferior o superior será cobrado instantáneamente así por la recabación de Stripe.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 border border-amber-500/20 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
          <AlertCircle className="w-5 h-5"/>
           Los cambios alteran el Front-End en directo
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="text-xl font-heading font-bold">Inventario SEO persistente</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Registros SEO cargados en base de datos: <strong className="text-foreground">{seoPagesCount}</strong>.
          </p>
          <a href="/api/seed-seo" className="mt-4 inline-flex bg-primary text-primary-foreground font-bold px-5 py-3 rounded-xl hover:opacity-90">
            Sincronizar seed SEO
          </a>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="text-xl font-heading font-bold">Estrategia de escalado</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            La web ya puede leer overrides SEO desde DB sin perder el fallback estático. El siguiente paso natural es una UI editorial para editar slugs, FAQs y payloads.
          </p>
          <a href="/admin/seo" className="mt-4 inline-flex bg-foreground text-background font-bold px-5 py-3 rounded-xl hover:bg-primary hover:text-primary-foreground">
            Abrir editor SEO
          </a>
        </div>
      </div>

      <AdminVariantsTable variants={product?.variants || []} />
    </div>
  )
}
