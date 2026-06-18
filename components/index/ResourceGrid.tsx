import type { Resource } from '@/types'
import { ResourceCard } from './ResourceCard'

interface Props {
  resources: Resource[]
  heading?: string
}

function Grid({ resources, mobileLimit }: { resources: Resource[]; mobileLimit?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource, i) => (
        <div
          key={resource._id}
          className={mobileLimit !== undefined && i >= mobileLimit ? 'hidden sm:block' : undefined}
        >
          <ResourceCard resource={resource} />
        </div>
      ))}
    </div>
  )
}

export function ResourceGrid({ resources, heading = 'Most Recent Resources' }: Props) {
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
        <p className="mb-5 text-sm text-muted-foreground">{heading}</p>
        <Grid resources={recent} mobileLimit={3} />
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
