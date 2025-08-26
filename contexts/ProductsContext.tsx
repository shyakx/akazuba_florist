'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/types'
import { productsAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { realFlowerProducts } from '@/data/real-flowers'

// Transform backend product to frontend product format
const transformProduct = (backendProduct: any, index: number): Product => ({
  id: index + 1, // Use sequential numbers for frontend compatibility
  name: backendProduct.name,
  price: backendProduct.price,
  image: backendProduct.images?.[0] || backendProduct.image || '/images/placeholder-flower.jpg',
  category: backendProduct.category?.name || 'flowers',
  featured: backendProduct.isFeatured || backendProduct.featured || false,
  description: backendProduct.description || `${backendProduct.name} from Akazuba Florist`,
  color: backendProduct.color || 'mixed',
  type: backendProduct.type || 'Flower'
})

interface ProductsState {
  products: Product[]
  featuredProducts: Product[]
  isLoading: boolean
  error: string | null
}

interface ProductsContextType {
  state: ProductsState
  refreshProducts: () => Promise<void>
  getProduct: (id: string) => Product | undefined
  getBackendProductId: (frontendId: number) => string | undefined
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProductsState>({
    products: [],
    featuredProducts: [],
    isLoading: false,
    error: null
  })
  const [backendIdMapping, setBackendIdMapping] = useState<Map<number, string>>(new Map())

  const fetchProducts = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await productsAPI.getAll()
      
      if (response.success && response.data) {
        const backendProducts = response.data
        const products = backendProducts.map((product, index) => transformProduct(product, index))
        const featuredProducts = products.filter(product => product.featured)
        
        // Create mapping between frontend IDs and backend IDs
        const mapping = new Map<number, string>()
        backendProducts.forEach((product, index) => {
          mapping.set(index + 1, product.id)
        })
        setBackendIdMapping(mapping)
        
        console.log('🔄 ProductsContext - Backend products loaded:', backendProducts.length)
        console.log('🔄 ProductsContext - ID mapping created:', Array.from(mapping.entries()))
        
        setState({
          products,
          featuredProducts,
          isLoading: false,
          error: null
        })
      } else {
        throw new Error('Backend returned no data')
      }
    } catch (error) {
      console.error('Error fetching products from backend, using fallback data:', error)
      
      // Fallback to static data when backend is not available
      const fallbackProducts = realFlowerProducts // Load all products
      const products = fallbackProducts.map((product, index) => ({
        ...product,
        id: index + 1, // Ensure sequential IDs
        featured: index < 8 // First 8 products as featured
      }))
      const featuredProducts = products.filter(product => product.featured)
      
      // Create empty mapping for fallback (no backend IDs)
      setBackendIdMapping(new Map())
      
      console.log('🔄 ProductsContext - Using fallback data:', products.length, 'products')
      
      setState({
        products,
        featuredProducts,
        isLoading: false,
        error: null
      })
      
      // Don't show error toast for fallback - it's expected behavior
    }
  }

  const refreshProducts = async () => {
    await fetchProducts()
  }

  const getProduct = (id: string): Product | undefined => {
    return state.products.find(product => product.id.toString() === id)
  }

  const getBackendProductId = (frontendId: number): string | undefined => {
    const backendId = backendIdMapping.get(frontendId)
    console.log('🔍 ProductsContext - Looking up frontend ID:', frontendId, '-> Backend ID:', backendId)
    console.log('🔍 ProductsContext - Current mapping size:', backendIdMapping.size)
    return backendId
  }

  // Load products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <ProductsContext.Provider value={{
      state,
      refreshProducts,
      getProduct,
      getBackendProductId
    }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}
