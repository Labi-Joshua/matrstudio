'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type Suggestion = { _id: string; title: string; slug: string; externalUrl?: string }

export function SearchInput({
  inputClassName = '',
  dropdownClassName = 'left-[-40px] w-[366px]',
  fullWidthOnMobile = false,
}: {
  inputClassName?: string
  dropdownClassName?: string
  fullWidthOnMobile?: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const [allResources, setAllResources] = useState<Suggestion[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [dropdownTop, setDropdownTop] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/suggestions')
      .then((r) => r.json())
      .then(setAllResources)
      .catch(() => {})
  }, [])

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768) }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (open && fullWidthOnMobile && isMobile && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDropdownTop(rect.bottom + 10)
    }
  }, [open, fullWidthOnMobile, isMobile])

  useEffect(() => {
    if (value.trim() === '' && searchParams.get('q')) {
      router.push('/')
    }
  }, [value, searchParams, router])

  useEffect(() => {
    const q = value.trim().toLowerCase()
    if (!q) { setSuggestions([]); setOpen(false); return }
    const matches = allResources.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 6)
    setSuggestions(matches)
    setOpen(matches.length > 0)
  }, [value, allResources])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setOpen(false)
    router.push(value.trim() ? `/?q=${encodeURIComponent(value.trim())}` : '/')
  }

  function selectSuggestion(s: Suggestion) {
    setValue(s.title)
    setOpen(false)
    router.push(`/?q=${encodeURIComponent(s.title)}`)
  }

  const dropdownContent = (
    <div>
      {suggestions.map((s) => (
        <button
          key={s._id}
          onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s) }}
          className="flex w-full items-center px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-[#F5F5F5]"
        >
          <svg className="mr-2.5 size-3.5 shrink-0 text-muted-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="8.5" cy="8.5" r="5.75" />
            <path strokeLinecap="round" d="M13 13l3.5 3.5" />
          </svg>
          {s.title}
        </button>
      ))}
    </div>
  )

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Search the index"
          className={`w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${inputClassName}`}
        />
      </form>

      {open && fullWidthOnMobile && isMobile
        ? createPortal(
            <div
              className="fixed z-50 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
              style={{ top: dropdownTop, left: 16, right: 16 }}
            >
              {dropdownContent}
            </div>,
            document.body
          )
        : open && (
            <div className={`absolute top-[calc(100%+14px)] z-50 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 ${dropdownClassName}`}>
              {dropdownContent}
            </div>
          )
      }
    </div>
  )
}
