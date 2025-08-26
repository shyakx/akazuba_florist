import { AdminProduct } from './adminApi'
import { realFlowerProducts } from '@/data/real-flowers'

// Transform real flower products to admin format
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

// Product storage class
export class ProductStorage {
  private products: AdminProduct[] = []
  private nextId: number = 1

  constructor() {
    this.initializeProducts()
  }

  private initializeProducts() {
    // Transform real flower products
    const transformedProducts = realFlowerProducts.map((product, index) => 
      transformToAdminProduct(product, index)
    )
    
    // Set next ID to be higher than existing products
    this.nextId = Math.max(...transformedProducts.map(p => parseInt(p.id))) + 1
    
    this.products = transformedProducts
  }

  // Get all products with optional filtering
  getProducts(filters?: {
    search?: string
    category?: string
    status?: 'active' | 'inactive' | 'all'
    featured?: boolean
    page?: number
    limit?: number
  }): { products: AdminProduct[]; total: number; pages: number } {
    let filteredProducts = [...this.products]

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.categoryName.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Apply category filter
    if (filters?.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.categoryId === filters.category
      )
    }

    // Apply status filter
    if (filters?.status) {
      if (filters.status === 'active') {
        filteredProducts = filteredProducts.filter(product => product.isActive)
      } else if (filters.status === 'inactive') {
        filteredProducts = filteredProducts.filter(product => !product.isActive)
      }
    }

    // Apply featured filter
    if (filters?.featured !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.isFeatured === filters.featured
      )
    }

    // Apply pagination (if limit is specified, otherwise return all)
    let paginatedProducts = filteredProducts
    let totalPages = 1
    if (filters?.limit && filters.limit < filteredProducts.length) {
      const limit = filters.limit
      const page = filters?.page || 1
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      paginatedProducts = filteredProducts.slice(startIndex, endIndex)
      totalPages = Math.ceil(filteredProducts.length / limit)
    }

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      pages: totalPages
    }
  }

  // Get product by ID
  getProduct(id: string): AdminProduct | null {
    return this.products.find(product => product.id === id) || null
  }

  // Add new product
  addProduct(productData: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>): AdminProduct {
    const newProduct: AdminProduct = {
      ...productData,
      id: this.nextId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.products.push(newProduct)
    this.nextId++

    // Save to localStorage for persistence
    this.saveToStorage()

    return newProduct
  }

  // Update product
  updateProduct(id: string, updates: Partial<AdminProduct>): AdminProduct | null {
    const index = this.products.findIndex(product => product.id === id)
    if (index === -1) return null

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    // Save to localStorage for persistence
    this.saveToStorage()

    return this.products[index]
  }

  // Delete product
  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(product => product.id === id)
    if (index === -1) return false

    this.products.splice(index, 1)
    
    // Save to localStorage for persistence
    this.saveToStorage()

    return true
  }

  // Bulk operations
  bulkOperation(operation: {
    productIds: string[]
    operation: 'delete' | 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'updateStock'
    data?: any
  }): { success: boolean; affectedCount: number; message: string } {
    const { productIds, operation: op, data } = operation
    let affectedCount = 0

    switch (op) {
      case 'delete':
        productIds.forEach(id => {
          if (this.deleteProduct(id)) affectedCount++
        })
        return { success: true, affectedCount, message: `${affectedCount} products deleted` }

      case 'activate':
        productIds.forEach(id => {
          if (this.updateProduct(id, { isActive: true })) affectedCount++
        })
        return { success: true, affectedCount, message: `${affectedCount} products activated` }

      case 'deactivate':
        productIds.forEach(id => {
          if (this.updateProduct(id, { isActive: false })) affectedCount++
        })
        return { success: true, affectedCount, message: `${affectedCount} products deactivated` }

      case 'feature':
        productIds.forEach(id => {
          if (this.updateProduct(id, { isFeatured: true })) affectedCount++
        })
        return { success: true, affectedCount, message: `${affectedCount} products featured` }

      case 'unfeature':
        productIds.forEach(id => {
          if (this.updateProduct(id, { isFeatured: false })) affectedCount++
        })
        return { success: true, affectedCount, message: `${affectedCount} products unfeatured` }

      case 'updateStock':
        productIds.forEach(id => {
          const product = this.getProduct(id)
          if (product && data?.quantity !== undefined) {
            let newQuantity = product.stockQuantity
            if (data.operation === 'add') newQuantity += data.quantity
            else if (data.operation === 'subtract') newQuantity -= data.quantity
            else if (data.operation === 'set') newQuantity = data.quantity

            if (newQuantity >= 0) {
              this.updateProduct(id, { stockQuantity: newQuantity })
              affectedCount++
            }
          }
        })
        return { success: true, affectedCount, message: `Stock updated for ${affectedCount} products` }

      default:
        return { success: false, affectedCount: 0, message: 'Invalid operation' }
    }
  }

  // Get categories
  getCategories(): { id: string; name: string; count: number }[] {
    const categoryMap = new Map<string, { name: string; count: number }>()

    this.products.forEach(product => {
      const existing = categoryMap.get(product.categoryId)
      if (existing) {
        existing.count++
      } else {
        categoryMap.set(product.categoryId, {
          name: product.categoryName,
          count: 1
        })
      }
    })

    return Array.from(categoryMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      count: data.count
    }))
  }

  // Get analytics
  getAnalytics(): any[] {
    return this.products.map(product => ({
      productId: product.id,
      productName: product.name,
      views: product.views || 0,
      sales: product.sales || 0,
      revenue: product.revenue || 0,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      stockTurnover: product.sales ? (product.sales / product.stockQuantity) : 0,
      profitMargin: product.costPrice ? ((product.price - product.costPrice) / product.price) : 0,
      lastUpdated: product.updatedAt
    }))
  }

  // Save to localStorage
  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminProducts', JSON.stringify(this.products))
      localStorage.setItem('adminProductsNextId', this.nextId.toString())
    }
  }

  // Load from localStorage
  loadFromStorage() {
    if (typeof window !== 'undefined') {
      const savedProducts = localStorage.getItem('adminProducts')
      const savedNextId = localStorage.getItem('adminProductsNextId')
      
      if (savedProducts) {
        this.products = JSON.parse(savedProducts)
      }
      
      if (savedNextId) {
        this.nextId = parseInt(savedNextId)
      }
    }
  }
}

// Export singleton instance
export const productStorage = new ProductStorage()

// Load saved data on initialization
if (typeof window !== 'undefined') {
  productStorage.loadFromStorage()
}
