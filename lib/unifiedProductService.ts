import { Product } from '@/types'

// Unified Product Service - Single source of truth for all product operations
class UnifiedProductService {
  private baseURL: string
  private cache: Map<string, { data: Product[], timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

  constructor() {
    // Use same logic as databaseApi for consistency
    this.baseURL = this.getApiBaseUrl()
  }

  private getApiBaseUrl(): string {
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_API_URL || 'https://akazuba-backend-api.onrender.com/api/v1'
    }
    
    const hostname = window.location.hostname
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
    
    if (isLocalhost) {
      return 'http://localhost:5000/api/v1'
    } else {
      return process.env.NEXT_PUBLIC_API_URL || 'https://akazuba-backend-api.onrender.com/api/v1'
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.log('🔑 Token found for authentication:', token.substring(0, 20) + '...')
    } else {
      console.warn('⚠️ No authentication token found')
    }
    
    return headers
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    
    const now = Date.now()
    return (now - cached.timestamp) < this.CACHE_DURATION
  }

  private setCache(key: string, data: Product[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  private invalidateCache(): void {
    console.log(`🗑️ Invalidating cache (size before: ${this.cache.size})`)
    this.cache.clear()
    console.log(`🗑️ Product cache invalidated (size after: ${this.cache.size})`)
  }

  // Convert backend product to frontend Product type
  private convertBackendProduct(backendProduct: any): Product {
    if (!backendProduct || !backendProduct.name) {
      console.warn('🚨 Invalid product data received:', backendProduct)
      console.warn('🚨 This will create a fallback product, increasing the total count!')
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

    const price = typeof backendProduct.price === 'string' ? parseFloat(backendProduct.price) : (backendProduct.price || 0)
    const images = backendProduct.images && backendProduct.images.length > 0 
      ? backendProduct.images 
      : backendProduct.image 
        ? [backendProduct.image] 
        : ['/images/placeholder-flower.jpg']

    return {
      id: backendProduct.id || `product-${Date.now()}`,
      name: backendProduct.name || 'Unnamed Product',
      type: backendProduct.type || 'flower',
      color: backendProduct.color || 'mixed',
      brand: backendProduct.brand || 'Akazuba Florist',
      description: backendProduct.description || '',
      price: price,
      salePrice: backendProduct.salePrice || null,
      stockQuantity: backendProduct.stockQuantity || backendProduct.stock || 0,
      images: images,
      categoryName: backendProduct.category?.name || backendProduct.category || 'Unknown',
      size: backendProduct.size || 'Standard',
      isActive: backendProduct.isActive !== false,
      isFeatured: backendProduct.featured || backendProduct.isFeatured || false,
      sku: backendProduct.sku || `SKU-${backendProduct.id}`,
      weight: backendProduct.weight || 0,
      tags: backendProduct.tags || [backendProduct.type, backendProduct.color].filter(Boolean),
      categoryIds: backendProduct.category?.id ? [backendProduct.category.id] : []
    }
  }

  // Get fallback products (same for both admin and customer)
  private getFallbackProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Female Elegance Perfume',
        type: 'perfume',
        color: 'pink',
        brand: 'Akazuba',
        description: 'Elegant and feminine fragrance for women, perfect for special occasions and romantic evenings',
        price: 65000,
        salePrice: null,
        stockQuantity: 10,
        images: ['/images/flowers/red/red-1.jpg'],
        categoryName: 'Perfumes',
        size: 'Standard',
        isActive: true,
        isFeatured: true,
        sku: 'PERF-001',
        weight: 0.5,
        tags: ['perfume', 'pink', 'elegant'],
        categoryIds: ['perfumes-category']
      },
      {
        id: '2',
        name: 'Wedding Bouquet - White Roses',
        type: 'flower',
        color: 'white',
        brand: 'Akazuba',
        description: 'Beautiful white rose bouquet perfect for wedding ceremonies and bridal celebrations',
        price: 130000,
        salePrice: null,
        stockQuantity: 5,
        images: ['/images/flowers/white/white-1.jpg'],
        categoryName: 'Flowers',
        size: 'Large',
        isActive: true,
        isFeatured: true,
        sku: 'FLWR-002',
        weight: 1.2,
        tags: ['flower', 'white', 'wedding'],
        categoryIds: ['flowers-category']
      },
      {
        id: '3',
        name: 'Anniversary Red Roses',
        type: 'flower',
        color: 'red',
        brand: 'Akazuba',
        description: 'Romantic red roses perfect for anniversaries and expressing love',
        price: 130000,
        salePrice: null,
        stockQuantity: 8,
        images: ['/images/flowers/red/red-1.jpg'],
        categoryName: 'Flowers',
        size: 'Medium',
        isActive: true,
        isFeatured: true,
        sku: 'FLWR-003',
        weight: 0.8,
        tags: ['flower', 'red', 'anniversary'],
        categoryIds: ['flowers-category']
      },
      {
        id: '4',
        name: 'Valentine\'s Day Special',
        type: 'flower',
        color: 'red',
        brand: 'Akazuba',
        description: 'Romantic red and pink roses perfect for Valentine\'s Day celebrations',
        price: 95000,
        salePrice: null,
        stockQuantity: 12,
        images: ['/images/flowers/red/red-2.jpg'],
        categoryName: 'Flowers',
        size: 'Medium',
        isActive: true,
        isFeatured: false,
        sku: 'FLWR-004',
        weight: 0.9,
        tags: ['flower', 'red', 'valentine'],
        categoryIds: ['flowers-category']
      },
      {
        id: '5',
        name: 'Mother\'s Day Pink Bouquet',
        type: 'flower',
        color: 'pink',
        brand: 'Akazuba',
        description: 'Beautiful pink flowers perfect for showing love and appreciation to mothers',
        price: 85000,
        salePrice: null,
        stockQuantity: 7,
        images: ['/images/flowers/pink/pink-1.jpg'],
        categoryName: 'Flowers',
        size: 'Medium',
        isActive: true,
        isFeatured: false,
        sku: 'FLWR-005',
        weight: 0.7,
        tags: ['flower', 'pink', 'mothers-day'],
        categoryIds: ['flowers-category']
      },
      {
        id: '6',
        name: 'Graduation Sunflower Arrangement',
        type: 'flower',
        color: 'yellow',
        brand: 'Akazuba',
        description: 'Bright yellow sunflowers perfect for graduation celebrations and achievements',
        price: 75000,
        salePrice: null,
        stockQuantity: 9,
        images: ['/images/flowers/yellow/yellow-1.jpg'],
        categoryName: 'Flowers',
        size: 'Large',
        isActive: true,
        isFeatured: false,
        sku: 'FLWR-006',
        weight: 1.0,
        tags: ['flower', 'yellow', 'graduation'],
        categoryIds: ['flowers-category']
      },
      {
        id: '7',
        name: 'Male Confidence Cologne',
        type: 'perfume',
        color: 'blue',
        brand: 'Akazuba',
        description: 'Masculine and confident fragrance for the modern gentleman',
        price: 55000,
        salePrice: null,
        stockQuantity: 15,
        images: ['/images/perfumes/male/male-1.jpg'],
        categoryName: 'Perfumes',
        size: 'Standard',
        isActive: true,
        isFeatured: false,
        sku: 'PERF-007',
        weight: 0.4,
        tags: ['perfume', 'blue', 'masculine'],
        categoryIds: ['perfumes-category']
      },
      {
        id: '8',
        name: 'Soft Scent Daily Wear',
        type: 'perfume',
        color: 'white',
        brand: 'Akazuba',
        description: 'Gentle and subtle fragrance perfect for everyday wear and office use',
        price: 45000,
        salePrice: null,
        stockQuantity: 20,
        images: ['/images/perfumes/soft/soft-1.jpg'],
        categoryName: 'Perfumes',
        size: 'Standard',
        isActive: true,
        isFeatured: false,
        sku: 'PERF-008',
        weight: 0.3,
        tags: ['perfume', 'white', 'daily'],
        categoryIds: ['perfumes-category']
      },
      {
        id: '9',
        name: 'Birthday Celebration Mix',
        type: 'flower',
        color: 'mixed',
        brand: 'Akazuba',
        description: 'Colorful mixed flower arrangement perfect for birthday celebrations and parties',
        price: 65000,
        salePrice: null,
        stockQuantity: 6,
        images: ['/images/flowers/mixed/mixed-1.jpg'],
        categoryName: 'Flowers',
        size: 'Large',
        isActive: true,
        isFeatured: false,
        sku: 'FLWR-009',
        weight: 1.1,
        tags: ['flower', 'mixed', 'birthday'],
        categoryIds: ['flowers-category']
      },
      {
        id: '10',
        name: 'Funeral Peaceful Lilies',
        type: 'flower',
        color: 'white',
        brand: 'Akazuba',
        description: 'Peaceful white lilies for respectful memorial and funeral arrangements',
        price: 90000,
        salePrice: null,
        stockQuantity: 4,
        images: ['/images/flowers/white/white-2.jpg'],
        categoryName: 'Flowers',
        size: 'Medium',
        isActive: true,
        isFeatured: false,
        sku: 'FLWR-010',
        weight: 0.6,
        tags: ['flower', 'white', 'funeral'],
        categoryIds: ['flowers-category']
      }
    ]
  }

  // Get all products (used by both admin and customer)
  async getAllProducts(forceRefresh = false, adminContext = false, customHeaders?: Record<string, string>): Promise<Product[]> {
    const cacheKey = adminContext ? 'admin-products' : 'all-products'
    
    console.log(`🔄 getAllProducts called with forceRefresh: ${forceRefresh}, adminContext: ${adminContext}`)
    console.log(`📦 Cache valid: ${this.isCacheValid(cacheKey)}`)
    console.log(`📦 Cache size: ${this.cache.size}`)
    
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      const cachedData = this.cache.get(cacheKey)!.data
      console.log(`📦 Returning cached ${adminContext ? 'admin ' : ''}products:`, cachedData.length)
      return cachedData
    }

    try {
      // Use admin endpoint for admin context to get all products (active + inactive)
      const endpoint = adminContext ? `${this.baseURL}/admin/products` : `${this.baseURL}/products`
      console.log('🔄 Fetching products from backend:', endpoint)
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: customHeaders || this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Backend products response:', data)

      let products: Product[] = []
      
      if (data.success && data.data) {
        console.log(`🔄 Converting ${data.data.length} backend products...`)
        products = data.data.map((product: any, index: number) => {
          console.log(`🔄 Converting product ${index + 1}:`, { id: product.id, name: product.name })
          return this.convertBackendProduct(product)
        })
        console.log(`✅ Conversion complete: ${products.length} products`)
      } else {
        throw new Error('Invalid response format')
      }

      // Cache the results
      console.log(`📦 Caching ${products.length} products`)
      this.setCache(cacheKey, products)
      console.log(`📦 Cache updated, size: ${this.cache.size}`)
      return products

    } catch (error) {
      console.warn('⚠️ Backend not available, using fallback products:', error)
      
      const fallbackProducts = this.getFallbackProducts()
      this.setCache(cacheKey, fallbackProducts)
      return fallbackProducts
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getAllProducts()
    return products.find(product => product.id === id) || null
  }

  // Create product (Admin only)
  async createProduct(productData: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      console.log('🔄 Creating product in backend:', productData)
      console.log('🔗 Backend URL:', `${this.baseURL}/products`)
      console.log('🔑 Auth headers:', this.getAuthHeaders())
      
      // Get actual category IDs from backend
      const categories = await this.getCategories()
      console.log('📂 Available categories:', categories)
      
      // Find the correct category ID
      let categoryId = null
      if (productData.categoryName === 'Flowers' || productData.categoryName === 'flowers') {
        const flowersCategory = categories.find(cat => 
          cat.name?.toLowerCase().includes('flower') || 
          cat.name?.toLowerCase().includes('flower')
        )
        categoryId = flowersCategory?.id || categories[0]?.id
      } else if (productData.categoryName === 'Perfumes' || productData.categoryName === 'perfumes') {
        const perfumesCategory = categories.find(cat => 
          cat.name?.toLowerCase().includes('perfume') || 
          cat.name?.toLowerCase().includes('perfume')
        )
        categoryId = perfumesCategory?.id || categories[0]?.id
      } else {
        // Default to first available category
        categoryId = categories[0]?.id
      }
      
      console.log('🎯 Selected category ID:', categoryId)
      
      const backendData = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stockQuantity: productData.stockQuantity,
        isActive: productData.isActive,
        images: productData.images,
        categoryId: categoryId,
        tags: productData.tags,
        sku: productData.sku,
        weight: productData.weight
      }

      console.log('📤 Sending to backend:', backendData)

      const response = await fetch(`${this.baseURL}/products`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(backendData)
      })

      console.log('📥 Backend response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Backend error response:', errorText)
        throw new Error(`Backend responded with status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('📥 Backend response data:', data)
      
      if (data.success && data.data) {
        console.log('✅ Product created successfully in backend')
        // Invalidate cache after creating product
        this.invalidateCache()
        const convertedProduct = this.convertBackendProduct(data.data)
        console.log('🔄 Converted product:', convertedProduct)
        return convertedProduct
      }
      
      console.error('❌ Backend response indicates failure:', data)
      return null
    } catch (error) {
      console.error('❌ Error creating product:', error)
      
      // Don't return fallback product for validation errors - let the error bubble up
      if (error instanceof Error && error.message.includes('400')) {
        throw error // Re-throw validation errors
      }
      
      console.warn('⚠️ Backend not available for product creation:', error)
      
      // Only return fallback product for network/connection issues
      const fallbackProduct: Product = {
        id: Date.now().toString(),
        ...productData
      }
      
      console.log('📝 Returning fallback product:', fallbackProduct)
      return fallbackProduct
    }
  }

  // Update product (Admin only)
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      console.log('🔄 Updating product in backend:', id, updates)
      
      const backendUpdates = {
        name: updates.name,
        description: updates.description,
        price: updates.price,
        stockQuantity: updates.stockQuantity,
        isActive: updates.isActive,
        images: updates.images,
        tags: updates.tags,
        sku: updates.sku,
        weight: updates.weight
      }

      const response = await fetch(`${this.baseURL}/products/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(backendUpdates)
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        // Invalidate cache after updating product
        this.invalidateCache()
        return this.convertBackendProduct(data.data)
      }
      
      return null
    } catch (error) {
      console.warn('⚠️ Backend not available for product update:', error)
      return null
    }
  }

  // Delete product (Admin only)
  async deleteProduct(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting product from backend:', id)
      
      const response = await fetch(`${this.baseURL}/products/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Invalidate cache after deleting product
        this.invalidateCache()
        console.log('✅ Product deleted successfully from backend')
        return true
      }
      
      return false
    } catch (error) {
      console.warn('⚠️ Backend not available for product deletion:', error)
      // Don't delete from local state if backend is not available
      return false
    }
  }

  // Force refresh - clears cache and refetches
  async forceRefresh(): Promise<Product[]> {
    console.log('🔄 Force refreshing products...')
    this.invalidateCache()
    return this.getAllProducts(true)
  }

  // Debug method to get cache info
  getCacheInfo(): { size: number; keys: string[]; valid: boolean } {
    const cacheKey = 'all-products'
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      valid: this.isCacheValid(cacheKey)
    }
  }

  // Get categories
  async getCategories(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/categories`, {
        headers: this.getAuthHeaders()
      })
      const data = await response.json()
      
      if (data.success && data.data) {
        console.log('📂 Categories from backend:', data.data)
        return data.data
      }
      return []
    } catch (error) {
      console.warn('⚠️ Backend not available for categories:', error)
      return [
        { id: 'flowers-category', name: 'Flowers', slug: 'flowers' },
        { id: 'perfumes-category', name: 'Perfumes', slug: 'perfumes' }
      ]
    }
  }
}

// Export singleton instance
export const unifiedProductService = new UnifiedProductService()
