'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/write-client'
import { deriveCategory } from '@/lib/taxonomy'
import { slugify } from '@/lib/utils'

interface SubmissionRecord {
  title: string
  url: string
  topic: string
  creator?: string
  rationale?: string
}

export async function approveSubmission(id: string) {
  const reviewer = await requireAdminSession()

  const submission = await writeClient.fetch<SubmissionRecord | null>(
    `*[_type == "submission" && _id == $id][0]{ title, url, topic, creator, rationale }`,
    { id }
  )
  if (!submission) return

  // Submissions don't collect a resource type today, so new resources land as
  // "article" — an admin can recategorize in Studio if that's wrong.
  const resource = await writeClient.create({
    _type: 'resource',
    title: submission.title,
    slug: { _type: 'slug', current: slugify(submission.title) },
    resourceType: 'article',
    externalUrl: submission.url,
    subtopic: [submission.topic],
    category: deriveCategory(submission.topic) ?? 'design-execution',
    author: submission.creator,
    summary: submission.rationale,
    publishedAt: new Date().toISOString(),
    featured: false,
  })

  await writeClient
    .patch(id)
    .set({
      status: 'approved',
      resolvedResourceId: resource._id,
      reviewedAt: new Date().toISOString(),
      reviewedBy: { name: reviewer.name, email: reviewer.email },
    })
    .commit()

  revalidatePath('/admin/submissions')
  revalidatePath('/admin')
  revalidatePath('/admin/resources')
}

export async function rejectSubmission(id: string) {
  const reviewer = await requireAdminSession()

  await writeClient
    .patch(id)
    .set({
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: { name: reviewer.name, email: reviewer.email },
    })
    .commit()

  revalidatePath('/admin/submissions')
  revalidatePath('/admin')
}
