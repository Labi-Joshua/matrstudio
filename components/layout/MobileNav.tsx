'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="md:hidden flex items-center justify-center w-8 h-8 text-foreground"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-t border-border px-4 py-4 flex flex-col gap-1 z-50">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={['px-2 py-3 text-sm font-medium rounded-lg transition-colors', pathname === '/' ? 'text-primary' : 'text-foreground hover:bg-muted'].join(' ')}
          >
            Index
          </Link>
          <Link
            href="/topics"
            onClick={() => setOpen(false)}
            className={['px-2 py-3 text-sm font-medium rounded-lg transition-colors', pathname.startsWith('/topics') ? 'text-primary' : 'text-foreground hover:bg-muted'].join(' ')}
          >
            Topics
          </Link>
        </div>
      )}
    </>
  )
}
