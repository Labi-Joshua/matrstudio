import { Suspense } from 'react'
import { IndexHero } from '@/components/index/IndexHero'
import { ResourceGrid } from '@/components/index/ResourceGrid'
import { CategoryFilter } from '@/components/index/CategoryFilter'
import { SearchInput } from '@/components/layout/SearchInput'
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
    <div>
      <IndexHero />

      {/* Mobile search bar — hidden on desktop where header search is visible */}
      <div className="md:hidden mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="flex items-center gap-2 rounded-full bg-[#F0F0F0] px-4 py-[8px]">
          <svg className="shrink-0 size-4 text-muted-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="8.5" cy="8.5" r="5.75" />
            <path strokeLinecap="round" d="M13 13l3.5 3.5" />
          </svg>
          <Suspense fallback={<div className="flex-1" />}>
            <SearchInput inputClassName="text-[16px]" dropdownClassName="left-0 w-full" />
          </Suspense>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-0 md:pt-[48px] pb-[64px] sm:px-6 lg:px-8">
        <Suspense>
          <CategoryFilter />
        </Suspense>
        <ResourceGrid resources={resources} heading={heading} />
      </section>
    </div>
  )
}
