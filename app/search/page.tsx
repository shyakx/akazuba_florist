'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Grid, List, Flower, Sparkles } from 'lucide-react'
import { useProducts } from '@/contexts/ProductsContext'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import Footer from '@/components/Footer'
import { Product } from '@/types'
import { flowerCategories, perfumeCategories } from '@/data/categories'
import { findProductCategories, getCategoryMappingById } from '@/data/category-product-mapping'

// Separate component that uses useSearchParams
const SearchContent = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const { products, getProductsByCategory } = useProducts()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'newest'>('name')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAllCategories, setShowAllCategories] = useState(false)

  // Filter and sort products based on search query and filters
  useEffect(() => {
    setLoading(true)
    
    let filtered = [...products]
    
    // Filter by search query
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ')
      filtered = filtered.filter((product: Product) => {
        const searchableText = [
          product.name,
          product.type,
          product.color,
          product.description,
          product.brand,
          product.categoryName,
          ...(product.tags || []),
          ...(product.categoryIds || [])
        ].join(' ').toLowerCase()
        
        return searchTerms.some(term => searchableText.includes(term))
      })
    }
    
    // Filter by category using the new mapping system
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'flowers') {
        // Filter for all flower products
        filtered = filtered.filter((product: Product) => 
          product.categoryName?.toLowerCase() === 'flowers'
        )
      } else if (categoryFilter === 'perfumes') {
        // Filter for all perfume products
        filtered = filtered.filter((product: Product) => 
          product.categoryName?.toLowerCase() === 'perfumes'
        )
      } else {
        // Filter by specific subcategory using the new mapping system
        const categoryMapping = getCategoryMappingById(categoryFilter)
        if (categoryMapping) {
          filtered = filtered.filter((product: Product) => {
            // Check if product has explicit category IDs
            if (product.categoryIds && product.categoryIds.includes(categoryFilter)) {
              return true
            }
            
            // Fallback to keyword matching
            const productCategories = findProductCategories(product)
            return productCategories.includes(categoryFilter)
          })
        }
      }
    }
    
    // Sort products
    filtered.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          // Since we don't have createdAt, sort by ID (newer products have higher IDs)
          return b.id.localeCompare(a.id)
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })
    
    setFilteredProducts(filtered)
    setLoading(false)
  }, [query, categoryFilter, sortBy, products])

  const mainCategories = [
    { id: 'all', name: 'All Categories', icon: <Flower className="w-4 h-4" /> },
    { id: 'flowers', name: 'Flowers', icon: <Flower className="w-4 h-4" /> },
    { id: 'perfumes', name: 'Perfumes', icon: <Sparkles className="w-4 h-4" /> }
  ]

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SearchBar />
        <div className="container-responsive py-8">
          <div className="container-wide">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching for products...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar />
      
      <div className="container-responsive py-8">
        <div className="container-wide">
          {/* Search Results Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-gray-600">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} for &quot;{query}&quot;
              </p>
            )}
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex flex-col gap-6">
              {/* Main Category Filter */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Main Category:</span>
                <div className="flex space-x-2">
                  {mainCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setCategoryFilter(category.id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                        categoryFilter === category.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.icon}
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Categories */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Detailed Categories:</span>
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="text-sm text-pink-600 hover:text-pink-700"
                  >
                    {showAllCategories ? 'Show Less' : 'Show All'}
                  </button>
                </div>
                
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 ${showAllCategories ? 'block' : 'hidden'}`}>
                  {/* Flower Categories */}
                  {flowerCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setCategoryFilter(category.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                        categoryFilter === category.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={category.description}
                    >
                      <span>{category.icon}</span>
                      <span className="truncate">{category.name}</span>
                    </button>
                  ))}
                  
                  {/* Perfume Categories */}
                  {perfumeCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setCategoryFilter(category.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                        categoryFilter === category.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={category.description}
                    >
                      <span>{category.icon}</span>
                      <span className="truncate">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-pink-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-pink-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-pink-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {query 
                  ? `We couldn't find any products matching "${query}". Try searching for something else.`
                  : 'Use the search bar above to find your perfect products.'
                }
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Try searching for:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Roses', 'Bouquets', 'Wedding', 'Birthday', 'Red Flowers', 'Perfumes', 'Male', 'Female', 'Strong Scent'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => router.push(`/search?q=${encodeURIComponent(suggestion)}`}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          {/* Results Summary */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 text-center text-gray-600">
              <p>
                Showing {filteredProducts.length} of {products.length} total products
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 

// Main page component with Suspense boundary
const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <SearchBar />
        <div className="container-responsive py-8">
          <div className="container-wide">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading search page...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

export default SearchPage )