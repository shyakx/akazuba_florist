import { realFlowerProducts } from '@/data/real-flowers'
import { AdminProduct } from './adminApi'

// Transform real flower data to admin product format
const transformToAdminProduct = (product: any, index: number): AdminProduct => ({
  id: product.id.toString(),
  name: product.name,
  slug: product.name.toLowerCase().replace(/\s+/g, '-'),
  description: product.description,
  shortDescription: product.description.substring(0, 100) + '...',
  price: product.price,
  salePrice: undefined,
  costPrice: product.price * 0.6, // Estimate cost price as 60% of selling price
  sku: `${product.type.toUpperCase()}-${product.color.toUpperCase()}-${product.id}`,
  stockQuantity: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
  minStockAlert: 5,
  categoryId: product.color, // Use color as category for now
  categoryName: product.color.charAt(0).toUpperCase() + product.color.slice(1) + ' Flowers',
  images: [product.image],
  isActive: true,
  isFeatured: product.featured,
  weight: Math.floor(Math.random() * 2) + 1, // Random weight 1-3 kg
  dimensions: {
    length: Math.floor(Math.random() * 20) + 20,
    width: Math.floor(Math.random() * 15) + 15,
    height: Math.floor(Math.random() * 30) + 30
  },
  tags: [product.color, product.type.toLowerCase(), 'flowers'],
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
  updatedAt: new Date().toISOString(),
  views: Math.floor(Math.random() * 1000) + 100,
  sales: Math.floor(Math.random() * 50) + 5,
  revenue: (Math.floor(Math.random() * 50) + 5) * product.price,
  rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3.0-5.0
  reviewCount: Math.floor(Math.random() * 20) + 1
})

class ProductStorage {
  private products: AdminProduct[] = []
  private nextId: number = 1
  private isInitialized = false

  constructor() {
    this.loadFromStorage()
  }

  // Initialize products from real flower data
  initializeProducts() {
    if (this.isInitialized) return

    // Transform real flower products to admin format
    this.products = realFlowerProducts.map((product, index) => 
      transformToAdminProduct(product, index)
    )
    
    // Set next ID for new products
    this.nextId = this.products.length + 1
    
    this.isInitialized = true
    this.saveToStorage()
  }

  // Get products with optional filtering and pagination
  getProducts(options?: {
    search?: string
    category?: string
    status?: string
    page?: number
    limit?: number
  }): { products: AdminProduct[]; total: number; pages: number } {
    this.initializeProducts()
    
    let filteredProducts = [...this.products]

    // Apply search filter
    if (options?.search) {
      const searchTerm = options.search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.categoryName.toLowerCase().includes(searchTerm)
      )
    }

    // Apply category filter
    if (options?.category && options.category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.categoryId === options.category
      )
    }

    // Apply status filter
    if (options?.status && options.status !== 'all') {
      if (options.status === 'active') {
        filteredProducts = filteredProducts.filter(product => product.isActive)
      } else if (options.status === 'inactive') {
        filteredProducts = filteredProducts.filter(product => !product.isActive)
      } else if (options.status === 'featured') {
        filteredProducts = filteredProducts.filter(product => product.isFeatured)
      }
    }

    const total = filteredProducts.length
    const page = options?.page || 1
    const limit = options?.limit || 10
    const pages = Math.ceil(total / limit)

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return {
      products: paginatedProducts,
      total,
      pages
    }
  }

  // Add new product
  addProduct(productData: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>): AdminProduct {
    this.initializeProducts()
    
    const newProduct: AdminProduct = {
      ...productData,
      id: this.nextId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.products.push(newProduct)
    this.nextId++
    this.saveToStorage()
    
    // Sync with backend
    this.syncToBackend(newProduct, 'create')
    
    return newProduct
  }

  // Update existing product
  updateProduct(updatedProduct: AdminProduct): AdminProduct {
    this.initializeProducts()
    
    const index = this.products.findIndex(p => p.id === updatedProduct.id)
    if (index === -1) {
      throw new Error('Product not found')
    }

    const product = {
      ...updatedProduct,
      updatedAt: new Date().toISOString()
    }

    this.products[index] = product
    this.saveToStorage()
    
    // Sync with backend
    this.syncToBackend(product, 'update')
    
    return product
  }

  // Delete product
  deleteProduct(id: string): void {
    this.initializeProducts()
    
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }

    this.products.splice(index, 1)
    this.saveToStorage()
    
    // Sync with backend
    this.syncToBackend({ id } as AdminProduct, 'delete')
  }

  // Bulk operations
  bulkOperation(operation: 'delete' | 'activate' | 'deactivate' | 'feature' | 'unfeature', productIds: string[]): void {
    this.initializeProducts()
    
    this.products = this.products.map(product => {
      if (productIds.includes(product.id)) {
        switch (operation) {
          case 'delete':
            return null
          case 'activate':
            return { ...product, isActive: true, updatedAt: new Date().toISOString() }
          case 'deactivate':
            return { ...product, isActive: false, updatedAt: new Date().toISOString() }
          case 'feature':
            return { ...product, isFeatured: true, updatedAt: new Date().toISOString() }
          case 'unfeature':
            return { ...product, isFeatured: false, updatedAt: new Date().toISOString() }
          default:
            return product
        }
      }
      return product
    }).filter(Boolean) as AdminProduct[]

    this.saveToStorage()
    
    // Sync with backend
    this.syncBulkToBackend(operation, productIds)
  }

  // Get categories dynamically from products
  getCategories(): Array<{ id: string; name: string; count: number }> {
    this.initializeProducts()
    
    const categoryMap = new Map<string, number>()
    
    this.products.forEach(product => {
      const count = categoryMap.get(product.categoryId) || 0
      categoryMap.set(product.categoryId, count + 1)
    })

    return Array.from(categoryMap.entries()).map(([id, count]) => ({
      id,
      name: this.products.find(p => p.categoryId === id)?.categoryName || id,
      count
    }))
  }

  // Get analytics data
  getAnalytics(): any {
    this.initializeProducts()
    
    const totalProducts = this.products.length
    const activeProducts = this.products.filter(p => p.isActive).length
    const featuredProducts = this.products.filter(p => p.isFeatured).length
    const lowStockProducts = this.products.filter(p => p.stockQuantity <= 5).length
    
    const totalRevenue = this.products.reduce((sum, p) => sum + (p.revenue || 0), 0)
    const totalSales = this.products.reduce((sum, p) => sum + (p.sales || 0), 0)
    const totalViews = this.products.reduce((sum, p) => sum + (p.views || 0), 0)
    
    const avgRating = this.products.length > 0 
      ? this.products.reduce((sum, p) => sum + (p.rating || 0), 0) / this.products.length 
      : 0

    return {
      totalProducts,
      activeProducts,
      featuredProducts,
      lowStockProducts,
      totalRevenue,
      totalSales,
      totalViews,
      avgRating: parseFloat(avgRating.toFixed(1))
    }
  }

  // Sync with backend database
  private async syncToBackend(product: AdminProduct, operation: 'create' | 'update' | 'delete') {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      switch (operation) {
        case 'create':
          await fetch(`${baseURL}/api/v1/admin/products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
          })
          break
        case 'update':
          await fetch(`${baseURL}/api/v1/admin/products/${product.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
          })
          break
        case 'delete':
          await fetch(`${baseURL}/api/v1/admin/products/${product.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          break
      }
    } catch (error) {
      console.error('Failed to sync with backend:', error)
    }
  }

  // Sync bulk operations with backend
  private async syncBulkToBackend(operation: string, productIds: string[]) {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      await fetch(`${baseURL}/api/v1/admin/products/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ operation, productIds })
      })
    } catch (error) {
      console.error('Failed to sync bulk operation with backend:', error)
    }
  }

  // Load from localStorage
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('productStorage')
      if (stored) {
        const data = JSON.parse(stored)
        this.products = data.products || []
        this.nextId = data.nextId || 1
        this.isInitialized = data.isInitialized || false
      }
    } catch (error) {
      console.error('Error loading from storage:', error)
    }
  }

  // Save to localStorage
  private saveToStorage() {
    try {
      const data = {
        products: this.products,
        nextId: this.nextId,
        isInitialized: this.isInitialized
      }
      localStorage.setItem('productStorage', JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  }
}

export const productStorage = new ProductStorage()
