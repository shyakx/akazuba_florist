import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export interface JWTPayload {
  userId: string
  role: string
  iat: number
  exp: number
}

// Verify JWT token
export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Access token required' })
      return
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User not found or inactive' })
      return
    }

    req.user = user
    next()
  } catch (error) {
    logger.error('Token verification failed:', error)
    res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

// Require authentication
export const requireAuth = verifyToken

// Require admin role
export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await verifyToken(req, res, () => {
      if (req.user && req.user.role === 'ADMIN') {
        next()
      } else {
        res.status(403).json({ success: false, message: 'Admin access required' })
      }
    })
  } catch (error) {
    logger.error('Admin verification failed:', error)
    res.status(403).json({ success: false, message: 'Admin access required' })
  }
}

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next()
      return
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (user && user.isActive) {
      req.user = user
    }
    next()
  } catch (error) {
    // Don't fail on token errors for optional auth
    next()
  }
}

// Rate limiting configuration for auth endpoints
export const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
}

// Validation utilities
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' }
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' }
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (@$!%*?&)' }
  }
  
  return { isValid: true, message: 'Password is strong' }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Check if it's a valid Rwandan phone number (10 digits starting with 07 or 25)
  if (cleanPhone.length === 10 && (cleanPhone.startsWith('07') || cleanPhone.startsWith('25'))) {
    return true
  }
  
  // Check if it's a valid international Rwandan number (12 digits starting with 250)
  if (cleanPhone.length === 12 && cleanPhone.startsWith('250')) {
    return true
  }
  
  return false
} 