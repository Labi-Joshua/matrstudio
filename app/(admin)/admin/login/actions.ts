'use server'

import { redirect } from 'next/navigation'
import { createAdminSession } from '@/lib/admin-auth'

export type LoginState = { error?: string } | undefined

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get('password')

  if (typeof password !== 'string' || !password || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Incorrect password.' }
  }

  await createAdminSession()
  redirect('/admin')
}
