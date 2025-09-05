'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/RealAuthContext'
import { Eye, EyeOff, Lock, User, Flower2, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import '../admin-styles.css'

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { adminLogin, isAuthenticated, user, isLoading: authLoading, isInitialized } = useAuth()

  // Debug authentication states
  console.log('🔍 Admin Login Debug:', {
    isInitialized,
    authLoading,
    isAuthenticated,
    userRole: user?.role,
    userEmail: user?.email
  })

  // Redirect if already authenticated as admin - but only after initialization
  React.useEffect(() => {
    console.log('🔄 Admin Login useEffect triggered:', {
      isInitialized,
      isAuthenticated,
      userRole: user?.role,
      userEmail: user?.email
    })
    
    if (isInitialized && isAuthenticated && user?.role === 'ADMIN') {
      console.log('✅ Admin user already authenticated, redirecting to admin panel...')
      router.push('/admin')
    }
  }, [isAuthenticated, user, router, isInitialized])

  // Additional effect to handle redirect after successful login
  React.useEffect(() => {
    if (isInitialized && isAuthenticated && user?.role === 'ADMIN') {
      console.log('🚀 Redirecting to admin panel after successful login...')
      // Use setTimeout to ensure state updates are complete
      setTimeout(() => {
        router.push('/admin')
      }, 100)
    }
  }, [isAuthenticated, user?.role, isInitialized, router])

  // Show loading state while authentication is initializing
  if (authLoading || !isInitialized) {
    return (
      <div className="admin-panel">
        <div className="loading-state">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p>
            {!isInitialized ? 'Initializing authentication...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    
    try {
      console.log('🚀 Starting admin login process...')
      console.log('Current auth state before login:', { isAuthenticated, userRole: user?.role, isInitialized })
      
      // Use adminLogin from auth context
      const success = await adminLogin({ username: formData.username, password: formData.password })
      
      console.log('🔍 Admin login result:', success)
      console.log('Auth state after login:', { isAuthenticated, userRole: user?.role, isInitialized })
      
      if (success) {
        toast.success('Login successful!')
        console.log('🎉 Login successful, waiting for state update...')
        
        // Force a small delay to ensure state updates are complete
        setTimeout(() => {
          console.log('🔄 Checking authentication state after login...')
          console.log('Current state:', { isAuthenticated, userRole: user?.role, isInitialized })
          
          // Force redirect if state is correct
          if (isAuthenticated && user?.role === 'ADMIN') {
            console.log('🚀 Force redirecting to admin panel...')
            router.push('/admin')
          } else {
            // If state isn't updated, try to get user from localStorage
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
              try {
                const userData = JSON.parse(storedUser)
                if (userData.role === 'ADMIN') {
                  console.log('🚀 Found admin user in localStorage, redirecting...')
                  router.push('/admin')
                }
              } catch (error) {
                console.error('Error parsing stored user:', error)
              }
            }
          }
        }, 500)
        
        // Additional fallback - force redirect after 2 seconds regardless
        setTimeout(() => {
          console.log('🚀 Fallback redirect - forcing navigation to admin panel...')
          window.location.href = '/admin'
        }, 2000)
        
        // Immediate redirect attempt
        setTimeout(() => {
          console.log('🚀 Immediate redirect attempt...')
          router.replace('/admin')
        }, 100)
        
        // Redirect will happen automatically via useEffect
      } else {
        toast.error('Access denied. Admin privileges required.')
      }
    } catch (error: any) {
      console.error('Admin login error:', error)
      toast.error(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-login-container">
        {/* Login Card */}
        <div className="admin-login-card">
          {/* Header */}
          <div className="admin-login-header">
            <div className="admin-login-logo">
              <Flower2 className="w-12 h-12 text-pink-500" />
              <h1>Akazuba Florist</h1>
            </div>
            <h2>Admin Login</h2>
            <p>Access the admin panel to manage your business</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="username">
                <User className="w-4 h-4" />
                Username
              </label>
              <div className="input-with-icon">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter your username"
                  className="pl-10"
                />
                <User className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="input-with-icon">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="pl-10"
                />
                <Lock className="input-icon" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <Link
                href="/admin/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* Security Notice */}
          <div className="admin-login-security">
            <Shield className="w-5 h-5 text-gray-400" />
            <p>This is a secure admin-only area. Unauthorized access attempts will be logged.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
