'use client'

import React, { useState, useEffect } from 'react'
import { useProducts } from '@/contexts/ProductsContext'
import { Product } from '@/types'

const TestAPIPage = () => {
  const { products, isLoading, error, loadProducts } = useProducts()
  const [apiTest, setApiTest] = useState<any>(null)

  // Test the API directly
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/products?limit=10')
        const data = await response.json()
        setApiTest(data)
        console.log('🔍 API Test Response:', data)
      } catch (error: any) {
        console.error('❌ API Test Error:', error)
        setApiTest({ error: error.message })
      }
    }

    testAPI()
  }, [])

  if (isLoading) {
    return <div className="p-8">Loading products from context...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      {/* Products from Context */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products from Context</h2>
          <button 
            onClick={() => {
              console.log('🔄 Manual refresh triggered')
              loadProducts()
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            🔄 Refresh Products
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Total Products:</strong> {products?.length || 0}</p>
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          {products && products.length > 0 && (
            <div className="mt-4">
              <p><strong>Sample Products:</strong></p>
              <ul className="list-disc list-inside text-sm">
                {products.slice(0, 5).map(product => (
                  <li key={product.id}>
                    {product.name} - {product.categoryName || 'No Category'} - {product.type}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Direct API Test */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Direct API Test</h2>
        <div className="bg-gray-100 p-4 rounded">
          {apiTest ? (
            <div>
              <p><strong>API Response:</strong></p>
              <p><strong>Success:</strong> {apiTest.success ? 'Yes' : 'No'}</p>
              <p><strong>Total Products:</strong> {apiTest.data?.length || 0}</p>
              <p><strong>Pagination:</strong> {JSON.stringify(apiTest.pagination)}</p>
              <pre className="text-xs bg-white p-2 rounded overflow-auto">
                {JSON.stringify(apiTest, null, 2)}
              </pre>
            </div>
          ) : (
            <p>Testing API...</p>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      {products && products.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
          <div className="bg-gray-100 p-4 rounded">
            {(() => {
              const categories = products.reduce((acc, product) => {
                const cat = product.categoryName || 'Unknown'
                acc[cat] = (acc[cat] || 0) + 1
                return acc
              }, {} as Record<string, number>)
              
              return (
                <ul className="list-disc list-inside">
                  {Object.entries(categories).map(([category, count]) => (
                    <li key={category}>
                      <strong>{category}:</strong> {count} products
                    </li>
                  ))}
                </ul>
              )
            })()}
          </div>
        </div>
      )}

      {/* Raw Products Data */}
      {products && products.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Raw Products Data (First 3)</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-xs bg-white p-2 rounded overflow-auto">
              {JSON.stringify(products.slice(0, 3), null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestAPIPage
