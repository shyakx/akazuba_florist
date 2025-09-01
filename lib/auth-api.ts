'use client'

import toast from 'react-hot-toast'

// Types
export interface User {
  id: string | number
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'ADMIN' | 'CUSTOMER'
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

// Production-only API Base URL
const getApiBaseUrl = (): string => {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    // Server-side rendering - use environment variable
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
  }

  // Client-side - check current hostname
  const hostname = window.location.hostname
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  
  console.log('🔧 API Base URL Check:')
  console.log('  - Current hostname:', hostname)
  console.log('  - Is localhost:', isLocalhost)
  console.log('  - NODE_ENV:', process.env.NODE_ENV)
  console.log('  - NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
  
  if (isLocalhost) {
    // Development - use localhost
    console.log('🔧 Using localhost API for development')
    return 'http://localhost:5000/api/v1'
  } else {
    // Production - use environment variable or production URL
    const productionUrl = process.env.NEXT_PUBLIC_API_URL || 'https://akazuba-backend-api.onrender.com/api/v1'
    console.log('🔧 Using production API:', productionUrl)
    return productionUrl
  }
}

// Base API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`
  
  console.log('🔍 API Request Debug:')
  console.log('  - Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side')
  console.log('  - Base URL:', baseUrl)
  console.log('  - Endpoint:', endpoint)
  console.log('  - Full URL:', url)
  
  // Default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  // Add auth token if available
  const accessToken = getAccessToken()
  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Add CORS mode for cross-origin requests
    mode: 'cors',
    credentials: 'include',
  }
  
  try {
    console.log('🌐 Making API request to:', url)
    console.log('📤 Request config:', {
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body
    })
    const response = await fetch(url, config)
    
    console.log('📡 Response status:', response.status)
    console.log('📡 Response headers:', response.headers)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }))
      console.log('❌ Error response body:', errorData)
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }
    
    return await response.json()
  } catch (error: any) {
    console.error(`❌ API request failed for ${endpoint}:`, error)
    console.error('🔍 Error details:', {
      message: error.message,
      type: error.type,
      name: error.name
    })
    throw error
  }
}

// Token management
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken')
  }
  return null
}

const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken')
  }
  return null
}

const storeTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }
}

const storeUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

const getStoredUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }
}

// Authentication API
export const authAPI = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await apiRequest<{
        message: string
        user: User
        accessToken: string
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      
      // Transform backend response to match expected format
      const transformedResponse: AuthResponse = {
        success: true,
        message: response.message,
        data: {
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.accessToken // Backend doesn't provide refresh token for registration yet
        }
      }
      
      // Store tokens and user data
      storeTokens(transformedResponse.data!.accessToken, transformedResponse.data!.refreshToken)
      storeUser(transformedResponse.data!.user)
      toast.success('Account created successfully!')
      
      return transformedResponse
    } catch (error: any) {
      // Provide professional error messages
      let errorMessage = 'Registration failed'
      
      if (error.message) {
        if (error.message.includes('User already exists') || error.message.includes('already exists')) {
          errorMessage = 'An account with this email already exists. Please try logging in instead.'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.'
        } else if (error.message.includes('Password') && error.message.includes('required')) {
          errorMessage = 'Please enter a password (minimum 6 characters).'
        } else if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Connection error. Please check your internet connection and try again.'
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again in a few moments.'
        } else {
          errorMessage = error.message
        }
      }
      
      toast.error(errorMessage)
      throw error
    }
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiRequest<{
        message: string
        user: User
        accessToken: string
        refreshToken: string
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      
      console.log('🔍 Backend response:', response)
      
      // Transform backend response to match expected format
      const transformedResponse: AuthResponse = {
        success: true,
        message: response.message,
        data: {
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        }
      }
      
      console.log('🔄 Transformed response:', transformedResponse)
      
      // Store tokens and user data
      storeTokens(transformedResponse.data!.accessToken, transformedResponse.data!.refreshToken)
      storeUser(transformedResponse.data!.user)
      toast.success('Login successful!')
      
      return transformedResponse
    } catch (error: any) {
      // Provide professional error messages
      let errorMessage = 'Login failed'
      
      if (error.message) {
        if (error.message.includes('Invalid credentials') || error.message.includes('401')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        } else if (error.message.includes('User not found')) {
          errorMessage = 'Account not found. Please check your email address or create a new account.'
        } else if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Connection error. Please check your internet connection and try again.'
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again in a few moments.'
        } else {
          errorMessage = error.message
        }
      }
      
      toast.error(errorMessage)
      throw error
    }
  },

  // Admin login (uses same endpoint as regular login)
  adminLogin: async (data: { username: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await apiRequest<{
        message: string
        user: User
        accessToken: string
        refreshToken: string
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: data.username, password: data.password }),
      })
      
      console.log('🔍 Admin login backend response:', response)
      
      // Check if user is admin
      if (response.user.role !== 'ADMIN') {
        throw new Error('Access denied. Admin privileges required.')
      }
      
      // Transform backend response to match expected format
      const transformedResponse: AuthResponse = {
        success: true,
        message: response.message,
        data: {
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        }
      }
      
      console.log('🔄 Admin login transformed response:', transformedResponse)
      
      // Store tokens and user data
      storeTokens(transformedResponse.data!.accessToken, transformedResponse.data!.refreshToken)
      storeUser(transformedResponse.data!.user)
      toast.success('Admin login successful!')
      
      return transformedResponse
    } catch (error: any) {
      // Provide professional error messages
      let errorMessage = 'Admin login failed'
      
      if (error.message) {
        if (error.message.includes('Invalid credentials') || error.message.includes('401')) {
          errorMessage = 'Invalid username or password. Please check your credentials and try again.'
        } else if (error.message.includes('Access denied')) {
          errorMessage = 'Access denied. Admin privileges required.'
        } else if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Connection error. Please check your internet connection and try again.'
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again in a few moments.'
        } else {
          errorMessage = error.message
        }
      }
      
      toast.error(errorMessage)
      throw error
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint to invalidate tokens on server
      await apiRequest('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      // Even if server logout fails, clear local storage
      console.warn('Server logout failed:', error)
    } finally {
      // Always clear local storage
      clearAuth()
      toast.success('Logged out successfully')
    }
  },

  // Get current user profile
  getProfile: async (): Promise<{ success: boolean; data?: { user: User } }> => {
    try {
      const response = await apiRequest<{ user: User }>('/auth/profile')
      return {
        success: true,
        data: { user: response.user }
      }
    } catch (error: any) {
      console.error('Profile fetch failed:', error)
      throw error
    }
  },

  // Refresh access token
  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      
      const response = await apiRequest<AuthResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      })
      
      if (response.success && response.data) {
        // Store new tokens and user data
        storeTokens(response.data.accessToken, response.data.refreshToken)
        storeUser(response.data.user)
      }
      
      return response
    } catch (error: any) {
      // If refresh fails, clear all auth data
      clearAuth()
      throw error
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAccessToken() && !!getStoredUser()
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return getStoredUser()
  },

  // Utility functions
  utils: {
    getAccessToken,
    getRefreshToken,
    storeTokens,
    storeUser,
    getStoredUser,
    clearAuth,
    
    // Validate email format
    validateEmail: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    // Validate password strength
    validatePassword: (password: string): { isValid: boolean; message: string } => {
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
      
      return { isValid: true, message: 'Password is strong' }
    }
  }
} 