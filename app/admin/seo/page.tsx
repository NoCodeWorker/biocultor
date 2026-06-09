import prisma from '@/lib/db';
import SeoPagesEditor from '../SeoPagesEditor';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
  // --- SYNC LANDINGS ---
  const landingSlug = 'protocolo-cultivo-biologico-profesional';
  const existingLanding = await prisma.seoPage.findUnique({
    where: { slug: landingSlug }
  });

  if (!existingLanding) {
    await prisma.seoPage.create({
      data: {
        kind: 'LANDING',
        slug: landingSlug,
        title: 'Protocolo de Cultivo Biológico Profesional',
        metaTitle: 'Protocolo de Cultivo Biológico Profesional | Biocultor',
        metaDescription: 'La guía definitiva paso a paso para maximizar biomasa, cannabinoides y prevenir patógenos en el cultivo de cannabis mediante Té de Humus y Purín de Ortiga.',
        workflowStatus: 'READY',
        priorityScore: 90,
        payloadJson: JSON.stringify({
          heroImage: '/10 litros.jpg',
          section1Image: '/5 litros.jpg',
          section2Image: '/1 litro.jpg',
          section3Image: '/10 litros.jpg'
        }),
      }
    });
  }

  // --- SYNC SERVICES ---
  const serviceSlug = 'regeneracion-cesped-y-jardines';
  const existingService = await prisma.seoPage.findUnique({
    where: { slug: serviceSlug }
  });

  if (!existingService) {
    const defaultFaqs = [
      {
        question: '¿Qué es exactamente la inoculación regenerativa?',
        answer: 'Es la aplicación pulverizada in-situ de un concentrado líquido extremadamente activo y denso en microorganismos benéficos (bacterias, hongos formadores de agregados, protozoos) extraídos del humus de lombriz premium. Estos microorganismos colonizan el suelo, descomponen la materia orgánica muerta y liberan nutrientes bloqueados para las raíces.'
      },
      {
        question: '¿Cuánto tiempo tardan en verse los resultados?',
        answer: 'No vendemos milagros instantáneos: esto es biología del suelo, no pintura química ni césped artificial. Los primeros cambios en el vigor de la raíz y la absorción de nutrientes ocurren bajo tierra en las primeras 2 semanas. Estéticamente, verás un césped más denso, homogéneo y verde de forma natural entre la semana 4 y 8 tras el tratamiento.'
      },
      {
        question: '¿Es seguro para niños y mascotas?',
        answer: '100% seguro. Al ser un tratamiento puramente biológico sin trazas de herbicidas, fungicidas ni fertilizantes químicos sintéticos, tu familia y mascotas pueden pisar y jugar en el césped inmediatamente después de la aplicación.'
      },
      {
        question: '¿Cuándo es la mejor época para realizar el tratamiento?',
        answer: 'Las mejores épocas son primavera y otoño, ya que la temperatura y la humedad del suelo favorecen el establecimiento y la proliferación de los microorganismos en la rizosfera. No obstante, se puede aplicar durante todo el año para corregir problemas específicos de compactación o degradación.'
      },
      {
        question: '¿Qué incluye la tarifa de 195 €?',
        answer: 'La tarifa incluye el desplazamiento de un técnico certificado, la inspección previa del estado del terreno (compactación y pH), la aplicación in-situ de té de humus fresco y ultra-concentrado para superficies de hasta 500 m², y una guía personalizada con pautas de riego y corte para maximizar los resultados.'
      },
      {
        question: '¿Cómo preparo mi jardín antes de que venga el técnico?',
        answer: 'Es recomendable cortar el césped a una altura estándar (unos 4-5 cm) y haber retirado hojas o ramas acumuladas el día anterior. Esto asegura que la pulverización biológica penetre directamente en el suelo y haga contacto óptimo con la base de los tallos.'
      }
    ];

    const defaultPayload = {
      beforeImage: '/servicios-cesped-antes.webp',
      afterImage: '/servicios-cesped-despues.webp',
      price: '195',
      areaLimit: '500',
      trustBadge1_title: 'Biología Activa y Fresca',
      trustBadge1_desc: 'El té de humus se extrae y oxigena pocas horas antes de la aplicación, asegurando millones de microorganismos vivos.',
      trustBadge2_title: 'Avalado por la Ciencia',
      trustBadge2_desc: 'Estudios científicos corroboran que las enmiendas biológicas líquidas son el mejor tratamiento a medio y largo plazo.',
      trustBadge3_title: 'Cero Plazos de Seguridad',
      trustBadge3_desc: 'Seguridad total inmediata para tus hijos y mascotas. Sin metales pesados ni químicos de síntesis artificial.',
    };

    await prisma.seoPage.create({
      data: {
        kind: 'SERVICIO',
        slug: serviceSlug,
        title: 'Regeneración de Césped y Jardines',
        targetKeyword: 'regeneracion cesped y jardines',
        workflowStatus: 'READY',
        priorityScore: 90,
        label: 'Servicios',
        metaTitle: 'Regeneración de Césped y Jardines con Té de Humus | Biocultor',
        metaDescription: 'Servicio profesional de inoculación biológica in-situ para recuperar la salud y el verde de tu césped. Tratamiento 100% ecológico desde 195€.',
        payloadJson: JSON.stringify(defaultPayload),
        faqJson: JSON.stringify(defaultFaqs),
        isPublished: true,
      }
    });
  }
  // ----------------------

  const [pages, posts] = await Promise.all([
    prisma.seoPage.findMany({
      orderBy: [{ priorityScore: 'desc' }, { kind: 'asc' }, { slug: 'asc' }],
    }),
    prisma.post.findMany({
      select: { slug: true, coverImage: true },
    }),
  ]);

  const postImageMap = new Map(posts.map((p) => [p.slug, p.coverImage]));

  const enrichedPages = pages.map((page) => ({
    ...page,
    updatedAt: page.updatedAt.toISOString(),
    // Fallback a la imagen del post si la de SEO está vacía
    image: page.image || postImageMap.get(page.slug) || null,
  }));

  const priorityCount = enrichedPages.filter((page) => page.workflowStatus === 'PRIORITY').length;
  const readyCount = enrichedPages.filter((page) => page.workflowStatus === 'READY').length;
  const avgPriority =
    enrichedPages.length > 0
      ? Math.round(
          enrichedPages.reduce((acc, page) => acc + page.priorityScore, 0) / enrichedPages.length
        )
      : 0;

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto relative z-10 antialiased">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight">
            Gestión SEO
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-3xl leading-relaxed">
            Editor persistente para los dominios transaccional, informacional, GEO/IA y de
            aplicaciones. Los cambios revalidan las rutas públicas afectadas.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/80">Prioridad</p>
          <p className="mt-3 text-4xl font-heading font-black tracking-tight">{priorityCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">URLs marcadas como ataque inmediato.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/80">Ready</p>
          <p className="mt-3 text-4xl font-heading font-black tracking-tight">{readyCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">URLs publicadas listas para refino.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/80">Media</p>
          <p className="mt-3 text-4xl font-heading font-black tracking-tight">{avgPriority}</p>
          <p className="mt-2 text-sm text-muted-foreground">Prioridad media del inventario SEO.</p>
        </div>
      </div>

      <SeoPagesEditor pages={enrichedPages} />
    </div>
  );
}
