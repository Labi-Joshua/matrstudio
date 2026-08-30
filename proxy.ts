import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, verifySessionCookieValue } from '@/lib/admin-auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/admin/login'
  const hasValidSession = verifySessionCookieValue(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)

  if (!hasValidSession && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (hasValidSession && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
