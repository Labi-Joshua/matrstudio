import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
})

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
