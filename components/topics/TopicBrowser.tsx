'use client'

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
      { label: 'Career Strategy',        value: 'career-strategy' },
      { label: 'Portfolio & Case Studies', value: 'portfolio-case-studies' },
      { label: 'AI-Assisted Workflow',   value: 'ai-assisted-workflow' },
      { label: 'Accessibility',          value: 'accessibility' },
      { label: 'Workflow Optimization',  value: 'workflow-optimization' },
    ],
  },
]

export function TopicBrowser() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSubtopic = searchParams.get('subtopic') ?? ''

  function select(category: string, subtopic: string) {
    if (activeSubtopic === subtopic) {
      router.push('/topics')
    } else {
      router.push(`/topics?category=${encodeURIComponent(category)}&subtopic=${encodeURIComponent(subtopic)}`)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
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
  )
}
