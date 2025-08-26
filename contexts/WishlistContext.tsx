'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/api'
import { useAuth } from './RealAuthContext'
import { useProducts } from './ProductsContext'
import { wishlistAPI } from '@/lib/wishlist-api'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: string
  productId: string
  userId: string
  createdAt: string
  product: Product | any // Allow both Product and RealFlowerProduct
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (product: Product | any) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<boolean>
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => Promise<boolean>
  isLoading: boolean
  itemCount: number
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

interface WishlistProviderProps {
  children: ReactNode
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const { getBackendProductId, state: productsState } = useProducts()
  const router = useRouter()

  // Load wishlist from backend when user is authenticated
  const refreshWishlist = async () => {
    if (!isAuthenticated || !user) {
      // Load from localStorage for unauthenticated users
      if (typeof window !== 'undefined') {
        const storedWishlist = localStorage.getItem('wishlist')
        if (storedWishlist) {
          try {
            setItems(JSON.parse(storedWishlist))
          } catch (error) {
            console.error('Error parsing wishlist from localStorage:', error)
            localStorage.removeItem('wishlist')
          }
        }
      }
      return
    }

    try {
      setIsLoading(true)
      
      // Check if we have backend ID mapping (backend is available)
      const hasBackendMapping = productsState.products.length > 0 && 
        productsState.products.some(p => getBackendProductId(p.id))
      
      if (hasBackendMapping && isAuthenticated) {
        // Try to fetch from backend
        const response = await wishlistAPI.getWishlist()
        if (response.success && Array.isArray(response.data)) {
          console.log('📦 Wishlist items from backend:', response.data)
          setItems(response.data)
          return
        }
      }
      
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        const wishlistKey = `wishlist_${user?.id || 'guest'}`
        const storedWishlist = localStorage.getItem(wishlistKey)
        if (storedWishlist) {
          try {
            const parsedWishlist = JSON.parse(storedWishlist)
            console.log('📦 Wishlist items from localStorage:', parsedWishlist)
            setItems(parsedWishlist)
          } catch (error) {
            console.error('Error parsing wishlist from localStorage:', error)
            localStorage.removeItem(wishlistKey)
            setItems([])
          }
        } else {
          setItems([])
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load wishlist on mount and when authentication changes
  useEffect(() => {
    refreshWishlist()
  }, [isAuthenticated, user])

  // Save wishlist to localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(items))
    }
  }, [items, isAuthenticated])

  const addToWishlist = async (product: Product | any): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Check authentication first
      if (!isAuthenticated) {
        toast.error('Please sign in to add items to wishlist')
        router.push('/login')
        return false
      }
      
      // Convert product ID to string for consistent comparison
      const frontendProductId = product.id?.toString() || product.id
      
      // Check if products are loaded
      if (productsState.isLoading) {
        console.log('⏳ Products are still loading, please wait...')
        toast.error('Products are still loading, please try again')
        return false
      }
      
      if (productsState.products.length === 0) {
        console.error('❌ No products loaded in ProductsContext')
        toast.error('Products not loaded')
        return false
      }
      
      // Get the backend product ID using the mapping
      const backendProductId = getBackendProductId(parseInt(frontendProductId))
      
      if (!backendProductId) {
        console.log('⚠️ No backend ID mapping found - using fallback mode')
        console.log('⚠️ This means we\'re using static data, wishlist will use frontend ID')
        
        // When using fallback data, we can't add to backend wishlist
        // Instead, we'll use localStorage for wishlist items
        const wishlistKey = `wishlist_${user?.id || 'guest'}`
        const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]')
        
        // Check if already in local wishlist
        if (existingWishlist.some((item: any) => item.productId === frontendProductId)) {
          toast.success(`${product.name} is already in your wishlist`)
          return true
        }
        
        // Add to local wishlist
        const wishlistItem = {
          id: `local_${Date.now()}`,
          productId: frontendProductId,
          product: product,
          createdAt: new Date().toISOString()
        }
        
        existingWishlist.push(wishlistItem)
        localStorage.setItem(wishlistKey, JSON.stringify(existingWishlist))
        
        // Update local state
        setItems(existingWishlist)
        toast.success(`${product.name} added to wishlist!`)
        return true
      }
      
      // Check if product is already in wishlist
      if (isInWishlist(frontendProductId)) {
        toast.success(`${product.name} is already in your wishlist`)
        return true // Already in wishlist
      }

      console.log('🎯 Adding to wishlist - Frontend Product ID:', frontendProductId);
      console.log('🎯 Backend Product ID:', backendProductId);
      console.log('🎯 Product object:', product);
      
      // Add to backend using the real backend product ID
      const response = await wishlistAPI.addToWishlist(backendProductId)
      
      if (response.success) {
        // Refresh wishlist from backend
        await refreshWishlist()
        toast.success(`${product.name} added to wishlist!`)
        return true
      } else {
        toast.error(response.message || 'Failed to add to wishlist')
        return false
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add to wishlist')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Find the item to get its ID and name
      const itemToRemove = items.find(item => item.productId === productId)
      
      if (!itemToRemove) {
        toast.error('Item not found in wishlist')
        return false
      }

      // Check if this is a local wishlist item (starts with 'local_')
      if (itemToRemove.id.startsWith('local_')) {
        // Remove from localStorage
        const wishlistKey = `wishlist_${user?.id || 'guest'}`
        const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]')
        const updatedWishlist = existingWishlist.filter((item: any) => item.id !== itemToRemove.id)
        localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist))
        
        // Update local state
        setItems(updatedWishlist)
        toast.success(`${itemToRemove.product.name} removed from wishlist!`)
        return true
      }

      // Remove from backend
      const response = await wishlistAPI.removeFromWishlist(itemToRemove.id)
      
      if (response.success) {
        // Refresh wishlist from backend
        await refreshWishlist()
        toast.success(`${itemToRemove.product.name} removed from wishlist!`)
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

  const isInWishlist = (frontendProductId: string): boolean => {
    // Get the backend product ID for this frontend ID
    const backendProductId = getBackendProductId(parseInt(frontendProductId))
    
    if (backendProductId) {
      // Check if the backend product ID exists in the wishlist items
      return items.some(item => item.productId === backendProductId)
    } else {
      // Fallback mode - check if frontend ID exists in local wishlist
      return items.some(item => item.productId === frontendProductId)
    }
  }

  const clearWishlist = async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Check if we have any local wishlist items
      const hasLocalItems = items.some(item => item.id.startsWith('local_'))
      
      if (hasLocalItems) {
        // Clear from localStorage
        const wishlistKey = `wishlist_${user?.id || 'guest'}`
        localStorage.removeItem(wishlistKey)
        setItems([])
        toast.success('Wishlist cleared successfully!')
        return true
      }
      
      // Clear from backend
      const response = await wishlistAPI.clearWishlist()
      
      if (response.success) {
        setItems([])
        toast.success('Wishlist cleared successfully!')
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

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    isLoading,
    itemCount: items.length,
    refreshWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
} 