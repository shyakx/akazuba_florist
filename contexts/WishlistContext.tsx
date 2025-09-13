'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './RealAuthContext'
import { useProducts } from './ProductsContext'
import { wishlistAPI } from '@/lib/wishlist-api'
import { toast } from 'react-hot-toast'

export interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
    categoryName: string
  }
  addedAt: string
}

interface WishlistContextType {
  items: WishlistItem[]
  isLoading: boolean
  addToWishlist: (product: any) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<boolean>
  clearWishlist: () => Promise<boolean>
  isInWishlist: (productId: string) => boolean
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

interface WishlistProviderProps {
  children: React.ReactNode
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const { products } = useProducts()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load wishlist on mount and when user changes
  useEffect(() => {
    // Only proceed if we're in the browser and have authentication state
    if (typeof window === 'undefined') return
    
    if (user && isAuthenticated) {
      refreshWishlist()
    } else {
      // For guest users or unauthenticated users, show empty wishlist
      setItems([])
    }
  }, [user, isAuthenticated])

  const refreshWishlist = async () => {
    // Early return if not in browser environment (SSR/SSG)
    if (typeof window === 'undefined') {
      return
    }
    
    // Early return if not authenticated or no user
    if (!user || !isAuthenticated) {
      return
    }

    try {
      setIsLoading(true)
      
      // Check if we have a valid token before making the API call
      let token = localStorage.getItem('accessToken')
      
      // If not found in localStorage, try cookies as fallback
      if (!token) {
        const cookies = document.cookie.split(';')
        const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='))
        if (accessTokenCookie) {
          token = accessTokenCookie.split('=')[1]
        }
      }
      
      if (!token) {
        setItems([])
        return
      }
      
      const response = await wishlistAPI.getWishlist()
      
      if (response.success && response.data) {
        // Transform backend data to match frontend expectations
        const transformedItems = (response.data as any[]).map((item: any) => ({
          ...item,
          product: item.products || item.product // Backend returns 'products', frontend expects 'product'
        }))
        setItems(transformedItems as WishlistItem[])
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Error refreshing wishlist:', error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  const addToWishlist = async (product: any): Promise<boolean> => {
    // Early return if not in browser environment (SSR/SSG)
    if (typeof window === 'undefined') {
      return false
    }
    
    try {
      setIsLoading(true)

      if (!user) {
        toast.error('Please login to add items to your wishlist')
        return false
      }

      // User mode - add to backend
      const response = await wishlistAPI.addToWishlist(product.id)
      
      if (response.success) {
        await refreshWishlist()
        toast.success(`${product.name} added to wishlist!`)
        return true
      } else {
        toast.error(response.message || 'Failed to add to wishlist')
        return false
      }
    } catch (error) {
      console.error('❌ Error adding to wishlist:', error)
      toast.error('Failed to add to wishlist')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    // Early return if not in browser environment (SSR/SSG)
    if (typeof window === 'undefined') {
      return false
    }
    
    try {
      setIsLoading(true)

      if (!user) {
        toast.error('Please login to manage your wishlist')
        return false
      }

      const response = await wishlistAPI.removeFromWishlist(productId)
      
      if (response.success) {
        await refreshWishlist()
        toast.success('Item removed from wishlist')
        return true
      } else {
        toast.error(response.message || 'Failed to remove from wishlist')
        return false
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const clearWishlist = async (): Promise<boolean> => {
    // Early return if not in browser environment (SSR/SSG)
    if (typeof window === 'undefined') {
      return false
    }
    
    try {
      setIsLoading(true)

      if (!user) {
        toast.error('Please login to manage your wishlist')
        return false
      }

      const response = await wishlistAPI.clearWishlist()
      
      if (response.success) {
        setItems([])
        toast.success('Wishlist cleared')
        return true
      } else {
        toast.error(response.message || 'Failed to clear wishlist')
        return false
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      toast.error('Failed to clear wishlist')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.productId === productId)
  }

  const value: WishlistContextType = {
    items,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    refreshWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
} 