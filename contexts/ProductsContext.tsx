'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { Product } from '@/types'
import { logger } from '@/lib/logger'
import { databaseAPI } from '@/lib/databaseApi'
import { usePathname } from 'next/navigation'

interface ProductsContextType {
  products: Product[]
  isLoading: boolean
  error: string | null
  loadProducts: () => Promise<void>
  refreshProducts: () => Promise<void>
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
      console.log('🚫 ProductsContext: Load already in progress, skipping...')
      return
    }

    try {
      isLoadingRef.current = true
      setIsLoading(true)
      setError(null)
      console.log('🔄 Loading products from database...')
      
      const productsData = await databaseAPI.getAllProducts()
      setProducts(productsData)
      console.log('✅ Loaded', productsData.length, 'products from database')
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
      console.log('➕ Adding product:', product.name)
      
      const newProduct = await databaseAPI.createProduct(product)
      if (newProduct) {
        console.log('✅ Product added to database successfully:', newProduct.name)
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
      console.log('✏️ Updating product:', id)
      
      const updatedProduct = await databaseAPI.updateProduct(id, updates)
      if (updatedProduct) {
        console.log('✅ Product updated in database successfully:', updatedProduct.name)
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
      console.log('🗑️ Deleting product:', id)
      
      const success = await databaseAPI.deleteProduct(id)
      if (success) {
        console.log('✅ Product deleted from database successfully')
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
      console.log('🚫 ProductsContext: Skipping product load on admin page:', pathname)
      return
    }
    
    // Skip loading on auth pages
    if (pathname && ['/login', '/register', '/admin/login'].includes(pathname)) {
      console.log('🚫 ProductsContext: Skipping product load on auth page:', pathname)
      return
    }
    
    // Only load if products are empty
    if (products.length === 0) {
      console.log('🚀 ProductsContext: Initial load triggered (products empty)')
      loadProducts()
    } else {
      console.log('🚫 ProductsContext: Products already loaded, skipping initial load')
    }
  }, [pathname, products.length, loadProducts]) // Depend on pathname, products length, and loadProducts

  // Page focus refresh - only if not on admin pages
  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      console.log('🚫 ProductsContext: Skipping focus refresh on admin page')
      return
    }
    
    const handleFocus = () => {
      if (products.length > 0) {
        console.log('🔄 Page focused, refreshing products...')
        loadProducts()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [pathname, products.length, loadProducts]) // Add pathname dependency

  // Auto-refresh - only if not on admin pages
  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      console.log('🚫 ProductsContext: Skipping auto-refresh on admin page')
      return
    }
    
    const interval = setInterval(() => {
      if (products.length > 0) {
        console.log('🔄 Auto-refreshing products...')
        loadProducts()
      }
    }, 15 * 60 * 1000) // 15 minutes

    return () => clearInterval(interval)
  }, [pathname, products.length, loadProducts]) // Add pathname dependency

  const value: ProductsContextType = {
    products,
    isLoading,
    error,
    loadProducts,
    refreshProducts,
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

