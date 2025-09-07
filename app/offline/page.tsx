'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Wifi, WifiOff, RefreshCw, Home, ShoppingCart, Heart } from 'lucide-react'

/**
 * Offline Page Component
 * 
 * Displays when the user is offline and provides:
 * - Clear offline status indication
 * - Retry connection functionality
 * - Navigation to cached pages
 * - Information about offline capabilities
 * 
 * @returns JSX element
 */
export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Initial check
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    
    // Force a network check
    fetch('/api/health', { 
      method: 'HEAD',
      cache: 'no-cache'
    })
    .then(() => {
      setIsOnline(true)
      // Redirect to home page when back online
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    })
    .catch(() => {
      // Still offline
      setIsOnline(false)
    })
  }

  if (isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <Wifi className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            You're Back Online!
          </h1>
          <p className="text-green-600 mb-4">
            Redirecting you to the homepage...
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mb-8">
          <WifiOff className="mx-auto h-24 w-24 text-gray-400" />
        </div>

        {/* Main Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          It looks like you're not connected to the internet. Don't worry, you can still browse some of our content!
        </p>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          disabled={retryCount > 3}
          className="w-full mb-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${retryCount > 0 ? 'animate-spin' : ''}`} />
          {retryCount > 3 ? 'Still Offline' : 'Try Again'}
        </button>

        {/* Available Offline Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Offline
          </h2>
          
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-700">Homepage</span>
            </Link>
            
            <Link
              href="/products"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-gray-700">Browse Products</span>
            </Link>
            
            <Link
              href="/about"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart className="w-5 h-5 text-pink-600 mr-3" />
              <span className="text-gray-700">About Us</span>
            </Link>
          </div>
        </div>

        {/* Offline Features Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Offline Features
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Browse previously viewed products</li>
            <li>• View cached product information</li>
            <li>• Access saved favorites</li>
            <li>• Read about our services</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-gray-500">
          <p className="mb-2">
            Need help? Contact us when you're back online:
          </p>
          <p className="font-medium">
            📞 +250 XXX XXX XXX
          </p>
          <p className="font-medium">
            ✉️ info@akazuba.com
          </p>
        </div>

        {/* Retry Counter */}
        {retryCount > 0 && (
          <div className="mt-4 text-xs text-gray-400">
            Retry attempts: {retryCount}
          </div>
        )}
      </div>
    </div>
  )
}
