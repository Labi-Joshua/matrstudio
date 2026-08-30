import { LoginForm } from '@/components/admin/LoginForm'
import { AuthPageShell } from '@/components/admin/AuthPageShell'

export const metadata = {
  title: 'Sign in — Matr Studio Admin',
}

export default function AdminLoginPage() {
  return (
    <AuthPageShell>
      <h1 className="whitespace-nowrap text-[28px] font-medium leading-snug text-foreground">Sign-in to Your Admin Account</h1>
      <LoginForm />
    </AuthPageShell>
  )
}
