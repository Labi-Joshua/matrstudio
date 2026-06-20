import { Suspense } from 'react'
import { IndexHero } from '@/components/index/IndexHero'
import { ResourceGrid } from '@/components/index/ResourceGrid'
import { ResourceCard } from '@/components/index/ResourceCard'
import { CategoryFilter } from '@/components/index/CategoryFilter'
import { TypeFilterButton } from '@/components/index/TypeFilterButton'
import { SearchInput } from '@/components/layout/SearchInput'
import { client } from '@/sanity/lib/client'
import { filteredResourcesQuery, featuredResourcesQuery } from '@/sanity/lib/queries'
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

  const isFiltered = !!(category || type || q)

  const [resources, featured] = await Promise.all([
    client.fetch<Resource[]>(filteredResourcesQuery, { category, type, subtopic: '', q }),
    isFiltered ? Promise.resolve([]) : client.fetch<Resource[]>(featuredResourcesQuery),
  ])

  const CATEGORY_LABELS: Record<string, string> = {
    'design-execution':   'Design Execution',
    'strategic-thinking': 'Strategic Thinking',
    'business-growth':    'Business & Growth',
    'career-craft':       'Career & Craft',
  }

  const heading = q
    ? `Results for "${q}"`
    : type
    ? `Showing "${type.charAt(0).toUpperCase() + type.slice(1)}" Resources.`
    : category
    ? `Showing "${CATEGORY_LABELS[category] ?? category}" Resources.`
    : 'Most Recent Resources'

  return (
    <div>
      <IndexHero />

      {/* Mobile: row 1 — search + media type */}
      <div className="md:hidden mx-auto max-w-7xl px-4 pb-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-[#F0F0F0] px-4 py-[8px]">
            <svg className="shrink-0 size-4 text-muted-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="8.5" cy="8.5" r="5.75" />
              <path strokeLinecap="round" d="M13 13l3.5 3.5" />
            </svg>
            <Suspense fallback={<div className="flex-1" />}>
              <SearchInput inputClassName="text-[16px]" dropdownClassName="left-0 w-full" />
            </Suspense>
          </div>
          <Suspense>
            <TypeFilterButton />
          </Suspense>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-0 md:pt-[48px] pb-[64px] sm:px-6 lg:px-8">
        <Suspense>
          <CategoryFilter />
        </Suspense>

        {featured.length > 0 && (
          <div className="mb-[64px]">
            <p className="mb-5 text-sm text-muted-foreground">Featured</p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((resource) => (
                <div key={resource._id} className="flex flex-col">
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          </div>
        )}

        <ResourceGrid resources={resources} heading={heading} />
      </section>
    </div>
  )
}
