'use client'

import { useEffect, useState } from 'react'

export default function TestAPIPage() {
  const [apiInfo, setApiInfo] = useState<any>(null)
  const [testResult, setTestResult] = useState<string>('')

  useEffect(() => {
    // Test the API URL logic
    const testAPI = async () => {
      try {
        // Simulate the API request logic
        const hostname = window.location.hostname
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')
        
        const baseUrl = isLocalhost ? 'http://localhost:5000/api/v1' : 'https://akazuba-backend-api.onrender.com/api/v1'
        
        setApiInfo({
          hostname,
          isLocalhost,
          baseUrl,
          fullUrl: `${baseUrl}/auth/login`
        })

        // Test the actual API call
        const response = await fetch(`${baseUrl}/health`)
        if (response.ok) {
          const data = await response.json()
          setTestResult(`✅ API Test Successful: ${JSON.stringify(data, null, 2)}`)
        } else {
          setTestResult(`❌ API Test Failed: ${response.status} ${response.statusText}`)
        }
      } catch (error: any) {
        setTestResult(`❌ API Test Error: ${error.message}`)
      }
    }

    testAPI()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API URL Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Configuration Info</h2>
          {apiInfo && (
            <div className="space-y-2 text-sm">
              <div><strong>Hostname:</strong> {apiInfo.hostname}</div>
              <div><strong>Is Localhost:</strong> {apiInfo.isLocalhost ? 'Yes' : 'No'}</div>
              <div><strong>Base URL:</strong> {apiInfo.baseUrl}</div>
              <div><strong>Full Login URL:</strong> {apiInfo.fullUrl}</div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Test Result</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {testResult || 'Testing...'}
          </pre>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/login" 
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Test Login Page
          </a>
        </div>
      </div>
    </div>
  )
}
