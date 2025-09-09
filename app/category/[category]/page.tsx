'use client'

import React from 'react'
import { useProducts } from '@/contexts/ProductsContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { flowerCategories, perfumeCategories, Category } from '@/data/categories'
import { findProductCategories, getCategoryMappingById } from '@/data/category-product-mapping'
import Link from 'next/link'

const CategoryPage = ({ params }: { params: { category: string } }) => {
  const { products, isLoading } = useProducts()
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()
  const category = params.category
  
  // Simple console log to verify component is working
  console.log('🚀 CategoryPage: Component mounted', { category, productsCount: products?.length || 0 })

  // Find the specific category details
  const categoryDetails = React.useMemo(() => {
    const allCategories = [...flowerCategories, ...perfumeCategories]
    return allCategories.find(cat => cat.id === category || cat.name.toLowerCase() === category.toLowerCase())
  }, [category])

  // Get category mapping for better product filtering
  const categoryMapping = React.useMemo(() => {
    return getCategoryMappingById(category)
  }, [category])

  // Filter products by category using the new mapping system
  const filteredProducts = React.useMemo(() => {
    if (!products || products.length === 0) return []
    
    console.log('🔍 Filtering products for category:', category)
    console.log('📊 Total products available:', products.length)
    
    if (category === 'flowers' || category === 'flower') {
      // Filter for all flower products
      const flowerProducts = products.filter(product => 
        product.categoryName?.toLowerCase() === 'flowers'
      )
      
      console.log('🌸 Flower products found:', flowerProducts.length)
      return flowerProducts
    }
    
    if (category === 'perfumes' || category === 'perfume') {
      // Filter for all perfume products
      const perfumeProducts = products.filter(product => 
        product.categoryName?.toLowerCase() === 'perfumes'
      )
      
      console.log('💎 Perfume products found:', perfumeProducts.length)
      return perfumeProducts
    }
    
    // For specific subcategories, use the new mapping system
    if (categoryMapping) {
      const subcategoryProducts = products.filter(product => {
        // Check if product has explicit category IDs
        if (product.categoryIds && product.categoryIds.includes(category)) {
          return true
        }
        
        // Fallback to keyword matching
        const productCategories = findProductCategories(product)
        return productCategories.includes(category)
      })
      
      console.log(`🎯 ${categoryMapping.categoryName} products found:`, subcategoryProducts.length)
      return subcategoryProducts
    }
    
    // For other categories, return all products
    return products
  }, [products, category, categoryDetails, categoryMapping])

  // Get related categories for navigation
  const relatedCategories = React.useMemo(() => {
    if (categoryDetails?.type === 'flowers') {
      return flowerCategories.filter(cat => cat.id !== category)
    } else if (categoryDetails?.type === 'perfumes') {
      return perfumeCategories.filter(cat => cat.id !== category)
    }
    return []
  }, [categoryDetails, category])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
              {categoryDetails?.name || category} Collection
            </h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading beautiful products...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show no products message
  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
              {categoryDetails?.name || category} Collection
            </h1>
            <p className="text-gray-600">No {categoryDetails?.name || category} found.</p>
            {relatedCategories.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3">Explore related categories:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {relatedCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200 transition-colors"
                    >
                      {cat.icon} {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Display filtered products
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {categoryDetails?.icon && (
              <span className="text-4xl">{categoryDetails.icon}</span>
            )}
            <h1 className="text-4xl font-bold text-gray-900 capitalize">
              {categoryDetails?.name || category} Collection
          </h1>
          </div>
          {categoryDetails?.description && (
            <p className="text-lg text-gray-700 mb-2 max-w-2xl mx-auto">
              {categoryDetails.description}
            </p>
          )}
          <p className="text-gray-600">
            {filteredProducts.length} beautiful {categoryDetails?.type === 'perfumes' ? 'fragrances' : 'products'} found
          </p>
          
          {/* Category Features */}
          {categoryDetails?.features && categoryDetails.features.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Features:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {categoryDetails.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white bg-opacity-70 text-gray-700 rounded-full text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Categories Navigation */}
        {relatedCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Explore More {categoryDetails?.type === 'perfumes' ? 'Perfume' : 'Flower'} Categories
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{cat.name}</div>
                    <div className="text-xs text-gray-500">{cat.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
            />
          ))}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default CategoryPage 
