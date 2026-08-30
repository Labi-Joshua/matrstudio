import { KeyRound } from 'lucide-react'
import Link from 'next/link'
import { verifyResetToken } from '@/lib/admin-auth'
import { isPasswordResetTokenValid } from '@/lib/admin-users'
import { ResetPasswordForm } from '@/components/admin/ResetPasswordForm'
import { AuthPageShell } from '@/components/admin/AuthPageShell'

export const metadata = {
  title: 'Create a new password — Matr Studio Admin',
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const parsed = token ? verifyResetToken(token) : null
  const stillValid = parsed ? await isPasswordResetTokenValid(parsed.userId, parsed.expiresAt) : false

  return (
    <AuthPageShell>
      {stillValid && token ? (
        <>
          <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="size-5" />
          </span>
          <h1 className="whitespace-nowrap text-[28px] font-medium leading-snug text-foreground">Create a New Password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter a new password to change your password.</p>
          <ResetPasswordForm token={token} />
        </>
      ) : (
        <>
          <h1 className="text-[28px] font-medium leading-snug text-foreground">This link has expired</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reset links are only valid for an hour and can only be used once.
          </p>
          <Link
            href="/admin/forgot-password"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Request a new link
          </Link>
        </>
      )}
    </AuthPageShell>
  )
}
