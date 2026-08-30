'use client'

import { useRef, useState } from 'react'

const RANGES = ['Last 3 months', 'Last 30 days', 'Last 7 days']

// Sample data for preview purposes only — not live analytics.
const DATES = [
  'Oct 01', 'Oct 02', 'Oct 03', 'Oct 04', 'Oct 05', 'Oct 06', 'Oct 07',
  'Oct 08', 'Oct 09', 'Oct 10', 'Oct 11', 'Oct 12', 'Oct 13', 'Oct 14',
  'Oct 15', 'Oct 16', 'Oct 17', 'Oct 18', 'Oct 19', 'Oct 20', 'Oct 21',
  'Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27', 'Oct 28',
  'Oct 29', 'Oct 30',
]
const RESOURCE_VIEWS = [
  18200, 19400, 21100, 20300, 22800, 24500, 23100,
  25600, 27200, 26400, 28900, 31200, 30100, 32600,
  34100, 33200, 35800, 34600, 36900, 38200, 37100,
  39400, 41200, 40100, 38900, 40600, 42300, 41500,
  39800, 41100,
]
const OUTBOUND_CLICKS = [
  2100, 2400, 2600, 2500, 2900, 3200, 3000,
  3400, 3700, 3500, 3900, 4300, 4100, 4500,
  4800, 4600, 5100, 4900, 5400, 5700, 5500,
  5900, 6300, 6100, 5800, 6200, 6600, 6400,
  6100, 6400,
]

const X_TICK_INDICES = [0, 7, 14, 21, 29]

const Y_TICKS = [0, 10000, 20000, 30000, 40000, 50000]
const Y_MAX = 50000

const WIDTH = 1000
const HEIGHT = 280
const MARGIN = { top: 12, right: 12, bottom: 28, left: 44 }
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom

function xFor(i: number) {
  return MARGIN.left + (i / (DATES.length - 1)) * PLOT_W
}
function yFor(value: number) {
  return MARGIN.top + PLOT_H - (value / Y_MAX) * PLOT_H
}
function linePath(values: number[]) {
  return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`).join(' ')
}
function areaPath(values: number[]) {
  const top = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`).join(' ')
  return `${top} L ${xFor(values.length - 1)} ${yFor(0)} L ${xFor(0)} ${yFor(0)} Z`
}

export function AnalyticsChartCard() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH
    const ratio = (relX - MARGIN.left) / PLOT_W
    const index = Math.round(ratio * (DATES.length - 1))
    setHoverIndex(Math.min(DATES.length - 1, Math.max(0, index)))
  }

  const activeIndex = hoverIndex ?? DATES.length - 1
  const tooltipX = xFor(activeIndex)
  const tooltipY = yFor(RESOURCE_VIEWS[activeIndex])
  const tooltipOnRight = tooltipX > WIDTH - 160

  return (
    <div className="rounded-2xl border border-[#242E42]/8 bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">Views and outbound clicks, last 30 days</p>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Sample data
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-muted p-1 text-xs">
          {RANGES.map((range) => (
            <span
              key={range}
              className={[
                'rounded-full px-3 py-1.5 font-medium',
                range === 'Last 30 days' ? 'bg-card text-foreground' : 'text-muted-foreground',
              ].join(' ')}
            >
              {range}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-5">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full touch-none select-none"
          onPointerMove={handleMove}
          onPointerLeave={() => setHoverIndex(null)}
        >
          {Y_TICKS.map((tick) => (
            <g key={tick}>
              <line
                x1={MARGIN.left}
                x2={WIDTH - MARGIN.right}
                y1={yFor(tick)}
                y2={yFor(tick)}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text x={MARGIN.left - 10} y={yFor(tick)} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[11px]">
                {tick === 0 ? '0' : `${tick / 1000}k`}
              </text>
            </g>
          ))}

          <path d={areaPath(OUTBOUND_CLICKS)} fill="var(--primary)" opacity={0.08} />
          <path d={areaPath(RESOURCE_VIEWS)} fill="var(--primary)" opacity={0.1} />

          <path d={linePath(OUTBOUND_CLICKS)} fill="none" stroke="var(--primary)" strokeOpacity={0.35} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={linePath(RESOURCE_VIEWS)} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {X_TICK_INDICES.map((i) => (
            <text
              key={i}
              x={xFor(i)}
              y={HEIGHT - 6}
              textAnchor={i === 0 ? 'start' : i === DATES.length - 1 ? 'end' : 'middle'}
              className="fill-muted-foreground text-[11px]"
            >
              {DATES[i]}
            </text>
          ))}

          {hoverIndex !== null && (
            <>
              <line x1={tooltipX} x2={tooltipX} y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} stroke="var(--border)" strokeWidth={1} />
              <circle cx={tooltipX} cy={yFor(RESOURCE_VIEWS[activeIndex])} r={5} fill="var(--primary)" stroke="white" strokeWidth={2} />
              <circle cx={tooltipX} cy={yFor(OUTBOUND_CLICKS[activeIndex])} r={5} fill="var(--primary)" fillOpacity={0.5} stroke="white" strokeWidth={2} />
            </>
          )}
        </svg>

        {hoverIndex !== null && (
          <div
            className="pointer-events-none absolute z-10 min-w-[130px] -translate-y-full rounded-lg border border-[#242E42]/8 bg-white px-3 py-2 shadow-md"
            style={{
              left: `${(tooltipX / WIDTH) * 100}%`,
              top: `${(tooltipY / HEIGHT) * 100}%`,
              transform: `translate(${tooltipOnRight ? '-100%' : '-8px'}, -12px)`,
            }}
          >
            <p className="text-xs text-muted-foreground">{DATES[activeIndex]}</p>
            <p className="text-sm font-semibold text-foreground">
              {RESOURCE_VIEWS[activeIndex].toLocaleString()} Views
            </p>
            <p className="text-xs text-muted-foreground">
              {OUTBOUND_CLICKS[activeIndex].toLocaleString()} Clicks
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" />
          Resource Views
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary/35" />
          Outbound Clicks
        </span>
      </div>
    </div>
  )
}
