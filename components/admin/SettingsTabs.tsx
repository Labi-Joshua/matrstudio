'use client'

import { useState, useActionState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { PasswordChecklist } from './PasswordChecklist'
import { checkPasswordRequirements, initials } from '@/lib/utils'
import {
  updateProfile,
  changePassword,
  inviteAdmin,
  removeAdmin,
  type ActionState,
} from '@/app/(admin)/admin/(dashboard)/settings/actions'
import type { AdminUser } from '@/lib/admin-users'

const INPUT =
  'w-full max-w-sm rounded-full border border-[#242E42]/12 bg-white px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none'

type Tab = 'profile' | 'team'

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
        active ? 'bg-white font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function ProfileSection({ currentUser }: { currentUser: AdminUser }) {
  const [profileState, profileAction, profilePending] = useActionState<ActionState, FormData>(updateProfile, undefined)
  const [passwordState, passwordAction, passwordPending] = useActionState<ActionState, FormData>(changePassword, undefined)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const passwordsMatch = confirm.length === 0 || password === confirm
  const canSubmitPassword = checkPasswordRequirements(password).every((r) => r.met) && confirm.length > 0 && passwordsMatch

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-[#242E42]/8 bg-card p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-base font-medium text-white">
            {initials(currentUser.name ?? currentUser.email)}
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">{currentUser.name ?? currentUser.email}</p>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>

        <form action={profileAction} className="mt-6 flex flex-col gap-3">
          <label htmlFor="name" className="text-sm text-foreground">
            Name
          </label>
          <input id="name" name="name" defaultValue={currentUser.name ?? ''} className={INPUT} />
          {profileState?.error && <p className="text-sm text-destructive">{profileState.error}</p>}
          {profileState?.success && <p className="text-sm text-emerald-600">{profileState.success}</p>}
          <Button type="submit" disabled={profilePending} className="w-fit rounded-full px-6">
            {profilePending ? 'Saving…' : 'Save'}
          </Button>
        </form>
      </div>

      <div className="rounded-2xl border border-[#242E42]/8 bg-card p-6">
        <p className="text-sm font-medium text-foreground">Change password</p>
        <form action={passwordAction} className="mt-4 flex max-w-sm flex-col gap-3">
          <input
            type="password"
            name="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={INPUT}
          />
          <input
            type="password"
            name="confirm"
            placeholder="Re-enter new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={INPUT}
          />
          <PasswordChecklist password={password} />
          {!passwordsMatch && <p className="text-sm text-destructive">Passwords do not match.</p>}
          {passwordState?.error && <p className="text-sm text-destructive">{passwordState.error}</p>}
          {passwordState?.success && <p className="text-sm text-emerald-600">{passwordState.success}</p>}
          <Button type="submit" disabled={passwordPending || !canSubmitPassword} className="w-fit rounded-full px-6 disabled:opacity-40">
            {passwordPending ? 'Changing…' : 'Change password'}
          </Button>
        </form>
      </div>
    </div>
  )
}

function TeamSection({ currentUser, users }: { currentUser: AdminUser; users: AdminUser[] }) {
  const [inviteState, inviteAction, invitePending] = useActionState<ActionState, FormData>(inviteAdmin, undefined)

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[#242E42]/8 bg-card p-6">
        <p className="text-sm font-medium text-foreground">Invite a teammate</p>
        <form action={inviteAction} className="mt-3 flex flex-wrap items-center gap-3">
          <input type="email" name="email" placeholder="name@matrstudio.com" required className={INPUT} />
          <Button type="submit" disabled={invitePending} className="rounded-full px-6">
            {invitePending ? 'Sending…' : 'Send invite'}
          </Button>
        </form>
        {inviteState?.error && <p className="mt-2 text-sm text-destructive">{inviteState.error}</p>}
        {inviteState?.success && <p className="mt-2 text-sm text-emerald-600">{inviteState.success}</p>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#242E42]/8 bg-card">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between gap-4 border-b border-[#242E42]/8 px-6 py-4 last:border-0">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                {initials(u.name ?? u.email)}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{u.name ?? u.email}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={[
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {u.status === 'active' ? 'Active' : 'Pending'}
              </span>
              {u.id !== currentUser.id && (
                <form action={removeAdmin.bind(null, u.id)}>
                  <Button type="submit" size="sm" variant="destructive">
                    Remove
                  </Button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SettingsTabs({ currentUser, users }: { currentUser: AdminUser; users: AdminUser[] }) {
  const [tab, setTab] = useState<Tab>('profile')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-fit items-center gap-1 rounded-full border border-[#242E42]/8 bg-[#EEEFF1] p-1">
        <TabButton active={tab === 'profile'} onClick={() => setTab('profile')}>
          Profile
        </TabButton>
        <TabButton active={tab === 'team'} onClick={() => setTab('team')}>
          Team
        </TabButton>
      </div>

      {tab === 'profile' ? (
        <ProfileSection currentUser={currentUser} />
      ) : (
        <TeamSection currentUser={currentUser} users={users} />
      )}
    </div>
  )
}
