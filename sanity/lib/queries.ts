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
  "publishedAt": coalesce(publishedAt, _createdAt),
  featured,
`

export const allResourcesQuery = groq`
  *[_type == "resource"] | order(coalesce(publishedAt, _createdAt) desc) {
    ${resourceFields}
  }
`

export const resourcesByCategoryQuery = groq`
  *[_type == "resource" && category == $category] | order(coalesce(publishedAt, _createdAt) desc) {
    ${resourceFields}
  }
`

export const searchResourcesQuery = groq`
  *[_type == "resource" && (
    title match $q + "*" ||
    summary match $q + "*" ||
    $q in tags
  )] | order(coalesce(publishedAt, _createdAt) desc) {
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
  *[_type == "resource" && featured == true] | order(coalesce(publishedAt, _createdAt) desc)[0...6] {
    ${resourceFields}
  }
`

export const filteredResourcesQuery = groq`
  *[_type == "resource"
    && ($category == "" || category == $category)
    && ($type == "" || resourceType == $type)
    && ($subtopic == "" || $subtopic in subtopic)
    && ($q == "" || title match $q + "*" || summary match $q + "*" || $q in tags)
  ] | order(coalesce(publishedAt, _createdAt) desc) {
    ${resourceFields}
  }
`

export const filteredResourcesQueryMulti = groq`
  *[_type == "resource"
    && ($category == "" || category == $category)
    && ($type == "" || resourceType == $type)
    && (count($subtopics) == 0 || count(subtopic[@ in $subtopics]) > 0)
    && ($q == "" || title match $q + "*" || summary match $q + "*" || $q in tags)
  ] | order(coalesce(publishedAt, _createdAt) desc) {
    ${resourceFields}
  }
`

// Admin dashboard queries

const submissionFields = groq`
  _id,
  title,
  url,
  topic,
  creator,
  rationale,
  submitterEmail,
  status,
  submittedAt,
  resolvedResourceId,
  reviewedAt,
`

export const pendingSubmissionsQuery = groq`
  *[_type == "submission" && status == "pending"] | order(submittedAt desc) {
    ${submissionFields}
  }
`

export const allSubmissionsQuery = groq`
  *[_type == "submission"] | order(submittedAt desc) {
    ${submissionFields}
  }
`

export const adminResourcesQuery = groq`
  *[_type == "resource"] | order(coalesce(publishedAt, _createdAt) desc) {
    ${resourceFields}
  }
`

export const pendingSubmissionsCountQuery = groq`count(*[_type == "submission" && status == "pending"])`

export const dashboardCountsQuery = groq`{
  "pendingSubmissions": count(*[_type == "submission" && status == "pending"]),
  "oldestPendingSubmittedAt": *[_type == "submission" && status == "pending"] | order(submittedAt asc) [0] .submittedAt,
  "totalResources": count(*[_type == "resource"]),
  "publishedLast30Days": count(*[_type == "resource" && dateTime(coalesce(publishedAt, _createdAt)) > dateTime(now()) - 60*60*24*30]),
  "contributors": count(array::unique(*[_type == "submission"].submitterEmail)),
  "byCategory": {
    "design-execution": count(*[_type == "resource" && category == "design-execution"]),
    "strategic-thinking": count(*[_type == "resource" && category == "strategic-thinking"]),
    "business-growth": count(*[_type == "resource" && category == "business-growth"]),
    "career-craft": count(*[_type == "resource" && category == "career-craft"]),
  }
}`

export const recentResourcesQuery = groq`
  *[_type == "resource"] | order(coalesce(publishedAt, _createdAt) desc) [0...8] {
    ${resourceFields}
  }
`
