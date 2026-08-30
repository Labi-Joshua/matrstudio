'use server'

import { redirect } from 'next/navigation'
import { verifyInviteToken, createAdminSession } from '@/lib/admin-auth'
import { activate, getById } from '@/lib/admin-users'

export type SetupState = { error?: string } | undefined

export async function completeSetup(token: string, _prevState: SetupState, formData: FormData): Promise<SetupState> {
  const parsed = verifyInviteToken(token)
  if (!parsed) {
    return { error: 'This invite link is invalid or has expired.' }
  }

  const user = await getById(parsed.userId)
  if (!user || user.status !== 'pending') {
    return { error: 'This invite has already been used.' }
  }

  const password = formData.get('password')
  if (typeof password !== 'string' || password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const name = formData.get('name')
  const trimmedName = typeof name === 'string' && name.trim() ? name.trim() : undefined

  await activate(user.id, password, trimmedName)
  await createAdminSession(user.id, false)
  redirect('/admin')
}
