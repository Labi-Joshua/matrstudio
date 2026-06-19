import { Suspense } from 'react'
import { TopicBrowser } from '@/components/topics/TopicBrowser'
import { TopicResourceHeader } from '@/components/topics/TopicResourceHeader'
import { ResourceGrid } from '@/components/index/ResourceGrid'
import { client } from '@/sanity/lib/client'
import { filteredResourcesQueryMulti } from '@/sanity/lib/queries'
import type { Resource } from '@/types'

export const revalidate = 60

export default async function TopicsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const subtopicParam = params.subtopic ?? ''
  const subtopics = subtopicParam ? subtopicParam.split(',') : []
  const category = params.category ?? ''
  const type = params.type ?? ''

  const resources = await client.fetch<Resource[]>(filteredResourcesQueryMulti, { category, type, subtopics, q: '' })

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-[32px] md:pt-[80px] pb-[64px] sm:px-6 lg:px-8">
        <Suspense>
          <TopicBrowser />
        </Suspense>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-[64px] sm:px-6 lg:px-8">
        <ResourceGrid
          resources={resources}
          headingNode={
            <Suspense>
              <TopicResourceHeader />
            </Suspense>
          }
        />
      </section>
    </div>
  )
}
