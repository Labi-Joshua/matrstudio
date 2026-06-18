import type { Resource } from '@/types'
import { ResourceCard } from './ResourceCard'

interface Props {
  resources: Resource[]
}

function Grid({ resources }: { resources: Resource[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard key={resource._id} resource={resource} />
      ))}
    </div>
  )
}

export function ResourceGrid({ resources }: Props) {
  if (resources.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">No resources found.</p>
      </div>
    )
  }

  const recent = resources.slice(0, 6)
  const older = resources.slice(6)

  return (
    <div className="flex flex-col gap-[64px]">
      <section>
        <p className="mb-5 text-sm text-muted-foreground">Most Recent Resources</p>
        <Grid resources={recent} />
      </section>

      {older.length > 0 && (
        <section>
          <p className="mb-5 text-sm text-muted-foreground">Older Resources</p>
          <Grid resources={older} />
        </section>
      )}
    </div>
  )
}
