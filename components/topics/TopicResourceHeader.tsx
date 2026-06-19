'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const SUBTOPIC_LABELS: Record<string, string> = {
  'design-systems':        'Design Systems',
  'design-handoff':        'Design Handoff',
  'prototyping':           'Prototyping',
  'documentation':         'Documentation',
  'visual-architecture':   'Visual Architecture',
  'design-rationale':      'Design Rationale',
  'stakeholder-management':'Stakeholder Management',
  'product-thinking':      'Product Thinking',
  'user-research':         'User Research',
  'design-ethics':         'Design Ethics',
  'product-analytics':     'Product Analytics',
  'conversion-optimization':'Conversion Optimization',
  'seo-optimization':      'SEO Optimization',
  'growth-design':         'Growth Design',
  'marketing-strategy':    'Marketing & Strategy',
  'career-strategy':       'Career Strategy',
  'portfolio-case-studies':'Portfolio & Case Studies',
  'ai-assisted-workflow':  'AI-Assisted Workflow',
  'accessibility':         'Accessibility',
  'workflow-optimization': 'Workflow Optimization',
}

const TYPE_FILTERS = [
  { label: 'All',      value: '',         color: '#9CA3AF' },
  { label: 'Article',  value: 'article',  color: '#4A7AB8' },
  { label: 'Video',    value: 'video',    color: '#DC5405' },
  { label: 'Book',     value: 'book',     color: '#B07840' },
  { label: 'Tool',     value: 'tool',     color: '#7C2828' },
  { label: 'Course',   value: 'course',   color: '#6B7280' },
  { label: 'Template', value: 'template', color: '#059669' },
  { label: 'Podcast',  value: 'podcast',  color: '#7C3AED' },
]

export function TopicResourceHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const subtopicParam = searchParams.get('subtopic') ?? ''
  const selected = subtopicParam ? subtopicParam.split(',') : []
  const topic = selected.length === 1
    ? (SUBTOPIC_LABELS[selected[0]] ?? selected[0])
    : ''
  const currentType = searchParams.get('type') ?? ''
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function selectType(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) { params.set('type', value) } else { params.delete('type') }
    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          {selected.length === 0
            ? 'All Resources'
            : selected.length === 1
              ? <>Resources on <span className="text-primary">'{topic}'</span></>
              : <><span className="text-primary">{selected.length} topics</span> selected</>
          }
        </p>
        {selected.length > 0 && (
          <button
            onClick={() => router.push(pathname)}
            className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors underline underline-offset-2"
          >
            Clear all selections
          </button>
        )}
      </div>

      <div ref={ref} className="relative shrink-0">
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
                  className={['flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors', isActive ? 'bg-muted' : 'hover:bg-muted/50'].join(' ')}
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
