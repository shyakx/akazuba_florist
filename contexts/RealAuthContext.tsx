'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, User, RegisterRequest, LoginRequest } from '@/lib/api'

/**
 * Authentication Context Interface
 * 
 * Provides authentication state and methods for the entire application.
 * Includes user management, login/logout, token refresh, and profile updates.
 */
interface AuthContextType {
  // State
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  isAuthenticated: boolean
  
  // Authentication Methods
  login: (data: LoginRequest) => Promise<boolean>
  adminLogin: (data: { username: string; password: string }) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  
  // User Management
  updateProfile: (data: Partial<User> & { currentPassword?: string; newPassword?: string }) => Promise<boolean>
  clearAuthData: () => void
  
  // Development Helpers (remove in production)
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

  /**
   * Enhanced token validation with comprehensive security checks
   * 
   * @param token - JWT token to validate
   * @returns true if token is expired or invalid, false if valid
   */
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      // Basic validation
      if (!token || typeof token !== 'string') {
        return true
      }

      // JWT structure validation
      const parts = token.split('.')
      if (parts.length !== 3) {
        console.warn('❌ Invalid JWT token format')
        return true
      }

      // Parse and validate payload
      const payload = JSON.parse(atob(parts[1]))
      
      // Required fields validation
      if (!payload.exp || !payload.iat || !payload.userId) {
        console.warn('❌ JWT token missing required fields')
        return true
      }

      // Expiration check
      const isExpired = payload.exp * 1000 < Date.now()
      if (isExpired) {
        console.log('⏰ JWT token expired at:', new Date(payload.exp * 1000).toISOString())
        return true
      }

      // Token age security check (prevent very old tokens)
      const tokenAge = Date.now() - (payload.iat * 1000)
      const maxTokenAge = 24 * 60 * 60 * 1000 // 24 hours
      if (tokenAge > maxTokenAge) {
        console.warn('❌ JWT token too old, forcing refresh')
        return true
      }

      return false // Token is valid
    } catch (error) {
      console.error('❌ Error parsing JWT token:', error)
      return true // Consider invalid tokens as expired for security
    }
  }, [])

  /**
   * Comprehensive cleanup function to clear all authentication data
   * 
   * Removes all stored authentication data from localStorage, sessionStorage,
   * and cookies to ensure complete logout and prevent data leakage.
   */
  const clearAllAuthData = useCallback(() => {
    // Only execute in browser environment
    if (typeof window === 'undefined') {
      return
    }

    try {
      // Clear localStorage authentication data
      const localStorageKeys = [
        'accessToken',
        'refreshToken', 
        'user',
        'hasVisitedBefore'
      ]
      localStorageKeys.forEach(key => localStorage.removeItem(key))
      
      // Clear localStorage authentication data (including session flags)
      const additionalLocalStorageKeys = [
        'authSessionStarted',
        'loginRedirected'
      ]
      additionalLocalStorageKeys.forEach(key => localStorage.removeItem(key))
      
      // Clear domain-specific session flags
      const currentDomain = window.location.hostname
      localStorage.removeItem(`authSession_${currentDomain}`)
      
      // Clear authentication cookies
      const domain = window.location.hostname
      const cookieNames = ['accessToken', 'userRole']
      cookieNames.forEach(name => {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}`
      })
      
      // Clear cookies for parent domain (production)
      if (domain.includes('akazubaflorist.com')) {
        const parentDomain = 'akazubaflorist.com'
        cookieNames.forEach(name => {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${parentDomain}`
        })
      }
      
      console.log('🧹 All authentication data cleared successfully')
    } catch (error) {
      console.error('❌ Error clearing authentication data:', error)
    } finally {
      // Always clear user state, even if storage clearing fails
      setUser(null)
    }
  }, [])

  /**
   * Initialize authentication state
   * 
   * Performs one-time initialization of authentication state by checking
   * for existing tokens and validating them. Prevents multiple concurrent
   * initializations for better performance and reliability.
   */
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) {
      console.log('🚀 Authentication already initialized, skipping...')
      return
    }

    let isInitializing = false
    
    const initializeAuth = async () => {
      if (isInitializing) {
        console.log('🚀 Authentication initialization already in progress, skipping...')
        return
      }
      
      isInitializing = true
      
      try {
        console.log('🚀 Initializing authentication system...')
        
        // Check if we're in browser environment before accessing localStorage
        if (typeof window === 'undefined') {
          console.log('🚀 Skipping auth initialization - server-side rendering')
          setIsInitialized(true)
          return
        }

        // Prevent multiple initializations
        if (isInitialized) {
          console.log('🚀 Authentication already initialized, skipping...')
          return
        }
        
        console.log('🚀 Starting authentication initialization...')
        
        // Check for existing valid tokens in both development and production
        const token = localStorage.getItem('accessToken')
        const storedUser = localStorage.getItem('user')
        
        console.log('🔍 Initial auth state check:', { 
          hasToken: !!token, 
          hasStoredUser: !!storedUser,
          tokenPreview: token ? token.substring(0, 20) + '...' : 'null'
        })
        
        // SECURITY FIX: Prevent cross-domain session leakage
        // Only sync authentication within the same domain family
        const currentDomain = window.location.hostname
        const isCustomDomain = currentDomain === 'akazubaflorist.com' || currentDomain === 'www.akazubaflorist.com'
        const isVercelDomain = currentDomain.includes('vercel.app')
        
        // Check if this domain has its own valid session
        const domainSpecificSession = localStorage.getItem(`authSession_${currentDomain}`)
        
        if ((isCustomDomain || isVercelDomain) && token && storedUser && domainSpecificSession) {
          console.log('🌐 Cross-domain auth sync for:', currentDomain)
          // Only sync if this domain already has a valid session
          const userData = JSON.parse(storedUser)
          if (userData.role) {
            const isProduction = currentDomain !== 'localhost'
            const roleCookieOptions = isProduction 
              ? `userRole=${userData.role}; path=/; max-age=86400; samesite=lax; secure`
              : `userRole=${userData.role}; path=/; max-age=86400; samesite=lax`
            document.cookie = roleCookieOptions
            
            const tokenCookieOptions = isProduction 
              ? `accessToken=${token}; path=/; max-age=86400; samesite=lax; secure`
              : `accessToken=${token}; path=/; max-age=86400; samesite=lax`
            document.cookie = tokenCookieOptions
            
            console.log('🍪 Cross-domain cookies synced for:', currentDomain)
          }
        } else if ((isCustomDomain || isVercelDomain) && !domainSpecificSession) {
          // SECURITY: Clear any cross-domain tokens if no valid session exists for this domain
          console.log('🔒 Clearing cross-domain tokens for:', currentDomain)
          clearAllAuthData()
          setUser(null)
          return // Exit early to prevent unauthorized access
        }
        
        // Check if this is a fresh session (no localStorage flag)
        const hasSessionFlag = localStorage.getItem('authSessionStarted')
        if (!hasSessionFlag) {
          console.log('🆕 Fresh session detected, checking for valid tokens...')
          
          // Only clear data if there's no valid token OR if token is expired
          if (!token) {
            console.log('🔓 No token found, clearing any stale auth data')
            clearAllAuthData()
            setUser(null)
          } else if (isTokenExpired(token)) {
            console.log('⏰ Token is expired, clearing auth data')
            clearAllAuthData()
            setUser(null)
          } else {
            console.log('🔑 Valid token found, will validate it')
          }
          
          // Mark this session as started
          localStorage.setItem('authSessionStarted', 'true')
        }
        
        // For security, always validate token on initialization
        if (token) {
          console.log('🔍 Found existing token, validating...')
          
          // SECURITY: Check if this domain has a valid session
          const currentDomain = window.location.hostname
          const domainSpecificSession = localStorage.getItem(`authSession_${currentDomain}`)
          
          if (!domainSpecificSession) {
            console.log('🔒 No domain-specific session found, setting it now for:', currentDomain)
            // Set the domain-specific session if it doesn't exist but we have a valid token
            localStorage.setItem(`authSession_${currentDomain}`, 'true')
            console.log('🔒 Domain-specific session created for:', currentDomain)
          }
          
          try {
            // Check if token is expired first
            if (isTokenExpired(token)) {
              console.log('⏰ Token is expired, clearing auth data')
              clearAllAuthData()
              setUser(null)
              return
            }
            
            // Always validate token first before setting user
            await validateAndSetUser(token)
          } catch (error) {
            console.error('❌ Token validation failed:', error)
            
            // If validation failed but it's a network error, try using stored user data
            if (error instanceof Error && error.message.includes('Network error')) {
              console.log('🌐 Backend unavailable during initialization, using stored user data')
              const storedUser = localStorage.getItem('user')
              if (storedUser) {
                try {
                  const user = JSON.parse(storedUser)
                  setUser(user)
                  console.log('👤 Using stored user data during initialization:', user.email)
                  return // Don't clear auth data for network errors
                } catch (parseError) {
                  console.error('❌ Failed to parse stored user data:', parseError)
                }
              }
            }
            
            // Only clear auth data for actual authentication errors
            console.warn('❌ Clearing auth data due to validation failure')
            clearAllAuthData()
            setUser(null)
          }
        } else {
          console.log('🔓 No existing token found')
          setUser(null)
          // Clear any stale data
          clearAllAuthData()
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
        
        // Final state check
        const finalToken = localStorage.getItem('accessToken')
        const finalUser = localStorage.getItem('user')
        console.log('🔍 Final authentication state:', { 
          isAuthenticated: !!finalToken, 
          hasUser: !!finalUser,
          isInitialized: true 
        })
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
        
        // Set cookies for middleware with cross-domain support
        if (response.data.user.role) {
          const isProduction = typeof window !== 'undefined' && typeof window.location !== 'undefined' && window.location.hostname !== 'localhost'
          const currentDomain = typeof window !== 'undefined' ? window.location.hostname : ''
          
          // Set cookie for current domain
          const roleCookieOptions = isProduction 
            ? `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax; secure`
            : `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax`
          document.cookie = roleCookieOptions
          
          // Also set access token cookie for current domain
          const accessToken = localStorage.getItem('accessToken')
          if (accessToken) {
            const tokenCookieOptions = isProduction 
              ? `accessToken=${accessToken}; path=/; max-age=86400; samesite=lax; secure`
              : `accessToken=${accessToken}; path=/; max-age=86400; samesite=lax`
            document.cookie = tokenCookieOptions
          }
          
          console.log('🍪 User role cookie set (regular login):', response.data.user.role)
          console.log('🍪 Access token cookie set for domain:', currentDomain)
          
          // Verify cookie was set
          setTimeout(() => {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
              const [key, value] = cookie.trim().split('=')
              acc[key] = value
              return acc
            }, {} as Record<string, string>)
            console.log('🍪 All cookies after setting userRole (regular login):', cookies)
            console.log('🍪 userRole cookie value:', cookies.userRole)
          }, 100)
        }
      } else {
        console.warn('❌ Token validation failed - invalid response')
        throw new Error('Invalid token response')
      }
    } catch (error) {
      console.error('❌ Token validation error:', error)
      
      // Check if this is a network/backend error vs actual auth error
      if (error instanceof Error && error.message.includes('Network error')) {
        console.log('🌐 Backend unavailable, using stored user data temporarily')
        // Don't clear auth data if backend is just unavailable
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            setUser(user)
            console.log('👤 Using stored user data:', user.email)
            return // Don't throw error, just use stored data
          } catch (parseError) {
            console.error('❌ Failed to parse stored user data:', parseError)
          }
        }
      }
      
      // Only clear auth data for actual authentication errors, not network errors
      console.warn('❌ Authentication validation failed, clearing auth data')
      clearAllAuthData()
      setUser(null)
      throw error // Re-throw to trigger the catch in initialization
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
          // Set cookie for current domain
          const domain = window.location.hostname
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400; samesite=lax; domain=${domain}`
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
            const domain = window.location.hostname
            document.cookie = `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax; domain=${domain}`
          }
        }
        
        // Set visited flag
        localStorage.setItem('hasVisitedBefore', 'true')
        
        // Set domain-specific session flag for security
        const currentDomain = window.location.hostname
        localStorage.setItem(`authSession_${currentDomain}`, 'true')
        console.log('🔒 Domain-specific session set for:', currentDomain)
        
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
          const isProduction = typeof window !== 'undefined' && typeof window.location !== 'undefined' && window.location.hostname !== 'localhost'
          const cookieOptions = isProduction 
            ? `accessToken=${response.data.accessToken}; path=/; max-age=86400; samesite=lax; secure`
            : `accessToken=${response.data.accessToken}; path=/; max-age=86400; samesite=lax; domain=localhost`
          document.cookie = cookieOptions
          console.log('🍪 Access token cookie set with options:', cookieOptions)
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
            const isProduction = typeof window !== 'undefined' && typeof window.location !== 'undefined' && window.location.hostname !== 'localhost'
            const roleCookieOptions = isProduction 
              ? `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax; secure`
              : `userRole=${response.data.user.role}; path=/; max-age=86400; samesite=lax; domain=localhost`
            document.cookie = roleCookieOptions
            console.log('🍪 User role cookie set with options:', roleCookieOptions)
          
          // Verify cookie was set
          setTimeout(() => {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
              const [key, value] = cookie.trim().split('=')
              acc[key] = value
              return acc
            }, {} as Record<string, string>)
            console.log('🍪 All cookies after setting userRole:', cookies)
            console.log('🍪 userRole cookie value:', cookies.userRole)
          }, 100)
        }
        }
        
        // Force a delay to ensure cookies are set and processed by middleware
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Double-check that cookies are set
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=')
          acc[key] = value
          return acc
        }, {} as Record<string, string>)
        
        if (!cookies.userRole || cookies.userRole !== 'ADMIN') {
          console.error('❌ userRole cookie not set correctly after admin login')
          console.log('🍪 Current cookies:', cookies)
          // Try setting the cookie again with a different approach
          document.cookie = `userRole=ADMIN; path=/; max-age=86400; samesite=lax; domain=localhost`
          console.log('🔄 Retried setting userRole cookie with domain=localhost')
          
          // Also try without domain
          document.cookie = `userRole=ADMIN; path=/; max-age=86400; samesite=lax`
          console.log('🔄 Also tried setting userRole cookie without domain')
        }
        
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
      
      // Clear domain-specific session flags
      const currentDomain = window.location.hostname
      localStorage.removeItem(`authSession_${currentDomain}`)
      
      // Clear cookies for all possible domains
      const domains = ['akazubaflorist.com', 'www.akazubaflorist.com', 'akazuba-florist.vercel.app']
      domains.forEach(domain => {
        document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`
        document.cookie = `userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`
      })
      console.log('🍪 Cross-domain cookies cleared')
      console.log('🔒 Domain-specific session cleared for:', currentDomain)
      
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