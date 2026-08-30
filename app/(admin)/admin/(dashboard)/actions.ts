'use server'

import { redirect } from 'next/navigation'
import { clearAdminSession } from '@/lib/admin-auth'

export async function logout() {
  await clearAdminSession()
  redirect('/admin/login')
}
