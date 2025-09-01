'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, User, RegisterRequest, LoginRequest } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
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
      console.log('🔍 Starting authentication status check...')
      
      // Check if we have stored auth data
      const token = localStorage.getItem('accessToken')
      console.log('🔑 Access token found:', token ? 'Yes' : 'No')
      
      if (!token) {
        console.log('🔒 No access token found - user not authenticated')
        setUser(null)
        setIsLoading(false)
        return
      }
      
      // Add a small delay to prevent rapid state changes
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Try to get current user profile
      try {
        console.log('🔄 Attempting to fetch user profile...')
        const response = await authAPI.getProfile()
        console.log('📡 Profile API response:', response)
        
        if (response.success && response.data && response.data.user) {
          console.log('✅ User authenticated:', response.data.user.email, 'Role:', response.data.user.role)
          setUser(response.data.user)
          // Set cookies for middleware
          if (response.data.user?.role) {
            document.cookie = `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax`
            console.log('🍪 Set user role cookie:', response.data.user.role)
          }
        } else {
          // Profile fetch failed, clear user
          console.warn('❌ Profile fetch failed - clearing user data')
          console.warn('Response:', response)
          setUser(null)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      } catch (error) {
        console.warn('❌ Profile fetch failed - clearing user data:', error)
        setUser(null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    } catch (error) {
      console.error('❌ Auth status check failed:', error)
      setUser(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      console.log('🏁 Authentication check completed, setting isLoading to false')
      setIsLoading(false)
    }
  }

  const login = async (data: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authAPI.login(data)
      
      if (response.success && response.data) {
        // Store tokens
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
          // Also set cookie for middleware
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400; samesite=lax`
        }
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        if (response.data.user?.role) {
          // Set user role cookie for middleware
          document.cookie = `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax`
        }
        
        setUser(response.data.user)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authAPI.register(data)
      
      if (response.success && response.data) {
        // Store tokens
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
          // Also set cookie for middleware
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400; samesite=lax`
        }
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        if (response.data.user?.role) {
          // Set user role cookie for middleware
          document.cookie = `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax`
        }
        
        setUser(response.data.user)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      
      // Clear all local storage first
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      
      // Clear cookies
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      // Clear user state
      setUser(null)
      
      // Try to call logout API (but don't wait for it)
      try {
        await authAPI.logout()
      } catch (apiError) {
        console.warn('API logout failed, but local logout successful:', apiError)
      }
      
      // Add delay before redirect to prevent rapid navigation
      setTimeout(() => {
        router.push('/')
      }, 500)
      
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout fails, clear local state
      setUser(null)
      setTimeout(() => {
        router.push('/')
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        return false
      }
      
      const response = await authAPI.refreshToken(refreshToken)
      
      if (response.success && response.data) {
        // Store new tokens
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
        }
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        
        setUser(response.data.user)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      setUser(null)
      return false
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
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