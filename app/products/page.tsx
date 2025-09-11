'use client'

import React from 'react'
import { RefreshCw } from 'lucide-react'
import { useProducts } from '@/contexts/ProductsContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import ProductsGrid from '@/components/ProductsGrid'
import Footer from '@/components/Footer'

const ProductsPage = () => {
  const { products, isLoading, forceRefresh } = useProducts()
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()

  const handleRefresh = async () => {
    await forceRefresh()
  }


  if (isLoading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header with refresh button */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Our Complete Collection</h1>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>
        
        <ProductsGrid
          products={products || []}
          title=""
          onAddToCart={addToCart}
          onAddToWishlist={addToWishlist}
        />
      </div>
      <Footer />
    </>
  )
}

export default ProductsPage
