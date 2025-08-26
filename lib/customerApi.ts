import { apiRequest } from './api'

// Customer API service for dashboard data
export const customerAPI = {
  // Get customer cart
  getCart: async () => {
    return apiRequest('/cart')
  },

  // Get customer wishlist
  getWishlist: async () => {
    return apiRequest('/wishlist')
  },

  // Get customer orders
  getOrders: async () => {
    return apiRequest('/orders/my-orders')
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string, quantity: number) => {
    return apiRequest(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    })
  },

  // Remove item from cart
  removeCartItem: async (itemId: string) => {
    return apiRequest(`/cart/items/${itemId}`, {
      method: 'DELETE'
    })
  },

  // Add item to wishlist
  addToWishlist: async (productId: string) => {
    return apiRequest('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId })
    })
  },

  // Remove item from wishlist
  removeFromWishlist: async (itemId: string) => {
    return apiRequest(`/wishlist/${itemId}`, {
      method: 'DELETE'
    })
  },

  // Get order details
  getOrderDetails: async (orderId: string) => {
    return apiRequest(`/orders/my-orders/${orderId}`)
  }
} 