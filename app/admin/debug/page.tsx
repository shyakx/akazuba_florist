'use client'

import React from 'react'
import { useAuth } from '@/contexts/RealAuthContext'
import { useAdmin } from '@/contexts/AdminContext'

export default function AdminDebugPage() {
  const { user, isAuthenticated, isLoading, isInitialized, forceClearAuth, clearAuthData } = useAuth()
  const { backendStatus } = useAdmin()

  const handleClearAuth = () => {
    if (confirm('Are you sure you want to clear all authentication data? This will log you out.')) {
      forceClearAuth()
      window.location.href = '/unified-login'
    }
  }

  const handleSoftClearAuth = () => {
    if (confirm('Are you sure you want to clear authentication data? This will log you out.')) {
      clearAuthData()
      window.location.href = '/unified-login'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Debug Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Authentication Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Is Loading:</span>
                <span className={`text-sm font-medium ${isLoading ? 'text-yellow-600' : 'text-green-600'}`}>
                  {isLoading ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Is Initialized:</span>
                <span className={`text-sm font-medium ${isInitialized ? 'text-green-600' : 'text-red-600'}`}>
                  {isInitialized ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Is Authenticated:</span>
                <span className={`text-sm font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                  {isAuthenticated ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">User Role:</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.role || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">User Email:</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.email || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Backend Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Backend Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${
                  backendStatus === 'online' ? 'text-green-600' : 
                  backendStatus === 'offline' ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  {backendStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Local Storage Data */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Local Storage Data</h2>
          <div className="space-y-2">
            {typeof window !== 'undefined' && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Access Token:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {localStorage.getItem('accessToken') ? 'Present' : 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Refresh Token:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {localStorage.getItem('refreshToken') ? 'Present' : 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">User Data:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {localStorage.getItem('user') ? 'Present' : 'None'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={handleSoftClearAuth}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Clear Auth Data (Soft)
          </button>
          <button
            onClick={handleClearAuth}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Force Clear All Auth Data
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>

        {/* Development Helpers */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Development Helpers</h2>
            <p className="text-sm text-blue-700 mb-2">
              Available in browser console:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <code>window.clearAllAuth()</code> - Clear all authentication data</li>
              <li>• <code>window.forceClearAuth()</code> - Force clear all auth data</li>
              <li>• <code>window.resetToFirstTime()</code> - Reset to first-time user experience</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
