import prisma from '@/lib/db';
import ServicePageEditor from './ServicePageEditor';

export const dynamic = 'force-dynamic';

export default async function AdminServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const serviceSlug = resolvedSearchParams.slug || 'regeneracion-cesped-y-jardines';

  // Buscar si ya existe la página de servicio en la BD
  let servicePage = await prisma.seoPage.findUnique({
    where: { slug: serviceSlug },
  });

  // Si no existe, crear el registro por defecto
  if (!servicePage) {
    if (serviceSlug === 'te-humus-paisajistas-jardineros') {
      const defaultLandscaperFaqs = [
        {
          question: '¿Qué caducidad tiene el Té de Humus de Lombriz?',
          answer: 'Dado que es un extracto biológico vivo y altamente oxigenado, su efectividad máxima se encuentra dentro de las primeras 24-48 horas tras su recolección. Por ello, coordinamos la entrega fresca directamente en tu obra o jardín en Madrid y Castilla-La Mancha.'
        },
        {
          question: '¿Es compatible con mi equipo de pulverización o cuba de riego?',
          answer: 'Absolutamente. El Té de Humus Biocultor se somete a un doble filtrado de 100 micras que retira cualquier micropartícula sólida. Es perfectamente compatible con sistemas de riego por goteo, inyectores Venturi, pulverizadores de mochila y cubas de aplicación hidromecánica, sin obstruir boquillas.'
        },
        {
          question: '¿Se puede mezclar con tratamientos fitosanitarios?',
          answer: 'Se recomienda no mezclarlo directamente con fungicidas o bactericidas en el mismo tanque, ya que neutralizarían los microorganismos benéficos del té. Para otros tratamientos o abonos foliares, consúltanos compatibilidades específicas.'
        },
        {
          question: '¿Qué certificaciones tiene el producto?',
          answer: 'El humus de lombriz base utilizado está certificado para agricultura ecológica por el CAAE. El té resultante cumple estrictamente con la normativa europea para insumos en agricultura y jardinería ecológica, aportando total residuo cero.'
        }
      ];

      const defaultLandscaperPayload = {
        beforeImage: '/servicios-cesped-antes.webp',
        afterImage: '/servicios-cesped-despues.webp',
        price: '195',
        areaLimit: '500',
        additionalRate: '0.2',
        trustBadge1_title: 'Microbiología Profesional Activa',
        trustBadge1_desc: 'Extraído en frío y entregado en menos de 24 horas para garantizar la viabilidad biológica.',
        trustBadge2_title: 'Suelos de la Meseta Optimizados',
        trustBadge2_desc: 'Formulación que rompe las arcillas compactadas y reactiva la nutrición en suelos calizos secos.',
        trustBadge3_title: 'Garantía Ecológica CAAE',
        trustBadge3_desc: 'Insumo 100% certificado, idóneo para proyectos de paisajismo sostenible y residuo cero.'
      };

      servicePage = await prisma.seoPage.create({
        data: {
          kind: 'SERVICIO',
          slug: serviceSlug,
          title: 'Té de Humus para Paisajistas y Jardineros',
          targetKeyword: 'te de humus paisajistas jardineros',
          workflowStatus: 'READY',
          priorityScore: 95,
          label: 'Servicios',
          metaTitle: 'Té de Humus de Lombriz para Paisajistas y Jardineros | Biocultor',
          metaDescription: 'Suministro y aplicación profesional de té de humus fresco en Madrid y Castilla-La Mancha. Optimiza suelos arcillosos y calizos con residuo cero.',
          payloadJson: JSON.stringify(defaultLandscaperPayload),
          faqJson: JSON.stringify(defaultLandscaperFaqs),
          isPublished: true,
        },
      });
    } else {
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
        additionalRate: '0.2',
        trustBadge1_title: 'Biología Activa y Fresca',
        trustBadge1_desc: 'El té de humus se extrae y oxigena pocas horas antes de la aplicación, asegurando millones de microorganismos vivos.',
        trustBadge2_title: 'Avalado por la Ciencia',
        trustBadge2_desc: 'Estudios científicos corroboran que las enmiendas biológicas líquidas son el mejor tratamiento a medio y largo plazo.',
        trustBadge3_title: 'Cero Plazos de Seguridad',
        trustBadge3_desc: 'Seguridad total inmediata para tus hijos y mascotas. Sin metales pesados ni químicos de síntesis artificial.',
      };

      servicePage = await prisma.seoPage.create({
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
        },
      });
    }
  }

  const enrichedPage = {
    ...servicePage,
    updatedAt: servicePage.updatedAt.toISOString(),
  };

  return (
    <div className="py-6">
      <ServicePageEditor page={enrichedPage} />
    </div>
  );
}
