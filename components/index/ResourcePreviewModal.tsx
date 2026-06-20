'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import type { Resource } from '@/types'
import { urlFor } from '@/sanity/lib/image'
import { createPortal } from 'react-dom'

const TOPIC_LABELS: Record<string, string> = {
  'design-execution':   'Design Execution',
  'strategic-thinking': 'Strategic Thinking',
  'business-growth':    'Business & Growth',
  'career-craft':       'Career & Craft',
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] ?? null
}

const BLUR_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYGD4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg=='

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m?.[1] ?? null
}

function splitTitle(title: string): [string, string] {
  const words = title.split(' ')
  if (words.length <= 1) return [title, '']
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

interface Props {
  resource: Resource
  onClose: () => void
}

export function ResourcePreviewModal({ resource, onClose }: Props) {
  const url = resource.externalUrl ?? ''
  const embedUrl = resource.embedUrl ?? ''
  const ytId = url ? getYouTubeId(url) : null
  const vimeoId = url ? getVimeoId(url) : null

  const imageSrc = resource.coverImageUrl
    ?? (resource.coverImage ? urlFor(resource.coverImage).width(1200).height(720).url() : null)
    ?? resource.thumbnailUrl
    ?? null

  // YouTube thumbnail from img.youtube.com — always available, no embed needed
  const ytThumb = ytId
    ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
    : null

  const heroSrc = ytThumb ?? imageSrc

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
            <path strokeLinecap="round" d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        {/* Embed URL player — shown when editor has provided an embed link */}
        {embedUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-t-2xl bg-black">
            <iframe
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="size-full"
            />
          </div>
        )}

        {/* Vimeo embed (reliable) */}
        {!embedUrl && vimeoId && (
          <div className="aspect-video w-full overflow-hidden rounded-t-2xl bg-black">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?dnt=1`}
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          </div>
        )}

        {/* YouTube: thumbnail + play button → opens YouTube directly */}
        {!embedUrl && ytId && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-video w-full overflow-hidden rounded-t-2xl bg-black"
          >
            {ytThumb && (
              <Image
                src={ytThumb}
                alt={resource.title}
                fill
                priority
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                className="object-cover transition-opacity duration-200 group-hover:opacity-80"
                unoptimized
              />
            )}
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-black/70 shadow-lg transition-transform duration-200 group-hover:scale-110">
                <svg viewBox="0 0 100 100" fill="none" className="size-8">
                  <polygon points="35,20 80,50 35,80" fill="white" />
                </svg>
              </div>
            </div>
            {/* YouTube badge */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-black/70 px-2.5 py-1.5">
              <svg viewBox="0 0 24 24" fill="#FF0000" className="size-4">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-[11px] font-medium text-white">Watch on YouTube</span>
            </div>
          </a>
        )}

        {/* Thumbnail for non-video resources */}
        {!ytId && !vimeoId && heroSrc && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl">
            <Image src={heroSrc} alt={resource.title} fill priority placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} className="object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>
              {[TOPIC_LABELS[resource.category], resource.author].filter(Boolean).join(' · ')}
            </p>
            <h2 className="text-[22px] font-normal leading-snug text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
              {(() => {
                const [line1, line2] = splitTitle(resource.title)
                return line2 ? <>{line1}<br />{line2}</> : line1
              })()}
            </h2>
          </div>

          {resource.summary && (
            <p className="text-sm leading-relaxed text-muted-foreground">{resource.summary}</p>
          )}

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {ytId ? 'Watch on YouTube' : vimeoId ? 'Watch on Vimeo' : 'Visit Resource'}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} className="size-3.5 transition-transform duration-200 group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
