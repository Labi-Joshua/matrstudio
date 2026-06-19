'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const TOPICS = [
  {
    label: 'Design Execution',
    subtopics: ['Design Systems', 'Design Handoff', 'Prototyping', 'Documentation', 'Visual Architecture'],
  },
  {
    label: 'Strategic Thinking',
    subtopics: ['Design Rationale', 'Stakeholder Management', 'Product Thinking', 'User Research', 'Design Ethics'],
  },
  {
    label: 'Business & Growth',
    subtopics: ['Product Analytics', 'Conversion Optimization', 'SEO Optimization', 'Growth Design', 'Marketing & Strategy'],
  },
  {
    label: 'Career & Craft',
    subtopics: ['Career Strategy', 'Portfolio & Case Studies', 'AI-Assisted Workflow', 'Accessibility', 'Workflow Optimization'],
  },
]

export function TopicBrowser() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('t') ?? ''

  function select(subtopic: string) {
    if (active === subtopic) {
      router.push('/topics')
    } else {
      router.push(`/topics?t=${encodeURIComponent(subtopic)}`)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
      {TOPICS.map(({ label, subtopics }) => (
        <div key={label}>
          <h2
            className="mb-4 text-[20px] font-normal leading-snug text-foreground"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {label}<span className="text-primary">.</span>
          </h2>
          <ul className="flex flex-col gap-1">
            {subtopics.map((sub) => (
              <li key={sub}>
                <button
                  onClick={() => select(sub)}
                  className={[
                    'text-left text-sm transition-colors',
                    active === sub
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary',
                  ].join(' ')}
                >
                  {sub}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
