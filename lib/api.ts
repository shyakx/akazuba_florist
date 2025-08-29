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

// Base API request function with proper production handling
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken()
  
  // Use local backend for development, deployed backend for production
  const API_BASE_URL_ACTUAL = process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api/v1' 
      : 'https://akazuba-backend-api.onrender.com/api/v1')

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
    
    const response = await fetch(`${API_BASE_URL_ACTUAL}${endpoint}`, config)
    console.log('📡 Response status:', response.status)
    
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

            // Transform backend response to match frontend expectations
        if (data.user && (data.accessToken || data.token)) {
          // Login/Register response - handle both accessToken and token
          const token = data.accessToken || data.token
          return {
            success: true,
            message: data.message || 'Success',
            data: {
              user: data.user,
              accessToken: token,
              refreshToken: data.refreshToken
            }
          } as ApiResponse<T>
        } else if (data.user && !data.accessToken && !data.token) {
          // Profile response
          return {
            success: true,
            message: 'Profile retrieved successfully',
            data: {
              user: data.user
            }
          } as ApiResponse<T>
        } else if (data.success && data.data) {
          // Backend already returns { success: true, data: [...] } format
          return data as ApiResponse<T>
        } else {
          // Other responses
          return {
            success: true,
            message: data.message || 'Success',
            data: data
          } as ApiResponse<T>
        }
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

  // Admin login
  adminLogin: async (data: { username: string; password: string }): Promise<ApiResponse<AuthResponse['data']>> => {
    try {
      const response = await apiRequest<AuthResponse['data']>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email: data.username, password: data.password }),
      });

      if (response.success && response.data) {
        return response;
      } else {
        throw new Error(response.message || 'Admin login failed');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/auth/logout', {
      method: 'POST',
    })
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse['data']>> => {
    return apiRequest<AuthResponse['data']>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
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
          email: 'admin@akazubaflorist.com', // Default email
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