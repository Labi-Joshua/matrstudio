'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession, createInviteToken } from '@/lib/admin-auth'
import * as adminUsers from '@/lib/admin-users'
import { sendInviteEmail } from '@/lib/emails'
import { passwordMeetsRequirements } from '@/lib/utils'

export type ActionState = { error?: string; success?: string } | undefined

export async function inviteAdmin(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const currentUser = await requireAdminSession()

  const email = formData.get('email')
  if (typeof email !== 'string' || !email.trim()) {
    return { error: 'Email is required.' }
  }

  const existing = await adminUsers.getByEmail(email)
  if (existing) {
    return { error: 'That email is already invited or already has an account.' }
  }

  const newUser = await adminUsers.create(email, { name: currentUser.name, email: currentUser.email })
  const token = createInviteToken(newUser.id)
  await sendInviteEmail(newUser.email, token).catch((err) => {
    console.error('Failed to send invite email:', err)
  })

  revalidatePath('/admin/settings')
  return { success: `Invite sent to ${newUser.email}.` }
}

export async function removeAdmin(id: string) {
  const currentUser = await requireAdminSession()
  if (currentUser.id === id) {
    throw new Error("You can't remove your own account.")
  }
  await adminUsers.remove(id)
  revalidatePath('/admin/settings')
}

export async function updateProfile(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const currentUser = await requireAdminSession()

  const name = formData.get('name')
  if (typeof name !== 'string' || !name.trim()) {
    return { error: 'Name is required.' }
  }

  await adminUsers.setName(currentUser.id, name.trim())
  revalidatePath('/admin/settings')
  return { success: 'Profile updated.' }
}

export async function changePassword(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const currentUser = await requireAdminSession()

  const password = formData.get('password')
  const confirm = formData.get('confirm')
  if (typeof password !== 'string' || typeof confirm !== 'string') {
    return { error: 'Both fields are required.' }
  }
  if (password !== confirm) {
    return { error: 'Passwords do not match.' }
  }
  if (!passwordMeetsRequirements(password)) {
    return { error: 'Password does not meet all requirements.' }
  }

  await adminUsers.setPassword(currentUser.id, password)
  return { success: 'Password changed.' }
}
