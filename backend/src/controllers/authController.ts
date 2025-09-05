/// <reference types="node" />
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'
import { validateEmail, validatePassword, validatePhone } from '../middleware/auth'

const prisma = new PrismaClient()

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'akazuba-jwt-secret-2024-development'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'

// Generate JWT tokens
const generateTokens = (userId: string, role: string) => {
  const accessToken = (jwt as any).sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
  
  const refreshToken = (jwt as any).sign(
    { userId, role, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  )
  
  return { accessToken, refreshToken }
}

// Register new customer
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone } = req.body

    // Validation
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required'
      })
      return
    }

    if (!validateEmail(email)) {
      res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        message: passwordValidation.message
      })
      return
    }

    if (phone && !validatePhone(phone)) {
      res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      })
      return
    }

    // Check if users already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      })
      return
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create users
    const users = await prisma.users.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: 'CUSTOMER',
        isActive: true,
        emailVerified: false
      },
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

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(users.id, users.role)

    // Store refresh token
    await prisma.refresh_tokens.create({
      data: {
        token: refreshToken,
        userId: users.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      } as any
    }) as any

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        users,
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    logger.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Customer login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
      return
    }

    // Find users with password hash
    const users = await prisma.users.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
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

    if (!users || !users.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
      return
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, users.passwordHash)
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
      return
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(users.id, users.role)

    // Store refresh token
    await prisma.refresh_tokens.create({
      data: {
        token: refreshToken,
        userId: users.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      } as any
    }) as any

    // Remove password from response
    const { passwordHash, ...usersWithoutPassword } = users

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        users: usersWithoutPassword,
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Admin login
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usersname, password } = req.body

    // Validation
    if (!usersname || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required'
      })
      return
    }

    // Find admin users with password hash
    const users = await prisma.users.findFirst({
      where: {
        OR: [
          { email: usersname.toLowerCase() },
          { firstName: usersname }
        ],
        role: 'ADMIN',
        isActive: true
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
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

    if (!users) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
      return
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, users.passwordHash)
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
      return
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(users.id, users.role)

    // Store refresh token
    await prisma.refresh_tokens.create({
      data: {
        token: refreshToken,
        userId: users.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      } as any
    }) as any

    // Remove password from response
    const { passwordHash, ...usersWithoutPassword } = users

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        users: usersWithoutPassword,
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    logger.error('Admin login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      // Invalidate refresh token
      await prisma.refresh_tokens.deleteMany({
        where: {
          userId: req.user!.id
        }
      })
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    logger.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      })
      return
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any
    
    if (decoded.type !== 'refresh') {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      })
      return
    }

    // Check if refresh token exists in database
    const storedToken = await prisma.refresh_tokens.findFirst({
      where: {
        token: refreshToken,
        userId: decoded.userId,
        expiresAt: {
          gt: new Date()
        }
      },
      include: { users: {
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
        }
      }
    })

    if (!storedToken || !storedToken.users.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      })
      return
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(
      storedToken.users.id,
      storedToken.users.role
    )

    // Delete old refresh token and store new one
    await prisma.refresh_tokens.delete({
      where: { id: storedToken.id }
    })

    await prisma.refresh_tokens.create({
      data: {
        token: newRefreshToken,
        userId: storedToken.users.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      } as any
    }) as any

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        users: storedToken.users,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    })
  } catch (error) {
    logger.error('Token refresh error:', error)
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    })
  }
}

// Get users profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findUnique({
      where: { id: req.user!.id },
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

    if (!users) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { users }
    })
  } catch (error) {
    logger.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Update users profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phone } = req.body

    // Validation
    if (phone && !validatePhone(phone)) {
      res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      })
      return
    }

    // Update users
    const updatedUser = await prisma.users.update({
      where: { id: req.user!.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone })
      },
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

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { users: updatedUser }
    })
  } catch (error) {
    logger.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Forgot password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body

    // Validation
    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      })
      return
    }

    // Find user
    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
      return
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Store reset token in database (you might want to create a separate table for this)
    // For now, we'll use a simple approach
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    // TODO: Send email with reset link
    // For now, we'll just log it (in production, use a service like SendGrid, Nodemailer, etc.)
    console.log(`Password reset link for ${user.email}: ${resetLink}`)

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      // In development, include the reset link for testing
      ...(process.env.NODE_ENV === 'development' && { resetLink })
    })
  } catch (error) {
    logger.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body

    // Validation
    if (!token || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      })
      return
    }

    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        message: passwordValidation.message
      })
      return
    }

    // Verify reset token
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (decoded.type !== 'password_reset') {
      res.status(401).json({
        success: false,
        message: 'Invalid reset token'
      })
      return
    }

    // Find user
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    // Hash new password
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await prisma.users.update({
      where: { id: user.id },
      data: { passwordHash: hashedNewPassword }
    })

    // Invalidate all refresh tokens
    await prisma.refresh_tokens.deleteMany({
      where: { userId: user.id }
    })

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
      return
    }

    logger.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validation
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      })
      return
    }

    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        message: passwordValidation.message
      })
      return
    }

    // Get users with password
    const users = await prisma.users.findUnique({
      where: { id: req.user!.id }
    })

    if (!users) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users.passwordHash)
    if (!isCurrentPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      })
      return
    }

    // Hash new password
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await prisma.users.update({
      where: { id: req.user!.id },
      data: { passwordHash: hashedNewPassword }
    })

    // Invalidate all refresh tokens
    await prisma.refresh_tokens.deleteMany({
      where: { userId: req.user!.id }
    })

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    logger.error('Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
} 