'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Edit,
  Trash2,
  Eye,
  Star,
  Package
} from 'lucide-react'
import { realFlowerProducts } from '@/data/real-flowers'
import { perfumeProducts } from '@/data/perfumes'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  categoryName: string
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  images: string[]
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    // Force complete refresh and ensure isolation
    console.log('🚫 Admin Products Page: Backend API calls are COMPLETELY DISABLED')
    console.log('🚫 This page ONLY uses local data files')
    console.log('🔄 Force refreshing products data...')
    
    // Clear any potential cached data
    setProducts([])
    setFilteredProducts([])
    
    // Small delay to ensure clean state
    setTimeout(() => {
      loadProducts()
    }, 100)
  }, [])

  // Additional safeguard: prevent any external data loading
  useEffect(() => {
    const preventExternalData = () => {
      console.log('🚫 Admin Products Page: External data loading is BLOCKED')
      // Override any potential global product loading
      if (typeof window !== 'undefined') {
        (window as any).adminProductsMode = true
      }
    }
    
    preventExternalData()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      // FORCE LOCAL DATA ONLY - NO BACKEND API CALLS
      console.log('🔄 Loading products from LOCAL data files only...')
      console.log('🚫 Backend API calls are COMPLETELY DISABLED')
      console.log('📁 Importing from @/data/real-flowers and @/data/perfumes')
      
      // Log the imported data to verify what we're getting
      console.log('🌺 Real flower products imported:', realFlowerProducts.length)
      console.log('🌸 Perfume products imported:', perfumeProducts.length)
      
      // Transform real flower products to admin format
      const flowerProducts: Product[] = realFlowerProducts.map((product, index) => {
        const transformed = {
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          categoryName: 'Flowers',
          stockQuantity: Math.floor(Math.random() * 50) + 10,
          isActive: true,
          isFeatured: product.featured || false,
          images: [product.image]
        }
        console.log(`🌺 Flower ${index + 1}: ${product.name} -> Image: ${product.image}`)
        return transformed
      })
      
      // Transform perfume products to admin format
      const adminPerfumeProducts: Product[] = perfumeProducts.map((product, index) => {
        const transformed = {
          id: `perfume-${index + 1}`,
          name: product.name,
          price: product.price,
          categoryName: 'Perfumes',
          stockQuantity: Math.floor(Math.random() * 30) + 5,
          isActive: true,
          isFeatured: product.featured || false,
          images: [product.image]
        }
        console.log(`🌸 Perfume ${index + 1}: ${product.name} -> Image: ${product.image}`)
        return transformed
      })
      
      // Combine all products
      const allProducts = [...flowerProducts, ...adminPerfumeProducts]
      
      console.log('📦 Final products array:', allProducts.length)
      console.log('🖼️ All image paths:', allProducts.map(p => ({ name: p.name, images: p.images })))
      
      setProducts(allProducts)
      setFilteredProducts(allProducts)
      
    } catch (error) {
      console.error('❌ Error loading products from local data files:', error)
      toast.error('Failed to load products from local data files')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categoryName === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory])

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        // Remove from local state only (no backend calls)
        const updatedProducts = products.filter(p => p.id !== productId)
        setProducts(updatedProducts)
        setFilteredProducts(filteredProducts.filter(p => p.id !== productId))
        toast.success('Product deleted successfully (local only)')
      } catch (error) {
        console.error('Delete error:', error)
        toast.error('Failed to delete product')
      }
    }
  }

  const getCategories = () => {
    const categories = ['all', ...Array.from(new Set(products.map(p => p.categoryName)))]
    return categories
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Products Inventory</h1>
            <p className="text-blue-100 text-sm sm:text-lg">
              Manage your product catalog for customer orders
            </p>
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-semibold text-sm sm:text-lg">Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <Eye className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.isFeatured).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {getCategories().map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="w-full lg:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-all duration-200`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-all duration-200`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Count */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{products.length}</span> products
        </div>
        <div className="text-sm text-gray-500">
          {searchQuery && `Search results for "${searchQuery}"`}
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
              viewMode="list"
            />
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 sm:py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No products match "${searchQuery}"`
              : 'No products available in this category'
            }
          </p>
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  onDelete: (id: string) => void
  viewMode: 'grid' | 'list'
}

function ProductCard({ product, onDelete, viewMode }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center space-x-6">
          {/* Product Image */}
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
            {product.images && product.images[0] && !imageError ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Package className="h-10 w-10 text-gray-400" />
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{product.categoryName}</p>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500 flex items-center">
                <Package className="h-4 w-4 mr-1" />
                Stock: <span className="font-semibold ml-1">{product.stockQuantity}</span>
              </span>
              <span className="text-lg font-bold text-blue-600">
                RWF {product.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center space-x-3">
            {product.isActive && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                Active
              </span>
            )}
            {product.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105" title="View Product">
              <Eye className="h-5 w-5" />
            </button>
            <button className="p-3 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-105" title="Edit Product">
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
              title="Delete Product"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {product.images && product.images[0] && !imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {/* Status Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.isActive && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-lg">
              Active
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2 text-lg line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.categoryName}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-blue-600">
            RWF {product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Stock: {product.stockQuantity}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105" title="View Product">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-105" title="Edit Product">
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
              title="Delete Product"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
