import type { Metadata } from 'next'
import Link from 'next/link'
import { SubmitForm } from '@/components/submit/SubmitForm'

export const metadata: Metadata = {
  title: 'Submit a Resource',
}

const CRITERIA = [
  {
    number: '01',
    title: 'One thing, not a roundup',
    body: 'Link the resource itself — not a list of resources, not a homepage.',
  },
  {
    number: '02',
    title: 'It has to earn a place',
    body: 'We add roughly one in five. Quality over coverage, always.',
  },
  {
    number: '03',
    title: 'The rationale is the point',
    body: 'It\'s the line readers actually see. Make the case in a sentence or two.',
  },
]

export default function SubmitPage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-[32px] md:pt-[80px] pb-[64px] sm:px-6 lg:px-8">

        {/* Back link */}
        <Link
          href="/"
          className="mb-4 md:mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="size-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
          Back to index
        </Link>

        {/* Hero */}
        <div className="max-w-2xl">
          <h1 className="font-display text-[48px] md:text-[56px] leading-[1.1] tracking-[-1.5px] text-foreground">
            Found something worth the index<span className="text-primary">?</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            The index grows by recommendation. Tell us what you found and why it matters — we read every submission.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="mt-[80px] flex flex-col gap-12 lg:flex-row lg:gap-[80px]">

          {/* Left: Selection Criteria */}
          <div className="lg:w-[360px] lg:shrink-0">
            <div className="w-fit">
              <h2
                className="text-[32px] leading-snug tracking-tight text-foreground"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Selection Criteria
              </h2>
              <div className="mt-3 h-px w-full bg-black/[0.08]" />
            </div>
            <div className="mt-8 flex flex-col gap-8">
              {CRITERIA.map(({ number, title, body }) => (
                <div key={number} className="flex gap-4">
                  <span
                    className="shrink-0 text-sm font-medium text-primary"
                    style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}
                  >
                    {number}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p
                      className="text-[18px] leading-snug text-foreground"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {title}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex-1">
            <SubmitForm />
          </div>

        </div>
      </section>
    </div>
  )
}
