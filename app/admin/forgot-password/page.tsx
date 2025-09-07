'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Flower2, CheckCircle, ArrowLeft } from 'lucide-react'
import '../admin-styles.css'

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [resetLink, setResetLink] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        // In development, show the reset link
        if (data.resetLink) {
          setResetLink(data.resetLink)
        }
      } else {
        setError(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="admin-panel">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <div className="admin-login-logo">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <h1>Akazuba Florist</h1>
              </div>
              <h2>Check Your Email</h2>
              <p>We've sent you a password reset link</p>
            </div>

            <div className="admin-login-form">
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  If an account with <strong>{email}</strong> exists, you'll receive an email with instructions to reset your password.
                </p>
                
                {resetLink && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 mb-2">Development Mode - Reset Link:</p>
                    <a 
                      href={resetLink} 
                      className="text-sm text-blue-600 hover:text-blue-500 break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resetLink}
                    </a>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail('')
                      setResetLink('')
                    }}
                    className="w-full py-2 px-4 text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Try a different email
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-login-footer">
              <Link href="/unified-login" className="admin-login-link">
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-logo">
              <Flower2 className="w-12 h-12 text-pink-500" />
              <h1>Akazuba Florist</h1>
            </div>
            <h2>Forgot Password?</h2>
            <p>No worries, we'll send you reset instructions</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <div className="alert alert-error">
                <p>{error}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="input-with-icon">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="pl-10"
                />
                <Mail className="input-icon" />
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
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>

          <div className="admin-login-footer">
            <Link href="/admin/login" className="admin-login-link">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
