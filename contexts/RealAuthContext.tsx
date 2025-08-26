'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, User, RegisterRequest, LoginRequest } from '@/lib/auth-api'

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
      
      // Check if we have stored auth data
      if (!authAPI.isAuthenticated()) {
        setUser(null)
        return
      }
      
      // Try to get current user profile
      try {
        const response = await authAPI.getProfile()
        if (response.success && response.data) {
          setUser(response.data.user)
        } else {
          // Profile fetch failed, try to refresh token
          const refreshSuccess = await refreshToken()
          if (!refreshSuccess) {
            setUser(null)
          }
        }
      } catch (error) {
        console.warn('Profile fetch failed, trying token refresh:', error)
        const refreshSuccess = await refreshToken()
        if (!refreshSuccess) {
          setUser(null)
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authAPI.login(data)
      
      if (response.success && response.data) {
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
      await authAPI.logout()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout fails, clear local state
      setUser(null)
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authAPI.refreshToken()
      
      if (response.success && response.data) {
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