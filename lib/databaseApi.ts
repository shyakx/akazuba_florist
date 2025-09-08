import { Product } from '@/types'

// API Base URL configuration
const getApiBaseUrl = (): string => {
  // Check if we're in the browser and have access to window.location
  if (typeof window === 'undefined' || typeof window.location === 'undefined') {
    // Server-side rendering - use environment variable
    return process.env.NEXT_PUBLIC_API_URL || 'https://akazuba-backend-api.onrender.com/api/v1'
  }
  
  // Client-side - check current hostname
  const hostname = window.location.hostname
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  
  if (isLocalhost) {
    // Development - use local backend
    return 'http://localhost:5000/api/v1'
  } else {
    // Production - use environment variable or production URL
    return process.env.NEXT_PUBLIC_API_URL || 'https://akazuba-backend-api.onrender.com/api/v1'
  }
}

// Database Product Interface (matches actual backend API response)
export interface DatabaseProduct {
  id: string
  name: string
  price: string | number
  image?: string
  images?: string[]
  category?: {
    id: string
    name: string
    slug: string
    description?: string
    imageUrl?: string
  }
  featured?: boolean
  description: string
  color?: string
  type?: string
  slug?: string
  shortDescription?: string
  categories?: {
    id: string
    name: string
    slug: string
  }
  isActive?: boolean
  stockQuantity?: number
  sku?: string
  weight?: number
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

// Convert DatabaseProduct to Product (for frontend compatibility)
const convertDatabaseProductToProduct = (dbProduct: DatabaseProduct): Product => {
  // Ensure we have a valid product object
  if (!dbProduct || !dbProduct.name) {
    console.warn('Invalid product data received:', dbProduct)
    // Return a fallback product to prevent crashes
    return {
      id: 'fallback-' + Date.now(),
      name: 'Unknown Product',
      type: 'unknown',
      color: 'mixed',
      brand: 'Akazuba Florist',
      description: 'Product information unavailable',
      price: 0,
      salePrice: null,
      stockQuantity: 0,
      images: ['/images/placeholder-flower.jpg'],
      categoryName: 'Unknown',
      size: 'Standard',
      isActive: false,
      isFeatured: false,
      sku: 'SKU-UNKNOWN',
      weight: 0,
      tags: ['unknown'],
      categoryIds: ['unknown-category']
    }
  }

  // Parse price safely
  const price = typeof dbProduct.price === 'string' ? parseFloat(dbProduct.price) : (dbProduct.price || 0)
  
  // Handle images - prefer images array, fallback to single image
  const images = dbProduct.images && dbProduct.images.length > 0 
    ? dbProduct.images 
    : dbProduct.image 
      ? [dbProduct.image] 
      : ['/images/placeholder-flower.jpg']
  
  return {
    id: dbProduct.id || `product-${Date.now()}`,
    name: dbProduct.name || 'Unnamed Product',
    type: dbProduct.type || 'flower',
    color: dbProduct.color || 'mixed',
    brand: 'Akazuba Florist',
    description: dbProduct.description || 'No description available',
    shortDescription: dbProduct.shortDescription || dbProduct.description || 'No description available',
    price: price,
    salePrice: null, // Backend doesn't provide sale price
    stockQuantity: dbProduct.stockQuantity || 50, // Use provided stock or default
    images: images,
    categoryName: dbProduct.category?.name || dbProduct.categories?.name || 'Unknown',
    size: 'Standard', // Default size
    isActive: dbProduct.isActive !== undefined ? dbProduct.isActive : true, // Use provided or default to active
    isFeatured: dbProduct.featured || false,
    sku: dbProduct.sku || `SKU-${dbProduct.id?.slice(-6) || 'UNKNOWN'}`, // Use provided SKU or generate
    weight: dbProduct.weight || 0.5, // Use provided weight or default
    tags: [
      dbProduct.type || 'flower',
      dbProduct.color || 'mixed',
      dbProduct.category?.name || dbProduct.categories?.name || 'Unknown',
      ...(dbProduct.tags || [])
    ].filter(Boolean),
    categoryIds: [
      dbProduct.category?.id || dbProduct.categories?.id || 'unknown-category'
    ],
    createdAt: dbProduct.createdAt,
    updatedAt: dbProduct.updatedAt
  }
}

class DatabaseAPI {
  private baseURL: string
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.baseURL = getApiBaseUrl()
  }

  // Cache management
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key)
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      console.log('📦 Database API: Using cached data for:', key)
      return cached.data
    }
    return null
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
    console.log('📦 Database API: Cached data for:', key)
  }

  // Invalidate cache for admin operations
  private invalidateCache(): void {
    this.cache.clear()
    console.log('🗑️ Database API: Cache invalidated')
  }

  // Get all products with caching
  async getAllProducts(): Promise<Product[]> {
    const cacheKey = 'all-products'
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const timestamp = Date.now()
      const url = `${this.baseURL}/products?limit=1000&_t=${timestamp}`
      console.log('🌐 Database API: Fetching from:', url)
      
      const response = await fetch(url)
      const data = await response.json()
      
      console.log('📊 Database API Response:', {
        success: data.success,
        dataLength: data.data?.length || 0,
        pagination: data.pagination,
        sampleProducts: data.data?.slice(0, 3).map((p: any) => ({ id: p.id, name: p.name, category: p.category }))
      })
      
      if (data.success && data.data) {
        const convertedProducts = data.data.map((dbProduct: DatabaseProduct) => {
          return convertDatabaseProductToProduct(dbProduct)
        })
        
        console.log(`✅ Database API: Converted ${convertedProducts.length} products`)
        
        // Cache the result
        this.setCachedData(cacheKey, convertedProducts)
        return convertedProducts
      }
      
      console.log('⚠️ Database API: No data or success false')
      return []
    } catch (error) {
      console.error('❌ Database API: Get all products error:', error)
      return []
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseURL}/products/${id}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        return convertDatabaseProductToProduct(data.data)
      }
      return null
    } catch (error) {
      console.error('Database API: Get product by ID error:', error)
      return null
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}/products?featured=true&limit=8`)
      const data = await response.json()
      
      if (data.success && data.data) {
        return data.data.map(convertDatabaseProductToProduct)
      }
      return []
    } catch (error) {
      console.error('Database API: Get featured products error:', error)
      return []
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const categorySlug = category.toLowerCase()
      const response = await fetch(`${this.baseURL}/products?category=${categorySlug}&limit=1000`)
      const data = await response.json()
      
      if (data.success && data.data) {
        return data.data.map(convertDatabaseProductToProduct)
      }
      return []
    } catch (error) {
      console.error('Database API: Get products by category error:', error)
      return []
    }
  }

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}/products?search=${encodeURIComponent(query)}&limit=1000`)
      const data = await response.json()
      
      if (data.success && data.data) {
        return data.data.map(convertDatabaseProductToProduct)
      }
      return []
    } catch (error) {
      console.error('Database API: Search products error:', error)
      return []
    }
  }

  // Create product (Admin only)
  async createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Authentication required')
      }

      const dbProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice || undefined,
        stockQuantity: product.stockQuantity,
        images: product.images,
        categoryId: product.categoryName === 'Flowers' ? 'flowers-category-id' : 'perfumes-category-id', // We'll need to get real category IDs
        tags: [
          product.type,
          product.color,
          ...(product.size ? ['size'] : []),
          ...(product.concentration ? ['concentration'] : []),
          ...(product.tags || [])
        ].filter(Boolean),
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        sku: product.sku,
        weight: product.weight
      }
      
      const response = await fetch(`${this.baseURL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dbProduct)
      })

      const data = await response.json()
      
      if (data.success && data.data) {
        // Invalidate cache after creating product
        this.invalidateCache()
        return convertDatabaseProductToProduct(data.data)
      }
      return null
    } catch (error) {
      console.error('Database API: Create product error:', error)
      throw error
    }
  }

  // Update product (Admin only)
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Authentication required')
      }

      const dbUpdates = {
        name: updates.name,
        description: updates.description,
        price: updates.price,
        salePrice: updates.salePrice || undefined,
        stockQuantity: updates.stockQuantity,
        images: updates.images,
        categoryId: updates.categoryName === 'Flowers' ? 'flowers-category-id' : 'perfumes-category-id', // We'll need to get real category IDs
        tags: [
          updates.type,
          updates.color,
          ...(updates.size ? ['size'] : []),
          ...(updates.concentration ? ['concentration'] : []),
          ...(updates.tags || [])
        ].filter(Boolean),
        isActive: updates.isActive,
        isFeatured: updates.isFeatured,
        sku: updates.sku,
        weight: updates.weight
      }
      
      const response = await fetch(`${this.baseURL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dbUpdates)
      })

      const data = await response.json()
      
      if (data.success && data.data) {
        // Invalidate cache after updating product
        this.invalidateCache()
        return convertDatabaseProductToProduct(data.data)
      }
      return null
    } catch (error) {
      console.error('Database API: Update product error:', error)
      throw error
    }
  }

  // Delete product (Admin only)
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${this.baseURL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        // Invalidate cache after deleting product
        this.invalidateCache()
        return true
      }
      return false
    } catch (error) {
      console.error('Database API: Delete product error:', error)
      throw error
    }
  }

  // Get categories
  async getCategories(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/categories`)
      const data = await response.json()
      
      if (data.success && data.data) {
        return data.data
      }
      return []
    } catch (error) {
      console.error('Database API: Get categories error:', error)
      return []
    }
  }

  // Upload image
  async uploadImage(file: File): Promise<string> {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Authentication required')
      }

      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${this.baseURL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      
      if (data.success && data.data) {
        return data.data.url
      }
      throw new Error('Image upload failed')
    } catch (error) {
      console.error('Database API: Upload image error:', error)
      throw error
    }
  }
}

export const databaseAPI = new DatabaseAPI()
