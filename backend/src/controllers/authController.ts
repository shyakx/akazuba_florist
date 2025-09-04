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
const generateTokens = (usersId: string, role: string) => {
  const accessToken = (jwt as any).sign(
    { usersId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
  
  const refreshToken = (jwt as any).sign(
    { usersId, role, type: 'refresh' },
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
        usersId: users.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

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
        usersId: users.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

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
        usersId: users.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

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
          usersId: req.users!.id
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
        usersId: decoded.usersId,
        expiresAt: {
          gt: new Date()
        }
      },
      include: { userss: {
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

    if (!storedToken || !storedToken.userss.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      })
      return
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(
      storedToken.userss.id,
      storedToken.userss.role
    )

    // Delete old refresh token and store new one
    await prisma.refresh_tokens.delete({
      where: { id: storedToken.id }
    })

    await prisma.refresh_tokens.create({
      data: {
        token: newRefreshToken,
        usersId: storedToken.userss.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        users: storedToken.userss,
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
      where: { id: req.users!.id },
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
      where: { id: req.users!.id },
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
      where: { id: req.users!.id }
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
      where: { id: req.users!.id },
      data: { passwordHash: hashedNewPassword }
    })

    // Invalidate all refresh tokens
    await prisma.refresh_tokens.deleteMany({
      where: { usersId: req.users!.id }
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