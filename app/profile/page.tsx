'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/RealAuthContext'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, isAuthenticated, updateProfile } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate phone (optional but if provided, should be valid)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number'
      }
    }

    // Validate password change if any password field is filled
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password'
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required'
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters'
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password'
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const updateData: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
      }

      // Only include password data if user is changing password
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const success = await updateProfile(updateData)
      
      if (success) {
        toast.success('Profile updated successfully!')
        // Clear password fields
        setFormData(prev => ({
          ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
        }))
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to update profile. Please try again.' })
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-4">
          <div className="container-wide">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-pink-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="container-wide max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Settings</h1>
            <p className="text-gray-600">Update your account information and preferences</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
          </div>
              )}

              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-pink-600" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    <input
                        id="firstName"
                        name="firstName"
                      type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                          errors.firstName 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 focus:border-pink-500'
                        }`}
                        placeholder="John"
                        disabled={isLoading}
                    />
                  </div>
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                        errors.lastName 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 focus:border-pink-500'
                      }`}
                      placeholder="Doe"
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                    )}
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                  </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                  <input
                        id="email"
                        name="email"
                    type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                          errors.email 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 focus:border-pink-500'
                        }`}
                        placeholder="info.akazubaflorist@gmail.com"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>
                
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-gray-400">(Optional)</span>
                  </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                  <input
                        id="phone"
                        name="phone"
                    type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                          errors.phone 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 focus:border-pink-500'
                        }`}
                        placeholder="+250 123 456 789"
                        disabled={isLoading}
                  />
                </div>
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-pink-600" />
                  Change Password
                </h2>
                <p className="text-gray-600 mb-6">Leave blank if you don't want to change your password</p>
                
                <div className="space-y-6">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showPasswords.currentPassword ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                          errors.currentPassword 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 focus:border-pink-500'
                        }`}
                        placeholder="Enter current password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, currentPassword: !prev.currentPassword }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={isLoading}
                      >
                        {showPasswords.currentPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
                  </div>
                    {errors.currentPassword && (
                      <p className="mt-2 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                    <input
                          id="newPassword"
                          name="newPassword"
                          type={showPasswords.newPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                            errors.newPassword 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300 focus:border-pink-500'
                          }`}
                          placeholder="Enter new password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          disabled={isLoading}
                        >
                          {showPasswords.newPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                    </button>
                  </div>
                      {errors.newPassword && (
                        <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
                      )}
                </div>

                <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                    <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPasswords.confirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                            errors.confirmPassword 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300 focus:border-pink-500'
                          }`}
                          placeholder="Confirm new password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          disabled={isLoading}
                        >
                          {showPasswords.confirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                    </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                  </div>
                </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                  </button>
                </div>
              </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProfilePage 
