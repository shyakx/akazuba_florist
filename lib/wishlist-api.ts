import { apiRequest } from './api'

// Wishlist API service
export const wishlistAPI = {
  // Get user's wishlist
  getWishlist: async () => {
    return apiRequest('/wishlist')
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

  // Clear wishlist
  clearWishlist: async () => {
    return apiRequest('/wishlist', {
      method: 'DELETE'
    })
  }
}
