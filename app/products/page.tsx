'use client'

import React from 'react'
import { useProducts } from '@/contexts/ProductsContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import ProductsGrid from '@/components/ProductsGrid'
import Footer from '@/components/Footer'

const ProductsPage = () => {
  const { products, isLoading } = useProducts()
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()


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
        onAddToCart={addToCart}
        onAddToWishlist={addToWishlist}
      />
      <Footer />
    </>
  )
}

export default ProductsPage
