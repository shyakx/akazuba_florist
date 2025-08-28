'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Flower, Heart, Calendar, Gift, Users, Sparkles } from 'lucide-react'
import { useProducts } from '@/contexts/ProductsContext'
import { useRouter } from 'next/navigation'

interface SearchSuggestion {
  id: string
  text: string
  category: 'occasion' | 'flower-type' | 'color' | 'perfume-type'
  icon: React.ReactNode
}

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { state } = useProducts()

  // Search suggestions based on occasions and product types
  const searchSuggestions: SearchSuggestion[] = [
    // Occasions
    { id: 'wedding', text: 'Flowers for Wedding', category: 'occasion', icon: <Heart className="w-4 h-4" /> },
    { id: 'anniversary', text: 'Anniversary Flowers', category: 'occasion', icon: <Calendar className="w-4 h-4" /> },
    { id: 'funeral', text: 'Funeral Flowers', category: 'occasion', icon: <Flower className="w-4 h-4" /> },
    { id: 'birthday', text: 'Birthday Flowers', category: 'occasion', icon: <Gift className="w-4 h-4" /> },
    { id: 'graduation', text: 'Graduation Flowers', category: 'occasion', icon: <Users className="w-4 h-4" /> },
    { id: 'valentine', text: 'Valentine Flowers', category: 'occasion', icon: <Heart className="w-4 h-4" /> },
    { id: 'mothers-day', text: 'Mother\'s Day Flowers', category: 'occasion', icon: <Heart className="w-4 h-4" /> },
    
    // Flower Types
    { id: 'roses', text: 'Roses', category: 'flower-type', icon: <Flower className="w-4 h-4" /> },
    { id: 'tulips', text: 'Tulips', category: 'flower-type', icon: <Flower className="w-4 h-4" /> },
    { id: 'lilies', text: 'Lilies', category: 'flower-type', icon: <Flower className="w-4 h-4" /> },
    { id: 'sunflowers', text: 'Sunflowers', category: 'flower-type', icon: <Flower className="w-4 h-4" /> },
    { id: 'carnations', text: 'Carnations', category: 'flower-type', icon: <Flower className="w-4 h-4" /> },
    { id: 'peonies', text: 'Peonies', category: 'flower-type', icon: <Flower className="w-4 h-4" /> },
    { id: 'daisies', text: 'Daisies', category: 'flower-type', icon: <Flower className="w-4 h-4" /> },
    { id: 'bouquets', text: 'Bouquets', category: 'flower-type', icon: <Flower className="w-4 h-4" /> },
    { id: 'arrangements', text: 'Arrangements', category: 'flower-type', icon: <Flower className="w-4 h-4" /> },
    
    // Colors
    { id: 'red', text: 'Red Flowers', category: 'color', icon: <Flower className="w-4 h-4" /> },
    { id: 'pink', text: 'Pink Flowers', category: 'color', icon: <Flower className="w-4 h-4" /> },
    { id: 'white', text: 'White Flowers', category: 'color', icon: <Flower className="w-4 h-4" /> },
    { id: 'yellow', text: 'Yellow Flowers', category: 'color', icon: <Flower className="w-4 h-4" /> },
    { id: 'purple', text: 'Purple Flowers', category: 'color', icon: <Flower className="w-4 h-4" /> },
    
    // Perfume Types
    { id: 'mens-perfumes', text: 'Men\'s Perfumes', category: 'perfume-type', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'womens-perfumes', text: 'Women\'s Perfumes', category: 'perfume-type', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'unisex-perfumes', text: 'Unisex Perfumes', category: 'perfume-type', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'luxury-perfumes', text: 'Luxury Perfumes', category: 'perfume-type', icon: <Sparkles className="w-4 h-4" /> },
  ]

  // Filter suggestions based on search query
  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = state.products.filter((product: any) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.type && product.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.color && product.color.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredProducts(filtered.slice(0, 5)) // Limit to 5 results
    } else {
      setFilteredProducts([])
    }
  }, [searchQuery, state.products])

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
                placeholder="Search for flowers, occasions, or flower types..."
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
                  <div className="p-3 sm:p-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Products</h3>
                    <div className="space-y-2">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="w-full flex items-center space-x-3 p-2 hover:bg-pink-50 rounded-lg transition-colors text-left"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{product.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">{product.type} • {product.color}</div>
                          </div>
                          <div className="text-pink-600 font-semibold text-sm sm:text-base whitespace-nowrap">
                            RWF {product.price.toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                {!searchQuery && (
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Popular Searches</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {searchSuggestions.slice(0, 8).map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex items-center space-x-2 p-2 hover:bg-pink-50 rounded-lg transition-colors text-left"
                        >
                          <span className="text-pink-500">{suggestion.icon}</span>
                          <span className="text-xs sm:text-sm text-gray-700 truncate">{suggestion.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchQuery && filteredSuggestions.length === 0 && filteredProducts.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <Flower className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm sm:text-base">No results found for &quot;{searchQuery}&quot;</p>
                    <p className="text-xs sm:text-sm">Try searching for a different term</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Search Tags */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {['Wedding', 'Anniversary', 'Birthday', 'Roses', 'Bouquets', 'Red Flowers'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleSearch(tag)}
                className="px-3 sm:px-4 py-2 bg-white border border-pink-200 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-pink-50 hover:border-pink-300 transition-colors whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar 