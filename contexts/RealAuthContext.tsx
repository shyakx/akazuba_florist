'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, User, RegisterRequest, LoginRequest } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<boolean>
  adminLogin: (data: { username: string; password: string }) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  clearAuthData: () => void
  updateProfile: (data: Partial<User> & { currentPassword?: string; newPassword?: string }) => Promise<boolean>
  // Development helpers (remove in production)
  forceClearAuth: () => void
  resetToFirstTime: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  // Cleanup function to clear all authentication data
  const clearAllAuthData = useCallback(() => {
    // Clear localStorage
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
    localStorage.removeItem('hasVisitedBefore')
        
        // Clear cookies
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        
    // Clear user state
        setUser(null)
        
    console.log('🧹 All authentication data cleared')
  }, [])

  // Initialize authentication state - only once
  useEffect(() => {
    // Prevent multiple initializations with a more robust check
    if (isInitialized) {
      console.log('🚀 Authentication already initialized, skipping...')
      return
    }

    // Add a flag to prevent concurrent initializations
    let isInitializing = false
    
    const initializeAuth = async () => {
      if (isInitializing) {
        console.log('🚀 Authentication initialization already in progress, skipping...')
        return
      }
      
      isInitializing = true
      
      try {
        console.log('🚀 Initializing authentication system...')
        
        // Check for existing valid tokens in both development and production
        const token = localStorage.getItem('accessToken')
        const storedUser = localStorage.getItem('user')
        
        if (token && storedUser) {
          console.log('🔍 Found existing token and user data, validating...')
          try {
            const userData = JSON.parse(storedUser)
            // Set user immediately from stored data
            setUser(userData)
            console.log('✅ User restored from localStorage:', userData.email)
            
            // Then validate token in background
            await validateAndSetUser(token)
          } catch (error) {
            console.error('❌ Error parsing stored user data:', error)
            clearAllAuthData()
          }
        } else if (token) {
          console.log('🔍 Found token but no user data, validating...')
          await validateAndSetUser(token)
        } else {
          console.log('🔓 No existing token found')
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Authentication initialization failed:', error)
        clearAllAuthData()
      } finally {
        console.log('✅ Setting authentication as initialized...')
        setIsInitialized(true)
        setIsLoading(false)
        isInitializing = false
        console.log('✅ Authentication system initialized')
      }
    }

    initializeAuth()
  }, []) // Remove clearAllAuthData dependency to prevent infinite loops

  // Validate token and set user
  const validateAndSetUser = async (token: string) => {
    try {
      const response = await authAPI.getProfile()
      
      if (response.success && response.data?.user) {
        console.log('✅ Token valid, user authenticated:', response.data.user.email)
        setUser(response.data.user)
        
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Set cookies for middleware
        if (response.data.user.role) {
          document.cookie = `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax`
        }
      } else {
        console.warn('❌ Token validation failed, but keeping user data if available')
        // Don't clear auth data immediately - let the user try to use the app
        // The token might be temporarily invalid but could be refreshed
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          clearAllAuthData()
        }
      }
    } catch (error) {
      console.error('❌ Token validation error:', error)
      // Don't clear auth data on network errors - keep user logged in
      // Only clear if it's a clear authentication error
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        console.warn('❌ Authentication error, clearing auth data')
        clearAllAuthData()
      } else {
        console.warn('❌ Network error during token validation, keeping user logged in')
      }
    }
  }

  // Login function
  const login = async (data: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log('🔐 Attempting login for:', data.email)
      
      const response = await authAPI.login(data)
      
      if (response.success && response.data) {
        console.log('✅ Login successful, storing authentication data')
        
        // Store tokens
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400; samesite=lax`
        }
        
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        
        // Store user data and set state immediately
        if (response.data.user) {
          console.log('💾 Storing user data:', response.data.user)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          setUser(response.data.user)
          console.log('👤 User state set to:', response.data.user)
          
          // Set user role cookie for middleware
          if (response.data.user.role) {
            document.cookie = `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax`
          }
        }
        
        // Set visited flag
        localStorage.setItem('hasVisitedBefore', 'true')
        
        // Mark as authenticated immediately after successful login
        console.log('✅ Authentication state updated after login')
        
        return true
      } else {
        console.error('❌ Login failed:', response.message)
        return false
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Admin login function
  const adminLogin = async (data: { username: string; password: string }): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log('🔐 Attempting admin login for:', data.username)
      
      const response = await authAPI.adminLogin(data)
      
      if (response.success && response.data) {
        console.log('✅ Login successful, checking admin role...')
        
        // Check if user has admin role
        if (response.data.user.role !== 'ADMIN') {
          console.error('❌ Access denied: User is not an admin')
          return false
        }
        
        console.log('✅ Admin login successful, storing authentication data')
        
        // Store tokens
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
          // Set cookie with proper domain and secure settings
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400; samesite=lax`
          console.log('🍪 Access token cookie set')
        }
        
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        
        // Store user data
        if (response.data.user) {
          console.log('💾 Storing user data:', response.data.user)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          setUser(response.data.user)
          console.log('👤 User state updated:', response.data.user)
          
          // Set user role cookie for middleware
          if (response.data.user.role) {
            document.cookie = `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax`
            console.log('🍪 User role cookie set:', response.data.user.role)
          }
        }
        
        // Force a delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Set visited flag
        localStorage.setItem('hasVisitedBefore', 'true')
        
        return true
      } else {
        console.error('❌ Admin login failed:', response.message)
      return false
      }
    } catch (error) {
      console.error('❌ Admin login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (data: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log('📝 AuthContext: Attempting registration for:', data.email)
      
      const response = await authAPI.register(data)
      console.log('📝 AuthContext: API response:', response)
      
      if (response.success && response.data) {
        console.log('✅ AuthContext: Registration successful, storing authentication data')
        
        // Store tokens
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400; samesite=lax`
          console.log('🔑 AuthContext: Access token stored')
        }
        
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
          console.log('🔑 AuthContext: Refresh token stored')
        }
        
        // Store user data
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
          setUser(response.data.user)
          console.log('👤 AuthContext: User data stored:', response.data.user)
          
          // Set user role cookie for middleware
          if (response.data.user.role) {
          document.cookie = `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax`
          console.log('🍪 AuthContext: User role cookie set:', response.data.user.role)
        }
        }
        
        // Set visited flag
        localStorage.setItem('hasVisitedBefore', 'true')
        console.log('✅ AuthContext: Registration completed successfully')
        
        return true
      } else {
        console.error('❌ AuthContext: Registration failed:', response.message)
      return false
      }
    } catch (error) {
      console.error('❌ AuthContext: Registration error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Logging out user...')
      setIsLoading(true)
      
      // Try to call logout API (but don't wait for it)
      try {
        await authAPI.logout()
      } catch (apiError) {
        console.warn('⚠️ API logout failed, but continuing with local logout:', apiError)
      }
      
      // Clear all local authentication data
      clearAllAuthData()
      
      // Redirect to home page
        router.push('/')
      
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Even if logout fails, clear local state
      clearAllAuthData()
        router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken')
      
      if (!refreshTokenValue) {
        console.log('❌ No refresh token available')
        return false
      }
      
      console.log('🔄 Attempting token refresh...')
      const response = await authAPI.refreshToken(refreshTokenValue)
      
      if (response.success && response.data) {
        console.log('✅ Token refresh successful')
        
        // Store new tokens
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400; samesite=lax`
        }
        
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        
        // Update user data
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
        setUser(response.data.user)
          
          if (response.data.user.role) {
            document.cookie = `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax`
          }
      }
      
        return true
      } else {
        console.warn('❌ Token refresh failed')
        clearAllAuthData()
      return false
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error)
      clearAllAuthData()
      return false
    }
  }

  // Update profile function
  const updateProfile = async (data: Partial<User> & { currentPassword?: string; newPassword?: string }): Promise<boolean> => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Authentication required')
      }

      console.log('📝 Updating user profile...')

      // Prepare update data
      const updateData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      }

      // Add password change if provided
      if (data.currentPassword && data.newPassword) {
        updateData.currentPassword = data.currentPassword
        updateData.newPassword = data.newPassword
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://akazuba-backend-api.onrender.com/api/v1'}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      const result = await response.json()
      
      // Update local user state
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user))
        setUser(result.user)
        console.log('✅ Profile updated successfully')
      }
      
      return true
    } catch (error) {
      console.error('❌ Profile update error:', error)
      throw error
    }
  }

  // Clear authentication data
  const clearAuthData = () => {
    clearAllAuthData()
    console.log('🧹 Authentication data cleared')
  }

  // Development helper: Force clear all auth data
  const forceClearAuth = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Force clearing all authentication data...')
      
      // Clear all local storage
      localStorage.clear()
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      })
      
      // Clear user state
      setUser(null)
      setIsLoading(false)
      
      console.log('🧹 All authentication data cleared')
    }
  }

  // Development helper: Reset to first-time user experience
  const resetToFirstTime = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Resetting to first-time user experience...')
      clearAllAuthData()
      console.log('🔄 Reset to first-time user experience complete')
    }
  }

  // Make functions globally available for testing (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore - Development only
      window.clearAllAuth = clearAuthData
      // @ts-ignore - Development only
      window.forceClearAuth = forceClearAuth
      // @ts-ignore - Development only
      window.resetToFirstTime = resetToFirstTime
      
      console.log('🧪 Development helpers available:')
      console.log('  - window.clearAllAuth() - Clear all authentication data')
      console.log('  - window.forceClearAuth() - Force clear all auth data')
      console.log('  - window.resetToFirstTime() - Reset to first-time user experience')
    }
  }, [clearAuthData, forceClearAuth, resetToFirstTime])

  const value: AuthContextType = {
    user,
    isLoading: isLoading || !isInitialized,
    isInitialized,
    isAuthenticated: !!user,
    login,
    adminLogin,
    register,
    logout,
    refreshToken,
    clearAuthData,
    updateProfile,
    forceClearAuth,
    resetToFirstTime,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 