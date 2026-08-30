'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/write-client'

export async function toggleFeatured(id: string, next: boolean) {
  await requireAdminSession()
  await writeClient.patch(id).set({ featured: next }).commit()
  revalidatePath('/admin/resources')
}

export async function deleteResource(id: string) {
  await requireAdminSession()
  await writeClient.delete(id)
  revalidatePath('/admin/resources')
  revalidatePath('/admin')
}
