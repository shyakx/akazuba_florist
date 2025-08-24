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
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
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
      
      if (accessToken && storedUser) {
        // Verify token is still valid by making a profile request
        try {
          const response = await authAPI.getProfile()
          if (response.success && response.data) {
            setUser(response.data.user)
            // Update stored user data
            apiUtils.storeUser(response.data.user)
          } else {
            // Token might be expired, try to refresh
            await refreshToken()
          }
        } catch (error) {
          console.error('Token verification failed:', error)
          // Clear invalid tokens
          apiUtils.clearTokens()
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth status check failed:', error)
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
      
      const response = await authAPI.adminLogin({ username, password })
      
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
      // Call logout API
      await authAPI.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear all auth data
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

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    adminLogin,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken
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