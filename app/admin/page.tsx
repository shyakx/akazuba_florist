'use client'

import React from 'react'
import Link from 'next/link'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Akazuba Florist Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to the admin panel. Please login to access full features.
          </p>
          
          <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Access
            </h2>
            <div className="space-y-4">
              <Link 
                href="/admin/login"
                className="block w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 text-center"
              >
                Login to Admin Panel
              </Link>
              
              <Link 
                href="/admin/enhanced"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Enhanced Admin Panel (Direct Access)
              </Link>
              
              <Link 
                href="/admin/test-simple"
                className="block w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                Simple Test Page
              </Link>
              
              <Link 
                href="/test-orders-simple"
                className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                Test Orders System
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>If you're seeing this page, the basic admin structure is working.</p>
            <p>Use the links above to access different admin features.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 
