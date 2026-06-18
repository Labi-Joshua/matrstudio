'use client'

import { useState } from 'react'

const TOPICS = [
  { label: 'Craft & Fundamentals',  value: 'craft' },
  { label: 'Brand & Strategy',      value: 'brand-strategy' },
  { label: 'Operations & AI',       value: 'operations-ai' },
  { label: 'Motion & Interaction',  value: 'motion-interaction' },
  { label: 'Growth Marketing',      value: 'growth-marketing' },
  { label: 'Editorial & Curation',  value: 'editorial-curation' },
]

const MAX_RATIONALE = 240

const INPUT = 'w-full rounded-[6px] border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none'

export function SubmitForm() {
  const [title, setTitle]       = useState('')
  const [url, setUrl]           = useState('')
  const [topic, setTopic]       = useState('')
  const [email, setEmail]       = useState('')
  const [rationale, setRationale] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const normalizedUrl = url.trim() && !/^https?:\/\//i.test(url.trim()) ? `https://${url.trim()}` : url.trim()
  const isValidUrl = (() => { try { new URL(normalizedUrl); return true } catch { return false } })()
  const isValid = title.trim() !== '' && isValidUrl && topic !== '' && isValidEmail

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setSubmitted(true)
  }

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
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={INPUT}
        >
          <option value="" disabled>Select a topic</option>
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Creator / Source */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Creator / Source</label>
          <span className="text-xs text-muted-foreground">Optional</span>
        </div>
        <input
          type="text"
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
