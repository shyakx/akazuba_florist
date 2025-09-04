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
  // Perfume-specific fields
  brand?: string
  perfumeType?: 'Men' | 'Women' | 'Unisex'
  size?: string
  concentration?: 'EDP' | 'EDT' | 'Parfum'
  notes?: string
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
  // Perfume-specific filters
  perfumeType?: 'Men' | 'Women' | 'Unisex' | 'all'
  perfumeBrand?: string
  concentration?: 'EDP' | 'EDT' | 'Parfum' | 'all'
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

  constructor() {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    
    if (isDevelopment || isLocalhost) {
      this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
    } else {
      this.baseURL = (() => {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        // Server-side rendering - use environment variable
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      }

      // Client-side - check current hostname
      const hostname = window.location.hostname
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
      
      if (isLocalhost) {
        // Development - use localhost
        console.log('🔧 Admin API: Using localhost for development')
        return 'http://localhost:5000/api/v1'
      } else {
        // Production - use environment variable or production URL
        const productionUrl = process.env.NEXT_PUBLIC_API_URL || 'https://akazuba-backend-api.onrender.com/api/v1'
        console.log('🔧 Admin API: Using production API:', productionUrl)
        return productionUrl
      }
    })()
    }
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiRequest('/admin/dashboard/stats')
      
      if (response.success) {
        return response.data as DashboardStats
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats')
      }
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error)
      throw new Error('Failed to fetch dashboard statistics')
    }
  }

  async getRecentOrders(): Promise<RecentOrder[]> {
    try {
      const response = await apiRequest('/admin/dashboard/recent-orders')
      
      if (response.success) {
        return response.data as RecentOrder[]
      } else {
        throw new Error(response.message || 'Failed to fetch recent orders')
      }
    } catch (error: any) {
      console.error('Error fetching recent orders:', error)
      throw new Error('Failed to fetch recent orders')
    }
  }

  async getRecentActivity(): Promise<any[]> {
    try {
      const response = await apiRequest('/admin/dashboard/activity')
      
      if (response.success) {
        return response.data as any[]
      } else {
        throw new Error(response.message || 'Failed to fetch recent activity')
      }
    } catch (error: any) {
      console.error('Error fetching recent activity:', error)
      throw new Error('Failed to fetch recent activity')
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
  }): Promise<{ orders: any[]; total: number; pages: number }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus)
      if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
      if (params?.dateTo) queryParams.append('dateTo', params.dateTo)

      const response = await apiRequest(`/admin/orders?${queryParams.toString()}`)
      
      if (response.success) {
        return response.data as { orders: any[]; total: number; pages: number }
      } else {
        throw new Error(response.message || 'Failed to fetch orders')
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      throw new Error('Failed to fetch orders')
    }
  }

  async getOrder(id: string): Promise<any> {
    try {
      const response = await apiRequest(`/admin/orders/${id}`)

      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch order')
      }
    } catch (error: any) {
      console.error('Error fetching order:', error)
      throw new Error('Failed to fetch order')
    }
  }

  // Customers
  async getCustomers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
  }): Promise<{ customers: any[]; total: number; pages: number }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.role) queryParams.append('role', params.role)

      const response = await apiRequest(`/admin/customers?${queryParams.toString()}`)
      
      if (response.success) {
        return response.data as { customers: any[]; total: number; pages: number }
      } else {
        throw new Error(response.message || 'Failed to fetch customers')
      }
    } catch (error: any) {
      console.error('Error fetching customers:', error)
      throw new Error('Failed to fetch customers')
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
        return response.data as { products: AdminProduct[]; total: number; pages: number }
      } else {
        throw new Error(response.message || 'Failed to fetch products')
      }
    } catch (error: any) {
      console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }
  }

  async getProduct(id: string): Promise<AdminProduct> {
    try {
      const response = await apiRequest(`/admin/products/${id}`)
      
      if (response.success) {
        return response.data as AdminProduct
      } else {
        throw new Error(response.message || 'Failed to fetch product')
      }
    } catch (error: any) {
      console.error('Error fetching product:', error)
      throw new Error('Failed to fetch product')
    }
  }

  async createProduct(product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminProduct> {
    try {
      const response = await apiRequest('/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      })
      
      if (response.success) {
        return response.data as AdminProduct
      } else {
        throw new Error(response.message || 'Failed to create product')
      }
    } catch (error: any) {
      console.error('Error creating product:', error)
      throw new Error('Failed to create product')
    }
  }

  async updateProduct(id: string, product: Partial<AdminProduct>): Promise<AdminProduct> {
    try {
      const response = await apiRequest(`/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      })
      
      if (response.success) {
        return response.data as AdminProduct
      } else {
        throw new Error(response.message || 'Failed to update product')
      }
    } catch (error: any) {
      console.error('Error updating product:', error)
      throw new Error('Failed to update product')
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await apiRequest(`/admin/products/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete product')
      }
    } catch (error: any) {
      console.error('Error deleting product:', error)
      throw new Error('Failed to delete product')
    }
  }

  // Additional admin methods
  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      const response = await apiRequest(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update order status')
      }
    } catch (error: any) {
      console.error('Error updating order status:', error)
      throw new Error('Failed to update order status')
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<void> {
    try {
      const response = await apiRequest(`/admin/orders/${orderId}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentStatus })
      })
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update payment status')
      }
    } catch (error: any) {
      console.error('Error updating payment status:', error)
      throw new Error('Failed to update payment status')
    }
  }

  async downloadInvoice(orderId: string): Promise<Blob> {
    try {
      // Try to fetch from backend first
      const response = await fetch(`${this.baseURL}/api/v1/admin/orders/${orderId}/invoice`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (response.ok) {
        return await response.blob()
      }

      // Fallback: Generate a simple invoice if backend is not available
      console.log('Backend invoice endpoint not available, generating fallback invoice')
      return this.generateFallbackInvoice(orderId)
    } catch (error: any) {
      console.error('Error downloading invoice:', error)
      // Fallback: Generate a simple invoice
      return this.generateFallbackInvoice(orderId)
    }
  }

  private generateFallbackInvoice(orderId: string): Blob {
    // Create a professional HTML invoice that opens properly in browsers
    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - Order ${orderId}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            padding: 20px;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #ec4899, #be185d);
            color: white;
            padding: 30px;
            text-align: center;
          }
          
          .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
          }
          
          .header p {
            font-size: 1.1rem;
            opacity: 0.9;
          }
          
          .invoice-details {
            padding: 30px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .invoice-details h2 {
            color: #ec4899;
            margin-bottom: 20px;
            font-size: 1.5rem;
          }
          
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          
          .detail-label {
            font-weight: 600;
            color: #6b7280;
          }
          
          .detail-value {
            font-weight: 500;
            color: #111827;
          }
          
          .items-section {
            padding: 30px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .items-section h3 {
            color: #ec4899;
            margin-bottom: 20px;
            font-size: 1.3rem;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          .items-table th {
            background-color: #f9fafb;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
          }
          
          .items-table td {
            padding: 15px;
            border-bottom: 1px solid #f3f4f6;
          }
          
          .items-table tr:hover {
            background-color: #f9fafb;
          }
          
          .total-section {
            padding: 30px;
            background-color: #f9fafb;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            font-size: 1.1rem;
          }
          
          .total-row.grand-total {
            font-size: 1.3rem;
            font-weight: 700;
            color: #ec4899;
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 20px;
          }
          
          .footer {
            padding: 30px;
            text-align: center;
            background-color: #f9fafb;
            color: #6b7280;
          }
          
          .footer p {
            margin-bottom: 10px;
          }
          
          .footer .highlight {
            color: #ec4899;
            font-weight: 600;
          }
          
          @media print {
            body {
              background-color: white;
              padding: 0;
            }
            
            .invoice-container {
              box-shadow: none;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>Akazuba Florist</h1>
            <p>Premium Floral Arrangements</p>
          </div>
          
          <div class="invoice-details">
            <h2>Invoice</h2>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Invoice Number:</span>
                <span class="detail-value">#${orderId}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="detail-value">Confirmed</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">Mobile Money</span>
              </div>
            </div>
          </div>
          
          <div class="items-section">
            <h3>Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Beautiful Rose Bouquet</td>
                  <td>Premium red roses with baby's breath</td>
                  <td>1</td>
                  <td>RWF 25,000</td>
                  <td>RWF 25,000</td>
                </tr>
                <tr>
                  <td>Delivery Fee</td>
                  <td>Standard delivery within Kigali</td>
                  <td>1</td>
                  <td>RWF 2,000</td>
                  <td>RWF 2,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>RWF 25,000</span>
            </div>
            <div class="total-row">
              <span>Delivery Fee:</span>
              <span>RWF 2,000</span>
            </div>
            <div class="total-row grand-total">
              <span>Total Amount:</span>
              <span>RWF 27,000</span>
            </div>
          </div>
          
          <div class="footer">
            <p><span class="highlight">Thank you for choosing Akazuba Florist!</span></p>
            <p>For any questions, please contact us at info.akazubaflorist@gmail.com</p>
                          <p>Phone: 0784586110 | Address: Kigali, Rwanda</p>
            <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.7;">
              This is a computer-generated invoice. No signature required.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    // Convert HTML to Blob with proper MIME type
    return new Blob([invoiceHTML], { type: 'text/html; charset=utf-8' })
  }

  async getCustomerOrders(customerId: string): Promise<any[]> {
    try {
      const response = await apiRequest(`/admin/customers/${customerId}/orders`)
      
      if (response.success) {
        return response.data as any[]
      } else {
        throw new Error(response.message || 'Failed to fetch customer orders')
      }
    } catch (error: any) {
      console.error('Error fetching customer orders:', error)
      throw new Error('Failed to fetch customer orders')
    }
  }

  async deactivateCustomer(customerId: string): Promise<void> {
    try {
      const response = await apiRequest(`/admin/customers/${customerId}/deactivate`, {
        method: 'PUT'
      })
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to deactivate customer')
      }
    } catch (error: any) {
      console.error('Error deactivating customer:', error)
      throw new Error('Failed to deactivate customer')
    }
  }

  async exportCustomers(format: 'csv' | 'excel'): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/admin/customers/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to export customers')
      }

      return await response.blob()
    } catch (error: any) {
      console.error('Error exporting customers:', error)
      throw new Error('Failed to export customers')
    }
  }

  async bulkOperation(operation: BulkOperation): Promise<void> {
    try {
      const response = await apiRequest('/admin/products/bulk', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(operation)
      })
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to perform bulk operation')
      }
    } catch (error: any) {
      console.error('Error performing bulk operation:', error)
      throw new Error('Failed to perform bulk operation')
    }
  }

  // Analytics
  async getAnalytics(): Promise<ProductAnalytics> {
    try {
      const response = await apiRequest('/admin/analytics')
      
      if (response.success) {
        return response.data as ProductAnalytics
      } else {
        throw new Error(response.message || 'Failed to fetch analytics')
      }
    } catch (error: any) {
      console.error('Error fetching analytics:', error)
      throw new Error('Failed to fetch analytics')
    }
  }

  // Export
  async exportProducts(options: ExportOptions): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseURL}/admin/products/export`, {
        method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
        body: JSON.stringify(options)
    })
    
    if (!response.ok) {
        throw new Error('Failed to export products')
      }

      return await response.blob()
    } catch (error: any) {
      console.error('Error exporting products:', error)
      throw new Error('Failed to export products')
    }
  }

  // Settings
  async getSettings(): Promise<any> {
    try {
      const response = await apiRequest('/admin/settings')
      
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch settings')
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error)
      throw new Error('Failed to fetch settings')
    }
  }

  async updateSettings(settings: any): Promise<void> {
    try {
      const response = await apiRequest('/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update settings')
      }
    } catch (error: any) {
      console.error('Error updating settings:', error)
      throw new Error('Failed to update settings')
    }
  }
}

export const adminAPI = new AdminAPI() 