import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  delta?: { text: string; direction: 'up' | 'down' }
  muted?: boolean
}

export function StatCard({ label, value, subtitle, delta, muted }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-[#242E42]/8 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {delta && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-600">
            {delta.direction === 'up' ? (
              <TrendingUp className="size-4 stroke-[2.5] text-emerald-500" />
            ) : (
              <TrendingDown className="size-4 stroke-[2.5] text-destructive" />
            )}
            {delta.text}
          </span>
        )}
      </div>
      <p
        className={[
          'mt-3 text-2xl font-semibold leading-none',
          muted ? 'text-muted-foreground' : 'text-primary',
        ].join(' ')}
      >
        {value}
      </p>
      {subtitle && <p className="mt-3 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
