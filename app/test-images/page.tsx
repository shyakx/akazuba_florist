'use client'

import React, { useState, useEffect } from 'react'
import { useProducts } from '@/contexts/ProductsContext'
import { Product } from '@/types'

const TestImagesPage = () => {
  const { products, isLoading } = useProducts()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set loading based on products context
    setLoading(isLoading)
  }, [isLoading])

  if (loading) {
    return <div className="p-8">Loading products...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">Category: {product.categoryName}</p>
            <p className="text-sm text-gray-600 mb-2">Price: RF {product.price}</p>
            
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Image Path:</p>
              <code className="text-xs bg-gray-100 p-1 rounded">{product.images?.[0] || 'No image'}</code>
            </div>
            
            <div className="aspect-square bg-gray-100 rounded overflow-hidden">
              {product.images && product.images.length > 0 && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Image failed to load for ${product.name}:`, product.images[0])
                    const target = e.target as HTMLImageElement
                    target.src = '/images/placeholder-flower.jpg'
                  }}
                  onLoad={() => {
                    console.log(`Image loaded successfully for ${product.name}:`, product.images[0])
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">No Image</p>
              </div>
              )}
                </div>
            
            <div className="mt-2">
              <p className="text-xs text-gray-500">Status: {product.isActive ? 'Active' : 'Inactive'}</p>
              <p className="text-xs text-gray-500">Featured: {product.isFeatured ? 'Yes' : 'No'}</p>
              </div>
            </div>
          ))}
        </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
        <p>Total Products: {products.length}</p>
        <p>Products with Images: {products.filter(p => p.images && p.images.length > 0).length}</p>
        <p>Products without Images: {products.filter(p => !p.images || p.images.length === 0).length}</p>
      </div>
    </div>
  )
}

export default TestImagesPage
