import Link from 'next/link'
import Image from 'next/image'
import type { Resource } from '@/types'
import { urlFor } from '@/sanity/lib/image'

interface Props {
  resource: Resource
}

const FORMAT_TAGS = ['book', 'article', 'video', 'tool', 'course', 'template', 'podcast']

const FORMAT_COLORS: Record<string, string> = {
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
  const formatTag = resource.tags?.find((t) => FORMAT_TAGS.includes(t.toLowerCase()))

  const displayTags = [
    resource.category,
    ...(resource.tags ?? []).filter((t) => !FORMAT_TAGS.includes(t.toLowerCase())),
  ].filter(Boolean) as string[]

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
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {(formatTag || domain) && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            {formatTag && (
              <span className="flex items-center gap-1.5 rounded-[6px] bg-white px-3 py-1.5 text-[12px] font-medium text-foreground shadow-sm">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: FORMAT_COLORS[formatTag.toLowerCase()] ?? '#9CA3AF' }}
                />
                {capitalize(formatTag)}
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
        <h2 className="text-[24px] leading-snug tracking-tight text-foreground group-hover:underline underline-offset-2" style={{ fontFamily: 'Georgia, serif' }}>
          {resource.title}
        </h2>
        {resource.summary && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {resource.summary}
          </p>
        )}
        {displayTags.length > 0 && (
          <p className="mt-[6px] text-sm text-primary" style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>
            {displayTags.join(' · ')}
          </p>
        )}
      </div>
    </Link>
  )
}
