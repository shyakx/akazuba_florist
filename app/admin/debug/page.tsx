'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/RealAuthContext'

export default function AdminDebugPage() {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth()
  const [cookies, setCookies] = useState<Record<string, string>>({})
  const [localStorage, setLocalStorage] = useState<Record<string, string>>({})

  useEffect(() => {
    // Get cookies
    const cookieData = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    setCookies(cookieData)

    // Get localStorage
    const storageData: Record<string, string> = {}
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key) {
        storageData[key] = window.localStorage.getItem(key) || ''
      }
    }
    setLocalStorage(storageData)
  }, [])

  const clearAllData = () => {
    // Clear cookies
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    // Clear localStorage
    window.localStorage.removeItem('accessToken')
    window.localStorage.removeItem('refreshToken')
    window.localStorage.removeItem('user')
    window.localStorage.removeItem('hasVisitedBefore')
    
    // Reload page
    window.location.reload()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auth Context Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Auth Context Status</h2>
          <div className="space-y-2">
            <p><strong>isLoading:</strong> {isLoading ? 'true' : 'false'}</p>
            <p><strong>isInitialized:</strong> {isInitialized ? 'true' : 'false'}</p>
            <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
            <p><strong>User Role:</strong> {user?.role || 'null'}</p>
            <p><strong>User Email:</strong> {user?.email || 'null'}</p>
            <p><strong>User ID:</strong> {user?.id || 'null'}</p>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          <div className="space-y-2">
            {Object.keys(cookies).length === 0 ? (
              <p className="text-gray-500">No cookies found</p>
            ) : (
              Object.entries(cookies).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {value.length > 50 ? value.substring(0, 50) + '...' : value}
                </p>
              ))
            )}
          </div>
        </div>

        {/* LocalStorage */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage</h2>
          <div className="space-y-2">
            {Object.keys(localStorage).length === 0 ? (
              <p className="text-gray-500">No localStorage data found</p>
            ) : (
              Object.entries(localStorage).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {value.length > 50 ? value.substring(0, 50) + '...' : value}
                </p>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
            <button
              onClick={clearAllData}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear All Auth Data
            </button>
            <button
              onClick={() => window.location.href = '/unified-login'}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>

      {/* Raw Data */}
      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">User Object:</h3>
            <pre className="bg-white p-4 rounded text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">All Cookies:</h3>
            <pre className="bg-white p-4 rounded text-sm overflow-auto">
              {JSON.stringify(cookies, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
