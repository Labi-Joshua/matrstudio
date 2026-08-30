'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  Inbox,
  BookOpen,
  UploadCloud,
  Tags,
  BarChart3,
  Users,
  Settings,
  ExternalLink,
  PanelLeft,
  MoreHorizontal,
} from 'lucide-react'
import { logout } from '@/app/(admin)/admin/(dashboard)/actions'
import { initials } from '@/lib/utils'
import type { AdminUser } from '@/lib/admin-users'

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutGrid
  badge?: number
  disabled?: boolean
}

const LIBRARY_ITEMS: NavItem[] = [
  { href: '/admin/resources', label: 'Resources', icon: BookOpen },
  { href: '/admin/resources/new', label: 'Add Resources', icon: UploadCloud, disabled: true },
  { href: '/admin/topics', label: 'Topics & Types', icon: Tags, disabled: true },
]

const INSIGHT_ITEMS: NavItem[] = [
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, disabled: true },
  { href: '/admin/contributors', label: 'Contributors', icon: Users, disabled: true },
]

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
  const Icon = item.icon

  const content = (
    <>
      <span className="flex items-center gap-3">
        <Icon className="size-[18px]" />
        {item.label}
      </span>
      {typeof item.badge === 'number' && item.badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white">
          {item.badge}
        </span>
      )}
    </>
  )

  if (item.disabled) {
    return (
      <div className="flex cursor-not-allowed items-center justify-between rounded-full px-4 py-2.5 text-[15px] font-medium text-sidebar-foreground/60">
        {content}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={[
        'flex items-center justify-between rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      ].join(' ')}
    >
      {content}
    </Link>
  )
}

export function AdminSidebar({
  pendingSubmissions,
  user,
}: {
  pendingSubmissions: number
  user: AdminUser
}) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const overviewItem: NavItem = { href: '/admin', label: 'Overview', icon: LayoutGrid }
  const submissionsItem: NavItem = {
    href: '/admin/submissions',
    label: 'Submissions',
    icon: Inbox,
    badge: pendingSubmissions,
  }

  return (
    <aside className="m-2 flex w-72 max-h-[1920px] shrink-0 flex-col justify-between rounded-2xl border border-[#242E42]/8 bg-white px-5 py-6">
      <div className="flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/matrstudio..png" alt="Matrstudio" width={95} height={15} priority />
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              Admin
              <span className="size-1.5 rounded-full bg-primary" />
            </span>
          </div>
          <button
            type="button"
            aria-label="Toggle sidebar"
            className="rounded-lg bg-muted p-1.5 text-sidebar-foreground/50 hover:text-sidebar-foreground"
          >
            <PanelLeft className="size-4" />
          </button>
        </div>

        <div className="relative flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-medium text-white">
            {initials(user.name ?? user.email)}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-base font-medium text-sidebar-foreground">{user.name ?? user.email}</span>
            <span className="truncate text-sm text-sidebar-foreground/50">{user.email}</span>
          </div>
          <button
            type="button"
            aria-label="Account menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="shrink-0 rounded-md p-1 text-sidebar-foreground/40 hover:text-sidebar-foreground"
          >
            <MoreHorizontal className="size-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-xl border border-[#242E42]/8 bg-card shadow-lg">
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted"
                >
                  Log out
                </button>
              </form>
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <NavLink item={overviewItem} pathname={pathname} />
            <NavLink item={submissionsItem} pathname={pathname} />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="px-4 pb-1 text-sm text-sidebar-foreground/40">Library</p>
            {LIBRARY_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="px-4 pb-1 text-sm text-sidebar-foreground/40">Insight</p>
            {INSIGHT_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </div>
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <NavLink item={{ href: '/admin/settings', label: 'Settings', icon: Settings }} pathname={pathname} />

        <a
          href="https://resources.matrstudio.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-primary/10 px-4 py-3.5 transition-colors hover:bg-primary/15"
        >
          <ExternalLink className="size-4 shrink-0 text-primary" />
          <span className="flex flex-col text-sm">
            <span className="font-medium text-foreground">View Live Index</span>
            <span className="text-muted-foreground">resources.matrstudio.com</span>
          </span>
        </a>
      </div>
    </aside>
  )
}
