import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

const BASE_URL = 'https://resources.matrstudio.com'

const slugsQuery = groq`*[_type == "resource" && defined(slug.current)] { "slug": slug.current, publishedAt }`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resources: { slug: string; publishedAt?: string }[] = await client.fetch(slugsQuery)

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 1 },
    { url: `${BASE_URL}/topics`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/submit`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const resourcePages: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${BASE_URL}/resources/${r.slug}`,
    lastModified: r.publishedAt ? new Date(r.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...resourcePages]
}
