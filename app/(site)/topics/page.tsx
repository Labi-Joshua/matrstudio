import { Suspense } from 'react'
import type { Metadata } from 'next'
import { TopicBrowser } from '@/components/topics/TopicBrowser'
import { TopicResourceHeader } from '@/components/topics/TopicResourceHeader'
import { ResourceGrid } from '@/components/index/ResourceGrid'
import { client } from '@/sanity/lib/client'
import { filteredResourcesQueryMulti } from '@/sanity/lib/queries'
import type { Resource } from '@/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Browse Design Resources by Topic',
  description: 'Explore curated design resources organized by topic — design systems, UX research, product thinking, career strategy, and more.',
  alternates: { canonical: '/topics' },
}

const topicsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Browse Design Resources by Topic',
  description: 'Explore curated design resources organized by topic — design systems, UX research, product thinking, career strategy, and more.',
  url: 'https://resources.matrstudio.com/topics',
  isPartOf: { '@id': 'https://resources.matrstudio.com/#website' },
}

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
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(topicsJsonLd) }}
    />
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-[32px] md:pt-[80px] pb-[64px] sm:px-6 lg:px-8">
        <h1 className="sr-only">Browse Design Resources by Topic</h1>
        <Suspense>
          <TopicBrowser />
        </Suspense>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-[64px] sm:px-6 lg:px-8">
        <div className="mb-5">
          <Suspense>
            <TopicResourceHeader />
          </Suspense>
        </div>
        <ResourceGrid resources={resources} headingNode={<></>} />
      </section>
    </div>
    </>
  )
}
