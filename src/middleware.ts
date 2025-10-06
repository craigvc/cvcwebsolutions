import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block all admin routes in production
  if (process.env.NODE_ENV === 'production') {
    if (pathname.startsWith('/admin')) {
      // Return 404 to hide the existence of admin routes
      return new NextResponse(null, { status: 404 })
    }

    // Block admin API routes
    if (pathname.startsWith('/api/auth/admin') ||
        pathname.startsWith('/api/appointments/admin')) {
      return new NextResponse(null, { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/admin/:path*',
    '/api/appointments/admin/:path*'
  ]
}
