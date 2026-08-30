'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { completeSetup } from '@/app/(admin)/admin/setup/actions'

const INPUT =
  'w-full rounded-full border border-[#242E42]/12 bg-white px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none'

export function SetupForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(completeSetup.bind(null, token), undefined)

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm text-foreground">
          Password <span className="text-primary">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={INPUT}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm text-foreground">
          Name
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">Optional — add it later in Settings if you skip it</span>
        </label>
        <input id="name" name="name" type="text" autoComplete="name" className={INPUT} />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="rounded-full py-3.5 text-sm font-semibold">
        {pending ? 'Setting up…' : 'Complete setup'}
      </Button>
    </form>
  )
}
