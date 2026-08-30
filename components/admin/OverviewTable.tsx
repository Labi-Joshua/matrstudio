'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ResourceTypeBadge } from './ResourceTypeBadge'

export interface RecentRow {
  id: string
  title: string
  resourceType?: string
  author?: string
}

export interface PendingRow {
  id: string
  title: string
  topic: string
  submitterEmail: string
  waitingLabel: string
}

type Tab = 'most-viewed' | 'recent' | 'pending'

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors',
        active ? 'bg-white font-semibold text-foreground' : 'font-medium text-muted-foreground hover:text-foreground',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function Count({ children }: { children: number }) {
  return (
    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DCDCDF] px-1 text-[10px] font-medium text-foreground/70">
      {children}
    </span>
  )
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-card px-5 py-12 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function ValueBox({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-lg border border-[#242E42]/8 px-3 py-1 text-sm text-foreground">
      {children}
    </span>
  )
}

function HeaderCheckbox() {
  return (
    <th className="w-12 rounded-tl-2xl py-3 pl-5">
      <input
        type="checkbox"
        disabled
        aria-label="Select all rows"
        className="size-4 rounded-[4px] border border-[#242E42]/20 accent-primary"
      />
    </th>
  )
}

export function OverviewTable({ recent, pending }: { recent: RecentRow[]; pending: PendingRow[] }) {
  const [tab, setTab] = useState<Tab>('recent')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-[#242E42]/8 bg-[#EEEFF1] p-1">
          <TabButton active={tab === 'most-viewed'} onClick={() => setTab('most-viewed')}>
            Most Viewed
          </TabButton>
          <TabButton active={tab === 'recent'} onClick={() => setTab('recent')}>
            Recent Activity <Count>{recent.length}</Count>
          </TabButton>
          <TabButton active={tab === 'pending'} onClick={() => setTab('pending')}>
            Pending <Count>{pending.length}</Count>
          </TabButton>
        </div>
        <Link
          href="/admin/resources"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Add Resource
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#242E42]/8">
      {tab === 'most-viewed' && (
        <EmptyState
          title="View tracking isn't connected yet"
          subtitle="Once analytics is wired up, your most-viewed resources will show here."
        />
      )}

      {tab === 'recent' &&
        (recent.length === 0 ? (
          <EmptyState title="No resources yet" subtitle="Approved submissions will show up here." />
        ) : (
          <div className="overflow-x-auto bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-[#242E42]/8 bg-[#F7F7F8] text-left text-sm text-muted-foreground">
                  <HeaderCheckbox />
                  <th className="px-4 py-3 font-normal">Title</th>
                  <th className="px-4 py-3 font-normal">Type</th>
                  <th className="px-4 py-3 font-normal">Views</th>
                  <th className="px-4 py-3 font-normal">Clicks</th>
                  <th className="rounded-tr-2xl px-4 py-3 font-normal">Author</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr key={r.id} className="border-b border-[#242E42]/8 last:border-0">
                    <td className="py-4 pl-5 text-sm text-muted-foreground">{String(i + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-4 font-medium text-foreground">{r.title}</td>
                    <td className="px-4 py-4">
                      <ResourceTypeBadge type={r.resourceType} />
                    </td>
                    <td className="px-4 py-4">
                      <ValueBox>—</ValueBox>
                    </td>
                    <td className="px-4 py-4">
                      <ValueBox>—</ValueBox>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{r.author ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {tab === 'pending' &&
        (pending.length === 0 ? (
          <EmptyState title="No pending submissions" subtitle="New submissions will show up here for review." />
        ) : (
          <div className="overflow-x-auto bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-[#242E42]/8 bg-[#F7F7F8] text-left text-sm text-muted-foreground">
                  <HeaderCheckbox />
                  <th className="px-4 py-3 font-normal">Title</th>
                  <th className="px-4 py-3 font-normal">Topic</th>
                  <th className="px-4 py-3 font-normal">Submitted by</th>
                  <th className="rounded-tr-2xl px-4 py-3 font-normal">Waiting</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p, i) => (
                  <tr key={p.id} className="border-b border-[#242E42]/8 last:border-0">
                    <td className="py-4 pl-5 text-sm text-muted-foreground">{String(i + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-4 font-medium text-foreground">{p.title}</td>
                    <td className="px-4 py-4 text-muted-foreground">{p.topic}</td>
                    <td className="px-4 py-4 text-muted-foreground">{p.submitterEmail}</td>
                    <td className="px-4 py-4">
                      <ValueBox>{p.waitingLabel}</ValueBox>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
