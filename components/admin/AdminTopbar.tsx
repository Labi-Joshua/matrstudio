'use client'

import { usePathname } from 'next/navigation'
import { Search, Bell, Menu } from 'lucide-react'

const TITLES: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/submissions': 'Submissions',
  '/admin/resources': 'Resources',
}

function titleForPath(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname]
  const base = '/' + pathname.split('/').filter(Boolean).slice(0, 2).join('/')
  return TITLES[base] ?? 'Admin'
}

export function AdminTopbar({ hasAlerts }: { hasAlerts: boolean }) {
  const pathname = usePathname()

  return (
    <header className="flex items-center gap-6 p-3">
      <p className="shrink-0 text-lg font-medium text-foreground">{titleForPath(pathname)}</p>

      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search the index"
          disabled
          className="w-full rounded-full border-none bg-[#E9E9EB] py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed focus:outline-none"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3 rounded-full border border-[#242E42]/8 bg-white p-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
            AS
          </span>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-semibold text-foreground">Alex Simmons</span>
            <span className="text-xs text-muted-foreground">simmon@radianos.com</span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-[#242E42]/8 text-foreground hover:bg-muted"
        >
          <Bell className="size-4" />
          {hasAlerts && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-destructive" />}
        </button>

        <button
          type="button"
          aria-label="Menu"
          className="flex size-8 shrink-0 items-center justify-center text-foreground hover:text-muted-foreground"
        >
          <Menu className="size-[18px]" />
        </button>
      </div>
    </header>
  )
}
