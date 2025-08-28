'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { productsAPI } from '../lib/api'
import { realFlowerProducts } from '../data/real-flowers'
import { perfumeProducts } from '../data/perfumes'

export interface Product {
  id: string | number
  name: string
  price: number
  image: string
  category: string
  featured: boolean
  description: string
  color?: string
  type: string
  brand?: string
  size?: string
  concentration?: string
  notes?: string
  salePrice?: number
  stockQuantity?: number
  tags?: string[]
}

interface ProductsState {
  products: Product[]
  featuredProducts: Product[]
  flowerProducts: Product[]
  perfumeProducts: Product[]
  isLoading: boolean
  error: string | null
}

interface ProductsContextType {
  state: ProductsState
  refreshProducts: () => Promise<void>
  getProduct: (id: string) => Product | undefined
  getBackendProductId: (frontendId: number | string) => string | undefined
  getProductsByCategory: (category: string) => Product[]
  getFeaturedByCategory: (category: string) => Product[]
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const transformProduct = (product: any, index: number): Product => {
  // Handle both flower and perfume products
  const isPerfume = product.category === 'perfumes' || product.category?.name === 'perfumes'
  
  // Ensure we use the correct image path
  let imagePath = product.image || product.images?.[0]
  
  if (isPerfume) {
    // For perfumes, use the provided image URL or fallback
    if (!imagePath) {
      imagePath = 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop'
    }
  } else {
    // For flowers, use local image paths
    if (!imagePath) {
      const color = product.color || 'mixed'
      imagePath = `/images/flowers/${color}/${color}-${(index % 2) + 1}.jpg`
    }
    
    // Validate flower image path format
    if (imagePath && !imagePath.startsWith('/images/flowers/') && !imagePath.startsWith('http')) {
      const color = product.color || 'mixed'
      imagePath = `/images/flowers/${color}/${color}-1.jpg`
    }
  }
  
  console.log(`🖼️ Transform Product "${product.name}" - Category: ${isPerfume ? 'Perfume' : 'Flower'} - Image: ${imagePath}`)
  
  return {
    id: product.id || index + 1,
    name: product.name,
    price: Number(product.price),
    image: imagePath,
    category: product.category?.name || product.category || (isPerfume ? 'perfumes' : 'flowers'),
    featured: product.featured || product.isFeatured || index < 8,
    description: product.description || `${product.name} from Akazuba Florist`,
    color: product.color || (isPerfume ? undefined : 'mixed'),
    type: product.type || (isPerfume ? 'Perfume' : 'Flower'),
    brand: product.brand,
    size: product.size,
    concentration: product.concentration,
    notes: product.notes,
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    stockQuantity: product.stockQuantity,
    tags: product.tags
  }
}

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProductsState>({
    products: [],
    featuredProducts: [],
    flowerProducts: [],
    perfumeProducts: [],
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
        const flowerProducts = products.filter(product => product.category === 'flowers')
        const perfumeProducts = products.filter(product => product.category === 'perfumes')
        
        // Create mapping between frontend IDs and backend IDs for fallback compatibility
        const mapping = new Map<number, string>()
        backendProducts.forEach((product, index) => {
          mapping.set(index + 1, product.id)
        })
        setBackendIdMapping(mapping)
        
        setState({
          products,
          featuredProducts,
          flowerProducts,
          perfumeProducts,
          isLoading: false,
          error: null
        })
      } else {
        // Fallback to local data if backend fails
        console.warn('Backend products fetch failed, using local data')
        await loadLocalProducts()
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to local data
      await loadLocalProducts()
    }
  }

  const loadLocalProducts = async () => {
    try {
      // Transform flower products
      const flowerProducts = realFlowerProducts.map((product, index) => transformProduct(product, index))
      
      // Transform perfume products
      const perfumeProductsList = perfumeProducts.map((product, index) => transformProduct(product, index + 100))
      
      // Combine all products
      const allProducts = [...flowerProducts, ...perfumeProductsList]
      const featuredProducts = allProducts.filter(product => product.featured)
      
      setState({
        products: allProducts,
        featuredProducts,
        flowerProducts,
        perfumeProducts: perfumeProductsList,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Error loading local products:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load products'
      }))
    }
  }

  const refreshProducts = async () => {
    await fetchProducts()
  }

  const getProduct = (id: string): Product | undefined => {
    return state.products.find(product => product.id.toString() === id)
  }

  const getBackendProductId = (frontendId: number | string): string | undefined => {
    const numId = typeof frontendId === 'string' ? parseInt(frontendId) : frontendId
    return backendIdMapping.get(numId)
  }

  const getProductsByCategory = (category: string): Product[] => {
    return state.products.filter(product => product.category === category)
  }

  const getFeaturedByCategory = (category: string): Product[] => {
    return state.featuredProducts.filter(product => product.category === category)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const value: ProductsContextType = {
    state,
    refreshProducts,
    getProduct,
    getBackendProductId,
    getProductsByCategory,
    getFeaturedByCategory
  }

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}
