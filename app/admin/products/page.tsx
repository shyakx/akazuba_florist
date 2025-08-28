'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/RealAuthContext'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  Grid3X3, 
  Download, 
  RefreshCw,
  Package,
  Star,
  Eye,
  Edit,
  Trash2,
  Settings,
  Image as ImageIcon,
  Zap,
  Target,
  CheckCircle,
  AlertTriangle,
  Crown,
  Grid,
  List,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { adminAPI, AdminProduct, ProductFilters, BulkOperation, ProductAnalytics, ExportOptions } from '@/lib/adminApi'
import { productStorage } from '@/lib/productStorage'
import toast from 'react-hot-toast'
import { realFlowerProducts } from '@/data/real-flowers'
import { perfumeProducts } from '@/data/perfumes'

// Components
import ProductPreviewModal from './components/ProductPreviewModal'
import ProductFiltersPanel from './components/ProductFiltersPanel'
import BulkOperationsPanel from './components/BulkOperationsPanel'
import ProductAnalyticsPanel from './components/ProductAnalyticsPanel'
import StockManagementModal from './components/StockManagementModal'
import ImageManagementModal from './components/ImageManagementModal'
import PerfumeImageUpload from './components/PerfumeImageUpload'
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
  const [perfumeImageModal, setPerfumeImageModal] = useState<{ open: boolean; product: AdminProduct | null }>({ open: false, product: null })
  
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

  // Image loading state
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({})

  const handleImageLoad = (productId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [productId]: false }))
  }

  const handleImageError = (productId: string, imageSrc: string) => {
    console.warn(`Image failed to load for product ${productId}:`, imageSrc)
    setImageLoadingStates(prev => ({ ...prev, [productId]: false }))
  }

  // Preload images to check availability
  const preloadImage = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = src
    })
  }

  const validateImagePath = async (imagePath: string, productColor: string): Promise<string> => {
    // Try the original path first
    const isOriginalValid = await preloadImage(imagePath)
    if (isOriginalValid) return imagePath

    // Try fallback paths
    const fallbackPaths = [
      `/images/flowers/${productColor}/${productColor}-1.jpg`,
      `/images/flowers/${productColor}/${productColor}-2.jpg`,
      `/images/placeholder-flower.jpg`
    ]

    for (const fallbackPath of fallbackPaths) {
      const isValid = await preloadImage(fallbackPath)
      if (isValid) return fallbackPath
    }

    // Return placeholder as last resort
    return '/images/placeholder-flower.jpg'
  }

  const handlePerfumeImageUpdate = async (newImagePath: string) => {
    if (!perfumeImageModal.product) return
    
    try {
      // Update the product's image in the local state
      const updatedProducts = products.map(product => {
        if (product.id === perfumeImageModal.product?.id) {
          return {
            ...product,
            images: [newImagePath]
          }
        }
        return product
      })
      
      setProducts(updatedProducts)
      setFilteredProducts(updatedProducts)
      
      // Here you would also update the backend
      // await adminAPI.updateProduct({
      //   ...perfumeImageModal.product,
      //   images: [newImagePath]
      // })
      
      toast.success('Perfume image updated successfully!')
    } catch (error) {
      console.error('Error updating perfume image:', error)
      toast.error('Failed to update perfume image')
    }
  }

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

  // Handle loading overlay timeouts
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const timeout = setTimeout(() => {
        // Hide all loading overlays after 5 seconds
        const overlays = document.querySelectorAll('.loading-overlay')
        overlays.forEach((overlay) => {
          (overlay as HTMLElement).style.display = 'none'
        })
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [filteredProducts])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Use the same data source as the home page
      console.log('🔄 Using realFlowerProducts data (same as home page)')
      
      // Transform the data to match admin format
      const transformedProducts: AdminProduct[] = realFlowerProducts.map((product, index) => ({
        id: product.id.toString(),
        name: product.name,
        slug: product.name.toLowerCase().replace(/\s+/g, '-'),
        description: product.description,
        shortDescription: product.name,
        price: product.price,
        salePrice: undefined,
        costPrice: Math.floor(product.price * 0.6), // 40% margin
        sku: `${product.type.toUpperCase()}-${product.id}`,
        stockQuantity: 50,
        minStockAlert: 5,
        categoryId: 'flowers',
        categoryName: 'Flowers',
        images: [product.image], // Use the correct image path from realFlowerProducts
        isActive: true,
        isFeatured: product.featured,
        weight: 1.0,
        dimensions: { width: 20, height: 40, length: 30 },
        tags: [product.color, product.type.toLowerCase()],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: Math.floor(Math.random() * 100),
        sales: Math.floor(Math.random() * 20),
        revenue: product.price * Math.floor(Math.random() * 20),
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 50)
      }))

      console.log('🔍 Real flower products loaded:', transformedProducts.length)
      transformedProducts.forEach(product => {
        console.log(`📸 Product: ${product.name}, Images:`, product.images)
      })

      setProducts(transformedProducts)
      setFilteredProducts(transformedProducts)
    } catch (error) {
      console.error('❌ Error loading products:', error)
      toast.error('Failed to load products')
      setProducts([])
      setFilteredProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleProductDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
              try {
        productStorage.deleteProduct(productId)
        toast.success('Product deleted successfully')
        fetchProducts()
      } catch (error) {
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
      const result = productStorage.bulkOperation(operation.operation, selectedProducts, operation.data)
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
    if (product.stockQuantity === 0) return 'text-red-600 bg-red-50 border-red-200'
    if (product.stockQuantity <= product.minStockAlert) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-green-600 bg-green-50 border-green-200'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Products Management
                </h1>
              </div>
              <p className="text-gray-600 text-lg">Manage your product inventory, analytics, and operations</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200">
                {filteredProducts.length} of {products.length} products
              </div>
              <Link
                href="/admin/products/new"
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </Link>
              <Link
                href="/admin/products/test"
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Zap className="h-5 w-5" />
                <span>Test Components</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  Active inventory
                </p>
              </div>
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Products</p>
                <p className="text-3xl font-bold text-green-600">
                  {products.filter(p => p.isActive).length}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Currently available
                </p>
              </div>
              <div className="p-3 bg-green-600 rounded-2xl shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {products.filter(p => p.stockQuantity <= p.minStockAlert && p.stockQuantity > 0).length}
                </p>
                <p className="text-xs text-yellow-600 mt-1 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Needs attention
                </p>
              </div>
              <div className="p-3 bg-yellow-600 rounded-2xl shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Featured</p>
                <p className="text-3xl font-bold text-purple-600">
                  {products.filter(p => p.isFeatured).length}
                </p>
                <p className="text-xs text-purple-600 mt-1 flex items-center">
                  <Crown className="w-3 h-3 mr-1" />
                  Promoted products
                </p>
              </div>
              <div className="p-3 bg-purple-600 rounded-2xl shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-200 bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:shadow-md"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                    showAnalytics 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:shadow-md'
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
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Bulk Operations */}
              {selectedProducts.length > 0 && (
                <button
                  onClick={() => setShowBulkOperations(true)}
                  className="flex items-center space-x-2 px-4 py-3 bg-yellow-600 text-white border border-yellow-200 rounded-xl hover:bg-yellow-700 transition-all duration-200 shadow-lg"
                >
                  <Settings className="h-4 w-4" />
                  <span>Bulk Actions ({selectedProducts.length})</span>
                </button>
              )}

              {/* Export */}
              <button
                onClick={() => setExportModal({ open: true, options: null })}
                className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white border border-green-200 rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>

              {/* Refresh */}
              <button
                onClick={fetchProducts}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 shadow-md"
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
            <div className="text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {localStorage.getItem('accessToken') 
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Please login as admin to view products from the backend database.'
                }
              </p>
              {!localStorage.getItem('accessToken') ? (
                <Link
                  href="/admin/login"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Login as Admin</span>
                </Link>
              ) : (
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Your First Product</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredProducts.map((product) => (
                <div key={product.id} data-product-id={product.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                  <div className="relative">
                    <div className="aspect-square bg-gray-100">
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.target as HTMLImageElement
                              target.src = '/images/placeholder-flower.jpg'
                              target.onerror = null // Prevent infinite loop
                              // Hide loading overlay on error
                              const overlay = target.parentElement?.querySelector('.loading-overlay') as HTMLElement
                              if (overlay) {
                                overlay.style.display = 'none'
                              }
                            }}
                            onLoad={(e) => {
                              // Show image and hide loading overlay when image loads
                              const target = e.target as HTMLImageElement
                              target.style.opacity = '1'
                              // Hide the loading overlay
                              const overlay = target.parentElement?.querySelector('.loading-overlay') as HTMLElement
                              if (overlay) {
                                overlay.style.display = 'none'
                              }
                            }}
                            loading="lazy"
                            style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                          />
                          {/* Loading overlay - will be hidden when image loads */}
                          <div className="loading-overlay absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="animate-pulse">
                              <Package className="h-8 w-8 text-gray-300" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="text-center">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No Image</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Status badges */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                      {product.isFeatured && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-600 text-white shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      )}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStockStatusColor(product)}`}>
                        {getStockStatusText(product)}
                      </span>
                    </div>

                    {/* Checkbox */}
                    <div className="absolute top-3 right-3">
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
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                      />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{product.categoryName}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive 
                          ? 'bg-green-600 text-white' 
                          : 'bg-red-600 text-white'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
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
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPreviewModal({ open: true, product })}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setStockModal({ open: true, product })}
                          className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-200"
                        >
                          <Package className="h-4 w-4" />
                        </button>
                        {product.categoryId === 'perfumes' ? (
                          <button
                            onClick={() => setPerfumeImageModal({ open: true, product })}
                            className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-all duration-200"
                            title="Manage Perfume Image"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setImageModal({ open: true, product })}
                            className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-all duration-200"
                            title="Manage Images"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => handleProductDelete(product.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
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

      {perfumeImageModal.open && perfumeImageModal.product && (
        <PerfumeImageUpload
          productId={perfumeImageModal.product.id}
          productName={perfumeImageModal.product.name}
          currentImage={perfumeImageModal.product.images[0] || '/images/perfumes/placeholder.jpg'}
          onClose={() => setPerfumeImageModal({ open: false, product: null })}
          onUpdate={handlePerfumeImageUpdate}
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
    </div>
  )
}

export default AdminProductsPage
