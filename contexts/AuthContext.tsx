'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, apiUtils, User } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  adminLogin: (username: string, password: string) => Promise<boolean>
  unifiedLogin: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  clearAuth: () => void
  clearAuthOnly: () => void
  updateProfile: (data: UpdateProfileData) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  refreshToken: () => Promise<boolean>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

interface UpdateProfileData {
  firstName?: string
  lastName?: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Debug user state changes
  useEffect(() => {
    console.log('🔄 User state changed:', user)
  }, [user])

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      
      // Check if we have tokens
      const accessToken = apiUtils.getAccessToken()
      const storedUser = apiUtils.getStoredUser()
      
      console.log('🔍 Auth Status Check:', {
        hasAccessToken: !!accessToken,
        hasStoredUser: !!storedUser,
        storedUserRole: storedUser?.role,
        currentPath: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
      })
      
      // Check if we're on an admin page
      const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
      
      if (accessToken && storedUser) {
        // For admin pages, don't auto-authenticate - require explicit login
        if (isAdminPage && storedUser.role !== 'ADMIN') {
          // Clear non-admin tokens on admin pages
          console.log('🚫 Clearing non-admin tokens on admin page')
          apiUtils.clearTokens()
          setUser(null)
          return
        }
        
        // In development mode, trust stored tokens without API verification
        const isDevelopment = process.env.NODE_ENV === 'development'
        const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        
        if (isDevelopment && isLocalhost) {
          console.log('🔧 Development mode: Trusting stored tokens without API verification')
          setUser(storedUser)
          return
        }
        
        // Verify token is still valid by making a profile request (only in production)
        try {
          const response = await authAPI.getProfile()
          if (response.success && response.data) {
            console.log('✅ Token verified, user authenticated:', response.data.user.role)
            setUser(response.data.user)
            // Update stored user data
            apiUtils.storeUser(response.data.user)
          } else {
            console.log('❌ Token verification failed, trying refresh')
            // Token might be expired, try to refresh
            await refreshToken()
          }
        } catch (error) {
          console.error('❌ Token verification failed:', error)
          // In development, don't clear tokens on API failure
          if (!isDevelopment) {
          apiUtils.clearTokens()
          setUser(null)
          } else {
            console.log('🔧 Development mode: Keeping tokens despite API failure')
            setUser(storedUser)
          }
        }
      } else {
        console.log('🔓 No stored authentication found')
        setUser(null)
      }
    } catch (error) {
      console.error('❌ Auth status check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await authAPI.login({ email, password })
      
      if (response.success && response.data) {
        // Store tokens and user data
        apiUtils.storeTokens(response.data.accessToken, response.data.refreshToken)
        apiUtils.storeUser(response.data.user)
        
        // Set cookies for SSR
        document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        document.cookie = `userRole=${response.data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        
        setUser(response.data.user)
        return true
      } else {
        console.error('Login failed:', response.message)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Use the API layer instead of direct fetch calls
      const response = await authAPI.adminLogin({ username, password })
      
      if (response.success && response.data) {
        // Store tokens and user data
        apiUtils.storeTokens(response.data.accessToken, response.data.refreshToken || '')
        apiUtils.storeUser(response.data.user)
        
        // Set cookies for SSR
        document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        document.cookie = `userRole=${response.data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        
        setUser(response.data.user)
        return true
      } else {
        console.error('Admin login failed:', response.message)
        return false
      }
    } catch (error) {
      console.error('Admin login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const unifiedLogin = async (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      setIsLoading(true)
      console.log('🔐 Unified login started for:', email)
      
      // Try customer login first
      try {
        const response = await authAPI.login({ email, password })
        
        if (response.success && response.data) {
          console.log('✅ Customer login successful, storing data...')
          
          // Store tokens and user data
          apiUtils.storeTokens(response.data.accessToken, response.data.refreshToken)
          apiUtils.storeUser(response.data.user)
          
          // Set cookies for SSR
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
          document.cookie = `userRole=${response.data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
          
          console.log('🔐 Setting user state to:', response.data.user)
          setUser(response.data.user)
          
          // Verify the state was set
          console.log('🔐 User state should now be set. Returning success.')
          return { success: true, user: response.data.user }
        }
      } catch (error) {
        console.log('❌ Customer login failed, trying admin login...')
      }
      
      // If customer login failed, try admin login
      try {
        const response = await authAPI.adminLogin({ username: email, password })
        
        if (response.success && response.data) {
          console.log('✅ Admin login successful, storing data...')
          
          // Store tokens and user data
          apiUtils.storeTokens(response.data.accessToken, response.data.refreshToken || '')
          apiUtils.storeUser(response.data.user)
          
          // Set cookies for SSR
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
          document.cookie = `userRole=${response.data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
          
          console.log('🔐 Setting user state to:', response.data.user)
          setUser(response.data.user)
          
          // Verify the state was set
          console.log('🔐 User state should now be set. Returning success.')
          return { success: true, user: response.data.user }
        }
      } catch (error) {
        console.log('❌ Admin login also failed')
      }
      
      console.log('❌ Both login attempts failed')
      return { success: false, message: 'Invalid email or password. Please try again.' }
    } catch (error) {
      console.error('❌ Unified login error:', error)
      return { success: false, message: 'An unexpected error occurred during login.' }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await authAPI.register(data)
      
      if (response.success && response.data) {
        // Store tokens and user data
        apiUtils.storeTokens(response.data.accessToken, response.data.refreshToken)
        apiUtils.storeUser(response.data.user)
        
        // Set cookies for SSR
        document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        document.cookie = `userRole=${response.data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        
        setUser(response.data.user)
        return true
      } else {
        console.error('Registration failed:', response.message)
        return false
      }
    } catch (error) {
      console.error('Registration error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Check if we're in development mode with mock tokens
      const accessToken = apiUtils.getAccessToken()
      const isDevelopment = process.env.NODE_ENV === 'development' || typeof window !== 'undefined' && window.location.hostname === 'localhost'
      const isMockToken = accessToken && accessToken.startsWith('mock-')
      
      // Skip API call if in development mode with mock tokens
      if (isDevelopment && isMockToken) {
        console.log('🔧 Development mode: Skipping logout API call for mock tokens')
      } else {
        try {
          // Call logout API only for production or real tokens
      await authAPI.logout()
    } catch (error) {
      console.error('Logout API error:', error)
          // Continue with logout even if API call fails
        }
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all auth data regardless of API call success
      apiUtils.clearTokens()
      setUser(null)
      
      // Clear cookies
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      // Redirect to home
      router.push('/')
    }
  }

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await authAPI.updateProfile(data)
      
      if (response.success && response.data) {
        // Update stored user data
        apiUtils.storeUser(response.data.user)
        setUser(response.data.user)
        return true
      } else {
        console.error('Profile update failed:', response.message)
        return false
      }
    } catch (error) {
      console.error('Profile update error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await authAPI.changePassword({ currentPassword, newPassword })
      
      if (response.success) {
        return true
      } else {
        console.error('Password change failed:', response.message)
        return false
      }
    } catch (error) {
      console.error('Password change error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = apiUtils.getRefreshToken()
      
      if (!refreshToken) {
        return false
      }
      
      const response = await authAPI.refreshToken(refreshToken)
      
      if (response.success && response.data) {
        // Store new tokens
        apiUtils.storeTokens(response.data.accessToken, response.data.refreshToken)
        apiUtils.storeUser(response.data.user)
        
        // Update cookies
        document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        document.cookie = `userRole=${response.data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        
        setUser(response.data.user)
        return true
      } else {
        // Refresh failed, clear tokens
        apiUtils.clearTokens()
        setUser(null)
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear tokens on error
      apiUtils.clearTokens()
      setUser(null)
      return false
    }
  }

  const clearAuth = () => {
    apiUtils.clearTokens()
    setUser(null)
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/')
  }

  const clearAuthOnly = () => {
    apiUtils.clearTokens()
    setUser(null)
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    adminLogin,
    unifiedLogin,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    clearAuth,
    clearAuthOnly
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 