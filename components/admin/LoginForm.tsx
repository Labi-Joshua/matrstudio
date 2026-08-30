'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { login } from '@/app/(admin)/admin/login/actions'

const INPUT = 'w-full rounded-[6px] border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none'

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          className={INPUT}
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="rounded-full">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
