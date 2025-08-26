// Admin API Service for fetching real data from backend
import { apiRequest } from './api'
import { realFlowerProducts } from '@/data/real-flowers'

// Dashboard Stats Interface
export interface DashboardStats {
  newOrders: number
  totalProducts: number
  totalCustomers: number
  lowStockProducts: number
}

// Product Interface
export interface AdminProduct {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  salePrice?: number
  costPrice?: number
  sku?: string
  stockQuantity: number
  minStockAlert: number
  categoryId: string
  categoryName: string
  images: string[]
  isActive: boolean
  isFeatured: boolean
  weight?: number
  dimensions?: { length: number; width: number; height: number }
  tags: string[]
  createdAt: string
  updatedAt: string
  // Enhanced fields for analytics
  views?: number
  sales?: number
  revenue?: number
  rating?: number
  reviewCount?: number
}

// Product Analytics Interface
export interface ProductAnalytics {
  productId: string
  productName: string
  views: number
  sales: number
  revenue: number
  rating: number
  reviewCount: number
  stockTurnover: number
  profitMargin: number
  lastUpdated: string
}

// Bulk Operation Interface
export interface BulkOperation {
  productIds: string[]
  operation: 'delete' | 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'updateStock'
  data?: any
}

// Advanced Filter Interface
export interface ProductFilters {
  search?: string
  category?: string
  status?: 'active' | 'inactive' | 'all'
  stockStatus?: 'inStock' | 'lowStock' | 'outOfStock' | 'all'
  priceRange?: { min: number; max: number }
  featured?: boolean
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'sales' | 'views'
  sortOrder?: 'asc' | 'desc'
  tags?: string[]
  dateRange?: { from: string; to: string }
}

// Export Options Interface
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  includeImages?: boolean
  fields?: string[]
  filters?: ProductFilters
}

// Stock Management Interface
export interface StockUpdate {
  productId: string
  quantity: number
  operation: 'add' | 'subtract' | 'set'
  reason?: string
  notes?: string
}

// Image Management Interface
export interface ImageUpdate {
  productId: string
  images: File[]
  operation: 'add' | 'replace' | 'remove'
  imageUrls?: string[]
}

// Order Interface
export interface AdminOrder {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  status: string
  subtotal: number
  deliveryFee: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  deliveryStatus: string
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  notes?: string
  adminNotes?: string
  items: AdminOrderItem[]
  createdAt: string
  updatedAt: string
}

export interface AdminOrderItem {
  id: string
  productId: string
    productName: string
  productImage: string
  productSku?: string
    quantity: number
  unitPrice: number
  totalPrice: number
  color: string
  type: string
}

// Customer Interface
export interface AdminCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  isActive: boolean
  emailVerified: boolean
  totalOrders: number
  totalSpent: number
  createdAt: string
  updatedAt: string
}

// Category Interface
export interface AdminCategory {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
  productCount: number
  createdAt: string
  updatedAt: string
}

// Settings Interface
export interface AdminSettings {
  storeName: string
  storeAddress: string
  storePhone: string
  storeEmail: string
  deliveryFee: number
  freeDeliveryThreshold: number
  enablePickup: boolean
  enableDelivery: boolean
  enableMomo: boolean
  enableBK: boolean
  enableCash: boolean
  lowStockThreshold: number
}

// Recent Order Interface
export interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: number
  status: string
  createdAt: string
}

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

// Admin API Class
class AdminAPI {
  private baseURL: string
  private mockProducts: AdminProduct[] = [
    {
      id: '1',
      name: 'Red Rose Bouquet',
      slug: 'red-rose-bouquet',
      description: 'Beautiful red roses arranged in a stunning bouquet',
      price: 25000,
      stockQuantity: 15,
      minStockAlert: 5,
      categoryId: '1',
      categoryName: 'Roses',
      images: ['/images/flowers/red/red-1.jpg'],
      isActive: true,
      isFeatured: true,
      tags: ['roses', 'red', 'bouquet'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Pink Tulips',
      slug: 'pink-tulips',
      description: 'Fresh pink tulips perfect for spring',
      price: 18000,
      stockQuantity: 8,
      minStockAlert: 5,
      categoryId: '2',
      categoryName: 'Tulips',
      images: ['/images/flowers/pink/pink-1.jpg'],
      isActive: true,
      isFeatured: false,
      tags: ['tulips', 'pink', 'spring'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiRequest('/admin/dashboard/stats')
      
      if (response.success) {
        const stats = response.data as any
        return {
          newOrders: stats.newOrders || 0,
          totalProducts: stats.totalProducts || 0,
          totalCustomers: stats.totalCustomers || 0,
          lowStockProducts: stats.lowStockProducts || 0
        }
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats')
      }
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error)
      // Fallback to mock data
      return {
        newOrders: 5,
        totalProducts: 24,
        totalCustomers: 12,
        lowStockProducts: 3
      }
    }
  }

  async getRecentOrders(): Promise<RecentOrder[]> {
    try {
      const response = await apiRequest('/admin/dashboard/recent-orders')
      
      if (response.success) {
        const orders = (response.data as any[]).map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt
        }))
        
        return orders
      } else {
        throw new Error(response.message || 'Failed to fetch recent orders')
      }
    } catch (error: any) {
      console.error('Error fetching recent orders:', error)
      // Fallback to mock data
      return [
        {
          id: '1',
          orderNumber: 'ORD-001',
          customerName: 'John Doe',
          totalAmount: 25000,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          customerName: 'Jane Smith',
          totalAmount: 35000,
          status: 'CONFIRMED',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          orderNumber: 'ORD-003',
          customerName: 'Mike Johnson',
          totalAmount: 15000,
          status: 'SHIPPED',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ]
    }
  }

  // Products
  async getProducts(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    status?: string
  }): Promise<{ products: AdminProduct[]; total: number; pages: number }> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.category) queryParams.append('category', params.category)
      if (params?.status) queryParams.append('status', params.status)

      const response = await apiRequest(`/admin/products?${queryParams.toString()}`)
      
      if (response.success) {
        const products = (response.data as any[]).map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          price: product.price,
          salePrice: product.salePrice,
          costPrice: product.costPrice,
          sku: product.sku || '',
          stockQuantity: product.stockQuantity,
          minStockAlert: product.minStockAlert || 5,
          categoryId: product.categoryId,
          categoryName: product.category || 'Unknown',
          images: Array.isArray(product.images) ? product.images : [],
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          tags: Array.isArray(product.tags) ? product.tags : [],
          weight: product.weight,
          dimensions: product.dimensions || { length: '', width: '', height: '' },
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }))

        return {
          products,
          total: products.length,
          pages: Math.ceil(products.length / (params?.limit || 10))
        }
      } else {
        throw new Error(response.message || 'Failed to fetch products')
      }
    } catch (error: any) {
      console.error('Error fetching products:', error)
      // Fallback to real flower data if API fails
      const transformedProducts = realFlowerProducts.map((product, index) => 
        transformToAdminProduct(product, index)
      )
      
      // Apply filters if provided
      let filteredProducts = transformedProducts
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase()
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.categoryName.toLowerCase().includes(searchLower)
        )
      }
      
      if (params?.category) {
        filteredProducts = filteredProducts.filter(product => 
          product.categoryId === params.category
        )
      }
      
      if (params?.status) {
        if (params.status === 'active') {
          filteredProducts = filteredProducts.filter(product => product.isActive)
        } else if (params.status === 'inactive') {
          filteredProducts = filteredProducts.filter(product => !product.isActive)
        }
      }
      
      const limit = params?.limit || 10
      const page = params?.page || 1
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
      
      return {
        products: paginatedProducts,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit)
      }
    }
  }

  async getProduct(id: string): Promise<AdminProduct> {
    // Return mock product
    return {
      id: '1',
      name: 'Red Rose Bouquet',
      slug: 'red-rose-bouquet',
      description: 'Beautiful red roses arranged in a stunning bouquet',
      price: 25000,
      stockQuantity: 15,
      minStockAlert: 5,
      categoryId: '1',
      categoryName: 'Roses',
      images: ['/images/flowers/red/red-1.jpg'],
      isActive: true,
      isFeatured: true,
      tags: ['roses', 'red', 'bouquet'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async createProduct(data: FormData): Promise<AdminProduct> {
    try {
      const response = await apiRequest('/products', {
        method: 'POST',
        body: data
      })

      if (response.success) {
        const product = response.data as any
        console.log('Product created successfully:', product)
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          price: product.price,
          salePrice: product.salePrice,
          costPrice: product.costPrice,
          sku: product.sku || '',
          stockQuantity: product.stockQuantity,
          minStockAlert: product.minStockAlert || 5,
          categoryId: product.categoryId,
          categoryName: product.category?.name || 'Unknown',
          images: Array.isArray(product.images) ? product.images : [],
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          tags: Array.isArray(product.tags) ? product.tags : [],
          weight: product.weight,
          dimensions: product.dimensions || { length: '', width: '', height: '' },
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      } else {
        throw new Error(response.message || 'Failed to create product')
      }
    } catch (error: any) {
      console.error('Error creating product:', error)
      throw new Error(error.message || 'Failed to create product')
    }
  }

  async updateProduct(id: string, data: FormData): Promise<AdminProduct> {
    // Mock update product
    return {
      id: id,
      name: 'Updated Product',
      slug: 'updated-product',
      description: 'Updated product description',
      price: 25000,
      stockQuantity: 20,
      minStockAlert: 5,
      categoryId: '1',
      categoryName: 'Roses',
      images: [],
      isActive: true,
      isFeatured: false,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async deleteProduct(id: string): Promise<void> {
    // Remove product from mock products array
    this.mockProducts = this.mockProducts.filter(product => product.id !== id)
    console.log('Deleted product:', id)
    console.log('Total products now:', this.mockProducts.length)
  }

  // Debug function to check current products
  getCurrentProducts(): AdminProduct[] {
    console.log('Current products in memory:', this.mockProducts)
    return this.mockProducts
  }

  async updateProductStock(id: string, stockQuantity: number): Promise<AdminProduct> {
    // Mock update stock
    return {
      id: id,
      name: 'Updated Product',
      slug: 'updated-product',
      description: 'Updated product description',
      price: 25000,
      stockQuantity: stockQuantity,
      minStockAlert: 5,
      categoryId: '1',
      categoryName: 'Roses',
      images: [],
      isActive: true,
      isFeatured: false,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  // Orders
  async getOrders(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    paymentStatus?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<{ orders: AdminOrder[]; total: number; pages: number }> {
    // Return mock orders
    const mockOrders: AdminOrder[] = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+250 784 123 456',
        customerAddress: '123 Main St',
        customerCity: 'Kigali',
        status: 'PENDING',
        subtotal: 25000,
        deliveryFee: 2000,
        totalAmount: 27000,
        paymentMethod: 'MOMO',
        paymentStatus: 'PENDING',
        deliveryStatus: 'PENDING',
        items: [
          {
            id: '1',
            productId: '1',
            productName: 'Red Rose Bouquet',
            productImage: '/images/flowers/red/red-1.jpg',
            quantity: 1,
            unitPrice: 25000,
            totalPrice: 25000,
            color: 'Red',
            type: 'Bouquet'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return {
      orders: mockOrders,
      total: mockOrders.length,
      pages: 1
    }
  }

  async getOrder(id: string): Promise<AdminOrder> {
    // Return mock order
    return {
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+250 784 123 456',
      customerAddress: '123 Main St',
      customerCity: 'Kigali',
      status: 'PENDING',
      subtotal: 25000,
      deliveryFee: 2000,
      totalAmount: 27000,
      paymentMethod: 'MOMO',
      paymentStatus: 'PENDING',
      deliveryStatus: 'PENDING',
      items: [
        {
          id: '1',
          productId: '1',
          productName: 'Red Rose Bouquet',
          productImage: '/images/flowers/red/red-1.jpg',
          quantity: 1,
          unitPrice: 25000,
          totalPrice: 25000,
          color: 'Red',
          type: 'Bouquet'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<AdminOrder> {
    // Mock update order status
    return {
      id: id,
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+250 784 123 456',
      customerAddress: '123 Main St',
      customerCity: 'Kigali',
      status: status,
      subtotal: 25000,
      deliveryFee: 2000,
      totalAmount: 27000,
      paymentMethod: 'MOMO',
      paymentStatus: 'PENDING',
      deliveryStatus: 'PENDING',
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<AdminOrder> {
    // Mock update payment status
    return {
      id: id,
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+250 784 123 456',
      customerAddress: '123 Main St',
      customerCity: 'Kigali',
      status: 'PENDING',
      subtotal: 25000,
      deliveryFee: 2000,
      totalAmount: 27000,
      paymentMethod: 'MOMO',
      paymentStatus: paymentStatus,
      deliveryStatus: 'PENDING',
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async updateDeliveryStatus(id: string, deliveryStatus: string): Promise<AdminOrder> {
    // Mock update delivery status
    return {
      id: id,
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+250 784 123 456',
      customerAddress: '123 Main St',
      customerCity: 'Kigali',
      status: 'PENDING',
      subtotal: 25000,
      deliveryFee: 2000,
      totalAmount: 27000,
      paymentMethod: 'MOMO',
      paymentStatus: 'PENDING',
      deliveryStatus: deliveryStatus,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async addOrderNote(id: string, note: string): Promise<AdminOrder> {
    // Mock add order note
    return {
      id: id,
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+250 784 123 456',
      customerAddress: '123 Main St',
      customerCity: 'Kigali',
      status: 'PENDING',
      subtotal: 25000,
      deliveryFee: 2000,
      totalAmount: 27000,
      paymentMethod: 'MOMO',
      paymentStatus: 'PENDING',
      deliveryStatus: 'PENDING',
      notes: note,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async downloadInvoice(id: string): Promise<Blob> {
    // Mock download invoice
    const mockInvoice = new Blob(['Mock invoice content'], { type: 'application/pdf' })
    return mockInvoice
  }

  // Customers
  async getCustomers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
  }): Promise<{ customers: AdminCustomer[]; total: number; pages: number }> {
    // Return mock customers
    const mockCustomers: AdminCustomer[] = [
      {
        id: '1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+250 784 123 456',
        role: 'CUSTOMER',
        isActive: true,
        emailVerified: true,
        totalOrders: 3,
        totalSpent: 75000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+250 784 789 012',
        role: 'CUSTOMER',
        isActive: true,
        emailVerified: true,
        totalOrders: 2,
        totalSpent: 45000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return {
      customers: mockCustomers,
      total: mockCustomers.length,
      pages: 1
    }
  }

  async getCustomer(id: string): Promise<AdminCustomer> {
    // Return mock customer
    return {
      id: '1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+250 784 123 456',
      role: 'CUSTOMER',
      isActive: true,
      emailVerified: true,
      totalOrders: 3,
      totalSpent: 75000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async getCustomerOrders(id: string): Promise<AdminOrder[]> {
    // Return mock customer orders
    return [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+250 784 123 456',
        customerAddress: '123 Main St',
        customerCity: 'Kigali',
        status: 'PENDING',
        subtotal: 25000,
        deliveryFee: 2000,
        totalAmount: 27000,
        paymentMethod: 'MOMO',
        paymentStatus: 'PENDING',
        deliveryStatus: 'PENDING',
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }

  async updateCustomer(id: string, data: Partial<AdminCustomer>): Promise<AdminCustomer> {
    const response = await apiRequest(`/admin/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return response.data as AdminCustomer
  }

  async deactivateCustomer(id: string): Promise<void> {
    await apiRequest(`/admin/customers/${id}/deactivate`, {
      method: 'PATCH'
    })
  }

  // Categories
  async getCategories(): Promise<AdminCategory[]> {
    try {
      const response = await apiRequest('/categories')
      
      if (response.success) {
        const categories = (response.data as any[]).map((category: any) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          imageUrl: category.imageUrl || '',
          isActive: category.isActive,
          sortOrder: category.sortOrder || 0,
          productCount: category._count?.products || 0,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }))
        
        return categories
      } else {
        throw new Error(response.message || 'Failed to fetch categories')
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      // Fallback to mock categories if API fails
      return [
        {
          id: '1',
          name: 'Roses',
          slug: 'roses',
          description: 'Classic and elegant roses in various colors',
          imageUrl: '/images/categories/roses.jpg',
          isActive: true,
          sortOrder: 1,
          productCount: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Tulips',
          slug: 'tulips',
          description: 'Beautiful spring tulips in vibrant colors',
          imageUrl: '/images/categories/tulips.jpg',
          isActive: true,
          sortOrder: 2,
          productCount: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    }
  }

  async createCategory(data: Partial<AdminCategory>): Promise<AdminCategory> {
    const response = await apiRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.data as AdminCategory
  }

  async updateCategory(id: string, data: Partial<AdminCategory>): Promise<AdminCategory> {
    const response = await apiRequest(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return response.data as AdminCategory
  }

  async deleteCategory(id: string): Promise<void> {
    await apiRequest(`/admin/categories/${id}`, {
      method: 'DELETE'
    })
  }

  // Enhanced Product Management Methods

  // Advanced filtering and sorting
  async getProductsAdvanced(filters: ProductFilters, page: number = 1, limit: number = 10): Promise<{ products: AdminProduct[]; total: number; pages: number }> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('page', page.toString())
      queryParams.append('limit', limit.toString())
      
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status)
      if (filters.stockStatus && filters.stockStatus !== 'all') queryParams.append('stockStatus', filters.stockStatus)
      if (filters.priceRange) {
        queryParams.append('minPrice', filters.priceRange.min.toString())
        queryParams.append('maxPrice', filters.priceRange.max.toString())
      }
      if (filters.featured !== undefined) queryParams.append('featured', filters.featured.toString())
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)
      if (filters.tags?.length) queryParams.append('tags', filters.tags.join(','))
      if (filters.dateRange) {
        queryParams.append('dateFrom', filters.dateRange.from)
        queryParams.append('dateTo', filters.dateRange.to)
      }

      const response = await apiRequest(`/admin/products/advanced?${queryParams.toString()}`)
      
      if (response.success) {
        return {
          products: response.data.products,
          total: response.data.total,
          pages: response.data.pages
        }
      } else {
        throw new Error(response.message || 'Failed to fetch products')
      }
    } catch (error: any) {
      console.error('Error fetching products with advanced filters:', error)
      // Fallback to basic getProducts
      return this.getProducts({ page, limit, search: filters.search, category: filters.category, status: filters.status })
    }
  }

  // Bulk operations
  async bulkOperation(operation: BulkOperation): Promise<{ success: boolean; message: string; affectedCount: number }> {
    try {
      const response = await apiRequest('/admin/products/bulk', {
        method: 'POST',
        body: JSON.stringify(operation)
      })
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Bulk operation completed successfully',
          affectedCount: response.data.affectedCount || 0
        }
      } else {
        throw new Error(response.message || 'Bulk operation failed')
      }
    } catch (error: any) {
      console.error('Error performing bulk operation:', error)
      throw new Error(error.message || 'Bulk operation failed')
    }
  }

  // Product analytics
  async getProductAnalytics(productId?: string): Promise<ProductAnalytics[]> {
    try {
      const url = productId ? `/admin/products/${productId}/analytics` : '/admin/products/analytics'
      const response = await apiRequest(url)
      
      if (response.success) {
        return response.data as ProductAnalytics[]
      } else {
        throw new Error(response.message || 'Failed to fetch product analytics')
      }
    } catch (error: any) {
      console.error('Error fetching product analytics:', error)
      // Return mock analytics data
      return [
        {
          productId: '1',
          productName: 'Red Rose Bouquet',
          views: 1250,
          sales: 45,
          revenue: 1125000,
          rating: 4.5,
          reviewCount: 23,
          stockTurnover: 3.2,
          profitMargin: 0.35,
          lastUpdated: new Date().toISOString()
        },
        {
          productId: '2',
          productName: 'Pink Tulip Arrangement',
          views: 890,
          sales: 32,
          revenue: 800000,
          rating: 4.8,
          reviewCount: 18,
          stockTurnover: 2.8,
          profitMargin: 0.42,
          lastUpdated: new Date().toISOString()
        }
      ]
    }
  }

  // Export functionality
  async exportProducts(options: ExportOptions): Promise<{ downloadUrl: string; filename: string }> {
    try {
      const response = await apiRequest('/admin/products/export', {
        method: 'POST',
        body: JSON.stringify(options)
      })
      
      if (response.success) {
        return {
          downloadUrl: response.data.downloadUrl,
          filename: response.data.filename
        }
      } else {
        throw new Error(response.message || 'Export failed')
      }
    } catch (error: any) {
      console.error('Error exporting products:', error)
      throw new Error(error.message || 'Export failed')
    }
  }

  // Stock management
  async updateStock(stockUpdate: StockUpdate): Promise<AdminProduct> {
    try {
      const response = await apiRequest(`/admin/products/${stockUpdate.productId}/stock`, {
        method: 'PATCH',
        body: JSON.stringify(stockUpdate)
      })
      
      if (response.success) {
        return response.data as AdminProduct
      } else {
        throw new Error(response.message || 'Failed to update stock')
      }
    } catch (error: any) {
      console.error('Error updating stock:', error)
      throw new Error(error.message || 'Failed to update stock')
    }
  }

  async getLowStockProducts(threshold?: number): Promise<AdminProduct[]> {
    try {
      const queryParams = threshold ? `?threshold=${threshold}` : ''
      const response = await apiRequest(`/admin/products/low-stock${queryParams}`)
      
      if (response.success) {
        return response.data as AdminProduct[]
      } else {
        throw new Error(response.message || 'Failed to fetch low stock products')
      }
    } catch (error: any) {
      console.error('Error fetching low stock products:', error)
      // Return mock low stock products
      return this.mockProducts.filter(p => p.stockQuantity <= (threshold || 5))
    }
  }

  // Image management
  async updateProductImages(imageUpdate: ImageUpdate): Promise<AdminProduct> {
    try {
      const formData = new FormData()
      formData.append('operation', imageUpdate.operation)
      if (imageUpdate.imageUrls) {
        formData.append('imageUrls', JSON.stringify(imageUpdate.imageUrls))
      }
      imageUpdate.images.forEach(image => {
        formData.append('images', image)
      })

      const response = await apiRequest(`/admin/products/${imageUpdate.productId}/images`, {
        method: 'PATCH',
        body: formData
      })
      
      if (response.success) {
        return response.data as AdminProduct
      } else {
        throw new Error(response.message || 'Failed to update product images')
      }
    } catch (error: any) {
      console.error('Error updating product images:', error)
      throw new Error(error.message || 'Failed to update product images')
    }
  }

  // Product preview
  async getProductPreview(productId: string): Promise<AdminProduct> {
    try {
      const response = await apiRequest(`/admin/products/${productId}/preview`)
      
      if (response.success) {
        return response.data as AdminProduct
      } else {
        throw new Error(response.message || 'Failed to fetch product preview')
      }
    } catch (error: any) {
      console.error('Error fetching product preview:', error)
      // Return the product from getProduct as fallback
      return this.getProduct(productId)
    }
  }

  // Product search suggestions
  async getProductSuggestions(query: string): Promise<{ id: string; name: string; sku: string }[]> {
    try {
      const response = await apiRequest(`/admin/products/suggestions?q=${encodeURIComponent(query)}`)
      
      if (response.success) {
        return response.data as { id: string; name: string; sku: string }[]
      } else {
        throw new Error(response.message || 'Failed to fetch suggestions')
      }
    } catch (error: any) {
      console.error('Error fetching product suggestions:', error)
      // Return filtered mock products as suggestions
      return this.mockProducts
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku?.toLowerCase().includes(query.toLowerCase()))
        .map(p => ({ id: p.id, name: p.name, sku: p.sku || '' }))
        .slice(0, 10)
    }
  }

  // Settings
  async getSettings(): Promise<AdminSettings> {
    const response = await apiRequest('/admin/settings', {
      method: 'GET'
    })
    return response.data as AdminSettings
  }

  async updateSettings(data: Partial<AdminSettings>): Promise<AdminSettings> {
    const response = await apiRequest('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return response.data as AdminSettings
  }

  // Staff Management
  async getStaff(): Promise<AdminCustomer[]> {
    const response = await apiRequest('/admin/staff', {
      method: 'GET'
    })
    return response.data as AdminCustomer[]
  }

  async createStaff(data: {
    email: string
    firstName: string
    lastName: string
    phone?: string
    password: string
  }): Promise<AdminCustomer> {
    const response = await apiRequest('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.data as AdminCustomer
  }

  async updateStaff(id: string, data: Partial<AdminCustomer>): Promise<AdminCustomer> {
    const response = await apiRequest(`/admin/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return response.data as AdminCustomer
  }

  async deleteStaff(id: string): Promise<void> {
    await apiRequest(`/admin/staff/${id}`, {
      method: 'DELETE'
    })
  }

  // Export Data
  async exportOrders(format: 'csv' | 'excel', filters?: any): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/admin/orders/export?format=${format}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    })
    
    if (!response.ok) {
      throw new Error('Failed to export orders')
    }
    
    return response.blob()
  }

  async exportCustomers(format: 'csv' | 'excel'): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/admin/customers/export?format=${format}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to export customers')
    }
    
    return response.blob()
  }
}

export const adminAPI = new AdminAPI() 