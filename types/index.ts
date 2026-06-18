import type { SanityImageSource } from '@sanity/image-url'

export interface Resource {
  _id: string
  title: string
  slug: { current: string }
  resourceType?: 'article' | 'video' | 'book' | 'tool' | 'course' | 'template' | 'podcast'
  category: 'craft' | 'brand-strategy' | 'operations-ai' | 'motion-interaction' | 'growth-marketing' | 'editorial-curation'
  author?: string
  tags?: string[]
  summary?: string
  coverImage?: SanityImageSource
  coverImageUrl?: string
  externalUrl?: string
  publishedAt?: string
  featured?: boolean
}
