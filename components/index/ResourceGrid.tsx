import type { Resource } from '@/types'
import { ResourceCard } from './ResourceCard'

interface Props {
  resources: Resource[]
  heading?: string
  headingNode?: React.ReactNode
  priorityCount?: number
}

function Grid({ resources, mobileLimit, priorityCount = 0 }: { resources: Resource[]; mobileLimit?: number; priorityCount?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource, i) => (
        <div
          key={resource._id}
          className={mobileLimit !== undefined && i >= mobileLimit ? 'hidden sm:flex sm:flex-col' : 'flex flex-col'}
        >
          <ResourceCard resource={resource} priority={i < priorityCount} />
        </div>
      ))}
    </div>
  )
}

export function ResourceGrid({ resources, heading = 'Most Recent Resources', headingNode, priorityCount = 3 }: Props) {
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
        <div className="mb-5">{headingNode ?? <p className="text-sm text-muted-foreground capitalize">{heading}</p>}</div>
        <Grid resources={recent} mobileLimit={3} priorityCount={priorityCount} />
      </section>

      {older.length > 0 && (
        <section>
          <p className="mb-5 text-sm text-muted-foreground capitalize">More Resources</p>
          <Grid resources={older} />
        </section>
      )}
    </div>
  )
}
