'use server'

import { redirect } from 'next/navigation'
import { createAdminSession } from '@/lib/admin-auth'
import { verifyCredentials, recordLogin } from '@/lib/admin-users'

export type LoginState = { error?: string } | undefined

const GENERIC_ERROR = 'Incorrect email or password.'

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || !email || typeof password !== 'string' || !password) {
    return { error: GENERIC_ERROR }
  }

  const user = await verifyCredentials(email, password)
  if (!user) {
    return { error: GENERIC_ERROR }
  }

  const remember = formData.get('remember') === 'on'
  await createAdminSession(user.id, remember)
  await recordLogin(user.id)
  redirect('/admin')
}
