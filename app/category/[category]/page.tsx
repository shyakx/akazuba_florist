'use client'

import React from 'react'
import { useProducts } from '@/contexts/ProductsContext'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

// Format price function for RWF currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price)
}

const CategoryPage = ({ params }: { params: { category: string } }) => {
  const { state } = useProducts()
  const { products, isLoading } = state
  
  // Cache busting identifier: rwf-fix-2025-08-17-23-55-v4
  const category = params.category
  
  // Filter products based on category
  let filteredProducts = products
  
  if (category && products.length > 0) {
    const flowerTypes = Array.from(new Set(products.map(p => p.type?.toLowerCase() || '').filter(Boolean)))
    const flowerColors = Array.from(new Set(products.map(p => p.color?.toLowerCase() || '').filter(Boolean)))
    
    if (category === 'colors') {
      filteredProducts = products.filter(p => p.color !== 'mixed')
    } else if (category === 'mixed') {
      // Show mixed color flowers for bouquets
      filteredProducts = products.filter(p => p.color === 'mixed')
    } else if (flowerTypes.includes(category.toLowerCase())) {
      filteredProducts = products.filter(p => 
        p.type?.toLowerCase() === category.toLowerCase()
      )
    } else if (flowerColors.includes(category.toLowerCase())) {
      filteredProducts = products.filter(p => 
        p.color?.toLowerCase() === category.toLowerCase()
      )
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
              {category === 'colors' ? 'All Colors' : category === 'mixed' ? 'Mixed Bouquets' : category} Collection
            </h1>
            <p className="text-gray-600">Loading beautiful flowers...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50 rwf-category-page-v4">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
            {category === 'colors' ? 'All Colors' : category === 'mixed' ? 'Mixed Bouquets' : category} Collection
          </h1>
          <p className="text-gray-600">
            Discover our beautiful selection of {category === 'colors' ? 'colorful flowers' : category === 'mixed' ? 'mixed bouquets' : category}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              showRating={true}
            />
          ))}
        </div>

        {/* No Products Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">We couldn&apos;t find any products in this category.</p>
            <Link href="/" className="btn-primary">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CategoryPage 