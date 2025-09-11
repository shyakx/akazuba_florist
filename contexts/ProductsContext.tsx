'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { Product } from '@/types'
import { logger } from '@/lib/logger'
import { unifiedProductService } from '@/lib/unifiedProductService'
import { usePathname } from 'next/navigation'

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

  const loadProducts = useCallback(async () => {
    if (isLoadingRef.current) {
      return
    }

    try {
      isLoadingRef.current = true
      setIsLoading(true)
      setError(null)
      console.log('🔄 Loading products via unified service (admin context for full sync)')
      const productsData = await unifiedProductService.getAllProducts(false, true)
      console.log('✅ Products loaded via unified service:', productsData.length)
      setProducts(productsData)
    } catch (err) {
      logger.error('Failed to load products', 'PRODUCTS_CONTEXT', { error: err instanceof Error ? err.message : 'Unknown error' }, err instanceof Error ? err : undefined)
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, []) // Empty dependency array since this function doesn't depend on any state

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
      logger.error('Failed to add product', 'PRODUCTS_CONTEXT', { productName: product.name, error: err instanceof Error ? err.message : 'Unknown error' }, err instanceof Error ? err : undefined)
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
      if (!document.hidden && products.length > 0) {
        // Force refresh when tab becomes visible
        forceRefresh()
      }
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

    const handleAdminProductDelete = () => {
      console.log('🗑️ Admin product deleted, refreshing customer data')
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

