'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { checkPasswordRequirements } from '@/lib/utils'
import { PasswordChecklist } from './PasswordChecklist'
import { completeReset } from '@/app/(admin)/admin/reset-password/actions'

const INPUT =
  'w-full rounded-full border border-[#242E42]/12 bg-white px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none'

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(completeReset.bind(null, token), undefined)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const requirements = checkPasswordRequirements(password)
  const metCount = requirements.filter((r) => r.met).length
  const strengthPercent = (metCount / requirements.length) * 100
  const passwordsMatch = confirm.length === 0 || password === confirm
  const canSubmit = metCount === requirements.length && confirm.length > 0 && passwordsMatch

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm text-foreground">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`${INPUT} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm" className="text-sm text-foreground">
          Re-enter new password
        </label>
        <div className="relative">
          <input
            id="confirm"
            name="confirm"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className={`${INPUT} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${strengthPercent}%` }} />
        </div>
      </div>

      <PasswordChecklist password={password} />

      {!passwordsMatch && <p className="text-sm text-destructive">Passwords do not match.</p>}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button
        type="submit"
        disabled={pending || !canSubmit}
        className="rounded-full py-3.5 text-sm font-semibold disabled:opacity-40"
      >
        {pending ? 'Changing…' : 'Change password'}
      </Button>
    </form>
  )
}
