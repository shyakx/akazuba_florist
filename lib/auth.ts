import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import crypto from 'crypto'

/**
 * Authentication User Interface
 * 
 * Represents a user in the authentication system with all necessary
 * user information and status flags.
 */
export interface AuthUser {
  id: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  phone?: string
  isActive?: boolean
  emailVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * Authentication Session Interface
 * 
 * Represents a complete authentication session including user data
 * and authentication tokens.
 */
export interface AuthSession {
  user: AuthUser
  token?: string
  refreshToken?: string
}

/**
 * JWT Payload Interface
 * 
 * Defines the structure of JWT token payloads used throughout
 * the authentication system.
 */
export interface JWTPayload {
  userId: string
  email: string
  role: string
  type?: 'access' | 'refresh'
  sessionId?: string
  iat?: number
  exp?: number
}

/**
 * JWT Configuration
 * 
 * Secure configuration for JWT token generation and validation.
 * Includes fallback secrets for development and security validation.
 */
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('⚠️ JWT_SECRET not set in environment variables. Using fallback for development only.')
  return 'akazuba-jwt-secret-1757247557229-development-fallback'
})()

const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d'

// Security validation - ensure JWT secret meets minimum requirements
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long for security')
}

/**
 * Generate a secure session ID
 * 
 * Creates a cryptographically secure random UUID for session identification.
 * 
 * @returns A secure random UUID string
 */
export function generateSessionId(): string {
  return crypto.randomUUID()
}

/**
 * Verify JWT token with enhanced security validation
 * 
 * Validates JWT tokens with comprehensive security checks including
 * token type validation, payload validation, and proper error handling.
 * 
 * @param token - JWT token to verify
 * @param type - Expected token type ('access' or 'refresh')
 * @returns Decoded JWT payload if valid, null if invalid
 */
export function verifyToken(token: string, type: 'access' | 'refresh' = 'access'): JWTPayload | null {
  try {
    // Basic token validation
    if (!token || typeof token !== 'string') {
      return null
    }

    // Select appropriate secret based on token type
    const secret = type === 'refresh' ? REFRESH_SECRET : JWT_SECRET
    const decoded = jwt.verify(token, secret) as JWTPayload
    
    // Validate token type matches expected type
    if (decoded.type && decoded.type !== type) {
      console.warn('❌ JWT token type mismatch:', { expected: type, actual: decoded.type })
      return null
    }
    
    // Validate required payload fields
    if (!decoded.userId || !decoded.email || !decoded.role) {
      console.warn('❌ Invalid JWT payload: missing required fields')
      return null
    }
    
    return decoded
  } catch (error) {
    // Handle specific JWT errors with appropriate logging
    if (error instanceof jwt.TokenExpiredError) {
      console.warn('⏰ JWT token expired:', error.expiredAt)
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.warn('❌ Invalid JWT token:', error.message)
    } else {
      console.error('❌ JWT verification failed:', error)
    }
    return null
  }
}

/**
 * Generate secure JWT tokens for user authentication
 * 
 * Creates both access and refresh tokens with proper security configurations
 * including expiration times, issuer, and audience validation.
 * 
 * @param user - User object containing authentication data
 * @param sessionId - Optional session ID, generates new one if not provided
 * @returns Object containing access and refresh tokens
 */
export function generateTokens(user: AuthUser, sessionId?: string): { accessToken: string; refreshToken: string } {
  const session = sessionId || generateSessionId()
  
  // Access token payload
  const accessPayload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
    sessionId: session
  }
  
  // Refresh token payload
  const refreshPayload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'refresh',
    sessionId: session
  }
  
  // Generate access token with shorter expiration
  const accessToken = jwt.sign(accessPayload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'akazuba-florist',
    audience: 'akazuba-users'
  } as jwt.SignOptions)
  
  // Generate refresh token with longer expiration
  const refreshToken = jwt.sign(refreshPayload, REFRESH_SECRET, { 
    expiresIn: REFRESH_EXPIRES_IN,
    issuer: 'akazuba-florist',
    audience: 'akazuba-users'
  } as jwt.SignOptions)
  
  return { accessToken, refreshToken }
}

// Legacy function for backward compatibility
export function generateToken(user: AuthUser): string {
  const { accessToken } = generateTokens(user)
  return accessToken
}

// Extract token from request headers with enhanced security
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim()
    // Basic token format validation
    if (token && token.split('.').length === 3) {
      return token
    }
  }
  return null
}

// Extract token from cookies with security validation
export function extractTokenFromCookies(request: NextRequest): string | null {
  const token = request.cookies.get('accessToken')?.value
  if (token && token.trim() && token.split('.').length === 3) {
    return token.trim()
  }
  return null
}

// Get server session with enhanced JWT validation
export async function getServerSession(request?: NextRequest): Promise<AuthSession | null> {
  try {
    let token: string | null = null
    
    if (request) {
      // Try authorization header first, then cookies
      token = extractTokenFromRequest(request) || extractTokenFromCookies(request)
    } else {
      // For server-side calls without request object, try to get from cookies
      const { cookies } = await import('next/headers')
      const cookieStore = cookies()
      const cookieToken = cookieStore.get('accessToken')?.value
      if (cookieToken && cookieToken.trim() && cookieToken.split('.').length === 3) {
        token = cookieToken.trim()
      }
    }
    
    if (!token) {
      return null
    }
    
    // Verify the token with enhanced security
    const payload = verifyToken(token, 'access')
    if (!payload) {
      return null
    }
    
    // Return session with user info
    return {
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role
      },
      token,
      refreshToken: undefined // Will be populated if needed
    }
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
}

// Validate refresh token
export function validateRefreshToken(token: string): JWTPayload | null {
  return verifyToken(token, 'refresh')
}

// Check if user has required role with enhanced security
export function hasRole(user: AuthUser, requiredRole: string): boolean {
  const roleHierarchy = {
    'SUPER_ADMIN': 4,
    'ADMIN': 3,
    'MODERATOR': 2,
    'USER': 1,
    'CUSTOMER': 1
  }
  
  const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
  
  return userLevel >= requiredLevel
}

// Enhanced middleware for protecting routes
export function requireAuth(requiredRole: string = 'ADMIN') {
  return async (request: NextRequest) => {
    try {
      const session = await getServerSession(request)
      
      if (!session) {
        return {
          error: 'Unauthorized - No valid session found',
          status: 401
        }
      }
      
      // Check if user is active (if available)
      if (session.user.isActive === false) {
        return {
          error: 'Account deactivated',
          status: 403
        }
      }
      
      if (!hasRole(session.user, requiredRole)) {
        return {
          error: 'Insufficient permissions',
          status: 403
        }
      }
      
      return { session }
    } catch (error) {
      console.error('Auth middleware error:', error)
      return {
        error: 'Authentication error',
        status: 500
      }
    }
  }
}

// Secure cookie options
export const getSecureCookieOptions = (isProduction: boolean = process.env.NODE_ENV === 'production') => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 // 24 hours
})

// Enhanced auth configuration
export const authConfig = {
  jwtSecret: JWT_SECRET,
  refreshSecret: REFRESH_SECRET,
  accessTokenExpiry: JWT_EXPIRES_IN,
  refreshTokenExpiry: REFRESH_EXPIRES_IN,
  cookieName: 'accessToken',
  refreshCookieName: 'refreshToken',
  secure: process.env.NODE_ENV === 'production',
  issuer: 'akazuba-florist',
  audience: 'akazuba-users'
}

// Legacy export for backward compatibility
export const authOptions = {
  jwtSecret: JWT_SECRET,
  tokenExpiry: JWT_EXPIRES_IN,
  cookieName: 'accessToken',
  secure: process.env.NODE_ENV === 'production'
}
