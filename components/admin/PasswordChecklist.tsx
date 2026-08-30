import { Check } from 'lucide-react'
import { checkPasswordRequirements } from '@/lib/utils'

export function PasswordChecklist({ password }: { password: string }) {
  const requirements = checkPasswordRequirements(password)

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">Your Password Must Contain</p>
      <ul className="flex flex-col gap-1">
        {requirements.map((r) => (
          <li
            key={r.key}
            className={`flex items-center gap-1.5 text-xs ${r.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
          >
            <Check className={`size-3.5 ${r.met ? 'text-emerald-500' : 'text-muted-foreground/40'}`} />
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
