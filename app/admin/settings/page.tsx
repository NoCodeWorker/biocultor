import prisma from '@/lib/db';
import {
  Settings,
  Database,
  Globe,
  Shield,
  Zap,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import RevalidateButton from './RevalidateButton';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  // Datos de sistema
  const [productCount, variantCount, orderCount, customerCount, postCount] = await Promise.all([
    prisma.product.count(),
    prisma.variant.count(),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.post.count(),
  ]);

  const dbUrl = process.env.DATABASE_URL ?? '';
  const dbHost = dbUrl.includes('@') ? dbUrl.split('@')[1]?.split('/')[0] : 'desconocido';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://biocultor.com';
  const nodeEnv = process.env.NODE_ENV ?? 'development';

  const INTEGRATIONS = [
    {
      name: 'Stripe',
      status: !!process.env.STRIPE_SECRET_KEY,
      key: process.env.STRIPE_SECRET_KEY ? maskKey(process.env.STRIPE_SECRET_KEY) : null,
      docs: 'https://dashboard.stripe.com',
    },
    {
      name: 'Packlink',
      status: !!process.env.PACKLINK_API_KEY,
      key: process.env.PACKLINK_API_KEY ? maskKey(process.env.PACKLINK_API_KEY) : null,
      docs: 'https://pro.packlink.es',
    },
    {
      name: 'Resend',
      status: !!process.env.RESEND_API_KEY,
      key: process.env.RESEND_API_KEY ? maskKey(process.env.RESEND_API_KEY) : null,
      docs: 'https://resend.com/emails',
    },
    {
      name: 'DeepSeek AI',
      status: !!process.env.DEEP_SEEK_API_KEY,
      key: process.env.DEEP_SEEK_API_KEY ? maskKey(process.env.DEEP_SEEK_API_KEY) : null,
      docs: 'https://platform.deepseek.com',
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">Sistema</p>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mt-1 flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Ajustes
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
          Diagnóstico del sistema, estado de integraciones y acciones de mantenimiento.
        </p>
      </div>

      {/* Environment */}
      <section className="bg-card border border-border/60 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-4 h-4 text-primary" />
          <h2 className="text-base font-heading font-bold">Entorno</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EnvRow label="App URL" value={appUrl} link={appUrl} />
          <EnvRow label="Entorno Node" value={nodeEnv} badge={nodeEnv === 'production' ? 'green' : 'amber'} />
          <EnvRow label="Admin email" value={process.env.USER_ADMIN ?? '—'} />
          <EnvRow label="DB host" value={dbHost} />
        </div>
      </section>

      {/* DB Stats */}
      <section className="bg-card border border-border/60 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="text-base font-heading font-bold">Base de datos (Postgres)</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Productos', value: productCount },
            { label: 'Variantes', value: variantCount },
            { label: 'Pedidos', value: orderCount },
            { label: 'Clientes', value: customerCount },
            { label: 'Posts blog', value: postCount },
          ].map((s) => (
            <div key={s.label} className="bg-muted/30 rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="text-xl font-heading font-black text-foreground mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-card border border-border/60 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="text-base font-heading font-bold">Integraciones y API Keys</h2>
        </div>
        <div className="flex flex-col gap-3">
          {INTEGRATIONS.map((int) => (
            <div
              key={int.name}
              className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 ${
                int.status ? 'border-emerald-200/60 bg-emerald-50/40' : 'border-red-200/60 bg-red-50/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${int.status ? 'bg-emerald-500' : 'bg-red-500'}`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">{int.name}</p>
                  {int.key && (
                    <p className="text-[10px] font-mono text-muted-foreground truncate">{int.key}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    int.status
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {int.status ? '✓ Configurada' : '✗ Sin clave'}
                </span>
                {int.docs && (
                  <a
                    href={int.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                  >
                    Dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cache & Maintenance */}
      <section className="bg-card border border-border/60 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-primary" />
          <h2 className="text-base font-heading font-bold">Mantenimiento</h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Revalidar caché global</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fuerza la regeneración de todas las páginas cacheadas de Next.js sin reiniciar el servidor.
              </p>
            </div>
            <RevalidateButton />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 opacity-60">
            <div>
              <p className="text-sm font-semibold text-foreground">Exportar datos (CSV)</p>
              <p className="text-xs text-muted-foreground mt-0.5">Pedidos y clientes en formato CSV. Próximamente.</p>
            </div>
            <span className="text-[10px] font-bold bg-muted text-muted-foreground/70 px-2 py-1 rounded">PRÓX</span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 opacity-60">
            <div>
              <p className="text-sm font-semibold text-foreground">Backup de base de datos</p>
              <p className="text-xs text-muted-foreground mt-0.5">pg_dump automático con descarga segura. Próximamente.</p>
            </div>
            <span className="text-[10px] font-bold bg-muted text-muted-foreground/70 px-2 py-1 rounded">PRÓX</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function maskKey(key: string): string {
  if (key.length <= 12) return '••••••••';
  return key.slice(0, 7) + '••••••' + key.slice(-4);
}

function EnvRow({
  label,
  value,
  link,
  badge,
}: {
  label: string;
  value: string;
  link?: string;
  badge?: 'green' | 'amber';
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            {value} <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <p className="text-sm font-mono text-foreground truncate">{value}</p>
        )}
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge === 'green' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
