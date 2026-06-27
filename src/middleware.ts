import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('session')
  const sessionToken = sessionCookie?.value

  let isSessionValid = false

  if (sessionToken) {
    const payloadStr = await verifySession(sessionToken)
    if (payloadStr) {
      try {
        const payload = JSON.parse(payloadStr)
        if (payload.expiresAt && Date.now() < payload.expiresAt) {
          isSessionValid = true
        }
      } catch (e) {
        // Invalid JSON or format
      }
    }
  }

  // 1. User attempts to access admin panel without a valid session -> Redirect to login
  if (pathname.startsWith('/admin') && !isSessionValid) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 2. User is already logged in and attempts to access the login page -> Redirect to admin panel
  if (pathname === '/login' && isSessionValid) {
    const adminUrl = new URL('/admin/pemasukan', request.url)
    return NextResponse.redirect(adminUrl)
  }

  return NextResponse.next()
}

// Only execute middleware on admin routes and login page
export const config = {
  matcher: [
    '/admin/:path*',
    '/login'
  ]
}
