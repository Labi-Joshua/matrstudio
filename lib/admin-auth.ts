import { createHmac, timingSafeEqual } from 'crypto'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { getById, type AdminUser } from './admin-users'

export const ADMIN_SESSION_COOKIE = 'admin_session'

const REMEMBER_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 // 1 day — encoded expiry when "remember me" is off;
// the cookie itself still gets no `expires`, so it clears when the browser closes.
const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days to accept an invite
const RESET_TTL_MS = 1000 * 60 * 60 // 1 hour to use a password-reset link

type TokenPurpose = 'session' | 'invite' | 'reset'

function sign(purpose: TokenPurpose, userId: string, expiresAt: number): string {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return createHmac('sha256', secret).update(`${purpose}.${userId}.${expiresAt}`).digest('hex')
}

function buildToken(purpose: TokenPurpose, userId: string, expiresAt: number): string {
  return `${userId}.${expiresAt}.${sign(purpose, userId, expiresAt)}`
}

function verifyToken(purpose: TokenPurpose, value: string | undefined): { userId: string; expiresAt: number } | null {
  if (!value) return null
  const [userId, expiresAtStr, signature] = value.split('.')
  if (!userId || !expiresAtStr || !signature) return null

  const expiresAt = Number(expiresAtStr)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null

  const expected = Buffer.from(sign(purpose, userId, expiresAt))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null

  return { userId, expiresAt }
}

// --- Session cookie ---------------------------------------------------

// Used by proxy.ts, which reads cookies off the request directly rather than via next/headers.
// Kept boolean-only and purely cryptographic (no Sanity call) — the "optimistic" check.
export function verifySessionCookieValue(value: string | undefined): boolean {
  return verifyToken('session', value) !== null
}

export async function createAdminSession(userId: string, remember: boolean): Promise<void> {
  const expiresAt = Date.now() + (remember ? REMEMBER_TTL_MS : SESSION_TTL_MS)
  const value = buildToken('session', userId, expiresAt)
  const store = await cookies()
  store.set(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // Omit `expires` when not remembering so the cookie is a browser-session
    // cookie (cleared on close); the signed value's own 1-day expiry is the
    // backstop for browsers that restore session cookies across restarts.
    ...(remember ? { expires: new Date(expiresAt) } : {}),
  })
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_SESSION_COOKIE)
}

// The "secure" check — cookie must verify AND the user must still exist. This
// is what makes removing a user actually revoke access, not just "expires
// eventually." cache()-wrapped so a render pass only hits Sanity once.
export const getAdminSession = cache(async (): Promise<AdminUser | null> => {
  const store = await cookies()
  const parsed = verifyToken('session', store.get(ADMIN_SESSION_COOKIE)?.value)
  if (!parsed) return null
  const user = await getById(parsed.userId)
  return user && user.status === 'active' ? user : null
})

// Call as the first line of every mutating Server Action under app/(admin) —
// proxy.ts guards page navigation, but Server Functions are reachable by direct
// POST regardless of proxy's matcher, so each action must verify independently.
export async function requireAdminSession(): Promise<AdminUser> {
  const user = await getAdminSession()
  if (!user) throw new Error('Unauthorized')
  return user
}

// --- Invite tokens ------------------------------------------------------

export function createInviteToken(userId: string): string {
  return buildToken('invite', userId, Date.now() + INVITE_TTL_MS)
}

export function verifyInviteToken(value: string | undefined): { userId: string } | null {
  const parsed = verifyToken('invite', value)
  return parsed ? { userId: parsed.userId } : null
}

// --- Password reset tokens -----------------------------------------------
// Single-use via lib/admin-users.ts's passwordResetExpiresAt field: the
// verified token's expiresAt must match what's currently stored on the user,
// and a successful reset clears it — so requesting a new link invalidates any
// older outstanding one, and replaying a used link fails even before expiry.

export function createResetToken(userId: string): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + RESET_TTL_MS
  return { token: buildToken('reset', userId, expiresAt), expiresAt }
}

export function verifyResetToken(value: string | undefined): { userId: string; expiresAt: number } | null {
  return verifyToken('reset', value)
}
