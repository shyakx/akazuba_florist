'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { productsAPI } from '../lib/api'
import { realFlowerProducts } from '../data/real-flowers'
import { perfumeProducts as perfumeData } from '../data/perfumes'

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
  // Check if it's a perfume based on multiple criteria
  const isPerfume = product.category === 'perfumes' || 
                   product.category?.name === 'perfumes' || 
                   product.brand || 
                   product.concentration ||
                   product.type === 'Men' || 
                   product.type === 'Women' || 
                   product.type === 'Unisex'
  
  let imagePath = product.image || product.images?.[0]

  if (isPerfume) {
    // For perfumes, use perfume-specific image paths
    if (!imagePath) {
      imagePath = 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop'
    }
    // If it's a local path, ensure it goes to perfumes directory
    if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/images/perfumes/')) {
      imagePath = `/images/perfumes/perfume-${(index % 6) + 1}.jpg`
    }
  } else {
    // For flowers, PRESERVE the original image path from realFlowerProducts
    if (!imagePath) {
      // Only set default if no image path exists
      const color = product.color || 'mixed'
      imagePath = `/images/flowers/${color}/${color}-${(index % 2) + 1}.jpg`
    }
    // DON'T override existing flower image paths - they are already correct
    // Only ensure flower images go to flowers directory if they're missing
    if (imagePath && !imagePath.startsWith('/images/flowers/') && !imagePath.startsWith('http') && !imagePath.includes('/images/')) {
      const color = product.color || 'mixed'
      imagePath = `/images/flowers/${color}/${color}-1.jpg`
    }
  }

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

  // Helper function to load local products only
  const loadLocalProducts = async () => {
    // Check if admin mode is active
    if (typeof window !== 'undefined' && (window.location.pathname.startsWith('/admin') || (window as any).adminProductsMode)) {
      console.log('🚫 ProductsContext: Admin mode detected - skipping local products load')
      return
    }
    
    console.log('🔄 Loading local products only...')
    const localFlowerProducts = realFlowerProducts.map((product, index) => transformProduct(product, index))
    const localPerfumeProducts = perfumeData.map((product, index) => transformProduct(product, index + 100))
    
    const allProducts = [...localFlowerProducts, ...localPerfumeProducts]
    const featuredProducts = allProducts.filter(product => product.featured)
    const flowerProducts = localFlowerProducts
    const perfumeProducts = localPerfumeProducts
    
    setState({
      products: allProducts,
      featuredProducts,
      flowerProducts,
      perfumeProducts,
      isLoading: false,
      error: null
    })
    
    console.log('✅ Local products loaded successfully:', allProducts.length)
  }

  const fetchProducts = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      console.log('🔄 Loading products with local data priority...')
      
      // Always load local flower data first (ensures correct image paths)
      console.log('🌸 Loading local flower products...')
      const localFlowerProducts = realFlowerProducts.map((product, index) => transformProduct(product, index))
      console.log('✅ Local flower products loaded:', localFlowerProducts.length)
      
      // Always load local perfume data
      console.log('🌸 Loading local perfume products...')
      const localPerfumeProducts = perfumeData.map((product, index) => transformProduct(product, index + 100))
      console.log('✅ Local perfume products loaded:', localPerfumeProducts.length)
      
      // Try to fetch backend products for additional data
      try {
        console.log('🔄 Attempting to fetch additional products from backend API...')
        const response = await productsAPI.getAll()
        console.log('📡 Backend API response:', response)
        
        if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log('✅ Backend products fetched successfully:', response.data.length, 'products')
          const backendProducts = response.data
          const backendFlowerProducts = backendProducts.map((product, index) => transformProduct(product, index))
          
          // Combine backend flowers with local perfumes (prioritize local flowers for correct images)
          const allProducts = [...localFlowerProducts, ...localPerfumeProducts]
          const featuredProducts = allProducts.filter(product => product.featured)
          const flowerProducts = localFlowerProducts // Use local flowers for correct images
          const perfumeProducts = localPerfumeProducts
          
          // Create mapping between frontend IDs and backend IDs for fallback compatibility
          const mapping = new Map<number, string>()
          backendProducts.forEach((product, index) => {
            mapping.set(index + 1, product.id)
          })
          setBackendIdMapping(mapping)
          
          setState({
            products: allProducts,
            featuredProducts,
            flowerProducts,
            perfumeProducts,
            isLoading: false,
            error: null
          })
          
          console.log('🎉 Products loaded successfully with backend integration')
        } else {
          // Backend failed or returned empty, use local data only
          console.warn('⚠️ Backend products fetch failed or returned empty, using local data only')
          await loadLocalProducts()
        }
      } catch (backendError) {
        console.error('❌ Error fetching products from backend:', backendError)
        console.log('🔄 Using local data only...')
        // Backend failed, use local data only
        await loadLocalProducts()
      }
    } catch (error) {
      console.error('❌ Critical error in fetchProducts:', error)
      // Final fallback to local data
      await loadLocalProducts()
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
    console.log('🔍 getProductsByCategory called with category:', category)
    console.log('📦 Total products available:', state.products.length)
    console.log('🌸 Flower products available:', state.flowerProducts.length)
    
    // Handle both singular and plural category names
    const categoryMap: { [key: string]: string[] } = {
      'flowers': ['flowers', 'flower'],
      'perfumes': ['perfumes', 'perfume'],
      'roses': ['roses', 'rose'],
      'tulips': ['tulips', 'tulip'],
      'lilies': ['lilies', 'lily'],
      'sunflowers': ['sunflowers', 'sunflower'],
      'bouquets': ['bouquets', 'bouquet'],
      'wedding-flowers': ['wedding-flowers', 'wedding', 'wedding flowers'],
      'men-perfumes': ['men-perfumes', 'men', 'men perfume'],
      'women-perfumes': ['women-perfumes', 'women', 'women perfume'],
      'unisex-perfumes': ['unisex-perfumes', 'unisex', 'unisex perfume']
    }
    
    const validCategories = categoryMap[category] || [category]
    console.log('🎯 Valid categories for', category, ':', validCategories)
    
    const filteredProducts = state.products.filter(product => 
      validCategories.includes(product.category.toLowerCase())
    )
    
    console.log('✅ Found', filteredProducts.length, 'products for category', category)
    console.log('📋 Products:', filteredProducts.map(p => ({ id: p.id, name: p.name, category: p.category })))
    
    return filteredProducts
  }

  const getFeaturedByCategory = (category: string): Product[] => {
    return state.featuredProducts.filter(product => product.category === category)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔄 ProductsContext state changed:', {
      totalProducts: state.products.length,
      flowerProducts: state.flowerProducts.length,
      perfumeProducts: state.perfumeProducts.length,
      isLoading: state.isLoading,
      error: state.error
    })
  }, [state])

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
