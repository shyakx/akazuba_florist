import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface AuthUser {
  id: string
  email: string
  role: string
  firstName?: string
  lastName?: string
}

export interface AuthSession {
  user: AuthUser
  token?: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

// JWT Secret - should match the backend secret
// For production, this should be the same as the backend's JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'akazuba-jwt-secret-1757247557229-development'

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  }
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

// Extract token from request headers
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

// Get server session with real JWT validation
export async function getServerSession(request?: NextRequest): Promise<AuthSession | null> {
  try {
    let token: string | null = null
    
    if (request) {
      // Extract token from request headers
      token = extractTokenFromRequest(request)
    } else {
      // For server-side calls without request object, try to get from cookies
      const { cookies } = await import('next/headers')
      const cookieStore = cookies()
      token = cookieStore.get('accessToken')?.value || null
    }
    
    if (!token) {
      return null
    }
    
    // Verify the token
    const payload = verifyToken(token)
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
      token
    }
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
}

// Check if user has required role
export function hasRole(user: AuthUser, requiredRole: string): boolean {
  const roleHierarchy = {
    'SUPER_ADMIN': 4,
    'ADMIN': 3,
    'MODERATOR': 2,
    'USER': 1
  }
  
  const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
  
  return userLevel >= requiredLevel
}

// Middleware for protecting admin routes
export function requireAuth(requiredRole: string = 'ADMIN') {
  return async (request: NextRequest) => {
    const session = await getServerSession(request)
    
    if (!session) {
      return {
        error: 'Unauthorized',
        status: 401
      }
    }
    
    if (!hasRole(session.user, requiredRole)) {
      return {
        error: 'Insufficient permissions',
        status: 403
      }
    }
    
    return { session }
  }
}

export const authOptions = {
  jwtSecret: JWT_SECRET,
  tokenExpiry: '24h',
  cookieName: 'accessToken',
  secure: process.env.NODE_ENV === 'production'
}
