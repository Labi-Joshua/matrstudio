import { LoginForm } from '@/components/admin/LoginForm'

export const metadata = {
  title: 'Sign in — Matr Studio Admin',
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[26px] leading-snug text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
          Admin
        </p>
        <p className="text-sm text-muted-foreground">Sign in to manage the index.</p>
      </div>
      <LoginForm />
    </main>
  )
}
