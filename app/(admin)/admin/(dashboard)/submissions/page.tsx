import { writeClient } from '@/sanity/lib/write-client'
import { pendingSubmissionsQuery } from '@/sanity/lib/queries'
import { Button } from '@/components/ui/button'
import { approveSubmission, rejectSubmission } from './actions'

interface Submission {
  _id: string
  title: string
  url: string
  topic: string
  creator?: string
  rationale?: string
  submitterEmail: string
  submittedAt?: string
}

export default async function AdminSubmissionsPage() {
  const submissions = await writeClient.fetch<Submission[]>(pendingSubmissionsQuery)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
        Submissions
      </h1>

      {submissions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending submissions.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {submissions.map((s) => (
            <div key={s._id} className="flex items-start justify-between gap-4 rounded-2xl border border-[#242E42]/8 bg-card p-5">
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium text-foreground">{s.title}</p>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                  {s.url}
                </a>
                <p className="text-sm text-muted-foreground">Topic: {s.topic}</p>
                {s.creator && <p className="text-sm text-muted-foreground">Creator: {s.creator}</p>}
                {s.rationale && <p className="text-sm text-muted-foreground">&ldquo;{s.rationale}&rdquo;</p>}
                <p className="text-xs text-muted-foreground">Submitted by {s.submitterEmail}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <form action={approveSubmission.bind(null, s._id)}>
                  <Button type="submit" size="sm">Approve</Button>
                </form>
                <form action={rejectSubmission.bind(null, s._id)}>
                  <Button type="submit" size="sm" variant="destructive">Reject</Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
