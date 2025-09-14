'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/RealAuthContext'
import { Eye, EyeOff, Lock, User, Flower2, Shield, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { secureLogger } from '@/lib/secureLogger'

export default function UnifiedLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasRedirected, setHasRedirected] = useState(false)

  // Check if we've already redirected in this session
  const [sessionRedirected, setSessionRedirected] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('loginRedirected') === 'true'
    }
    return false
  })

  const router = useRouter()
  const { login, adminLogin, isAuthenticated, user, isLoading: authLoading, isInitialized } = useAuth()                                                                               


  // Redirect if already authenticated - with more robust logic
  React.useEffect(() => {
    secureLogger.debug('Redirection check', {
      isInitialized,
      authLoading,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role,
      hasRedirected,
      sessionRedirected
    })

    // Only redirect if we have stable authentication state and haven't redirected in this session                                                                                    
    if (isInitialized && !authLoading && isAuthenticated && user && !hasRedirected && !sessionRedirected) {                                                                           

      secureLogger.system('REDIRECTION CONDITIONS MET - PROCEEDING WITH REDIRECT')
      setHasRedirected(true) // Prevent multiple redirects
      setSessionRedirected(true) // Mark session as redirected

      // Store in localStorage for better persistence across sessions
      if (typeof window !== 'undefined') {
        localStorage.setItem('loginRedirected', 'true')
        localStorage.setItem('lastLoginTime', Date.now().toString())
        localStorage.setItem('userRole', user.role)
      }

      // Determine redirect URL based on user role and login type
      let redirectUrl = '/dashboard' // Default to customer dashboard

      if (user.role === 'ADMIN') {
        redirectUrl = '/admin'
        secureLogger.system('Admin user detected, redirecting to:', redirectUrl)
      } else {
        secureLogger.system('Customer user detected, redirecting to:', redirectUrl)
      }

      
      // Use window.location.replace for more reliable navigation
      if (typeof window !== 'undefined') {
        secureLogger.debug('Executing redirect to:', redirectUrl)
        secureLogger.user('Current user role:', user.role)
        secureLogger.auth('Current authentication state:', { isAuthenticated, isInitialized, authLoading })
        
        // Use replace to prevent back button issues and ensure clean navigation
        setTimeout(() => {
          secureLogger.system('Actually redirecting now to:', redirectUrl)
          window.location.replace(redirectUrl)
        }, 100) // Minimal delay for state stability
      }
    } else {
      secureLogger.debug('Redirection blocked', {
        isInitialized,
        authLoading,
        isAuthenticated,
        hasUser: !!user,
        hasRedirected,
        sessionRedirected,
        reason: !isInitialized ? 'not initialized' : 
                authLoading ? 'still loading' : 
                !isAuthenticated ? 'not authenticated' : 
                !user ? 'no user' : 
                hasRedirected ? 'already redirected' : 
                sessionRedirected ? 'session redirected' : 'unknown'
      })
    }
  }, [isInitialized, authLoading, isAuthenticated, user, hasRedirected, sessionRedirected])

  // Clear session redirect flag when user is not authenticated
  React.useEffect(() => {
    if (isInitialized && !isAuthenticated && sessionRedirected) {
      secureLogger.system('Clearing session redirect flag - user not authenticated')
      setSessionRedirected(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('loginRedirected')
        localStorage.removeItem('lastLoginTime')
        localStorage.removeItem('userRole')
      }
    }
  }, [isInitialized, isAuthenticated, sessionRedirected])

  // Emergency redirect - if user is authenticated but stuck on login page for too long
  React.useEffect(() => {
    if (isInitialized && !authLoading && isAuthenticated && user) {
      const emergencyRedirectTimer = setTimeout(() => {
        secureLogger.system('EMERGENCY REDIRECT - User authenticated but stuck on login page')
        const redirectUrl = user.role === 'ADMIN' ? '/admin' : '/dashboard'
        secureLogger.system('Force redirecting to:', redirectUrl)
        window.location.href = redirectUrl
      }, 3000) // 3 seconds emergency redirect

      return () => clearTimeout(emergencyRedirectTimer)
    }
  }, [isInitialized, authLoading, isAuthenticated, user])

  // Show loading state while authentication is initializing
  if (authLoading || !isInitialized || (isAuthenticated && hasRedirected)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">                                                                  
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>                                                                         
          <p className="text-gray-600">
            {!isInitialized ? 'Initializing authentication...' :
             isAuthenticated && hasRedirected ? 'Redirecting...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {

      let success = false

        // Auto-detect: Try admin first, then customer
      
      // Enhanced admin detection logic
      const email = formData.email.toLowerCase()
      const isLikelyAdmin = email.includes('admin') ||
                           email.includes('akazuba') ||
                           email.includes('@akazuba') ||
                           email.includes('manager') ||
                           email.includes('staff') ||
                           email.endsWith('@akazubaflorist.com') ||
                           email.endsWith('@akazuba.com')

        if (isLikelyAdmin) {
          success = await adminLogin({ username: formData.email, password: formData.password })                                                                                       

          if (success) {
          // Admin login successful
          } else {
            success = await login({ email: formData.email, password: formData.password })  
          }
        } else {
          success = await login({ email: formData.email, password: formData.password })    

          if (success) {
          // Customer login successful
          } else {
            success = await adminLogin({ username: formData.email, password: formData.password })                                                                                     
        }
      }

      
      if (success) {
        toast.success('Login successful! Redirecting...')

        // Don't manually redirect here - let the useEffect handle it
        // The authentication state change will trigger the automatic redirection
        // This prevents conflicts between manual and automatic redirection

      } else {
        toast.error('Invalid credentials. Please check your email and password.')
        setError('Invalid credentials. Please check your email and password.')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed. Please try again.')
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (error) {
      setError('')
    }
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"                                                                                  
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Flower2 className="h-12 w-12 text-pink-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Akazuba Florist</h1>        
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-600">Access your account</p>
          </div>


          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">                                                                                        
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">                                                                                
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"                 
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">                                                                                
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"                
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />       
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${     
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700'                                                                                
              } text-white`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>                                                                              
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <Link
              href="/forgot-password"
              className="text-sm text-pink-600 hover:text-pink-700 transition-colors"      
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-pink-600 hover:text-pink-700 transition-colors">                                                                                 
                Sign up
              </Link>
            </div>
            
            {/* Fallback redirect for authenticated users */}
            {isAuthenticated && user && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600 mb-2">You're already logged in as {user.role}!</p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const redirectUrl = user.role === 'ADMIN' ? '/admin' : '/dashboard'
                      secureLogger.system('Manual redirect to:', redirectUrl)
                      window.location.replace(redirectUrl)
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors mr-2"
                  >
                    Go to {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
                  </button>
                  <button
                    onClick={() => {
                      secureLogger.system('Clearing redirect flags and retrying...')
                      setHasRedirected(false)
                      setSessionRedirected(false)
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('loginRedirected')
                      }
                      // Force a re-render to trigger redirection
                      setTimeout(() => {
                        const redirectUrl = user.role === 'ADMIN' ? '/admin' : '/dashboard'
                        window.location.replace(redirectUrl)
                      }, 100)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Reset & Retry
                  </button>
                  <button
                    onClick={() => {
                      secureLogger.system('Force redirect - bypassing all checks')
                      const redirectUrl = user.role === 'ADMIN' ? '/admin' : '/dashboard'
                      // Force redirect immediately
                      window.location.href = redirectUrl
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Force Redirect
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}