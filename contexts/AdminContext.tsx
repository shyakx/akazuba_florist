'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { convertImageUrl } from '@/lib/imageUtils'
import { unifiedProductService } from '@/lib/unifiedProductService'

// Types
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

interface OrderItem {
  id: string
  quantity: number
  total: number
  productImage?: string  // Image stored directly in order item
  product: {
    id: string
    name: string
    price: number
    image?: string
    images?: string[]
  }
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  totalAmount: number
  status: string
  paymentStatus?: string
  deliveryStatus?: string
  itemsCount: number
  items: OrderItem[]
  createdAt: string
  deliveryAddress: string
  phoneNumber?: string
  paymentMethod?: string
  notes?: string
}

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  status: string
  totalOrders: number
  totalSpent: number
  lastOrder?: string
  createdAt?: string
}

interface DashboardStats {
  categories: number
  products: number
  orders: number
  revenue: number
  customers: number
}

interface AdminContextType {
  // Data
  products: Product[]
  orders: Order[]
  customers: Customer[]
  stats: DashboardStats
  topProducts: Array<{ id: string; name: string; sales: number; revenue: number }>
  
  // Loading states
  isLoading: {
    products: boolean
    orders: boolean
    customers: boolean
    stats: boolean
    topProducts: boolean
  }
  
  // Error states
  errors: {
    products: string | null
    orders: string | null
    customers: string | null
    stats: string | null
    topProducts: string | null
  }
  
  // Actions
  refreshProducts: () => Promise<void>
  refreshOrders: () => Promise<void>
  refreshCustomers: () => Promise<void>
  refreshStats: () => Promise<void>
  refreshTopProducts: () => Promise<void>
  refreshAll: () => Promise<void>
  
  // Product operations
  addProduct: (product: Product) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  
  // Order operations
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>
  
  // Customer operations
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  
  // Change tracking
  hasUnsavedChanges: boolean
  markChangesSaved: () => void
  markChangesUnsaved: () => void
  
  // Backend status
  backendStatus: 'checking' | 'online' | 'offline'
  checkBackendStatus: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

interface AdminProviderProps {
  children: ReactNode
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    categories: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0
  })
  const [topProducts, setTopProducts] = useState<Array<{ id: string; name: string; sales: number; revenue: number }>>([])
  
  // Loading states
  const [isLoading, setIsLoading] = useState({
    products: false,
    orders: false,
    customers: false,
    stats: false,
    topProducts: false
  })
  
  // Error states
  const [errors, setErrors] = useState({
    products: null as string | null,
    orders: null as string | null,
    customers: null as string | null,
    stats: null as string | null,
    topProducts: null as string | null
  })
  
  // Change tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Backend status
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  
  // Helper function to get auth headers
  const getAuthHeaders = useCallback(() => {
    let token = null
    
    if (typeof window !== 'undefined') {
      // First try localStorage
      token = localStorage.getItem('accessToken')
      
      // If not found in localStorage, try cookies as fallback
      if (!token) {
        const cookies = document.cookie.split(';')
        const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='))
        if (accessTokenCookie) {
          token = accessTokenCookie.split('=')[1]
        }
      }
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }, [])

  
  // Mark changes as unsaved
  const markChangesUnsaved = useCallback(() => {
    setHasUnsavedChanges(true)
  }, [])
  
  // Mark changes as saved
  const markChangesSaved = useCallback(() => {
    setHasUnsavedChanges(false)
  }, [])
  
  // Check backend status
  const checkBackendStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        setBackendStatus('online')
        console.log('✅ Backend is online')
      } else {
        setBackendStatus('offline')
        console.log('❌ Backend is offline')
      }
    } catch (error) {
      setBackendStatus('offline')
      console.log('❌ Backend is offline:', error)
    }
  }, [getAuthHeaders])
  
  // Fetch products
  const refreshProducts = useCallback(async () => {
    console.log('🔄 Refreshing products via unified service...')
    setIsLoading(prev => ({ ...prev, products: true }))
    setErrors(prev => ({ ...prev, products: null }))
    
    try {
      // Use unified product service with force refresh to ensure fresh data
      const productsData = await unifiedProductService.getAllProducts(true, true)
      console.log('✅ Products loaded via unified service (forced refresh):', productsData.length)
      console.log('📦 AdminContext products data:', productsData.map(p => ({ id: p.id, name: p.name })))
      
      // Transform unified service products to admin format
      const transformedProducts: Product[] = productsData.map((product) => {
        // Convert image URLs to API format
        const convertedImages = (product.images || []).map((img: string) => convertImageUrl(img))
        const convertedImage = convertImageUrl(product.images?.[0] || '')
        
        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price || 0,
          category: product.categoryName || 'Unknown',
          stock: product.stockQuantity || 0,
          status: (product.isActive ? 'active' : 'inactive') as 'active' | 'inactive',
          images: convertedImages,
          image: convertedImage,
          createdAt: product.createdAt || new Date().toISOString(),
          sales: 0
          }
        })
        
        console.log('✅ Setting products:', transformedProducts.length, 'products')
        setProducts(transformedProducts)
      console.log('✅ Products transformed and set in AdminContext:', transformedProducts.length)
      console.log('📦 Transformed products:', transformedProducts.map(p => ({ id: p.id, name: p.name })))
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      setErrors(prev => ({ ...prev, products: error instanceof Error ? error.message : 'Unknown error' }))
    } finally {
      setIsLoading(prev => ({ ...prev, products: false }))
    }
  }, [])
  
  // Fetch orders
  const refreshOrders = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, orders: true }))
    setErrors(prev => ({ ...prev, orders: null }))
    
    try {
      const headers = getAuthHeaders()
      console.log('🔍 AdminContext calling /api/admin/orders with headers:', headers)
      
      // Use admin orders endpoint instead of customer orders endpoint
      const response = await fetch('/api/admin/orders', {
        headers
      })
      
      console.log('📡 Admin orders response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Admin orders error response:', errorText)
        throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('🔍 Admin Orders API response:', result)
      
      // Handle both success response structure and direct array response
      if (result.success || Array.isArray(result)) {
        // Handle both direct data and paginated data structures
        const ordersData = result.data?.orders || result.data || result || []
        
        // Convert image URLs in order items
        const processedOrders = ordersData.map((order: any) => ({
          ...order,
          order_items: (order.order_items || []).map((item: any) => ({
            ...item,
            productImage: item.productImage ? convertImageUrl(item.productImage) : item.productImage
          }))
        }))
        
        console.log('🔍 Processed admin orders data:', processedOrders)
        setOrders(Array.isArray(processedOrders) ? processedOrders : [])
      } else {
        throw new Error(result.message || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('❌ Error fetching admin orders:', error)
      setErrors(prev => ({ ...prev, orders: error instanceof Error ? error.message : 'Unknown error' }))
    } finally {
      setIsLoading(prev => ({ ...prev, orders: false }))
    }
  }, [getAuthHeaders])
  
  // Fetch customers
  const refreshCustomers = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, customers: true }))
    setErrors(prev => ({ ...prev, customers: null }))
    
    try {
      const response = await fetch('/api/admin/customers', {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) throw new Error('Failed to fetch customers')
      
      const result = await response.json()
      console.log('🔍 Customers API response:', result)
      
      if (result.success) {
        // Handle both direct data and paginated data structures
        const customersData = result.data?.customers || result.data || []
        console.log('🔍 Processed customers data:', customersData)
        setCustomers(Array.isArray(customersData) ? customersData : [])
      } else {
        throw new Error('Failed to fetch customers')
      }
    } catch (error) {
      console.error('❌ Error fetching customers:', error)
      setErrors(prev => ({ ...prev, customers: error instanceof Error ? error.message : 'Unknown error' }))
    } finally {
      setIsLoading(prev => ({ ...prev, customers: false }))
    }
  }, [getAuthHeaders])
  
  // Fetch stats
  const refreshStats = useCallback(async () => {
    console.log('🔄 Refreshing dashboard stats...')
    setIsLoading(prev => ({ ...prev, stats: true }))
    setErrors(prev => ({ ...prev, stats: null }))
    
    try {
      // Add cache-busting parameter to prevent caching
      const timestamp = Date.now()
      const response = await fetch(`/api/admin/dashboard/stats?t=${timestamp}`, {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const result = await response.json()
      console.log('📊 Stats API response:', result)
      
      if (result.success) {
        // Calculate real-time revenue from current orders if available
        const realTimeRevenue = orders.length > 0 
          ? orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0)
          : result.revenue || 0
        
        const newStats = {
          categories: result.categories || 0,
          products: result.products || 0,
          orders: result.orders || 0,
          revenue: realTimeRevenue, // Use real-time calculated revenue
          customers: result.customers || 0
        }
        console.log('✅ Setting stats:', newStats)
        console.log('📊 Previous stats:', stats)
        console.log('💰 Real-time revenue calculated:', realTimeRevenue)
        console.log('📦 Orders used for calculation:', orders.length)
        setStats(newStats)
        console.log('🔄 Stats state updated')
      } else {
        throw new Error(result.message || 'Failed to fetch stats')
      }
      
    } catch (error) {
      console.error('❌ Error fetching stats:', error)
      setErrors(prev => ({ ...prev, stats: error instanceof Error ? error.message : 'Unknown error' }))
    } finally {
      setIsLoading(prev => ({ ...prev, stats: false }))
    }
  }, [getAuthHeaders, orders]) // Add orders as dependency
  
  // Fetch top products
  const refreshTopProducts = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, topProducts: true }))
    setErrors(prev => ({ ...prev, topProducts: null }))
    
    try {
      const response = await fetch('/api/admin/dashboard/analytics', {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      const result = await response.json()
      
      if (result.success && result.data.topProducts) {
        setTopProducts(result.data.topProducts)
      }
    } catch (error) {
      console.error('❌ Error fetching top products:', error)
      setErrors(prev => ({ ...prev, topProducts: error instanceof Error ? error.message : 'Unknown error' }))
    } finally {
      setIsLoading(prev => ({ ...prev, topProducts: false }))
    }
  }, [getAuthHeaders])
  
  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshProducts(),
      refreshOrders(),
      refreshCustomers(),
      refreshStats(),
      refreshTopProducts()
    ])
  }, [refreshProducts, refreshOrders, refreshCustomers, refreshStats, refreshTopProducts])
  
  // Product operations
  const addProduct = useCallback(async (product: Product): Promise<void> => {
    try {
      console.log('➕ Creating product via unified service:', product)
      
      // Convert to unified service format
      const productData = {
        name: product.name,
        description: product.description || '',
        price: product.price,
        stockQuantity: product.stock,
        isActive: product.status === 'active',
        images: product.images || [],
        categoryName: typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'Unknown',
        type: 'flower', // Default type
        color: 'mixed', // Default color
        brand: 'Akazuba',
        tags: ['admin-created'],
        sku: `ADMIN-${Date.now()}`,
        weight: 1,
        isFeatured: false,
        salePrice: null
      }

      console.log('🔄 Sending product data to unified service:', productData)
      const newProduct = await unifiedProductService.createProduct(productData)
      console.log('📝 Unified service response:', newProduct)
      
      if (newProduct) {
        console.log('🔄 Refreshing products and stats after creation...')
        console.log('📦 New product created with ID:', newProduct.id)
        
        // First refresh products to ensure cache is cleared
        console.log('🔄 Step 1: Refreshing products...')
        await refreshProducts()
        
        // Small delay to ensure cache is properly cleared and backend is updated
        console.log('⏳ Waiting 500ms for backend to process...')
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Then refresh stats to get updated count
        console.log('🔄 Step 2: Refreshing stats...')
        await refreshStats()
        
        console.log('✅ Products and stats refreshed successfully')
        markChangesSaved() // Mark as saved since it's persisted
        
        // Notify customer context to refresh data
        window.dispatchEvent(new CustomEvent('admin-product-added', { 
          detail: { product: newProduct } 
        }))
        
        console.log('✅ Product created successfully:', newProduct)
        return // Explicitly return void
      } else {
        console.error('❌ Unified service returned null/undefined')
        throw new Error('Failed to create product - no product returned')
      }
    } catch (error) {
      console.error('❌ Error creating product:', error)
    markChangesUnsaved()
      throw error
    }
  }, [markChangesUnsaved, markChangesSaved, refreshProducts, refreshStats])
  
  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      console.log('🔄 Updating product via unified service:', id, updates)
      
      // Convert to unified service format
      const productUpdates = {
        name: updates.name,
        description: updates.description,
        price: updates.price,
        stockQuantity: updates.stock,
        isActive: updates.status === 'active',
        images: updates.images,
        tags: (updates as any).tags,
        sku: (updates as any).sku,
        weight: (updates as any).weight
      }
      
      console.log('🔄 AdminContext: Converting updates for unified service:', {
        originalUpdates: updates,
        convertedUpdates: productUpdates
      })

      const updatedProduct = await unifiedProductService.updateProduct(id, productUpdates)
      
      if (updatedProduct) {
        // Refresh products and stats to get updated counts
        await Promise.all([
          refreshProducts(),
          refreshStats()
        ])
        markChangesSaved() // Mark as saved since it's persisted
        
        // Notify customer context to refresh data
        window.dispatchEvent(new CustomEvent('admin-product-updated', { 
          detail: { productId: id, updates } 
        }))
        
        console.log('✅ Product updated successfully:', updatedProduct)
      } else {
        // Fallback to local update if backend fails
    setProducts(prev => {
          const updated = prev.map(product => {
            if (product.id === id) {
              const updatedProduct = { ...product, ...updates }
              console.log('✅ Product updated locally (backend unavailable):', updatedProduct)
              return updatedProduct
            }
            return product
          })
      return updated
    })
    markChangesUnsaved()
      }
    } catch (error) {
      console.error('❌ Error updating product:', error)
      markChangesUnsaved()
    }
  }, [markChangesUnsaved, markChangesSaved, refreshProducts, refreshStats])
  
  const deleteProduct = useCallback(async (id: string) => {
    try {
      console.log('🗑️ Deleting product via unified service:', id)
      
      const success = await unifiedProductService.deleteProduct(id)
      
      if (success) {
        // Refresh products and stats to get updated counts
        await Promise.all([
          refreshProducts(),
          refreshStats()
        ])
        markChangesSaved() // Mark as saved since it's persisted
        
        // Notify customer context to refresh data
        console.log('📢 Dispatching admin-product-deleted event for product:', id)
        window.dispatchEvent(new CustomEvent('admin-product-deleted', { 
          detail: { productId: id } 
        }))
        
        console.log('✅ Product deleted successfully from backend')
      } else {
        // Don't remove from local state if backend deletion failed
        console.warn('⚠️ Backend deletion failed, keeping product in local state')
        markChangesUnsaved()
      }
    } catch (error) {
      console.error('❌ Error deleting product:', error)
      // Don't remove from local state if there's an error
      markChangesUnsaved()
    }
  }, [markChangesUnsaved, markChangesSaved, refreshProducts, refreshStats])
  
  // Order operations
  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    try {
      // Update order in backend first
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update order')
      }
      
      const result = await response.json()
      if (result.success) {
        // Update local state
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ))
        
        // Dispatch event for other components to refresh
        window.dispatchEvent(new CustomEvent('admin-order-updated', { 
          detail: { orderId: id, updates } 
        }))
        
        // Refresh orders to ensure sync
        await refreshOrders()
        await refreshStats()
        
        markChangesSaved()
        console.log('✅ Order updated successfully:', id)
      } else {
        throw new Error(result.message || 'Failed to update order')
      }
    } catch (error) {
      console.error('❌ Error updating order:', error)
    markChangesUnsaved()
      throw error
    }
  }, [getAuthHeaders, refreshOrders, refreshStats, markChangesSaved, markChangesUnsaved])
  
  // Customer operations
  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ))
    markChangesUnsaved()
  }, [markChangesUnsaved])
  
  // Initialize data on mount
  useEffect(() => {
    console.log('🔄 AdminContext: Initializing data on mount')
    checkBackendStatus()
    refreshAll()
  }, []) // Remove dependencies to prevent re-running
  
  // Real-time revenue calculation when orders change
  useEffect(() => {
    if (orders.length > 0) {
      const realTimeRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0)
      console.log('💰 Real-time revenue update:', realTimeRevenue)
      console.log('📦 Orders count for revenue:', orders.length)
      
      // Update stats with real-time revenue
      setStats(prev => {
        // Only update if values actually changed to prevent unnecessary re-renders
        if (prev.revenue !== realTimeRevenue || prev.orders !== orders.length) {
          console.log('📊 Stats updated due to revenue/orders change')
          return {
            ...prev,
            revenue: realTimeRevenue,
            orders: orders.length
          }
        }
        return prev
      })
    }
  }, [orders]) // This will trigger whenever orders change
  
  // Listen for order events from customer side
  useEffect(() => {
    const handleOrderCreated = () => {
      console.log('🔄 Order created event received, refreshing admin orders...')
      refreshOrders()
      refreshStats()
    }
    
    const handleOrderUpdated = () => {
      console.log('🔄 Order updated event received, refreshing admin orders...')
      refreshOrders()
      refreshStats()
    }
    
    // Listen for order events
    window.addEventListener('customer-order-created', handleOrderCreated)
    window.addEventListener('customer-order-updated', handleOrderUpdated)
    
    return () => {
      window.removeEventListener('customer-order-created', handleOrderCreated)
      window.removeEventListener('customer-order-updated', handleOrderUpdated)
    }
  }, [refreshOrders, refreshStats])
  
  // Auto-refresh data every 5 minutes (reduced frequency to prevent memory issues)
  // DISABLED: Auto-refresh to prevent constant refreshing
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!hasUnsavedChanges) {
  //       // Only refresh orders and stats, not all data
  //       refreshOrders()
  //       refreshStats()
  //     }
  //   }, 300000) // 5 minutes instead of 30 seconds
  //   
  //   return () => clearInterval(interval)
  // }, [refreshOrders, refreshStats, hasUnsavedChanges])
  
  const value: AdminContextType = {
    // Data
    products,
    orders,
    customers,
    stats,
    topProducts,
    
    // Loading states
    isLoading,
    
    // Error states
    errors,
    
    // Actions
    refreshProducts,
    refreshOrders,
    refreshCustomers,
    refreshStats,
    refreshTopProducts,
    refreshAll,
    
    // Product operations
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Order operations
    updateOrder,
    
    // Customer operations
    updateCustomer,
    
    // Change tracking
    hasUnsavedChanges,
    markChangesSaved,
    markChangesUnsaved,
    
    // Backend status
    backendStatus,
    checkBackendStatus
  }
  
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
