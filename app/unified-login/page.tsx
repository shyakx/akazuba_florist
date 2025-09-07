'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/RealAuthContext'
import { Eye, EyeOff, Lock, User, Flower2, Shield, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UnifiedLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginType, setLoginType] = useState<'auto' | 'admin' | 'customer'>('auto')
  
  const router = useRouter()
  const { login, adminLogin, isAuthenticated, user, isLoading: authLoading, isInitialized } = useAuth()

  // Debug authentication states
  console.log('🔍 Unified Login Debug:', {
    isInitialized,
    authLoading,
    isAuthenticated,
    userRole: user?.role,
    userEmail: user?.email,
    loginType
  })

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      console.log('✅ User already authenticated, redirecting...')
      console.log('🔍 User details:', { role: user.role, email: user.email })
      
      // Add a small delay to ensure cookies are properly set
      setTimeout(() => {
        if (user.role === 'ADMIN') {
          console.log('🚀 Redirecting to admin panel...')
          window.location.href = '/admin'
        } else {
          console.log('🚀 Redirecting to dashboard...')
          window.location.href = '/dashboard'
        }
      }, 100)
    }
  }, [isAuthenticated, user, isInitialized])

  // Show loading state while authentication is initializing
  if (authLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!isInitialized ? 'Initializing authentication...' : 'Loading...'}
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
      console.log('🚀 Starting unified login process...')
      console.log('Login type:', loginType)
      
      let success = false
      
      if (loginType === 'admin') {
        // Force admin login
        console.log('🔐 Attempting admin login...')
        success = await adminLogin({ username: formData.email, password: formData.password })
      } else if (loginType === 'customer') {
        // Force customer login
        console.log('👤 Attempting customer login...')
        success = await login({ email: formData.email, password: formData.password })
      } else {
        // Auto-detect: Try admin first, then customer
        console.log('🔄 Auto-detecting login type...')
        
        // Try admin login first
        success = await adminLogin({ username: formData.email, password: formData.password })
        
        if (!success) {
          console.log('❌ Admin login failed, trying customer login...')
          // Try customer login
          success = await login({ email: formData.email, password: formData.password })
        }
      }
      
      console.log('🔍 Login result:', success)
      
      if (success) {
        toast.success('Login successful!')
        console.log('🎉 Login successful, redirecting...')
        
        // Wait for state to update, then redirect based on login type
        setTimeout(() => {
          if (loginType === 'admin' || (loginType === 'auto' && formData.email.includes('admin'))) {
            console.log('🚀 Redirecting to admin panel...')
            window.location.href = '/admin'
          } else {
            console.log('🚀 Redirecting to dashboard...')
            window.location.href = '/dashboard'
          }
        }, 2000)
        
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          {/* Login Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Login Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLoginType('auto')}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  loginType === 'auto'
                    ? 'bg-pink-100 border-pink-300 text-pink-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  loginType === 'admin'
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setLoginType('customer')}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  loginType === 'customer'
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Customer
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {loginType === 'auto' && 'Automatically detects admin or customer'}
              {loginType === 'admin' && 'Admin panel access only'}
              {loginType === 'customer' && 'Customer account access only'}
            </p>
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
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-gray-500 mr-2" />
              <p className="text-xs text-gray-600">
                Secure login with automatic role detection
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
