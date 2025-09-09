'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { Product } from '@/types'
import ProductCard from './ProductCard'
import { flowerCategories, perfumeCategories } from '@/data/categories'

interface ProductsGridProps {
  products: Product[]
  title?: string
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  title = "Our Products",
  onAddToCart,
  onAddToWishlist
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')


  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'flowers') {
        filtered = filtered.filter(product => product.categoryName === 'Flowers')
      } else if (selectedCategory === 'perfumes') {
        filtered = filtered.filter(product => product.categoryName === 'Perfumes')
      } else {
        // Filter by specific subcategory
        filtered = filtered.filter(product => 
          product.categoryIds?.includes(selectedCategory) || false
        )
      }
    }

    return filtered
  }, [products, searchQuery, selectedCategory])

  const mainCategories = [
    { id: 'all', name: 'All Products' },
    { id: 'flowers', name: 'Flowers' },
    { id: 'perfumes', name: 'Perfumes' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">Discover our beautiful collection</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              {mainCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold">{products.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🌸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No products match "${searchQuery}"`
                : 'Try adjusting your filters'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsGrid
