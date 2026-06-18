import Link from 'next/link'
import Image from 'next/image'
import type { Resource } from '@/types'
import { urlFor } from '@/sanity/lib/image'

interface Props {
  resource: Resource
}

const TOPIC_LABELS: Record<string, string> = {
  'craft':               'Craft & Fundamentals',
  'brand-strategy':      'Brand & Strategy',
  'operations-ai':       'Operations & AI',
  'motion-interaction':  'Motion & Interaction',
  'growth-marketing':    'Growth Marketing',
  'editorial-curation':  'Editorial & Curation',
}

const TYPE_COLORS: Record<string, string> = {
  article:  '#4A7AB8',
  video:    '#DC5405',
  book:     '#B07840',
  tool:     '#7C2828',
  course:   '#9CA3AF',
  template: '#9CA3AF',
  podcast:  '#9CA3AF',
}

function getDomain(url?: string): string | null {
  if (!url) return null
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return null }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function ResourceCard({ resource }: Props) {
  const href = resource.externalUrl ?? `/resources/${resource.slug.current}`
  const domain = getDomain(resource.externalUrl)
  const resourceType = resource.resourceType

  const topicLabel = TOPIC_LABELS[resource.category] ?? resource.category
  const displayMeta = [topicLabel, resource.author].filter(Boolean).join(' · ')

  const imageSrc = resource.coverImageUrl
    ?? (resource.coverImage ? urlFor(resource.coverImage).width(640).height(480).url() : null)

  return (
    <Link
      href={href}
      target={resource.externalUrl ? '_blank' : undefined}
      rel={resource.externalUrl ? 'noopener noreferrer' : undefined}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[345/200] w-full overflow-hidden rounded-[12px] bg-muted">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={resource.title}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {(resourceType || domain) && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            {resourceType && (
              <span className="flex items-center gap-1.5 rounded-[6px] bg-white px-3 py-1.5 text-[12px] font-medium text-foreground shadow-sm">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: TYPE_COLORS[resourceType] ?? '#9CA3AF' }}
                />
                {capitalize(resourceType)}
              </span>
            )}
            {domain && (
              <span className="rounded-[6px] bg-white px-3 py-1.5 text-[12px] font-medium text-foreground shadow-sm">
                {domain}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-[24px] leading-snug tracking-tight text-foreground transition-colors group-hover:text-foreground/75" style={{ fontFamily: 'Georgia, serif' }}>
          {resource.title}
        </h2>
        {resource.summary && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {resource.summary}
          </p>
        )}
        {displayMeta && (
          <p className="mt-[6px] text-sm text-primary" style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>
            {displayMeta}
          </p>
        )}
      </div>
    </Link>
  )
}
