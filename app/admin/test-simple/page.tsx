'use client'

import React from 'react'

const TestSimplePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Simple Admin Test Page
        </h1>
        <p className="text-gray-600 mb-6">
          This is a simple test page to check if the admin structure is working.
        </p>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Content
          </h2>
          <p className="text-gray-700">
            If you can see this content, the basic admin structure is working correctly.
          </p>
          
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800">
              ✅ Admin page is rendering successfully!
            </p>
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Navigation Links
          </h2>
          <div className="space-y-2">
            <a 
              href="/admin/enhanced" 
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              Enhanced Admin Panel
            </a>
            <a 
              href="/admin/login" 
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              Admin Login
            </a>
            <a 
              href="/test-orders-simple" 
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              Test Orders
            </a>
            <a 
              href="/" 
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestSimplePage 