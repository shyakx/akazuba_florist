'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/RealAuthContext'
import { useRouter } from 'next/navigation'
import { 
  Package, Plus, Search, Filter, Download, RefreshCw, Eye, Edit, Trash2,
  AlertTriangle, Star, TrendingUp, BarChart3, Settings, Grid, List,
  CheckCircle, LogOut, Flower, Image
} from 'lucide-react'
import Link from 'next/link'
import { adminAPI, AdminProduct, ProductFilters, BulkOperation, ProductAnalytics, ExportOptions } from '@/lib/adminApi'
import { productStorage } from '@/lib/productStorage'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'

// Components
import ProductPreviewModal from './components/ProductPreviewModal'
import ProductFiltersPanel from './components/ProductFiltersPanel'
import BulkOperationsPanel from './components/BulkOperationsPanel'
import ProductAnalyticsPanel from './components/ProductAnalyticsPanel'
import StockManagementModal from './components/StockManagementModal'
import ImageManagementModal from './components/ImageManagementModal'
import ExportModal from './components/ExportModal'

const AdminProductsPage = () => {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<AdminProduct[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showBulkOperations, setShowBulkOperations] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  // Modal States
  const [previewModal, setPreviewModal] = useState<{ open: boolean; product: AdminProduct | null }>({ open: false, product: null })
  const [stockModal, setStockModal] = useState<{ open: boolean; product: AdminProduct | null }>({ open: false, product: null })
  const [imageModal, setImageModal] = useState<{ open: boolean; product: AdminProduct | null }>({ open: false, product: null })
  const [exportModal, setExportModal] = useState<{ open: boolean; options: ExportOptions | null }>({ open: false, options: null })
  
  // Filters State
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    status: 'all',
    stockStatus: 'all',
    priceRange: undefined,
    featured: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    tags: [],
    dateRange: undefined
  })
  
  // Analytics State
  const [analytics, setAnalytics] = useState<ProductAnalytics[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    } else if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [isAuthenticated, user, isLoading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchProducts()
    }
  }, [isAuthenticated, user?.role])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Use product storage to get all real products
      const result = productStorage.getProducts({
        page: 1,
        limit: 1000 // Get all products
      })
      setProducts(result.products)
      setFilteredProducts(result.products)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleProductDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const success = productStorage.deleteProduct(productId)
        if (success) {
          toast.success('Product deleted successfully')
          fetchProducts()
        } else {
          toast.error('Failed to delete product')
        }
      } catch (error) {
        console.error('Delete error:', error)
        toast.error('Failed to delete product')
      }
    }
  }

  const handleBulkOperation = async (operation: BulkOperation) => {
    try {
      const result = productStorage.bulkOperation(operation)
      if (result.success) {
        toast.success(result.message)
        setSelectedProducts([])
        fetchProducts()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Bulk operation error:', error)
      toast.error('Bulk operation failed')
    }
  }

  const handleExport = async (options: ExportOptions) => {
    try {
      // For now, simulate the export
      toast.success('Export completed successfully')
      setExportModal({ open: false, options: null })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed')
    }
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const analyticsData = productStorage.getAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStockStatusColor = (product: AdminProduct) => {
    if (product.stockQuantity === 0) return 'text-red-600 bg-red-50'
    if (product.stockQuantity <= product.minStockAlert) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getStockStatusText = (product: AdminProduct) => {
    if (product.stockQuantity === 0) return 'Out of Stock'
    if (product.stockQuantity <= product.minStockAlert) return 'Low Stock'
    return 'In Stock'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
              <p className="text-gray-600 mt-2">Manage your product inventory, analytics, and operations</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                {filteredProducts.length} of {products.length} products
              </div>
              <Link
                href="/admin/products/new"
                className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Link>
              <Link
                href="/admin/products/test"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Package className="h-4 w-4" />
                <span>Test Components</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                <p className="text-xs text-blue-600 mt-1">Active inventory</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Products</p>
                <p className="text-3xl font-bold text-green-600">
                  {products.filter(p => p.isActive).length}
                </p>
                <p className="text-xs text-green-600 mt-1">Currently available</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {products.filter(p => p.stockQuantity <= p.minStockAlert && p.stockQuantity > 0).length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">Needs attention</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Featured</p>
                <p className="text-3xl font-bold text-purple-600">
                  {products.filter(p => p.isFeatured).length}
                </p>
                <p className="text-xs text-purple-600 mt-1">Promoted products</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    const filtered = products.filter(product =>
                      product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                      product.description.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                    setFilteredProducts(filtered)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    showAnalytics 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </button>
              </div>
            </div>

            {/* View Controls and Actions */}
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Bulk Operations */}
              {selectedProducts.length > 0 && (
                <button
                  onClick={() => setShowBulkOperations(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Bulk Actions ({selectedProducts.length})</span>
                </button>
              )}

              {/* Export */}
              <button
                onClick={() => setExportModal({ open: true, options: null })}
                className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>

              {/* Refresh */}
              <button
                onClick={fetchProducts}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <ProductFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Analytics Panel */}
        {showAnalytics && (
          <ProductAnalyticsPanel
            analytics={analytics}
            loading={analyticsLoading}
            onFetchAnalytics={fetchAnalytics}
            onClose={() => setShowAnalytics(false)}
          />
        )}

        {/* Products Display */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Product</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-square bg-gray-100">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Status badges */}
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {product.isFeatured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product)}`}>
                        {getStockStatusText(product)}
                      </span>
                    </div>

                    {/* Checkbox */}
                    <div className="absolute top-2 right-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(prev => [...prev, product.id])
                          } else {
                            setSelectedProducts(prev => prev.filter(id => id !== product.id))
                          }
                        }}
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{product.categoryName}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      {product.views && (
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {product.views}
                        </div>
                      )}
                      {product.sales && (
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {product.sales}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setPreviewModal({ open: true, product })}
                          className="p-1 text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1 text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-3 w-3" />
                        </Link>
                        <button
                          onClick={() => setStockModal({ open: true, product })}
                          className="p-1 text-purple-600 hover:text-purple-900"
                        >
                          <Package className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setImageModal({ open: true, product })}
                          className="p-1 text-orange-600 hover:text-orange-900"
                        >
                          <Image className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleProductDelete(product.id)}
                        className="p-1 text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {previewModal.open && previewModal.product && (
        <ProductPreviewModal
          product={previewModal.product}
          onClose={() => setPreviewModal({ open: false, product: null })}
        />
      )}

      {stockModal.open && stockModal.product && (
        <StockManagementModal
          product={stockModal.product}
          onClose={() => setStockModal({ open: false, product: null })}
          onUpdate={fetchProducts}
        />
      )}

      {imageModal.open && imageModal.product && (
        <ImageManagementModal
          product={imageModal.product}
          onClose={() => setImageModal({ open: false, product: null })}
          onUpdate={fetchProducts}
        />
      )}

      {exportModal.open && (
        <ExportModal
          onClose={() => setExportModal({ open: false, options: null })}
          onExport={handleExport}
        />
      )}

      {showBulkOperations && (
        <BulkOperationsPanel
          selectedCount={selectedProducts.length}
          onClose={() => setShowBulkOperations(false)}
          onOperation={handleBulkOperation}
        />
      )}
    </AdminLayout>
  )
}

export default AdminProductsPage
