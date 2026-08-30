import { Mail } from 'lucide-react'
import { ForgotPasswordForm } from '@/components/admin/ForgotPasswordForm'
import { AuthPageShell } from '@/components/admin/AuthPageShell'

export const metadata = {
  title: 'Reset password — Matr Studio Admin',
}

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Mail className="size-5" />
      </span>
      <h1 className="whitespace-nowrap text-[28px] font-medium leading-snug text-foreground">Reset Password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the email associated with your account and we&apos;ll send you a secure link to reset your password.
      </p>
      <ForgotPasswordForm />
    </AuthPageShell>
  )
}
