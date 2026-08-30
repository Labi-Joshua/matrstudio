import { writeClient } from '@/sanity/lib/write-client'
import { adminResourcesQuery } from '@/sanity/lib/queries'
import { CATEGORY_LABELS, type CategorySlug } from '@/lib/taxonomy'
import { Button } from '@/components/ui/button'
import { toggleFeatured, deleteResource } from './actions'

interface AdminResource {
  _id: string
  title: string
  resourceType?: string
  category: CategorySlug
  externalUrl?: string
  featured?: boolean
}

export default async function AdminResourcesPage() {
  const resources = await writeClient.fetch<AdminResource[]>(adminResourcesQuery)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
        Resources
      </h1>
      <p className="text-sm text-muted-foreground">
        {resources.length} total. Full editing stays in Sanity Studio — this is for quick triage.
      </p>

      <div className="flex flex-col gap-2">
        {resources.map((r) => (
          <div
            key={r._id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[#242E42]/8 bg-card px-5 py-3"
          >
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground">
                {r.resourceType ?? 'untyped'} · {CATEGORY_LABELS[r.category] ?? r.category}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <form action={toggleFeatured.bind(null, r._id, !r.featured)}>
                <Button type="submit" size="sm" variant={r.featured ? 'default' : 'outline'}>
                  {r.featured ? 'Featured' : 'Feature'}
                </Button>
              </form>
              <form action={deleteResource.bind(null, r._id)}>
                <Button type="submit" size="sm" variant="destructive">
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
