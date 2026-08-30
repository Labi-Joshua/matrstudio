import { verifyInviteToken } from '@/lib/admin-auth'
import { getById } from '@/lib/admin-users'
import { SetupForm } from '@/components/admin/SetupForm'
import { AuthPageShell } from '@/components/admin/AuthPageShell'

export const metadata = {
  title: 'Set up your account — Matr Studio Admin',
}

export default async function AdminSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const parsed = token ? verifyInviteToken(token) : null
  const user = parsed ? await getById(parsed.userId) : null
  const isValid = Boolean(user && user.status === 'pending' && token)

  return (
    <AuthPageShell>
      {isValid ? (
        <>
          <h1 className="text-[28px] font-medium leading-snug text-foreground">Set up your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;ve been invited to Matr Studio Admin as <span className="text-foreground">{user!.email}</span>.
          </p>
          <SetupForm token={token as string} />
        </>
      ) : (
        <>
          <h1 className="text-[28px] font-medium leading-snug text-foreground">This invite has already been used</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask an existing admin to send you a new invite from the Team settings page.
          </p>
        </>
      )}
    </AuthPageShell>
  )
}
