// API Service Layer for Akazuba Florist
// Connects Next.js frontend with Express backend

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF'
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  salePrice?: number
  costPrice?: number
  sku?: string
  stockQuantity: number
  minStockAlert: number
  categoryId: string
  images?: string[]
  isActive: boolean
  isFeatured: boolean
  weight?: number
  dimensions?: { length: number; width: number; height: number }
  tags?: string[]
  createdAt: string
  updatedAt: string
  category?: Category
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  createdAt: string
  updatedAt: string
  product?: Product
}

export interface Cart {
  id: string
  userId: string
  sessionId?: string
  createdAt: string
  updatedAt: string
  cartItems: CartItem[]
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
  paymentMethod: 'MOMO' | 'BK' | 'CASH'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  shippingAddress: any
  billingAddress?: any
  notes?: string
  createdAt: string
  updatedAt: string
  user?: User
  orderItems?: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productSku?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt: string
  product?: Product
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Utility function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken')
  }
  return null
}

// Base API request function with mock support for static deployments
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken()
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'

  // If on HTTPS (CloudFront) and not in development/localhost, use mock data for auth endpoints
  // This is temporary until the full backend is deployed
  if (isHttps && !isDevelopment && !isLocalhost && endpoint.includes('/auth/')) {
    console.warn(`⚠️ Mocking API request for ${endpoint} on HTTPS production. Backend needs HTTPS support.`)
    // Implement mock responses based on endpoint
    switch (endpoint) {
      case '/admin/analytics':
        return { 
          success: true, 
          message: 'Mock analytics data', 
          data: { 
            totalOrders: 150, 
            totalRevenue: 1500000, 
            newCustomers: 25, 
            topProducts: [{ id: 'mock-prod-1', name: 'Mock Rose', sales: 50 }],
            recentOrders: [
              { id: 'order-1', customer: 'Marie Uwimana', amount: 45000, status: 'delivered', date: '2025-08-20' },
              { id: 'order-2', customer: 'Jean Pierre', amount: 32000, status: 'processing', date: '2025-08-19' },
              { id: 'order-3', customer: 'Sarah Johnson', amount: 28000, status: 'confirmed', date: '2025-08-18' }
            ],
            monthlyRevenue: [1200000, 1350000, 1420000, 1500000],
            customerGrowth: [120, 135, 142, 150],
            topCategories: [
              { name: 'Roses', sales: 45 },
              { name: 'Tulips', sales: 32 },
              { name: 'Lilies', sales: 28 }
            ]
          } as T 
        };
      case '/admin/customers':
        return { 
          success: true, 
          message: 'Mock customers data', 
          data: [
            { 
              id: 'mock-cust-1', 
              email: 'marie.uwimana@email.com', 
              firstName: 'Marie', 
              lastName: 'Uwimana', 
              phone: '+250 789 123 456',
              role: 'CUSTOMER',
              isActive: true,
              emailVerified: true,
              totalOrders: 15,
              totalSpent: 450000,
              status: 'active',
              joinedDate: '2024-01-15',
              address: 'Kigali, Rwanda',
              wishlistItems: 8,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { 
              id: 'mock-cust-2', 
              email: 'jean.pierre@email.com', 
              firstName: 'Jean', 
              lastName: 'Pierre', 
              phone: '+250 789 456 789',
              role: 'CUSTOMER',
              isActive: true,
              emailVerified: true,
              totalOrders: 8,
              totalSpent: 280000,
              status: 'vip',
              joinedDate: '2023-12-20',
              address: 'Kigali, Rwanda',
              wishlistItems: 12,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { 
              id: 'mock-cust-3', 
              email: 'sarah.johnson@email.com', 
              firstName: 'Sarah', 
              lastName: 'Johnson', 
              phone: '+250 789 789 123',
              role: 'CUSTOMER',
              isActive: true,
              emailVerified: true,
              totalOrders: 5,
              totalSpent: 180000,
              status: 'active',
              joinedDate: '2024-03-10',
              address: 'Kigali, Rwanda',
              wishlistItems: 3,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ] as T 
        };
      case '/admin/orders':
        return { 
          success: true, 
          message: 'Mock orders data', 
          data: [
            { 
              id: 'mock-order-1', 
              orderNumber: 'AKZ-2025-001', 
              customerName: 'Marie Uwimana',
              customerEmail: 'marie.uwimana@email.com',
              status: 'DELIVERED', 
              subtotal: 45000,
              taxAmount: 4500,
              shippingAmount: 2000,
              discountAmount: 0,
              totalAmount: 51500,
              paymentMethod: 'MOMO',
              paymentStatus: 'PAID',
              shippingAddress: {
                street: '123 Main Street',
                city: 'Kigali',
                country: 'Rwanda'
              },
              items: [
                { productName: 'Red Rose Bouquet', quantity: 2, price: 15000 },
                { productName: 'White Lily', quantity: 1, price: 15000 }
              ],
              createdAt: new Date('2025-08-20').toISOString(),
              updatedAt: new Date('2025-08-20').toISOString(),
            },
            { 
              id: 'mock-order-2', 
              orderNumber: 'AKZ-2025-002', 
              customerName: 'Jean Pierre',
              customerEmail: 'jean.pierre@email.com',
              status: 'PROCESSING', 
              subtotal: 32000,
              taxAmount: 3200,
              shippingAmount: 2000,
              discountAmount: 2000,
              totalAmount: 35200,
              paymentMethod: 'BK',
              paymentStatus: 'PAID',
              shippingAddress: {
                street: '456 Oak Avenue',
                city: 'Kigali',
                country: 'Rwanda'
              },
              items: [
                { productName: 'Tulip Mix', quantity: 1, price: 32000 }
              ],
              createdAt: new Date('2025-08-19').toISOString(),
              updatedAt: new Date('2025-08-19').toISOString(),
            },
            { 
              id: 'mock-order-3', 
              orderNumber: 'AKZ-2025-003', 
              customerName: 'Sarah Johnson',
              customerEmail: 'sarah.johnson@email.com',
              status: 'CONFIRMED', 
              subtotal: 28000,
              taxAmount: 2800,
              shippingAmount: 2000,
              discountAmount: 0,
              totalAmount: 32800,
              paymentMethod: 'CASH',
              paymentStatus: 'PENDING',
              shippingAddress: {
                street: '789 Pine Road',
                city: 'Kigali',
                country: 'Rwanda'
              },
              items: [
                { productName: 'Sunflower Bouquet', quantity: 1, price: 28000 }
              ],
              createdAt: new Date('2025-08-18').toISOString(),
              updatedAt: new Date('2025-08-18').toISOString(),
            }
          ] as T 
        };
      case '/admin/products':
        return { 
          success: true, 
          message: 'Mock products data', 
          data: [
            { 
              id: 'mock-prod-1', 
              name: 'Red Rose Bouquet', 
              slug: 'red-rose-bouquet',
              description: 'A beautiful bouquet of fresh red roses.',
              price: 15000, 
              stockQuantity: 25,
              minStockAlert: 5,
              categoryId: 'roses',
              category: 'Roses',
              isActive: true,
              isFeatured: true,
              images: ['/images/red-roses.jpg'],
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { 
              id: 'mock-prod-2', 
              name: 'White Lily', 
              slug: 'white-lily',
              description: 'Elegant white lilies for special occasions.',
              price: 15000, 
              stockQuantity: 15,
              minStockAlert: 3,
              categoryId: 'lilies',
              category: 'Lilies',
              isActive: true,
              isFeatured: false,
              images: ['/images/white-lily.jpg'],
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { 
              id: 'mock-prod-3', 
              name: 'Tulip Mix', 
              slug: 'mixed-tulip-bouquet',
              description: 'Colorful mix of tulips in various colors.',
              price: 32000, 
              stockQuantity: 30,
              minStockAlert: 8,
              categoryId: 'tulips',
              category: 'Tulips',
              isActive: true,
              isFeatured: true,
              images: ['/images/flowers/mixed/mixed-1.jpg'],
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ] as T 
        };
      case '/admin/wishlists':
        return {
          success: true,
          message: 'Mock wishlists data',
          data: [
            {
              id: 'wishlist-1',
              customerId: 'mock-cust-1',
              customerName: 'Marie Uwimana',
              customerEmail: 'marie.uwimana@email.com',
              items: [
                { productId: 'mock-prod-1', productName: 'Red Rose Bouquet', price: 15000, addedAt: new Date('2025-08-15').toISOString() },
                { productId: 'mock-prod-3', productName: 'Tulip Mix', price: 32000, addedAt: new Date('2025-08-10').toISOString() }
              ],
              totalItems: 2,
              totalValue: 47000,
              createdAt: new Date('2025-08-10').toISOString(),
              updatedAt: new Date('2025-08-15').toISOString(),
            },
            {
              id: 'wishlist-2',
              customerId: 'mock-cust-2',
              customerName: 'Jean Pierre',
              customerEmail: 'jean.pierre@email.com',
              items: [
                { productId: 'mock-prod-2', productName: 'White Lily', price: 15000, addedAt: new Date('2025-08-12').toISOString() },
                { productId: 'mock-prod-1', productName: 'Red Rose Bouquet', price: 15000, addedAt: new Date('2025-08-08').toISOString() },
                { productId: 'mock-prod-3', productName: 'Tulip Mix', price: 32000, addedAt: new Date('2025-08-05').toISOString() }
              ],
              totalItems: 3,
              totalValue: 62000,
              createdAt: new Date('2025-08-05').toISOString(),
              updatedAt: new Date('2025-08-12').toISOString(),
            }
          ] as T
        };
      case '/wishlist':
        // Handle both GET and POST requests for wishlist
        if (options.method === 'POST') {
          // Mock adding item to wishlist
          try {
            const body = JSON.parse(options.body as string)
            const productId = body.productId
            
            // Mock wishlist item structure
            const mockWishlistItem = {
              id: 'wishlist-item-' + Date.now(),
              userId: 'customer-1',
              productId: productId,
              createdAt: new Date().toISOString(),
              product: {
                id: productId,
                name: productId === 'mock-prod-1' ? 'Red Rose Bouquet' : 
                      productId === 'mock-prod-2' ? 'White Lily' : 
                      productId === 'mock-prod-3' ? 'Tulip Mix' : 'Product',
                price: productId === 'mock-prod-1' ? 15000 : 
                       productId === 'mock-prod-2' ? 15000 : 
                       productId === 'mock-prod-3' ? 32000 : 20000,
                category: { name: 'Flowers' }
              }
            }
            
            return {
              success: true,
              message: 'Item added to wishlist successfully',
              data: mockWishlistItem
            } as ApiResponse<T>
          } catch (e) {
            return {
              success: false,
              message: 'Invalid request body'
            } as ApiResponse<T>
          }
        } else {
          // Mock getting wishlist items
          return {
            success: true,
            message: 'Wishlist retrieved successfully',
            data: [
              {
                id: 'wishlist-item-1',
                userId: 'customer-1',
                productId: 'mock-prod-1',
                createdAt: new Date('2025-08-15').toISOString(),
                product: {
                  id: 'mock-prod-1',
                  name: 'Red Rose Bouquet',
                  price: 15000,
                  category: { name: 'Roses' }
                }
              },
              {
                id: 'wishlist-item-2',
                userId: 'customer-1',
                productId: 'mock-prod-3',
                createdAt: new Date('2025-08-10').toISOString(),
                product: {
                  id: 'mock-prod-3',
                  name: 'Tulip Mix',
                  price: 32000,
                  category: { name: 'Tulips' }
                }
              }
            ]
          } as ApiResponse<T>
        }
      case (endpoint.match(/^\/wishlist\/[^\/]+$/) && options.method === 'DELETE' ? endpoint : null):
        // Mock deleting wishlist item
        return {
          success: true,
          message: 'Item removed from wishlist successfully'
        } as ApiResponse<T>
      case '/auth/profile':
        // This is for getProfile, which is called by AuthContext
        const storedUser = apiUtils.getStoredUser();
        if (storedUser) {
          return { success: true, message: 'Mock profile data', data: { user: storedUser } as T };
        }
        // If no stored user, return a default customer profile
        return { 
          success: true, 
          message: 'Mock profile data', 
          data: { 
            user: {
              id: 'customer-1',
              email: 'marie.uwimana@email.com',
              firstName: 'Marie',
              lastName: 'Uwimana',
              role: 'CUSTOMER' as const,
              isActive: true,
              emailVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          } as T 
        };
      case '/auth/admin/login':
        // Mock admin login for HTTPS environments
        return {
          success: true,
          message: 'Mock admin login successful',
          data: {
            user: {
              id: 'admin-1',
              email: 'admin@akazuba.rw',
              firstName: 'Admin',
              lastName: 'User',
              role: 'ADMIN' as const,
              isActive: true,
              emailVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            accessToken: 'mock-admin-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
          } as T
        };
      case '/auth/login':
        // Mock customer login for HTTPS environments
        // Try to parse the request body to get the email
        let customerEmail = 'marie.uwimana@email.com'
        let customerName = 'Marie'
        let customerLastName = 'Uwimana'
        
        try {
          if (options.body) {
            const body = JSON.parse(options.body as string)
            customerEmail = body.email || customerEmail
            
            // Map different customer emails to different names
            if (customerEmail === 'jean.pierre@email.com') {
              customerName = 'Jean'
              customerLastName = 'Pierre'
            } else if (customerEmail === 'claire.mutoni@email.com') {
              customerName = 'Claire'
              customerLastName = 'Mutoni'
            } else if (customerEmail === 'customer@example.com') {
              customerName = 'John'
              customerLastName = 'Doe'
            }
          }
        } catch (e) {
          // Use default values if parsing fails
        }
        
        return {
          success: true,
          message: 'Mock customer login successful',
          data: {
            user: {
              id: 'customer-1',
              email: customerEmail,
              firstName: customerName,
              lastName: customerLastName,
              role: 'CUSTOMER' as const,
              isActive: true,
              emailVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            accessToken: 'mock-customer-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
          } as T
        };
      // Add more mock cases as needed for other endpoints
      default:
        console.warn(`No specific mock for ${endpoint}. Returning generic success.`)
        return { success: true, message: `Mock response for ${endpoint}`, data: {} as T };
    }
  }

  // Determine the actual API base URL for non-mocked environments
  let API_BASE_URL_ACTUAL: string;
  if (isDevelopment) {
    // Use TypeScript backend with payment APIs
    API_BASE_URL_ACTUAL = 'http://localhost:5000/api/v1';
  } else {
    // Use the configured API URL or fallback to HTTPS backend
    API_BASE_URL_ACTUAL = process.env.NEXT_PUBLIC_API_URL || 'https://ar7fgtd32h.us-east-1.awsapprunner.com/api/v1';
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log('🌐 Making API request to:', `${API_BASE_URL_ACTUAL}${endpoint}`)
    console.log('🔑 Token:', token ? 'Present' : 'Missing')
    console.log('📤 Request config:', {
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body
    })
    
    const response = await fetch(`${API_BASE_URL_ACTUAL}${endpoint}`, config)
    console.log('📡 Response status:', response.status)
    console.log('📡 Response headers:', response.headers)
    
    const data = await response.json()
    console.log('📥 Response data:', data)

    if (!response.ok) {
      console.error('❌ API request failed:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      })
      throw new Error(data.message || data.error || 'API request failed')
    }

    return data
  } catch (error: any) {
    console.error('API Error:', error)

    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Unable to connect to backend server.')
    }
    if (error.message && error.message.includes('Mixed Content')) {
      throw new Error('Security error: Cannot connect to HTTP backend from HTTPS site.')
    }

    throw error
  }
}

// Authentication API
export const authAPI = {
  // Customer registration
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse['data']>> => {
    return apiRequest<AuthResponse['data']>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Customer login
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse['data']>> => {
    return apiRequest<AuthResponse['data']>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Admin login - now relies on apiRequest for mocking
  adminLogin: async (data: { username: string; password: string }): Promise<ApiResponse<AuthResponse['data']>> => {
    // The mocking logic for HTTPS and development is now handled by apiRequest.
    // This function will simply call apiRequest, which will return mock data if applicable.
    try {
      const response = await apiRequest<AuthResponse['data']>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email: data.username, password: data.password }),
      });

      if (response.success && response.data) {
        // For mock responses, ensure user role is ADMIN
        if (response.data.user.role !== 'ADMIN') {
          throw new Error('Mock login successful, but user is not an admin. Check mock data.')
        }
        return response;
      } else {
        throw new Error(response.message || 'Admin login failed');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      // Re-throw specific errors from apiRequest or add more specific admin login errors
      if (error.message.includes('Network error') || error.message.includes('Security error')) {
        throw error; // Re-throw network/mixed content errors
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    // Check if we're in development mode with mock tokens
    const accessToken = apiUtils.getAccessToken()
    const isDevelopment = process.env.NODE_ENV === 'development' || typeof window !== 'undefined' && window.location.hostname === 'localhost'
    const isMockToken = accessToken && accessToken.startsWith('mock-')
    
    // Skip API call if in development mode with mock tokens
    if (isDevelopment && isMockToken) {
      console.log('🔧 Development mode: Skipping logout API call for mock tokens')
      return {
        success: true,
        message: 'Logout successful (development mode)'
      }
    }
    
    return apiRequest<void>('/auth/logout', {
      method: 'POST',
    })
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse['data']>> => {
    // Check if we're in development mode with mock tokens
    const isDevelopment = process.env.NODE_ENV === 'development' || typeof window !== 'undefined' && window.location.hostname === 'localhost'
    const isMockToken = refreshToken && refreshToken.startsWith('mock-')
    
    if (isDevelopment && isMockToken) {
      // Return mock refreshed tokens for development
      console.log('🔧 Development mode: Using mock token refresh')
      const mockUser = {
        id: 'admin-1',
        email: 'admin@akazuba.rw',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN' as const,
        isActive: true,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      return {
        success: true,
        data: {
          user: mockUser,
          accessToken: 'mock-admin-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
        },
        message: 'Token refreshed successfully (development mode)'
      }
    }
    
    return apiRequest<AuthResponse['data']>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    // The mocking logic for HTTPS and development is now handled by apiRequest.
    // This function will simply call apiRequest, which will return mock data if applicable.
    return apiRequest<{ user: User }>('/auth/profile', {
      method: 'GET',
    })
  },

  // Update user profile
  updateProfile: async (data: { firstName?: string; lastName?: string; phone?: string }): Promise<ApiResponse<{ user: User }>> => {
    return apiRequest<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// User API
export const userAPI = {
  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiRequest<User>('/users/profile')
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiRequest<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}

// Products API
export const productsAPI = {
  // Get all products
  getAll: async (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }): Promise<ApiResponse<Product[]>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.category) searchParams.append('category', params.category)
    if (params?.search) searchParams.append('search', params.search)
    
    const queryString = searchParams.toString()
    const endpoint = queryString ? `/products?${queryString}` : '/products'
    
    return apiRequest<Product[]>(endpoint)
  },

  // Get product by ID
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiRequest<Product>(`/products/${id}`)
  },

  // Get featured products
  getFeatured: async (): Promise<ApiResponse<Product[]>> => {
    return apiRequest<Product[]>('/products/featured')
  },
}

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    return apiRequest<Category[]>('/categories')
  },

  // Get category by ID
  getById: async (id: string): Promise<ApiResponse<Category>> => {
    return apiRequest<Category>(`/categories/${id}`)
  },
}

// Cart API
export const cartAPI = {
  // Get user cart
  getCart: async (): Promise<ApiResponse<Cart>> => {
    return apiRequest<Cart>('/cart')
  },

  // Add item to cart
  addItem: async (data: { productId: string; quantity: number }): Promise<ApiResponse<CartItem>> => {
    return apiRequest<CartItem>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update cart item
  updateItem: async (id: string, data: { quantity: number }): Promise<ApiResponse<CartItem>> => {
    return apiRequest<CartItem>(`/cart/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Remove cart item
  removeItem: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/cart/items/${id}`, {
      method: 'DELETE',
    })
  },

  // Clear cart
  clearCart: async (): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/cart', {
      method: 'DELETE',
    })
  },
}

// Orders API
export const ordersAPI = {
  // Get user orders
  getUserOrders: async (): Promise<ApiResponse<Order[]>> => {
    return apiRequest<Order[]>('/orders')
  },

  // Create order
  createOrder: async (data: {
    items: Array<{ productId: string; quantity: number }>
    shippingAddress: any
    paymentMethod: 'MOMO' | 'BK' | 'CASH'
  }): Promise<ApiResponse<Order>> => {
    return apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get order by ID
  getById: async (id: string): Promise<ApiResponse<Order>> => {
    return apiRequest<Order>(`/orders/${id}`)
  },
}

// Admin API (protected routes)
export const adminAPI = {
  // Get all products (admin)
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    return apiRequest<Product[]>('/admin/products')
  },

  // Get all orders (admin)
  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    return apiRequest<Order[]>('/admin/orders')
  },
}

// Utility functions
export const apiUtils = {
  // Store auth tokens
  storeTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    }
  },

  // Get access token
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      // First try localStorage
      const localToken = localStorage.getItem('accessToken')
      if (localToken) {
        return localToken
      }
      
      // Fallback to cookies
      const cookies = document.cookie.split(';')
      const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='))
      if (accessTokenCookie) {
        const token = accessTokenCookie.split('=')[1]
        // Also store in localStorage for consistency
        localStorage.setItem('accessToken', token)
        return token
      }
    }
    return null
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken')
    }
    return null
  },

  // Clear auth tokens
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      
      // Also clear cookies
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  },

  // Get stored user
  getStoredUser: (): User | null => {
    if (typeof window !== 'undefined') {
      // First try localStorage
      const userStr = localStorage.getItem('user')
      if (userStr) {
        return JSON.parse(userStr)
      }
      
      // Fallback to cookies for user role
      const cookies = document.cookie.split(';')
      const userRoleCookie = cookies.find(cookie => cookie.trim().startsWith('userRole='))
      if (userRoleCookie) {
        const role = userRoleCookie.split('=')[1]
        // Create a basic user object from cookie data
        const user: User = {
          id: 'cookie-user',
          email: 'admin@example.com', // Default email
          firstName: 'Admin',
          lastName: 'User',
          role: role as 'ADMIN' | 'CUSTOMER',
          phone: '',
          isActive: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        // Store in localStorage for consistency
        localStorage.setItem('user', JSON.stringify(user))
        return user
      }
    }
    return null
  },

  // Store user
  storeUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('accessToken')
    }
    return false
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = apiUtils.getStoredUser()
    return user?.role === 'ADMIN'
  },

  // Get auth headers for API requests
  getAuthHeaders: (): Record<string, string> => {
    const token = apiUtils.getAccessToken()
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  },

  // Format phone number for Rwanda
  formatPhoneNumber: (phone: string): string => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '')
    
    // If it starts with 25 and is 12 digits, it's already in international format
    if (cleanPhone.startsWith('25') && cleanPhone.length === 12) {
      return `+${cleanPhone}`
    }
    
    // If it starts with 07 and is 10 digits, convert to international format
    if (cleanPhone.startsWith('07') && cleanPhone.length === 10) {
      return `+25${cleanPhone}`
    }
    
    // If it's 9 digits and starts with 7, add country code
    if (cleanPhone.length === 9 && cleanPhone.startsWith('7')) {
      return `+25${cleanPhone}`
    }
    
    // Return as is if it doesn't match any pattern
    return phone
  },

  // Validate email format
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate password strength
  validatePassword: (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' }
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' }
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' }
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' }
    }
    
    return { isValid: true, message: 'Password is valid' }
  },

  // Validate phone number (Rwanda format)
  validatePhone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '')
    
    // Rwanda numbers start with 25 and are 12 digits long
    if (cleanPhone.startsWith('25') && cleanPhone.length === 12) {
      return true
    }
    
    // Or start with 07 and are 10 digits long
    if (cleanPhone.startsWith('07') && cleanPhone.length === 10) {
      return true
    }
    
    return false
  }
}

export default {
  auth: authAPI,
  user: userAPI,
  products: productsAPI,
  categories: categoriesAPI,
  cart: cartAPI,
  orders: ordersAPI,
  admin: adminAPI,
  utils: apiUtils,
}

// Export apiRequest function for use in other modules
export { apiRequest } 