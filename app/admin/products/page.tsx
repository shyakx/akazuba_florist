'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { showProductDeletedNotification, showErrorNotification } from '@/lib/adminNotifications'
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Star,
  Heart,
  ShoppingBag,
  Calendar,
  DollarSign,
  BarChart3,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  status: 'active' | 'inactive'
  image?: string
  images?: string[]
  createdAt: string
  sales?: number
  rating?: number
  description?: string
}

export default function ProductsPage() {
  const router = useRouter()
  const { 
    products, 
    isLoading, 
    errors, 
    refreshProducts, 
    deleteProduct,
    markChangesSaved 
  } = useAdmin()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterCategory, setFilterCategory] = useState('')


  // Read category parameter from URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const categoryParam = urlParams.get('category')
      if (categoryParam) {
        setFilterCategory(categoryParam)
      }
    }
  }, [])

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    const matchesCategory = !filterCategory || product.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (isLoading.products) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-blue-100 text-lg">Manage your beautiful flower products with ease</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{isLoading.products ? '...' : (products?.length || 0)}</div>
                  <div className="text-sm text-blue-100">Total Products</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{isLoading.products ? '...' : (products?.filter(p => p.status === 'active').length || 0)}</div>
                  <div className="text-sm text-blue-100">Active</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{isLoading.products ? '...' : (products?.reduce((sum, p) => sum + (p.sales || 0), 0) || 0)}</div>
                  <div className="text-sm text-blue-100">Total Sales</div>
                </div>
              </div>
            </div>
        </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{isLoading.products ? '...' : (products?.length || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">Live Data</span>
            <span className="text-gray-500 ml-1">from database</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-green-600">{isLoading.products ? '...' : (products?.filter(p => p.status === 'active').length || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">Live Data</span>
            <span className="text-gray-500 ml-1">from database</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{isLoading.products ? '...' : (products?.filter(p => p.stock < 10).length || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600 font-medium">Live Data</span>
            <span className="text-gray-500 ml-1">from database</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-purple-600">{isLoading.products ? '...' : (products?.reduce((sum, p) => sum + (p.sales || 0), 0) || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">Live Data</span>
            <span className="text-gray-500 ml-1">from database</span>
          </div>
        </div>
      </div>

      {/* Category Filter Indicator */}
      {filterCategory && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Showing products in category:</p>
                <p className="font-semibold text-blue-900">{filterCategory}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFilterCategory('')
                // Update URL to remove category parameter
                if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
                  const url = new URL(window.location.href)
                  url.searchParams.delete('category')
                  window.history.replaceState({}, '', url.toString())
                }
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products/new" className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </Link>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              // Export products data as CSV
              const csvContent = [
                ['Name', 'Category', 'Price', 'Stock', 'Status', 'Sales', 'Rating', 'Created At'],
                ...(products || []).map(product => [
                  product.name,
                  product.category,
                  product.price,
                  product.stock,
                  product.status,
                  product.sales || 0,
                  product.rating || 0,
                  new Date(product.createdAt).toLocaleDateString()
                ])
              ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              window.URL.revokeObjectURL(url)
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
              <button
              className="btn btn-secondary px-6 py-3"
              onClick={() => {
                // TODO: Implement advanced filters
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
              </button>
            </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Product Image */}
            <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <Package className="w-10 h-10 text-blue-600" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500">ID: {product.id}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Category</span>
                  <span className="text-sm font-medium text-gray-900">{product.category}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Price</span>
                  <span className="text-lg font-bold text-blue-600">RWF {(product.price || 0).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Stock</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' :
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock} units
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Sales</span>
                  <span className="text-sm font-medium text-gray-900">{product.sales || 0} sold</span>
                </div>
                  </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => {
                        router.push(`/admin/products/view/${product.id}`)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
                        <Edit className="w-4 h-4" />
                    </button>
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this product?')) {
                          try {
                            // Get the JWT token using the proper utility function
                            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
                            const headers: Record<string, string> = {
                              'Content-Type': 'application/json',
                            }
                            
                            if (token) {
                              headers['Authorization'] = `Bearer ${token}`
                            }
                            
                            const response = await fetch(`/api/admin/products/${product.id}/delete`, {
                              method: 'DELETE',
                              headers
                            })
                            
                            if (response.ok) {
                              const result = await response.json()
                              if (result.success) {
                                // Remove product from global state
                                deleteProduct(product.id)
                                // Show success notification
                                showProductDeletedNotification(product.name)
                                // Refresh the product list to ensure consistency
                                await refreshProducts()
                                // Mark changes as saved
                                markChangesSaved()
                              } else {
                                throw new Error(result.message || 'Failed to delete product')
                              }
                            } else {
                              const errorData = await response.json()
                              if (errorData.backendAvailable === false) {
                                showErrorNotification(
                                  'Backend Offline',
                                  'Backend server is not available. Please start the backend server to delete products.'
                                )
                              } else {
                                throw new Error(errorData.message || 'Failed to delete product')
                              }
                            }
                          } catch (error) {
                            console.error('Error deleting product:', error)
                            showErrorNotification(
                              'Delete Failed',
                              `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`
                            )
                          }
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && (products || []).length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
              : 'Get started by adding your first beautiful flower product to your inventory.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Link href="/admin/products/new" className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Product
            </Link>
          )}
        </div>
      )}
    </div>
  )
}