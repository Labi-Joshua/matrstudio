import type { SanityImageSource } from '@sanity/image-url'

export interface Resource {
  _id: string
  title: string
  slug: { current: string }
  resourceType?: 'article' | 'video' | 'book' | 'tool' | 'course' | 'template' | 'podcast'
  category: 'design-execution' | 'strategic-thinking' | 'business-growth' | 'career-craft'
  subtopic?: string[]
  author?: string
  tags?: string[]
  summary?: string
  coverImage?: SanityImageSource
  coverImageUrl?: string
  thumbnailUrl?: string
  externalUrl?: string
  publishedAt?: string
  featured?: boolean
}
