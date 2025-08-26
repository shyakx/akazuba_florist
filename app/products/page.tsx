'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useProducts } from '@/contexts/ProductsContext'
import ProductCard from '@/components/ProductCard'
import { realFlowerProducts } from '@/data/real-flowers'
import { Filter, Grid, List, Search } from 'lucide-react'

// Color configuration
const colorConfig = [
  { 
    name: 'Red', 
    value: 'red', 
    bg: 'bg-red-50', 
    border: 'border-red-200', 
    text: 'text-red-800',
    accent: 'bg-red-500'
  },
  { 
    name: 'Pink', 
    value: 'pink', 
    bg: 'bg-pink-50', 
    border: 'border-pink-200', 
    text: 'text-pink-800',
    accent: 'bg-pink-500'
  },
  { 
    name: 'White', 
    value: 'white', 
    bg: 'bg-gray-50', 
    border: 'border-gray-200', 
    text: 'text-gray-800',
    accent: 'bg-gray-500'
  },
  { 
    name: 'Yellow', 
    value: 'yellow', 
    bg: 'bg-yellow-50', 
    border: 'border-yellow-200', 
    text: 'text-yellow-800',
    accent: 'bg-yellow-500'
  },
  { 
    name: 'Orange', 
    value: 'orange', 
    bg: 'bg-orange-50', 
    border: 'border-orange-200', 
    text: 'text-orange-800',
    accent: 'bg-orange-500'
  },
  { 
    name: 'Purple', 
    value: 'purple', 
    bg: 'bg-purple-50', 
    border: 'border-purple-200', 
    text: 'text-purple-800',
    accent: 'bg-purple-500'
  },
  { 
    name: 'Mixed', 
    value: 'mixed', 
    bg: 'bg-gradient-to-r from-pink-50 to-purple-50', 
    border: 'border-purple-200', 
    text: 'text-purple-800',
    accent: 'bg-gradient-to-r from-pink-500 to-purple-500'
  }
]

const ProductsPage = () => {
  const { state } = useProducts()
  const { products, isLoading } = state

  const [selectedColor, setSelectedColor] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fallback data in case context fails
  const fallbackProducts = realFlowerProducts.map((product, index) => ({
    ...product,
    id: index + 1,
    featured: index < 8
  }))

  // Use products from context or fallback
  const allProducts = products.length > 0 ? products : fallbackProducts

  // Filter products based on search and color
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesColor = selectedColor === 'all' || product.color === selectedColor
    return matchesSearch && matchesColor
  })

  // Group products by color for display
  const productsByColor = colorConfig.map(color => ({
    ...color,
    products: filteredProducts.filter(product => product.color === color.value)
  })).filter(colorGroup => colorGroup.products.length > 0)

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading all flowers...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              All Flowers
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of {allProducts.length} beautiful flowers, 
              carefully organized by color to help you find the perfect blooms
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search flowers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Color Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All Colors</option>
                {colorConfig.map(color => (
                  <option key={color.value} value={color.value}>
                    {color.name} ({allProducts.filter(p => p.color === color.value).length})
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {allProducts.length} flowers
          </div>
        </div>
      </div>

      {/* Products Display */}
      <div className="container mx-auto px-4 py-8">
        {selectedColor === 'all' ? (
          // Show all products organized by color
          <div className="space-y-12">
            {productsByColor.map((colorGroup, colorIndex) => (
              <motion.div
                key={colorGroup.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: colorIndex * 0.1 }}
                className={`rounded-2xl p-6 ${colorGroup.bg} ${colorGroup.border} border-2`}
              >
                {/* Color Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${colorGroup.accent}`}></div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {colorGroup.name} Flowers
                    </h2>
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                      {colorGroup.products.length} products
                    </span>
                  </div>
                </div>

                {/* Products Grid */}
                <div className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {colorGroup.products.map((product, productIndex) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: productIndex * 0.05 }}
                    >
                      <ProductCard 
                        product={product}
                        showRating={true}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Show filtered products in a single grid
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <ProductCard 
                  product={product}
                  showRating={true}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No flowers found</h3>
            <p className="text-gray-500">Try adjusting your search or color filter</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
