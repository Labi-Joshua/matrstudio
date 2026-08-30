import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, verifySessionCookieValue } from '@/lib/admin-auth'

const PUBLIC_AUTH_PATHS = new Set([
  '/admin/login',
  '/admin/setup',
  '/admin/forgot-password',
  '/admin/reset-password',
])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicAuthPage = PUBLIC_AUTH_PATHS.has(pathname)
  const hasValidSession = verifySessionCookieValue(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)

  if (!hasValidSession && !isPublicAuthPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (hasValidSession && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
