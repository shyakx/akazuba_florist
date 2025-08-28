'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { productsAPI } from '../lib/api'
import { realFlowerProducts } from '../data/real-flowers'

export interface Product {
  id: string | number
  name: string
  price: number
  image: string
  category: string
  featured: boolean
  description: string
  color: string
  type: string
  salePrice?: number
  stockQuantity?: number
  tags?: string[]
}

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
  getBackendProductId: (frontendId: number | string) => string | undefined
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const transformProduct = (product: any, index: number): Product => {
  // Ensure we use the correct image path - never construct from slug
  let imagePath = product.image || product.images?.[0]
  
  // If no image path provided, use a fallback based on color
  if (!imagePath) {
    const color = product.color || 'mixed'
    imagePath = `/images/flowers/${color}/${color}-${(index % 2) + 1}.jpg`
  }
  
  // Validate image path format
  if (imagePath && !imagePath.startsWith('/images/flowers/') && !imagePath.startsWith('http')) {
    // If it's not a proper path, construct one based on color
    const color = product.color || 'mixed'
    imagePath = `/images/flowers/${color}/${color}-1.jpg`
  }
  
  console.log(`🖼️ Transform Product "${product.name}" - Image: ${imagePath}`)
  
  return {
    id: product.id || index + 1,
    name: product.name,
    price: Number(product.price),
    image: imagePath,
    category: product.category?.name || product.category || 'Flowers',
    featured: product.featured || product.isFeatured || index < 8,
    description: product.description || `${product.name} from Akazuba Florist`,
    color: product.color || 'mixed',
    type: product.type || 'Flower',
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    stockQuantity: product.stockQuantity,
    tags: product.tags
  }
}

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProductsState>({
    products: [],
    featuredProducts: [],
    isLoading: true,
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
        
        // Create mapping between frontend IDs and backend IDs for fallback compatibility
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

  const getBackendProductId = (frontendId: number | string): string | undefined => {
    // If the frontendId is already a string (backend ID), return it directly
    if (typeof frontendId === 'string' && frontendId.length > 10) {
      return frontendId // This is likely already a backend ID
    }
    
    // If it's a number, look it up in the mapping
    const numericId = typeof frontendId === 'string' ? parseInt(frontendId, 10) : frontendId
    const backendId = backendIdMapping.get(numericId)
    
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
