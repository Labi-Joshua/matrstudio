'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex items-center gap-5 text-sm font-medium leading-none">
      <Link
        href="/"
        className={pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}
      >
        Index
      </Link>
      <Link
        href="/topics"
        className={pathname.startsWith('/topics') ? 'text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}
      >
        Topics
      </Link>
    </div>
  )
}
