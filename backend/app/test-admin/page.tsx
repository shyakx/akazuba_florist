'use client'

import React from 'react'
import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'

const TestAdminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Package className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Enhanced Admin System
        </h1>
        
        <p className="text-gray-600 mb-8">
          Test the new enhanced admin panel with full product management capabilities.
        </p>
        
        <div className="space-y-4">
          <Link
                            href="/admin"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300"
          >
            <span>Access Enhanced Admin</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link
            href="/admin"
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span>Original Admin</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span>Back to Website</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">New Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• Full Product Management</li>
            <li>• Price Control & Updates</li>
            <li>• Image Upload & Management</li>
            <li>• Category Management</li>
            <li>• Product Status Control</li>
            <li>• Search & Filter Products</li>
            <li>• Real-time Preview</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TestAdminPage 