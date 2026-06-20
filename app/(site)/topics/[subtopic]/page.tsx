import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { filteredResourcesQueryMulti } from '@/sanity/lib/queries'
import { ResourceGrid } from '@/components/index/ResourceGrid'
import { TopicBrowser } from '@/components/topics/TopicBrowser'
import { TopicResourceHeader } from '@/components/topics/TopicResourceHeader'
import type { Resource } from '@/types'

const BASE_URL = 'https://resources.matrstudio.com'

const RESOURCE_SCHEMA_TYPE: Record<string, string> = {
  article:  'Article',
  video:    'VideoObject',
  book:     'Book',
  tool:     'SoftwareApplication',
  course:   'Course',
  template: 'CreativeWork',
  podcast:  'PodcastEpisode',
}

const SUBTOPICS = [
  { value: 'design-systems',          label: 'Design Systems',          category: 'design-execution',   categoryLabel: 'Design Execution' },
  { value: 'design-handoff',          label: 'Design Handoff',          category: 'design-execution',   categoryLabel: 'Design Execution' },
  { value: 'prototyping',             label: 'Prototyping',             category: 'design-execution',   categoryLabel: 'Design Execution' },
  { value: 'documentation',           label: 'Documentation',           category: 'design-execution',   categoryLabel: 'Design Execution' },
  { value: 'visual-architecture',     label: 'Visual Architecture',     category: 'design-execution',   categoryLabel: 'Design Execution' },
  { value: 'design-rationale',        label: 'Design Rationale',        category: 'strategic-thinking', categoryLabel: 'Strategic Thinking' },
  { value: 'stakeholder-management',  label: 'Stakeholder Management',  category: 'strategic-thinking', categoryLabel: 'Strategic Thinking' },
  { value: 'product-thinking',        label: 'Product Thinking',        category: 'strategic-thinking', categoryLabel: 'Strategic Thinking' },
  { value: 'user-research',           label: 'User Research',           category: 'strategic-thinking', categoryLabel: 'Strategic Thinking' },
  { value: 'design-ethics',           label: 'Design Ethics',           category: 'strategic-thinking', categoryLabel: 'Strategic Thinking' },
  { value: 'product-analytics',       label: 'Product Analytics',       category: 'business-growth',    categoryLabel: 'Business & Growth' },
  { value: 'conversion-optimization', label: 'Conversion Optimization', category: 'business-growth',    categoryLabel: 'Business & Growth' },
  { value: 'seo-optimization',        label: 'SEO Optimization',        category: 'business-growth',    categoryLabel: 'Business & Growth' },
  { value: 'growth-design',           label: 'Growth Design',           category: 'business-growth',    categoryLabel: 'Business & Growth' },
  { value: 'marketing-strategy',      label: 'Marketing & Strategy',    category: 'business-growth',    categoryLabel: 'Business & Growth' },
  { value: 'career-strategy',         label: 'Career Strategy',         category: 'career-craft',       categoryLabel: 'Career & Craft' },
  { value: 'portfolio-case-studies',  label: 'Portfolio & Case Studies',category: 'career-craft',       categoryLabel: 'Career & Craft' },
  { value: 'ai-assisted-workflow',    label: 'AI-Assisted Workflow',    category: 'career-craft',       categoryLabel: 'Career & Craft' },
  { value: 'accessibility',           label: 'Accessibility',           category: 'career-craft',       categoryLabel: 'Career & Craft' },
  { value: 'workflow-optimization',   label: 'Workflow Optimization',   category: 'career-craft',       categoryLabel: 'Career & Craft' },
]

export const revalidate = 60

export function generateStaticParams() {
  return SUBTOPICS.map(({ value }) => ({ subtopic: value }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ subtopic: string }> }
): Promise<Metadata> {
  const { subtopic } = await params
  const found = SUBTOPICS.find((s) => s.value === subtopic)
  if (!found) return {}
  return {
    title: `${found.label} Resources`,
    description: `Curated ${found.label.toLowerCase()} resources for UX and product designers — handpicked articles, tools, books, and videos from Matr Studio.`,
    alternates: { canonical: `/topics/${subtopic}` },
    openGraph: {
      title: `${found.label} Resources — Matr Studio`,
      description: `Curated ${found.label.toLowerCase()} resources for designers who care about the craft.`,
    },
  }
}

export default async function SubtopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ subtopic: string }>
  searchParams: Promise<Record<string, string>>
}) {
  const { subtopic } = await params
  const found = SUBTOPICS.find((s) => s.value === subtopic)
  if (!found) notFound()

  const { type = '', q = '' } = await searchParams

  const resources = await client.fetch<Resource[]>(filteredResourcesQueryMulti, {
    category: '',
    type,
    subtopics: [subtopic],
    q,
  })

  const related = SUBTOPICS.filter(
    (s) => s.category === found.category && s.value !== subtopic
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${BASE_URL}/topics/${subtopic}`,
        name: `${found.label} Resources`,
        description: `Curated ${found.label.toLowerCase()} resources for UX and product designers.`,
        url: `${BASE_URL}/topics/${subtopic}`,
        isPartOf: { '@id': `${BASE_URL}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',   item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Topics', item: `${BASE_URL}/topics` },
          { '@type': 'ListItem', position: 3, name: found.label, item: `${BASE_URL}/topics/${subtopic}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `${found.label} Resources`,
        itemListElement: resources.map((r, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': r.resourceType ? (RESOURCE_SCHEMA_TYPE[r.resourceType] ?? 'CreativeWork') : 'CreativeWork',
            name: r.title,
            description: r.summary,
            ...(r.externalUrl ? { url: r.externalUrl } : {}),
            ...(r.author ? { author: { '@type': 'Person', name: r.author } } : {}),
          },
        })),
      },
    ],
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-[32px] md:pt-[80px] pb-[64px] sm:px-6 lg:px-8">
        <nav className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/topics" className="hover:text-foreground transition-colors">Topics</Link>
          <span>/</span>
          <span className="text-foreground">{found.label}</span>
        </nav>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
          {found.categoryLabel}
        </p>
        <h1
          className="font-display text-[40px] md:text-[56px] leading-[1.1] tracking-[-1.5px] text-foreground"
        >
          {found.label}<span className="text-primary">.</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Curated {found.label.toLowerCase()} resources for designers — handpicked articles, tools, books, and videos.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-[64px] sm:px-6 lg:px-8">
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

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-[80px] sm:px-6 lg:px-8 border-t border-border pt-[48px]">
          <p className="mb-4 text-sm text-muted-foreground">
            More in {found.categoryLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.value}
                href={`/topics/${r.value}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {r.label}
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/topics"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Browse all topics →
            </Link>
          </div>
        </section>
      )}
    </div>
    </>
  )
}
