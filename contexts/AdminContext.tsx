'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

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
}

interface DashboardStats {
  categories: number
  products: number
  orders: number
  revenue: number
  customers: number
  totalWishlistItems: number
  totalCartItems: number
  activeCarts: number
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
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Order operations
  updateOrder: (id: string, updates: Partial<Order>) => void
  
  // Customer operations
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  
  // Change tracking
  hasUnsavedChanges: boolean
  markChangesSaved: () => void
  markChangesUnsaved: () => void
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
    customers: 0,
    totalWishlistItems: 0,
    totalCartItems: 0,
    activeCarts: 0
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
  
  // Helper function to get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
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
  
  // Fetch products
  const refreshProducts = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, products: true }))
    setErrors(prev => ({ ...prev, products: null }))
    
    try {
      const response = await fetch('/api/products', {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.data || [])
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      setErrors(prev => ({ ...prev, products: error instanceof Error ? error.message : 'Unknown error' }))
    } finally {
      setIsLoading(prev => ({ ...prev, products: false }))
    }
  }, [getAuthHeaders])
  
  // Fetch orders
  const refreshOrders = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, orders: true }))
    setErrors(prev => ({ ...prev, orders: null }))
    
    try {
      const response = await fetch('/api/orders', {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) throw new Error('Failed to fetch orders')
      
      const result = await response.json()
      
      if (result.success) {
        setOrders(result.data || [])
      } else {
        throw new Error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error)
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
      
      if (result.success) {
        setCustomers(result.data || [])
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
    setIsLoading(prev => ({ ...prev, stats: true }))
    setErrors(prev => ({ ...prev, stats: null }))
    
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const result = await response.json()
      
      
      if (result.success) {
        setStats({
          categories: result.categories || 0,
          products: result.products || 0,
          orders: result.orders || 0,
          revenue: result.revenue || 0,
          customers: result.customers || 0,
          totalWishlistItems: result.totalWishlistItems || 0,
          totalCartItems: result.totalCartItems || 0,
          activeCarts: result.activeCarts || 0
        })
      } else {
        throw new Error(result.message || 'Failed to fetch stats')
      }
      
    } catch (error) {
      console.error('❌ Error fetching stats:', error)
      setErrors(prev => ({ ...prev, stats: error instanceof Error ? error.message : 'Unknown error' }))
    } finally {
      setIsLoading(prev => ({ ...prev, stats: false }))
    }
  }, [getAuthHeaders])
  
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
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [product, ...prev])
    markChangesUnsaved()
  }, [markChangesUnsaved])
  
  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ))
    markChangesUnsaved()
  }, [markChangesUnsaved])
  
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
    markChangesUnsaved()
  }, [markChangesUnsaved])
  
  // Order operations
  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ))
    markChangesUnsaved()
  }, [markChangesUnsaved])
  
  // Customer operations
  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ))
    markChangesUnsaved()
  }, [markChangesUnsaved])
  
  // Initialize data on mount
  useEffect(() => {
    refreshAll()
  }, [refreshAll])
  
  // Auto-refresh data every 5 minutes (reduced frequency to prevent memory issues)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasUnsavedChanges) {
        // Only refresh orders and stats, not all data
        refreshOrders()
        refreshStats()
      }
    }, 300000) // 5 minutes instead of 30 seconds
    
    return () => clearInterval(interval)
  }, [refreshOrders, refreshStats, hasUnsavedChanges])
  
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
    markChangesUnsaved
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
