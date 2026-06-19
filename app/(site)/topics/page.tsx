import { Suspense } from 'react'
import { TopicBrowser } from '@/components/topics/TopicBrowser'
import { TopicResourceHeader } from '@/components/topics/TopicResourceHeader'
import { ResourceGrid } from '@/components/index/ResourceGrid'
import { client } from '@/sanity/lib/client'
import { filteredResourcesQuery } from '@/sanity/lib/queries'
import type { Resource } from '@/types'

export const revalidate = 60

export default async function TopicsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const subtopic = params.subtopic ?? ''
  const category = params.category ?? ''
  const type = params.type ?? ''

  const resources = await client.fetch<Resource[]>(filteredResourcesQuery, { category, type, subtopic, q: '' })

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-[80px] pb-[64px] sm:px-6 lg:px-8">
        <Suspense>
          <TopicBrowser />
        </Suspense>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-[64px] sm:px-6 lg:px-8">
        <ResourceGrid
          resources={resources}
          headingNode={
            <Suspense>
              <TopicResourceHeader subtopic={subtopic} />
            </Suspense>
          }
        />
      </section>
    </div>
  )
}
