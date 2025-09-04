'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Flower, Sparkles, Heart, Gift, Calendar, Star } from 'lucide-react'
import { useProducts } from '@/contexts/ProductsContext'

interface SearchSuggestion {
  id: string
  text: string
  icon: React.ReactNode
  category: string
}

const SearchBar = () => {
  const router = useRouter()
  const { products } = useProducts() // Updated to use the new context structure
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Search suggestions
  const suggestions: SearchSuggestion[] = [
    { id: '1', text: 'Red Roses', icon: <Flower className="w-4 h-4" />, category: 'flowers' },
    { id: '2', text: 'Valentine\'s Day', icon: <Heart className="w-4 h-4" />, category: 'occasions' },
    { id: '3', text: 'Birthday Flowers', icon: <Gift className="w-4 h-4" />, category: 'occasions' },
    { id: '4', text: 'Wedding Bouquets', icon: <Flower className="w-4 h-4" />, category: 'flowers' },
    { id: '5', text: 'Perfumes', icon: <Sparkles className="w-4 h-4" />, category: 'perfumes' },
    { id: '6', text: 'Anniversary', icon: <Calendar className="w-4 h-4" />, category: 'occasions' },
    { id: '7', text: 'Premium Flowers', icon: <Star className="w-4 h-4" />, category: 'flowers' },
  ]

  // Filter suggestions based on search query
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() && products && products.length > 0) {
      const filtered = products.filter((product: any) =>
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.type && product.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.color && product.color.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredProducts(filtered.slice(0, 5)) // Limit to 5 results
    } else {
      setFilteredProducts([])
    }
  }, [searchQuery, products]) // Updated dependency

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(false)
    
    // Navigate to search results page
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text)
  }

  const handleProductClick = (product: any) => {
    setSearchQuery(product.name)
    setShowSuggestions(false)
    // Navigate to product detail page
    router.push(`/product/${product.id}`)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setFilteredProducts([])
    setShowSuggestions(false)
  }

  return (
    <div className="bg-white border-b border-gray-200 py-4 sm:py-6 lg:py-8">
      <div className="container-responsive">
        <div className="container-wide" ref={searchRef}>
          {/* Search Title */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Find Your Perfect Products</h2>
            <p className="text-gray-600 text-sm sm:text-base">Search for flowers, perfumes, occasions, or browse our collections</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search for roses, tulips, perfumes, or occasions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-base sm:text-lg border-2 border-pink-200 rounded-full focus:border-pink-500 focus:outline-none shadow-lg bg-white"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {/* Suggestions */}
                {searchQuery && filteredSuggestions.length > 0 && (
                  <div className="p-3 sm:p-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Suggestions</h3>
                    <div className="space-y-2">
                      {filteredSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full flex items-center space-x-3 p-2 hover:bg-pink-50 rounded-lg transition-colors text-left"
                        >
                          <span className="text-pink-500">{suggestion.icon}</span>
                          <span className="text-gray-700 text-sm sm:text-base">{suggestion.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Results */}
                {searchQuery && filteredProducts.length > 0 && (
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Products</h3>
                    <div className="space-y-2">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="w-full flex items-center space-x-3 p-2 hover:bg-pink-50 rounded-lg transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder-flower.jpg'
                                }}
                              />
                            ) : (
                              <Flower className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 text-sm sm:text-base font-medium truncate">{product.name}</p>
                            <p className="text-gray-500 text-xs sm:text-sm truncate">
                              {product.type} • {product.color}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-pink-600 font-semibold text-sm sm:text-base">
                              RWF {product.price?.toLocaleString()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchQuery && filteredSuggestions.length === 0 && filteredProducts.length === 0 && (
                  <div className="p-4 text-center">
                    <p className="text-gray-500 text-sm">No results found for "{searchQuery}"</p>
                    <p className="text-gray-400 text-xs mt-1">Try different keywords or browse our categories</p>
                  </div>
                )}

                {/* Quick Actions */}
                {!searchQuery && (
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => router.push('/products')}
                        className="p-3 text-center bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                      >
                        <Flower className="w-6 h-6 text-pink-600 mx-auto mb-1" />
                        <span className="text-xs text-gray-700">Browse All</span>
                      </button>
                      <button
                        onClick={() => router.push('/contact')}
                        className="p-3 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Heart className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <span className="text-xs text-gray-700">Contact Us</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => handleSearch(searchQuery)}
              disabled={!searchQuery.trim()}
              className="bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              Search Products
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar 