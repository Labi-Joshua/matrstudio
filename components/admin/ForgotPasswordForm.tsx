'use client'

import { useActionState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { requestPasswordReset } from '@/app/(admin)/admin/forgot-password/actions'

const INPUT =
  'w-full rounded-full border border-[#242E42]/12 bg-white px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined)
  const sent = state?.sent ?? false

  return (
    <div className="mt-8">
      <form action={action} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-foreground">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="designer@radianos.com"
            required
            disabled={sent}
            className={INPUT}
          />
        </div>

        <Button
          type="submit"
          disabled={pending || sent}
          className="rounded-full py-3.5 text-sm font-semibold disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Send Link'}
        </Button>
      </form>

      {sent && (
        <div
          role="status"
          className="mt-4 flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm text-white"
        >
          <CheckCircle2 className="size-4 text-emerald-400" />
          Reset mail has been sent
        </div>
      )}
    </div>
  )
}
