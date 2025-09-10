'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { flowerCategories, perfumeCategories } from '@/data/categories'
import { findProductCategories, getAllCategoryMappings } from '@/data/category-product-mapping'
import { useProducts } from '@/contexts/ProductsContext'
import { 
  Flower, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Cross, 
  GraduationCap, 
  Users, 
  Calendar, 
  Gift, 
  Plane, 
  Package 
} from 'lucide-react'
import Footer from '@/components/Footer'

const CategoriesPage = () => {
  const { products } = useProducts()
  const [categoryProductCounts, setCategoryProductCounts] = useState<Record<string, number>>({})


  // Function to get the appropriate icon component for each category
  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'wedding': <Heart className="w-16 h-16 text-pink-500" />,
      'funerals': <Cross className="w-16 h-16 text-gray-500" />,
      'graduation': <GraduationCap className="w-16 h-16 text-yellow-500" />,
      'mothers-day': <Users className="w-16 h-16 text-pink-400" />,
      'anniversary': <Heart className="w-16 h-16 text-red-500" />,
      'birthday': <Gift className="w-16 h-16 text-purple-500" />,
      'valentine': <Heart className="w-16 h-16 text-red-600" />,
      'date': <Heart className="w-16 h-16 text-rose-400" />,
      'engagement': <Heart className="w-16 h-16 text-pink-300" />,
      'airport-pickup': <Plane className="w-16 h-16 text-blue-400" />,
      'male': <Users className="w-16 h-16 text-blue-600" />,
      'female': <Users className="w-16 h-16 text-pink-500" />,
      'strong-scent': <Package className="w-16 h-16 text-purple-600" />,
      'soft-scent': <Flower className="w-16 h-16 text-green-400" />,
      'casual-everyday': <Calendar className="w-16 h-16 text-blue-400" />,
      'special-occasions': <Gift className="w-16 h-16 text-yellow-500" />
    }
    return iconMap[categoryId] || <Package className="w-16 h-16 text-gray-500" />
  }

  // Calculate product counts for each category
  useEffect(() => {
    if (products && products.length > 0) {
      const counts: Record<string, number> = {}
      
      // Get all category mappings
      const allMappings = getAllCategoryMappings()
      
      // Count products for each category
      allMappings.forEach(mapping => {
        const count = products.filter(product => {
          // Check if product has explicit category IDs
          if (product.categoryIds && product.categoryIds.includes(mapping.categoryId)) {
            return true
          }
          
          // Fallback to keyword matching
          const productCategories = findProductCategories(product)
          return productCategories.includes(mapping.categoryId)
        }).length
        
        counts[mapping.categoryId] = count
      })
      
      setCategoryProductCounts(counts)
    }
  }, [products])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Collections
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of beautiful flowers and exquisite perfumes, 
            organized by occasion and preference to help you find exactly what you're looking for.
          </p>
        </div>

        {/* Flower Categories */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Flower className="h-8 w-8 text-pink-500" />
            <h2 className="text-3xl font-bold text-gray-900">Flower Categories</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {flowerCategories.map((category) => {
              const productCount = categoryProductCounts[category.id] || 0
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
                    {/* Category Icon */}
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {getCategoryIcon(category.id)}
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    
                    {/* Product Count Badge */}
                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {productCount} product{productCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {category.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-pink-50 text-pink-700 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {category.features.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{category.features.length - 2} more
                          </span>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Perfume Categories */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h2 className="text-3xl font-bold text-gray-900">Perfume Categories</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {perfumeCategories.map((category) => {
              const productCount = categoryProductCounts[category.id] || 0
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
                    {/* Category Icon */}
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {getCategoryIcon(category.id)}
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    
                    {/* Product Count Badge */}
                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {productCount} product{productCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {category.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {category.features.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{category.features.length - 2} more
                          </span>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our search functionality allows you to find products across all categories. 
            Use the search bar to discover specific flowers, perfumes, or occasions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/search"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              Search All Products
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default CategoriesPage
