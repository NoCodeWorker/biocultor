import prisma from '@/lib/db';
import ServicePageEditor from './ServicePageEditor';
import { syncDashboardSeoPages } from '@/lib/admin/editorial-dashboard-sync';

export const dynamic = 'force-dynamic';

export default async function AdminServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  await syncDashboardSeoPages();
  const serviceSlug = resolvedSearchParams.slug || 'regeneracion-cesped-y-jardines';
  const servicePages = await prisma.seoPage.findMany({
    where: { kind: 'SERVICIO' },
    orderBy: [{ priorityScore: 'desc' }, { slug: 'asc' }],
  });
  const servicePage =
    servicePages.find((page) => page.slug === serviceSlug) ?? servicePages[0];

  if (!servicePage) {
    throw new Error('No hay servicios sincronizados para editar.');
  }

  const enrichedPage = {
    ...servicePage,
    updatedAt: servicePage.updatedAt.toISOString(),
  };

  return (
    <div className="py-6">
      <ServicePageEditor page={enrichedPage} servicePages={servicePages.map((page) => ({
        slug: page.slug,
        title: page.title,
        label: page.label,
      }))} />
    </div>
  );
}
