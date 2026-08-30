import Link from 'next/link'
import { Inbox, ChevronRight } from 'lucide-react'
import { writeClient } from '@/sanity/lib/write-client'
import { dashboardCountsQuery, pendingSubmissionsQuery, recentResourcesQuery } from '@/sanity/lib/queries'
import { daysSince, greeting } from '@/lib/utils'
import { StatCard } from '@/components/admin/StatCard'
import { AnalyticsChartCard } from '@/components/admin/AnalyticsChartCard'
import { OverviewTable, type RecentRow, type PendingRow } from '@/components/admin/OverviewTable'

interface DashboardCounts {
  pendingSubmissions: number
  oldestPendingSubmittedAt: string | null
  totalResources: number
  publishedLast30Days: number
  contributors: number
}

interface PendingSubmission {
  _id: string
  title: string
  topic: string
  submitterEmail: string
  submittedAt?: string
}

interface RecentResource {
  _id: string
  title: string
  resourceType?: string
  author?: string
}

function dayLabel(n: number): string {
  return `${n} day${n === 1 ? '' : 's'}`
}

export default async function AdminDashboardPage() {
  const [counts, pendingSubmissions, recentResources] = await Promise.all([
    writeClient.fetch<DashboardCounts>(dashboardCountsQuery),
    writeClient.fetch<PendingSubmission[]>(pendingSubmissionsQuery),
    writeClient.fetch<RecentResource[]>(recentResourcesQuery),
  ])

  const oldestWaitingDays = daysSince(counts.oldestPendingSubmittedAt)

  const recentRows: RecentRow[] = recentResources.map((r) => ({
    id: r._id,
    title: r.title,
    resourceType: r.resourceType,
    author: r.author,
  }))

  const pendingRows: PendingRow[] = pendingSubmissions.map((s) => ({
    id: s._id,
    title: s.title,
    topic: s.topic,
    submitterEmail: s.submitterEmail,
    waitingLabel: dayLabel(daysSince(s.submittedAt) ?? 0),
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[32px] font-medium text-foreground">
          {greeting()}, Admin <span aria-hidden>👋</span>
        </p>
        <p className="mt-0.5 text-base text-muted-foreground">
          Here&apos;s everything happening on your resource centre.
        </p>
      </div>

      {counts.pendingSubmissions > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#242E42]/8 bg-card px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Inbox className="size-4" />
            </span>
            <p className="text-sm text-foreground">
              <span className="font-medium">
                {counts.pendingSubmissions} submission{counts.pendingSubmissions === 1 ? '' : 's'} waiting on you
              </span>
              {oldestWaitingDays !== null && (
                <span className="text-muted-foreground"> — oldest has been waiting {dayLabel(oldestWaitingDays)}</span>
              )}
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Review Queue
            <ChevronRight className="size-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Resources"
          value={counts.totalResources}
          subtitle={`${counts.publishedLast30Days} published this month`}
          delta={
            counts.publishedLast30Days > 0
              ? { text: `+${counts.publishedLast30Days}`, direction: 'up' }
              : undefined
          }
        />
        <StatCard label="Index Visits" value="—" subtitle="Not connected yet" muted />
        <StatCard
          label="Pending Review"
          value={counts.pendingSubmissions}
          subtitle={oldestWaitingDays !== null ? `Oldest waiting ${dayLabel(oldestWaitingDays)}` : 'All caught up'}
        />
        <StatCard label="Contributors" value={counts.contributors} subtitle="Unique people who've submitted" />
      </div>

      <AnalyticsChartCard />

      <OverviewTable recent={recentRows} pending={pendingRows} />
    </div>
  )
}
