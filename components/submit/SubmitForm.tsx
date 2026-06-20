'use client'

import { useState, useRef, useEffect } from 'react'

const TOPICS = [
  // Design Execution
  { label: 'Design Systems',          value: 'design-systems',         color: '#4A7AB8' },
  { label: 'Design Handoff',          value: 'design-handoff',         color: '#4A7AB8' },
  { label: 'Prototyping',             value: 'prototyping',            color: '#4A7AB8' },
  { label: 'Documentation',           value: 'documentation',          color: '#4A7AB8' },
  { label: 'Visual Architecture',     value: 'visual-architecture',    color: '#4A7AB8' },
  // Strategic Thinking
  { label: 'Design Rationale',        value: 'design-rationale',       color: '#DC5405' },
  { label: 'Stakeholder Management',  value: 'stakeholder-management', color: '#DC5405' },
  { label: 'Product Thinking',        value: 'product-thinking',       color: '#DC5405' },
  { label: 'User Research',           value: 'user-research',          color: '#DC5405' },
  { label: 'Design Ethics',           value: 'design-ethics',          color: '#DC5405' },
  // Business & Growth
  { label: 'Product Analytics',       value: 'product-analytics',      color: '#B07840' },
  { label: 'Conversion Optimization', value: 'conversion-optimization',color: '#B07840' },
  { label: 'SEO Optimization',        value: 'seo-optimization',       color: '#B07840' },
  { label: 'Growth Design',           value: 'growth-design',          color: '#B07840' },
  { label: 'Marketing & Strategy',    value: 'marketing-strategy',     color: '#B07840' },
  // Career & Craft
  { label: 'Career Strategy',         value: 'career-strategy',        color: '#7C3AED' },
  { label: 'Portfolio & Case Studies',value: 'portfolio-case-studies', color: '#7C3AED' },
  { label: 'AI-Assisted Workflow',    value: 'ai-assisted-workflow',   color: '#7C3AED' },
  { label: 'Accessibility',           value: 'accessibility',          color: '#7C3AED' },
  { label: 'Workflow Optimization',   value: 'workflow-optimization',  color: '#7C3AED' },
]

const SUBTOPIC_TO_CATEGORY: Record<string, string> = {
  'design-systems': 'Design Execution', 'design-handoff': 'Design Execution',
  'prototyping': 'Design Execution', 'documentation': 'Design Execution',
  'visual-architecture': 'Design Execution',
  'design-rationale': 'Strategic Thinking', 'stakeholder-management': 'Strategic Thinking',
  'product-thinking': 'Strategic Thinking', 'user-research': 'Strategic Thinking',
  'design-ethics': 'Strategic Thinking',
  'product-analytics': 'Business & Growth', 'conversion-optimization': 'Business & Growth',
  'seo-optimization': 'Business & Growth', 'growth-design': 'Business & Growth',
  'marketing-strategy': 'Business & Growth',
  'career-strategy': 'Career & Craft', 'portfolio-case-studies': 'Career & Craft',
  'ai-assisted-workflow': 'Career & Craft', 'accessibility': 'Career & Craft',
  'workflow-optimization': 'Career & Craft',
}

const MAX_RATIONALE = 240

const INPUT = 'w-full rounded-[6px] border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none'

export function SubmitForm() {
  const [title, setTitle]         = useState('')
  const [url, setUrl]             = useState('')
  const [topic, setTopic]         = useState('')
  const [email, setEmail]         = useState('')
  const [creator, setCreator]     = useState('')
  const [rationale, setRationale] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [topicOpen, setTopicOpen] = useState(false)
  const [customTopic, setCustomTopic] = useState(false)
  const topicRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (topicRef.current && !topicRef.current.contains(e.target as Node)) setTopicOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const normalizedUrl = url.trim() && !/^https?:\/\//i.test(url.trim()) ? `https://${url.trim()}` : url.trim()
  const isValidUrl = (() => { try { new URL(normalizedUrl); return true } catch { return false } })()
  const isValid = title.trim() !== '' && isValidUrl && topic !== '' && isValidEmail

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    const res = await fetch('https://formspree.io/f/xqeornjo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        title,
        url: normalizedUrl,
        topic,
        creator,
        email,
        rationale,
      }),
    })
    setLoading(false)
    if (res.ok) setSubmitted(true)
  }

  const selectedTopic = TOPICS.find((t) => t.value === topic)

  if (submitted) {
    return (
      <div className="flex flex-col gap-3 py-12">
        <p className="text-[28px] leading-snug text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
          Thanks for the submission.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We review every entry. If it makes the cut, we'll credit you and add it to the index.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Resource Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Resource Title <span className="text-primary">*</span></label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g a field guide to modular scale"
          className={INPUT}
        />
      </div>

      {/* URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">URL <span className="text-primary">*</span></label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://resource-link.com"
          className={INPUT}
        />
      </div>

      {/* Topic */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Topic <span className="text-primary">*</span></label>
        <div ref={topicRef} className="relative">
          {!customTopic && <button
            type="button"
            onClick={() => setTopicOpen((o) => !o)}
            className="w-full flex items-center gap-2 rounded-[6px] border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-left focus:border-foreground/30 focus:outline-none"
          >
            {selectedTopic ? (
              <>
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: selectedTopic.color }} />
                <span className="flex-1 text-foreground">{selectedTopic.label}</span>
              </>
            ) : (
              <span className="flex-1 text-muted-foreground">Select a topic</span>
            )}
            <svg className="size-3.5 shrink-0 text-muted-foreground" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>}

          {topicOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-y-auto rounded-2xl bg-white shadow-lg ring-1 ring-black/5" style={{ maxHeight: '264px' }}>
              {TOPICS.map(({ label, value, color }) => {
                const isActive = topic === value
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => { setTopic(value); setTopicOpen(false) }}
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
              <button
                type="button"
                onClick={() => { setCustomTopic(true); setTopic(''); setTopicOpen(false) }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors border-t border-border"
              >
                + Suggest a topic not listed
              </button>
            </div>
          )}

          {customTopic && (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Type your suggested topic…"
                  className="w-full rounded-[6px] border border-[#E0E0E0] bg-white px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => { setCustomTopic(false); setTopic('') }}
                  className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Cancel"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} className="size-4">
                    <path strokeLinecap="round" d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                onClick={() => { setCustomTopic(false); setTopic('') }}
                className="self-start text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                ← Pick from the list instead
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auto-populated Category */}
      {topic && !customTopic && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Category</label>
          <div className="w-full rounded-[6px] border border-[#E0E0E0] bg-[#F9F9F9] px-4 py-3 text-sm text-muted-foreground">
            ✓ {SUBTOPIC_TO_CATEGORY[topic]}
          </div>
        </div>
      )}

      {/* Creator / Source */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Creator / Source</label>
          <span className="text-xs text-muted-foreground">Optional</span>
        </div>
        <input
          type="text"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          placeholder="e.g Alade Olayemi"
          className={INPUT}
        />
      </div>

      {/* Curator's Rationale */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Curator's Rationale</label>
          <span className="text-xs text-muted-foreground">{rationale.length} / {MAX_RATIONALE}</span>
        </div>
        <textarea
          maxLength={MAX_RATIONALE}
          rows={6}
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          placeholder="Why does this earn a place in the index? One or 2 plain sentences — the clearer the case, the better"
          className={`${INPUT} resize-none`}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Your Email <span className="text-primary">*</span></label>
          <span className="text-xs text-muted-foreground">So we can credit you</span>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g hello@email.com"
          className={INPUT}
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full md:w-auto inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'Submitting…' : 'Submit for review'}
        </button>
        <p className="text-center md:text-left text-sm text-muted-foreground">
          No account needed. We'll credit you if it's added.
        </p>
      </div>

    </form>
  )
}
