'use client'

import React, { useState } from 'react'
import { Trash2, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const CleanupPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [productCount, setProductCount] = useState<number | null>(null)

  const checkDatabaseStatus = async () => {
    try {
      setIsLoading(true)
      setStatus('idle')
      
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
      
      if (!token) {
        setStatus('error')
        setMessage('No authentication token found. Please log in as admin.')
        return
      }

      const response = await fetch('/api/admin/products/cleanup', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setProductCount(data.data.totalProducts)
        setStatus('success')
        setMessage(`Database contains ${data.data.totalProducts} products`)
      } else {
        setStatus('error')
        setMessage(data.message || 'Failed to check database status')
      }
    } catch (error) {
      setStatus('error')
      setMessage(`Error checking database: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const cleanupDatabase = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL products from the database!\n\nAre you sure you want to continue?')) {
      return
    }

    try {
      setIsLoading(true)
      setStatus('idle')
      
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
      
      if (!token) {
        setStatus('error')
        setMessage('No authentication token found. Please log in as admin.')
        return
      }

      const response = await fetch('/api/admin/products/cleanup', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setProductCount(0)
      } else {
        setStatus('error')
        setMessage(data.message || 'Failed to cleanup database')
      }
    } catch (error) {
      setStatus('error')
      setMessage(`Error cleaning database: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200'
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200'
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Database Cleanup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Clean up your database and prepare for fresh product imports with proper category mapping.
          </p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Important Warning</h3>
              <p className="text-yellow-700">
                This will permanently delete ALL products from your database. 
                This action cannot be undone. Make sure you have backups if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Database Status</h2>
          
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={checkDatabaseStatus}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Check Status</span>
            </button>
            
            {productCount !== null && (
              <span className="text-lg font-medium text-gray-700">
                Products in database: {productCount}
              </span>
            )}
          </div>

          {message && (
            <div className={`flex items-center space-x-3 p-4 rounded-lg border ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="font-medium">{message}</span>
            </div>
          )}
        </div>

        {/* Cleanup Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cleanup Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={cleanupDatabase}
              disabled={isLoading || productCount === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete All Products</span>
            </button>
            
            {productCount === 0 && (
              <p className="text-green-600 font-medium">
                ✅ Database is clean! Ready for fresh imports.
              </p>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
          
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <p>Clean up the database using the button above</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <p>Import the properly mapped products from <code className="bg-gray-100 px-2 py-1 rounded">data/products-with-mapped-categories.json</code></p>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <p>Verify products appear in correct categories on the customer UI</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">📁 Files Ready for Import:</h3>
            <ul className="text-blue-800 space-y-1">
              <li>• <code>data/products-with-mapped-categories.json</code> - 71 products with proper categories</li>
              <li>• <code>data/products-with-mapped-categories.csv</code> - CSV alternative</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CleanupPage
