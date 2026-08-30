import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_SESSION_COOKIE = 'admin_session'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function sign(expiresAt: number): string {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return createHmac('sha256', secret).update(String(expiresAt)).digest('hex')
}

function isValidSessionValue(value: string | undefined): boolean {
  if (!value) return false
  const [expiresAtStr, signature] = value.split('.')
  if (!expiresAtStr || !signature) return false

  const expiresAt = Number(expiresAtStr)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false

  const expected = Buffer.from(sign(expiresAt))
  const actual = Buffer.from(signature)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

// Used by proxy.ts, which reads cookies off the request directly rather than via next/headers.
export function verifySessionCookieValue(value: string | undefined): boolean {
  return isValidSessionValue(value)
}

export async function createAdminSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const value = `${expiresAt}.${sign(expiresAt)}`
  const store = await cookies()
  store.set(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  })
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_SESSION_COOKIE)
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies()
  return isValidSessionValue(store.get(ADMIN_SESSION_COOKIE)?.value)
}

// Call as the first line of every mutating Server Action under app/(admin) —
// proxy.ts guards page navigation, but Server Functions are reachable by direct
// POST regardless of proxy's matcher, so each action must verify independently.
export async function requireAdminSession(): Promise<void> {
  if (!(await getAdminSession())) {
    throw new Error('Unauthorized')
  }
}
