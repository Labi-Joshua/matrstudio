'use server'

import { getByEmail, setPasswordResetToken } from '@/lib/admin-users'
import { createResetToken } from '@/lib/admin-auth'
import { sendPasswordResetEmail } from '@/lib/emails'

export type ForgotPasswordState = { sent: boolean } | undefined

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get('email')

  if (typeof email === 'string' && email.trim()) {
    const user = await getByEmail(email)
    if (user && user.status === 'active') {
      const { token, expiresAt } = createResetToken(user.id)
      await setPasswordResetToken(user.id, expiresAt)
      await sendPasswordResetEmail(user.email, token).catch((err) => {
        console.error('Failed to send password reset email:', err)
      })
    }
  }

  // Always the same result — never reveal whether the email exists.
  return { sent: true }
}
