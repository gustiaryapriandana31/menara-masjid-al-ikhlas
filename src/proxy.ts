import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('session')
  const sessionToken = sessionCookie?.value

  let isSessionValid = false

  if (sessionToken) {
    try {
      const payloadStr = await verifySession(sessionToken)
      if (payloadStr) {
        const payload = JSON.parse(payloadStr)
        if (payload.expiresAt && Date.now() < payload.expiresAt) {
          isSessionValid = true
        }
      }
    } catch (e) {
      isSessionValid = false
    }
  }

  // 1. User attempts to access admin panel without a valid session -> Redirect to login
  if (pathname.startsWith('/admin') && !isSessionValid) {
    const loginUrl = new URL('/login', request.nextUrl)
    return NextResponse.redirect(loginUrl)
  }

  // 2. User is already logged in and attempts to access the login page -> Redirect to admin panel
  if (pathname === '/login' && isSessionValid) {
    const adminUrl = new URL('/admin/pemasukan', request.nextUrl)
    return NextResponse.redirect(adminUrl)
  }

  return NextResponse.next()
}

export default proxy

// Only execute proxy on admin routes and login page
export const config = {
  matcher: [
    '/admin/:path*',
    '/login'
  ]
}
