import { groq } from 'next-sanity'

const resourceFields = groq`
  _id,
  title,
  slug,
  resourceType,
  category,
  subtopic,
  author,
  tags,
  summary,
  coverImage,
  thumbnailUrl,
  externalUrl,
  publishedAt,
  featured,
`

export const allResourcesQuery = groq`
  *[_type == "resource"] | order(publishedAt desc) {
    ${resourceFields}
  }
`

export const resourcesByCategoryQuery = groq`
  *[_type == "resource" && category == $category] | order(publishedAt desc) {
    ${resourceFields}
  }
`

export const searchResourcesQuery = groq`
  *[_type == "resource" && (
    title match $q + "*" ||
    summary match $q + "*" ||
    $q in tags
  )] | order(publishedAt desc) {
    ${resourceFields}
  }
`

export const resourceBySlugQuery = groq`
  *[_type == "resource" && slug.current == $slug][0] {
    ${resourceFields}
    body,
  }
`

export const featuredResourcesQuery = groq`
  *[_type == "resource" && featured == true] | order(publishedAt desc)[0...6] {
    ${resourceFields}
  }
`

export const filteredResourcesQuery = groq`
  *[_type == "resource"
    && ($category == "" || category == $category)
    && ($type == "" || resourceType == $type)
    && ($subtopic == "" || $subtopic in subtopic)
    && ($q == "" || title match $q + "*" || summary match $q + "*" || $q in tags)
  ] | order(publishedAt desc) {
    ${resourceFields}
  }
`

export const filteredResourcesQueryMulti = groq`
  *[_type == "resource"
    && ($category == "" || category == $category)
    && ($type == "" || resourceType == $type)
    && (count($subtopics) == 0 || count(subtopic[@ in $subtopics]) > 0)
    && ($q == "" || title match $q + "*" || summary match $q + "*" || $q in tags)
  ] | order(publishedAt desc) {
    ${resourceFields}
  }
`
