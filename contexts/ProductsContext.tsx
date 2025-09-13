'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { Product } from '@/types'
// import { logger } from '@/lib/logger' // Temporarily disabled to fix webpack error
import { unifiedProductService } from '@/lib/unifiedProductService'
import { usePathname } from 'next/navigation'
import { useAuth } from './RealAuthContext'

interface ProductsContextType {
  products: Product[]
  isLoading: boolean
  error: string | null
  loadProducts: () => Promise<void>
  refreshProducts: () => Promise<void>
  forceRefresh: () => Promise<void>
  getAllProducts: () => Product[]
  getProductById: (id: string) => Product | null
  getProductsByCategory: (category: string) => Product[]
  getFeaturedProducts: () => Product[]
  getActiveProducts: () => Product[]
  searchProducts: (query: string) => Product[]
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<boolean>
  clearError: () => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isLoadingRef = useRef(false)
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()

  const loadProducts = useCallback(async () => {
    if (isLoadingRef.current) {
      return
    }

    try {
      isLoadingRef.current = true
      setIsLoading(true)
      setError(null)
      
      // Only use admin context if user is authenticated and has admin role
      const shouldUseAdminContext = isAuthenticated && user?.role === 'ADMIN'
      console.log('🔄 Loading products via unified service', shouldUseAdminContext ? '(admin context for full sync)' : '(public context)')
      
      const productsData = await unifiedProductService.getAllProducts(false, shouldUseAdminContext)
      console.log('✅ Products loaded via unified service:', productsData.length)
      setProducts(productsData)
    } catch (err) {
      console.error('❌ Failed to load products:', err instanceof Error ? err.message : 'Unknown error', err)
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [isAuthenticated, user?.role]) // Dependencies: authentication state and user role

  const refreshProducts = async () => {
    await loadProducts()
  }

  const forceRefresh = async () => {
    console.log('🔄 Force refreshing customer data...')
    await unifiedProductService.forceRefresh()
    await loadProducts()
  }

  // Get all products
  const getAllProducts = (): Product[] => {
    return products
  }

  // Get product by ID
  const getProductById = (id: string): Product | null => {
    return products.find(product => product.id === id) || null
  }

  // Get products by category
  const getProductsByCategory = (category: string): Product[] => {
    const categoryLower = category.toLowerCase()
    return products.filter(product => {
      const productCategory = product.categoryName?.toLowerCase() || ''
      const productType = product.type?.toLowerCase() || ''
      const productColor = product.color?.toLowerCase() || ''
      
      return productCategory.includes(categoryLower) ||
             productType.includes(categoryLower) ||
             productColor.includes(categoryLower)
    })
  }

  // Get featured products
  const getFeaturedProducts = (): Product[] => {
    return products.filter(product => product.isFeatured)
  }

  // Get active products
  const getActiveProducts = (): Product[] => {
    return products.filter(product => product.isActive)
  }

  // Search products
  const searchProducts = (query: string): Product[] => {
    const searchTerm = query.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.categoryName?.toLowerCase().includes(searchTerm) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // Add product (Admin only)
  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    try {
      const newProduct = await unifiedProductService.createProduct(product)
      if (newProduct) {
        await loadProducts() // Refresh from database
        return newProduct
      }
      return null
      
    } catch (err) {
      console.error('❌ Failed to add product:', product.name, err instanceof Error ? err.message : 'Unknown error', err)
      setError('Failed to add product. Please try again.')
      throw err
    }
  }

  // Update product (Admin only)
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    try {
      const updatedProduct = await unifiedProductService.updateProduct(id, updates)
      if (updatedProduct) {
        await loadProducts() // Refresh from database
        return updatedProduct
      }
      return null
      
    } catch (err) {
      console.error('❌ Failed to update product:', err)
      setError('Failed to update product. Please try again.')
      throw err
    }
  }

  // Delete product (Admin only)
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const success = await unifiedProductService.deleteProduct(id)
      if (success) {
        await loadProducts() // Refresh from database
        return true
      }
      return false
      
    } catch (err) {
      console.error('❌ Failed to delete product:', err)
      setError('Failed to delete product. Please try again.')
      throw err
    }
  }

  const clearError = () => {
    setError(null)
  }

  // Initial load - only if products are empty and not on admin pages
  useEffect(() => {
    // Skip loading on admin pages completely
    if (pathname?.startsWith('/admin')) {
      return
    }
    
    // Skip loading on auth pages
    if (pathname && ['/register', '/unified-login'].includes(pathname)) {
      return
    }
    
    // Unified service handles cache invalidation automatically
    
    // If products exist but we're coming from admin, force refresh
    if (products.length > 0) {
      // Check if we just came from an admin page
      const lastPath = sessionStorage.getItem('lastPathname')
      if (lastPath?.startsWith('/admin')) {
        console.log('🔄 Refreshing customer data after admin navigation')
        forceRefresh()
      }
    } else {
      loadProducts()
    }
    
    // Store current pathname for next navigation
    sessionStorage.setItem('lastPathname', pathname || '')
  }, [pathname, products.length, loadProducts, forceRefresh]) // Depend on pathname, products length, loadProducts, and forceRefresh

  // Reload products when authentication state changes
  useEffect(() => {
    // Skip loading on admin pages completely
    if (pathname?.startsWith('/admin')) {
      return
    }
    
    // Skip loading on auth pages
    if (pathname && ['/register', '/unified-login'].includes(pathname)) {
      return
    }
    
    // Reload products when authentication state changes (with debounce)
    if (isAuthenticated !== undefined) {
      console.log('🔄 Authentication state changed, reloading products')
      // Add a small delay to prevent rapid re-initialization
      const timeoutId = setTimeout(() => {
        loadProducts()
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [isAuthenticated, user?.role, pathname, loadProducts])

  // Page focus refresh - only if not on admin pages
  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      return
    }
    
    const handleFocus = () => {
      if (products.length > 0) {
        // Force refresh when page becomes visible to get latest data
        forceRefresh()
      }
    }

    const handleVisibilityChange = () => {
      // DISABLED: This was causing too many API calls and 429 errors
      // if (!document.hidden && products.length > 0) {
      //   // Force refresh when tab becomes visible
      //   forceRefresh()
      // }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname, products.length, forceRefresh]) // Add pathname dependency

  // Auto-refresh - only if not on admin pages
  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      return
    }
    
    const interval = setInterval(() => {
      if (products.length > 0) {
        loadProducts()
      }
    }, 2 * 60 * 1000) // 2 minutes (reduced from 15 minutes)

    return () => clearInterval(interval)
  }, [pathname, products.length, loadProducts]) // Add pathname dependency

  // Listen for admin changes and refresh customer data
  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      return // Don't listen on admin pages
    }

    const handleAdminProductUpdate = () => {
      console.log('🔄 Admin product updated, refreshing customer data')
      forceRefresh()
    }

    const handleAdminProductAdd = () => {
      console.log('➕ Admin product added, refreshing customer data')
      forceRefresh()
    }

    const handleAdminProductDelete = (event?: CustomEvent) => {
      console.log('🗑️ Admin product deleted, refreshing customer data', event?.detail)
      forceRefresh()
    }

    const handleAdminProductSaved = () => {
      console.log('💾 Admin product saved to backend, refreshing customer data')
      forceRefresh()
    }

    // Listen for admin changes
    window.addEventListener('admin-product-updated', handleAdminProductUpdate)
    window.addEventListener('admin-product-added', handleAdminProductAdd)
    window.addEventListener('admin-product-deleted', handleAdminProductDelete)
    window.addEventListener('admin-product-saved', handleAdminProductSaved)

    return () => {
      window.removeEventListener('admin-product-updated', handleAdminProductUpdate)
      window.removeEventListener('admin-product-added', handleAdminProductAdd)
      window.removeEventListener('admin-product-deleted', handleAdminProductDelete)
    }
  }, [pathname, forceRefresh])

  const value: ProductsContextType = {
    products,
    isLoading,
    error,
    loadProducts,
    refreshProducts,
    forceRefresh,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getActiveProducts,
    searchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    clearError
  }

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

