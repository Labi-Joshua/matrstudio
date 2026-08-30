'use server'

import { redirect } from 'next/navigation'
import { verifyResetToken, createAdminSession } from '@/lib/admin-auth'
import { isPasswordResetTokenValid, clearPasswordResetToken, setPassword, getById } from '@/lib/admin-users'
import { passwordMeetsRequirements } from '@/lib/utils'

export type ResetPasswordState = { error?: string } | undefined

export async function completeReset(
  token: string,
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = verifyResetToken(token)
  if (!parsed) {
    return { error: 'This reset link is invalid or has expired.' }
  }

  const stillValid = await isPasswordResetTokenValid(parsed.userId, parsed.expiresAt)
  if (!stillValid) {
    return { error: 'This reset link has already been used.' }
  }

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

  const user = await getById(parsed.userId)
  if (!user) {
    return { error: 'Account not found.' }
  }

  await setPassword(user.id, password)
  await clearPasswordResetToken(user.id)
  await createAdminSession(user.id, false)
  redirect('/admin')
}
