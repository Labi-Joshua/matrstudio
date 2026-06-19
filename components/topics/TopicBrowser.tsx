'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const TOPICS = [
  {
    label: 'Design Execution',
    value: 'design-execution',
    subtopics: [
      { label: 'Design Systems',      value: 'design-systems' },
      { label: 'Design Handoff',      value: 'design-handoff' },
      { label: 'Prototyping',         value: 'prototyping' },
      { label: 'Documentation',       value: 'documentation' },
      { label: 'Visual Architecture', value: 'visual-architecture' },
    ],
  },
  {
    label: 'Strategic Thinking',
    value: 'strategic-thinking',
    subtopics: [
      { label: 'Design Rationale',       value: 'design-rationale' },
      { label: 'Stakeholder Management', value: 'stakeholder-management' },
      { label: 'Product Thinking',       value: 'product-thinking' },
      { label: 'User Research',          value: 'user-research' },
      { label: 'Design Ethics',          value: 'design-ethics' },
    ],
  },
  {
    label: 'Business & Growth',
    value: 'business-growth',
    subtopics: [
      { label: 'Product Analytics',       value: 'product-analytics' },
      { label: 'Conversion Optimization', value: 'conversion-optimization' },
      { label: 'SEO Optimization',        value: 'seo-optimization' },
      { label: 'Growth Design',           value: 'growth-design' },
      { label: 'Marketing & Strategy',    value: 'marketing-strategy' },
    ],
  },
  {
    label: 'Career & Craft',
    value: 'career-craft',
    subtopics: [
      { label: 'Career Strategy',          value: 'career-strategy' },
      { label: 'Portfolio & Case Studies', value: 'portfolio-case-studies' },
      { label: 'AI-Assisted Workflow',     value: 'ai-assisted-workflow' },
      { label: 'Accessibility',            value: 'accessibility' },
      { label: 'Workflow Optimization',    value: 'workflow-optimization' },
    ],
  },
]

export function TopicBrowser() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSubtopic = searchParams.get('subtopic') ?? ''
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  function select(category: string, subtopic: string) {
    if (activeSubtopic === subtopic) {
      router.push('/topics')
    } else {
      router.push(`/topics?category=${encodeURIComponent(category)}&subtopic=${encodeURIComponent(subtopic)}`)
    }
  }

  return (
    <>
      {/* Desktop: 4-column grid */}
      <div className="hidden md:grid grid-cols-4 gap-x-8 gap-y-10">
        {TOPICS.map(({ label, value, subtopics }) => (
          <div key={value}>
            <h2
              className="mb-3 text-[20px] font-normal leading-snug text-foreground"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {label}<span className="text-primary">.</span>
            </h2>
            <ul className="flex flex-col gap-1">
              {subtopics.map((sub) => (
                <li key={sub.value}>
                  <button
                    onClick={() => select(value, sub.value)}
                    className={[
                      'text-left text-[14px] transition-colors',
                      activeSubtopic === sub.value
                        ? 'text-primary'
                        : 'text-[#040404]/60 hover:text-primary',
                    ].join(' ')}
                  >
                    {sub.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile: vertical accordion */}
      <div className="md:hidden flex flex-col divide-y divide-border">
        {TOPICS.map(({ label, value, subtopics }) => {
          const isOpen = openCategory === value
          return (
            <div key={value}>
              <button
                onClick={() => setOpenCategory(isOpen ? null : value)}
                className="flex w-full items-center justify-between py-4"
              >
                <span
                  className="text-[20px] font-normal leading-snug text-foreground"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {label}<span className="text-primary">.</span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className={['size-4 text-muted-foreground transition-transform duration-200', isOpen ? 'rotate-180' : ''].join(' ')}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <ul className="flex flex-col gap-1 pb-4">
                  {subtopics.map((sub) => (
                    <li key={sub.value}>
                      <button
                        onClick={() => select(value, sub.value)}
                        className={[
                          'text-left text-[14px] transition-colors py-1',
                          activeSubtopic === sub.value
                            ? 'text-primary'
                            : 'text-[#040404]/60 hover:text-primary',
                        ].join(' ')}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
