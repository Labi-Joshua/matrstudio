'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Suggestion = { _id: string; title: string }

export function MobileSearch() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [allResources, setAllResources] = useState<Suggestion[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [keyboardOffset, setKeyboardOffset] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/suggestions')
      .then((r) => r.json())
      .then(setAllResources)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const q = value.trim().toLowerCase()
    if (!q) { setSuggestions([]); return }
    setSuggestions(allResources.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 6))
  }, [value, allResources])

  // Track keyboard height via visualViewport
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const onResize = () => {
      const offset = window.innerHeight - vv.height - vv.offsetTop
      setKeyboardOffset(Math.max(0, offset))
    }

    vv.addEventListener('resize', onResize)
    vv.addEventListener('scroll', onResize)
    return () => {
      vv.removeEventListener('resize', onResize)
      vv.removeEventListener('scroll', onResize)
    }
  }, [])

  // Reset offset when sheet closes
  useEffect(() => {
    if (!open) setKeyboardOffset(0)
  }, [open])

  function handleSelect(title: string) {
    setOpen(false)
    setValue('')
    router.push(`/?q=${encodeURIComponent(title)}`)
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!value.trim()) return
    setOpen(false)
    router.push(`/?q=${encodeURIComponent(value.trim())}`)
    setValue('')
  }

  return (
    <>
      {/* Search icon trigger */}
      <button
        onClick={() => { setOpen(true); inputRef.current?.focus() }}
        className="flex md:hidden items-center justify-center size-9 rounded-full bg-[#F0F0F0]"
        aria-label="Search"
      >
        <svg className="size-4 text-muted-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="8.5" cy="8.5" r="5.75" />
          <path strokeLinecap="round" d="M13 13l3.5 3.5" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => { setOpen(false); setValue('') }}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={[
          'fixed left-0 right-0 z-50 rounded-t-[20px] bg-white px-4 pt-5 shadow-xl transition-[transform,bottom] duration-300',
          open ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        style={{ bottom: keyboardOffset, paddingBottom: keyboardOffset > 0 ? 16 : 40 }}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E0E0E0]" />

        {/* Search input */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 rounded-full bg-[#F0F0F0] px-4 py-3">
            <svg className="size-4 shrink-0 text-muted-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="8.5" cy="8.5" r="5.75" />
              <path strokeLinecap="round" d="M13 13l3.5 3.5" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search the index"
              className="flex-1 bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {value && (
              <button type="button" onClick={() => setValue('')} className="text-muted-foreground">
                <svg className="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-3 flex flex-col overflow-y-auto" style={{ maxHeight: keyboardOffset > 0 ? 160 : 300 }}>
            {suggestions.map((s) => (
              <button
                key={s._id}
                onClick={() => handleSelect(s.title)}
                className="flex shrink-0 items-center gap-3 px-1 py-3 text-left text-sm text-foreground border-b border-[#F0F0F0] last:border-0"
              >
                <svg className="size-3.5 shrink-0 text-muted-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="8.5" cy="8.5" r="5.75" />
                  <path strokeLinecap="round" d="M13 13l3.5 3.5" />
                </svg>
                {s.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
