// Simple authentication utilities
import { NextRequest } from 'next/server'

interface AuthConfig {
  adminPassword: string
  sessionSecret: string
}

class AuthService {
  private config: AuthConfig

  constructor() {
    this.config = {
      adminPassword: process.env.ADMIN_PASSWORD || 'defaultPassword123!',
      sessionSecret: process.env.SESSION_SECRET || 'defaultSecret123!'
    }
  }

  // Validate admin password
  validateAdminPassword(password: string): boolean {
    return password === this.config.adminPassword
  }

  // Create admin session token
  createAdminToken(): string {
    const timestamp = Date.now()
    const payload = { admin: true, timestamp }
    
    // Simple JWT-like token (in production, use proper JWT)
    const tokenData = Buffer.from(JSON.stringify(payload)).toString('base64')
    return tokenData
  }

  // Validate admin token
  validateAdminToken(token: string): boolean {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // Check if token is valid and not expired (24 hours)
      const isValid = payload.admin === true
      const isNotExpired = (Date.now() - payload.timestamp) < (24 * 60 * 60 * 1000)
      
      return isValid && isNotExpired
    } catch {
      return false
    }
  }

  // Extract admin token from request
  getAdminTokenFromRequest(request: NextRequest): string | null {
    // Check Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    // Check cookie
    const token = request.cookies.get('admin_token')?.value
    return token || null
  }

  // Check if request is from admin
  isAdminRequest(request: NextRequest): boolean {
    const token = this.getAdminTokenFromRequest(request)
    return token ? this.validateAdminToken(token) : false
  }
}

export const authService = new AuthService()

// Rate limiting for login attempts
interface LoginAttempt {
  ip: string
  attempts: number
  lastAttempt: number
}

class RateLimiter {
  private attempts = new Map<string, LoginAttempt>()
  private maxAttempts = 5
  private windowMs = 15 * 60 * 1000 // 15 minutes

  isRateLimited(ip: string): boolean {
    const attempt = this.attempts.get(ip)
    if (!attempt) return false

    // Clean old attempts
    if (Date.now() - attempt.lastAttempt > this.windowMs) {
      this.attempts.delete(ip)
      return false
    }

    return attempt.attempts >= this.maxAttempts
  }

  recordAttempt(ip: string, success: boolean = false): void {
    const now = Date.now()
    const existing = this.attempts.get(ip)

    if (success) {
      // Clear attempts on successful login
      this.attempts.delete(ip)
      return
    }

    if (!existing || (now - existing.lastAttempt > this.windowMs)) {
      // First attempt or window expired
      this.attempts.set(ip, { ip, attempts: 1, lastAttempt: now })
    } else {
      // Increment attempts
      existing.attempts++
      existing.lastAttempt = now
      this.attempts.set(ip, existing)
    }
  }

  getRemainingAttempts(ip: string): number {
    const attempt = this.attempts.get(ip)
    if (!attempt) return this.maxAttempts

    // Clean expired attempts
    if (Date.now() - attempt.lastAttempt > this.windowMs) {
      this.attempts.delete(ip)
      return this.maxAttempts
    }

    return Math.max(0, this.maxAttempts - attempt.attempts)
  }
}

export const rateLimiter = new RateLimiter()