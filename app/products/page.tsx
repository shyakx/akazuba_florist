'use client'

import React from 'react'
import { useProducts } from '@/contexts/ProductsContext'
import ProductsGrid from '@/components/ProductsGrid'
import Footer from '@/components/Footer'

const ProductsPage = () => {
  const { products, isLoading } = useProducts()

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
      <ProductsGrid
        products={products || []}
        title="Our Complete Collection"
        onAddToCart={(product) => {
          // TODO: Connect to existing cart context
          console.log('Add to cart:', product.name)
        }}
        onAddToWishlist={(product) => {
          // TODO: Connect to existing wishlist context
          console.log('Add to wishlist:', product.name)
        }}
      />
      <Footer />
    </>
  )
}

export default ProductsPage
