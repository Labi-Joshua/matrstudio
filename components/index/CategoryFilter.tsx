'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const CATEGORIES = [
  { label: 'All Topics',           value: '' },
  { label: 'Craft & Fundamentals', value: 'craft' },
  { label: 'Brand & Strategy',     value: 'brand-strategy' },
  { label: 'Operations & AI',      value: 'operations-ai' },
  { label: 'Motion & Interaction', value: 'motion-interaction' },
  { label: 'Growth Marketing',     value: 'growth-marketing' },
  { label: 'Editorial & Curation', value: 'editorial-curation' },
]

const TYPE_FILTERS = [
  { label: 'All Types', value: '',        color: '#9CA3AF' },
  { label: 'Article',   value: 'article', color: '#4A7AB8' },
  { label: 'Video',     value: 'video',   color: '#DC5405' },
  { label: 'Book',      value: 'book',    color: '#B07840' },
  { label: 'Tool',      value: 'tool',    color: '#7C2828' },
]

const PILL = 'rounded-full px-[14px] py-[8px] text-[12px] font-medium'

export function CategoryFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('category') ?? ''
  const currentType = searchParams.get('type') ?? ''

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function selectCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) { params.set('category', value) } else { params.delete('category') }
    params.delete('q')
    router.push(`${pathname}?${params.toString()}`)
  }

  function selectType(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) { params.set('type', value) } else { params.delete('type') }
    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  return (
    <div className="mb-8 flex items-center justify-between gap-4">

      {/* Mobile: native selects */}
      <div className="md:hidden flex items-center gap-2">
        <select
          value={current}
          onChange={(e) => selectCategory(e.target.value)}
          className={`${PILL} bg-[#F5F5F5] text-foreground focus:outline-none`}
        >
          {CATEGORIES.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={currentType}
          onChange={(e) => selectType(e.target.value)}
          className={`${PILL} bg-[#F5F5F5] text-foreground focus:outline-none`}
        >
          {TYPE_FILTERS.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Desktop: chip row */}
      <div className="hidden md:flex flex-wrap items-center gap-2">
        {CATEGORIES.map(({ label, value }) => {
          const isActive = current === value
          return (
            <button
              key={value}
              onClick={() => selectCategory(value)}
              className={[
                PILL + ' transition-colors',
                isActive
                  ? 'bg-[#DC5405] text-white'
                  : 'bg-[#F5F5F5] text-foreground hover:bg-[#EBEBEB]',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Desktop: custom filter dropdown */}
      <div ref={dropdownRef} className="relative hidden md:block shrink-0">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
        >
          <svg className="size-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <line x1="2" y1="5" x2="10" y2="5" strokeLinecap="round" />
            <circle cx="11.5" cy="5" r="1.5" />
            <circle cx="4.5" cy="11" r="1.5" />
            <line x1="6" y1="11" x2="14" y2="11" strokeLinecap="round" />
          </svg>
          Filter
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
            {TYPE_FILTERS.map(({ label, value, color }) => {
              const isActive = currentType === value
              return (
                <button
                  key={value}
                  onClick={() => selectType(value)}
                  className={[
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    isActive ? 'bg-muted' : 'hover:bg-muted/50',
                  ].join(' ')}
                >
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                  <span className={['flex-1 text-left font-medium', isActive ? 'text-primary' : 'text-foreground'].join(' ')}>
                    {label}
                  </span>
                  {isActive && (
                    <svg className="size-4 text-primary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l3.5 3.5L13 4.5" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
