import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'

/**
 * Login API Route
 * 
 * Handles user authentication by validating credentials and generating
 * JWT tokens for authenticated sessions.
 * 
 * Features:
 * - Credential validation
 * - JWT token generation
 * - Secure cookie handling
 * - Error handling and logging
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    /**
     * Valid Admin Credentials
     * 
     * Production-ready admin credentials for system access.
     * In a production environment, these should be stored securely
     * and validated against a database.
     */
    const validCredentials = [
      {
        email: 'info.akazubaflorist@gmail.com',
        password: 'akazuba2024',
        user: {
          id: '1',
          email: 'info.akazubaflorist@gmail.com',
          role: 'ADMIN',
          firstName: 'Admin',
          lastName: 'User'
        }
      }
    ]

    const credential = validCredentials.find(
      cred => cred.email === email && cred.password === password
    )

    if (!credential) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken(credential.user)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: credential.user,
        accessToken: token
      }
    })

    // Set HTTP-only cookie for additional security
    response.cookies.set('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}