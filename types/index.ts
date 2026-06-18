import type { SanityImageSource } from '@sanity/image-url'

export interface Resource {
  _id: string
  title: string
  slug: { current: string }
  category: 'brand' | 'design' | 'motion' | 'strategy' | 'operations' | 'editorial'
  tags?: string[]
  summary?: string
  coverImage?: SanityImageSource
  coverImageUrl?: string
  externalUrl?: string
  publishedAt?: string
  featured?: boolean
}
