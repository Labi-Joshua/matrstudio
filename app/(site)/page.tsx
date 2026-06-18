import { Suspense } from 'react'
import { IndexHero } from '@/components/index/IndexHero'
import { ResourceGrid } from '@/components/index/ResourceGrid'
import { CategoryFilter } from '@/components/index/CategoryFilter'
import { client } from '@/sanity/lib/client'
import { filteredResourcesQuery } from '@/sanity/lib/queries'
import type { Resource } from '@/types'

export const revalidate = 60

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const category = params.category ?? ''
  const type = params.type ?? ''
  const q = params.q ?? ''

  const resources = await client.fetch<Resource[]>(filteredResourcesQuery, { category, type, q })

  const heading = q
    ? `Results for "${q}"`
    : type
    ? `${type.charAt(0).toUpperCase() + type.slice(1)}s`
    : category
    ? `${category.replace(/-/g, ' & ')} Resources`
    : 'Most Recent Resources'

  return (
    <div className="min-h-screen">
      <IndexHero />
      <section className="mx-auto max-w-7xl px-4 pt-[48px] pb-[64px] sm:px-6 lg:px-8">
        <Suspense>
          <CategoryFilter />
        </Suspense>
        <ResourceGrid resources={resources} heading={heading} />
      </section>
    </div>
  )
}
