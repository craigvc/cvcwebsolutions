import { NextRequest, NextResponse } from 'next/server'
import { authService, rateLimiter } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1'

    // Check rate limiting
    if (rateLimiter.isRateLimited(clientIp)) {
      return NextResponse.json(
        { 
          error: 'Too many login attempts. Please try again later.',
          remainingAttempts: 0
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const isValid = authService.validateAdminPassword(password)

    if (!isValid) {
      rateLimiter.recordAttempt(clientIp, false)
      return NextResponse.json(
        { 
          error: 'Invalid password',
          remainingAttempts: rateLimiter.getRemainingAttempts(clientIp)
        },
        { status: 401 }
      )
    }

    // Successful login
    rateLimiter.recordAttempt(clientIp, true)
    const token = authService.createAdminToken()

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful'
    })

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const isAdmin = authService.isAdminRequest(request)
  
  return NextResponse.json({
    authenticated: isAdmin,
    message: isAdmin ? 'Admin authenticated' : 'Not authenticated'
  })
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })

  // Clear admin cookie
  response.cookies.delete('admin_token')

  return response
}