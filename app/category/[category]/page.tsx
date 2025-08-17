'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Filter, SortAsc, SortDesc, Grid, List, Star, Loader2, Heart, ShoppingCart, Eye, Flower, Sparkles } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'
import { realFlowerProducts } from '@/data/real-flowers'
import Footer from '@/components/Footer'

const CategoryPage = ({ params }: { params: { category: string } }) => {
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { addToCart, getCartItem } = useCart()
  
  const category = params.category

  // Filter products based on category
  useEffect(() => {
    const filterProducts = () => {
      try {
        setLoading(true)
        setError(null)
        
        let filteredProducts = realFlowerProducts
        
        // Filter by category (flower type or color)
        if (category) {
          // Check if it's a flower type (case-insensitive)
          const flowerTypes = Array.from(new Set(realFlowerProducts.map(p => p.type.toLowerCase())))
          const flowerColors = Array.from(new Set(realFlowerProducts.map(p => p.color.toLowerCase())))
          
          if (category === 'colors') {
            // Show all flowers except mixed (which are in Bouquets)
            filteredProducts = realFlowerProducts.filter(p => p.color !== 'mixed')
          } else if (flowerTypes.includes(category.toLowerCase())) {
            // Filter by flower type
            filteredProducts = realFlowerProducts.filter(p => 
              p.type.toLowerCase() === category.toLowerCase()
            )
          } else if (flowerColors.includes(category.toLowerCase())) {
            // Filter by color
            filteredProducts = realFlowerProducts.filter(p => 
              p.color.toLowerCase() === category.toLowerCase()
            )
          } else {
            // No matching category found
            setError(`No products found for category: ${category}`)
            setProducts([])
            setLoading(false)
            return
          }
        }
        
        // Transform to Product type
        const transformedProducts: Product[] = filteredProducts.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          shortDescription: item.description.substring(0, 100) + '...',
          price: item.price,
          originalPrice: undefined,
          image: item.image,
          category: item.category,
          rating: 4.5, // Default rating
          reviews: Math.floor(Math.random() * 20) + 5, // Random reviews
          inStock: true,
          discount: undefined,
          featured: item.featured,
          tags: [item.color, item.type, 'fresh', 'premium'],
          weight: '0.5kg',
          dimensions: '30x20x15cm'
        }))
        
        setProducts(transformedProducts)
      } catch (err: any) {
        console.error('Error filtering products:', err)
        setError(err.message || 'Failed to filter products')
      } finally {
        setLoading(false)
      }
    }

    filterProducts()
  }, [category])
  
  // Get unique colors from products
  const allColors = useMemo(() => {
    const colors = products.map(product => {
      const flowerProduct = realFlowerProducts.find(p => p.id === product.id)
      return flowerProduct?.color || 'mixed'
    })
    return Array.from(new Set(colors))
  }, [products])
  
  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1]
      const flowerProduct = realFlowerProducts.find(p => p.id === product.id)
      const hasSelectedColor = selectedColors.length === 0 || 
        (flowerProduct && selectedColors.includes(flowerProduct.color))
      return inPriceRange && hasSelectedColor
    })
    
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'rating':
          aValue = a.rating || 0
          bValue = b.rating || 0
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    return filtered
  }, [products, priceRange, selectedColors, sortBy, sortOrder])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryTitle = (categorySlug: string) => {
    // Check if it's a flower type
    const flowerTypes = Array.from(new Set(realFlowerProducts.map(p => p.type.toLowerCase())))
    const flowerColors = Array.from(new Set(realFlowerProducts.map(p => p.color.toLowerCase())))
    
    if (categorySlug === 'colors') {
      return 'Flowers by Color'
    } else if (flowerTypes.includes(categorySlug.toLowerCase())) {
      const type = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
      return `${type}s Collection`
    } else if (flowerColors.includes(categorySlug.toLowerCase())) {
      const color = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
      return `${color} Flowers`
    } else if (categorySlug === 'mixed') {
      return 'Mixed Bouquets'
    } else {
      return 'Flower Collection'
    }
  }

  const getCategoryDescription = (categorySlug: string) => {
    // Check if it's a flower type
    const flowerTypes = Array.from(new Set(realFlowerProducts.map(p => p.type.toLowerCase())))
    const flowerColors = Array.from(new Set(realFlowerProducts.map(p => p.color.toLowerCase())))
    
    if (categorySlug === 'colors') {
      return 'Explore our beautiful flowers organized by color. From vibrant reds to soft pinks, find the perfect hue for any occasion.'
    } else if (flowerTypes.includes(categorySlug.toLowerCase())) {
      const type = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
      return `Discover our stunning collection of ${type.toLowerCase()}s. Each bloom is carefully selected for its beauty and freshness, perfect for any occasion.`
    } else if (flowerColors.includes(categorySlug.toLowerCase())) {
      const color = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
      return `Explore our beautiful ${color.toLowerCase()} flowers. Fresh and vibrant blooms that bring ${color.toLowerCase()} colors to any space. Perfect for celebrations and brightening your day.`
    } else if (categorySlug === 'mixed') {
      return 'Browse our handcrafted mixed bouquets. Each arrangement combines different flowers for a unique and beautiful display.'
    } else {
      return 'Explore our beautiful flower collection.'
    }
  }

  const getCategoryIcon = (categorySlug: string) => {
    // Check if it's a flower type
    const flowerTypes = Array.from(new Set(realFlowerProducts.map(p => p.type.toLowerCase())))
    const flowerColors = Array.from(new Set(realFlowerProducts.map(p => p.color.toLowerCase())))
    
    if (categorySlug === 'colors') {
      return '🌈'
    } else if (flowerTypes.includes(categorySlug.toLowerCase())) {
      switch (categorySlug.toLowerCase()) {
        case 'rose':
          return '🌹'
        case 'tulip':
          return '🌷'
        case 'lily':
          return '🌺'
        case 'sunflower':
          return '🌻'
        case 'daisy':
          return '🌼'
        case 'carnation':
          return '🌸'
        case 'peony':
          return '🌺'
        case 'orchid':
          return '🌷'
        case 'marigold':
          return '🌼'
        case 'lavender':
          return '💜'
        default:
          return '🌸'
      }
    } else if (flowerColors.includes(categorySlug.toLowerCase())) {
      switch (categorySlug.toLowerCase()) {
        case 'red':
          return '🌹'
        case 'pink':
          return '🌸'
        case 'white':
          return '🌺'
        case 'yellow':
          return '🌻'
        case 'purple':
          return '💜'
        case 'orange':
          return '🌼'
        default:
          return '🌸'
      }
    } else if (categorySlug === 'mixed') {
      return '💐'
    } else {
      return '🌸'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading beautiful flowers...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Flower className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Loading Products</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">{getCategoryIcon(category)}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {getCategoryTitle(category)}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {getCategoryDescription(category)}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                4.9/5 Rating
              </span>
              <span>•</span>
              <span>Fresh Daily</span>
              <span>•</span>
              <span>Same Day Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Filter className="h-5 w-5 text-pink-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 mb-4">Price Range</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>RWF {priceRange[0].toLocaleString()}</span>
                      <span>RWF {priceRange[1].toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                {/* Tags */}
                {allColors.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 mb-4">Colors</h4>
                    <div className="space-y-2">
                      {allColors.map((color) => (
                        <label key={color} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedColors.includes(color)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedColors([...selectedColors, color])
                              } else {
                                setSelectedColors(selectedColors.filter(c => c !== color))
                              }
                            }}
                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700 capitalize">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters */}
                {(selectedColors.length > 0 || priceRange[1] !== 200) && (
                  <button
                    onClick={() => {
                      setSelectedColors([])
                      setPriceRange([0, 200])
                    }}
                    className="w-full text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredAndSortedProducts.length} products
                  </h2>
                  <p className="text-gray-600">Showing all available {category} arrangements</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="rating">Rating</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* View Mode */}
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-600 hover:text-pink-600'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-600 hover:text-pink-600'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Flower className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to see more products.</p>
                  <button
                    onClick={() => {
                      setSelectedColors([])
                      setPriceRange([0, 200])
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}>
                  {filteredAndSortedProducts.map((product) => {
                    const cartItem = getCartItem(product.id)
                    const quantity = cartItem ? cartItem.quantity : 0
                    
                    return (
                      <div key={product.id} className={`card overflow-hidden group ${viewMode === 'list' ? 'flex' : ''}`}>
                        {/* Product Image */}
                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-48' : 'h-64'}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 space-y-2">
                            {product.discount && (
                              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                -{product.discount}%
                              </div>
                            )}
                            {product.featured && (
                              <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                Featured
                              </div>
                            )}
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                              <Heart className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            
                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">({product.reviews})</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-pink-600">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500 capitalize">
                              {product.category}
                            </span>
                          </div>

                          {/* Tags */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {product.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full capitalize"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Add to Cart */}
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => addToCart(product)}
                              className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span>{quantity > 0 ? `In Cart (${quantity})` : 'Add to Cart'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CategoryPage 