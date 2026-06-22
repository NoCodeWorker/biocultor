import Link from "next/link"
import {
  ArrowRight,
  Bot,
  Image as ImageIcon,
  Map,
  SearchCheck,
  Target,
  type LucideIcon,
} from "lucide-react"
import type { ContentIntelligenceSummary } from "@/lib/admin/content-intelligence"

type GrowthIntelligencePanelProps = {
  intelligence: ContentIntelligenceSummary
  showOperationalDetails?: boolean
}

const pillarIcons: Record<
  keyof ContentIntelligenceSummary["pillars"],
  LucideIcon
> = {
  cro: Target,
  seo: SearchCheck,
  geo: Map,
  aio: Bot,
  visual: ImageIcon,
}

export default function GrowthIntelligencePanel({
  intelligence,
  showOperationalDetails = false,
}: GrowthIntelligencePanelProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-5">
        {Object.entries(intelligence.pillars).map(([key, pillar]) => (
          <GrowthPillarCard
            key={key}
            icon={
              pillarIcons[key as keyof ContentIntelligenceSummary["pillars"]]
            }
            label={pillar.label}
            score={pillar.score}
            ready={pillar.ready}
            total={pillar.total}
            focus={showOperationalDetails ? pillar.focus : undefined}
          />
        ))}
      </div>

      {showOperationalDetails && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/50 bg-background p-5">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Contrato visual
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <MetricLine
                label="Con imagen"
                value={intelligence.visualContract.withImage}
              />
              <MetricLine
                label="Sin imagen"
                value={intelligence.visualContract.missingImage}
                warn
              />
              <MetricLine
                label="WebP"
                value={intelligence.visualContract.webpImages}
              />
              <MetricLine
                label="Uploads manuales"
                value={intelligence.visualContract.manualUploads}
              />
              <MetricLine
                label="Alt débil"
                value={intelligence.visualContract.weakAltText}
                warn
              />
              <MetricLine
                label="Genéricas"
                value={intelligence.visualContract.genericImages}
                warn
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-background p-5 lg:col-span-2">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Cola profesional priorizada
            </p>
            {intelligence.priorityActions.length === 0 ? (
              <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                No hay bloqueos críticos detectados en el inventario editable.
              </p>
            ) : (
              <div className="mt-4 grid gap-2">
                {intelligence.priorityActions.map((action) => (
                  <Link
                    key={`${action.pillar}-${action.href}-${action.title}`}
                    href={action.href}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            action.severity === "high"
                              ? "rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black tracking-widest text-red-700 uppercase"
                              : "rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black tracking-widest text-amber-700 uppercase"
                          }
                        >
                          {action.pillar.toUpperCase()}
                        </span>
                        <p className="truncate text-sm font-bold text-foreground">
                          {action.title}
                        </p>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {action.detail}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function GrowthPillarCard({
  icon: Icon,
  label,
  score,
  ready,
  total,
  focus,
}: {
  icon: LucideIcon
  label: string
  score: number
  ready: number
  total: number
  focus?: string
}) {
  const tone =
    score >= 85
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : score >= 70
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-red-200 bg-red-50 text-red-800"

  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <div className="flex items-center justify-between gap-3">
        <Icon className="h-5 w-5" />
        <span className="font-heading text-2xl font-black">{score}</span>
      </div>
      <p className="mt-3 text-xs font-black tracking-widest uppercase">
        {label}
      </p>
      <p className="mt-1 text-xs opacity-80">
        {ready}/{total} listos
      </p>
      {focus && (
        <p className="mt-3 line-clamp-3 text-xs leading-relaxed opacity-80">
          {focus}
        </p>
      )}
    </div>
  )
}

function MetricLine({
  label,
  value,
  warn = false,
}: {
  label: string
  value: number
  warn?: boolean
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
      <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={
          warn && value > 0
            ? "mt-1 text-xl font-black text-amber-700"
            : "mt-1 text-xl font-black text-foreground"
        }
      >
        {value}
      </p>
    </div>
  )
}
