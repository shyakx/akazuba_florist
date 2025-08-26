'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { CartItem } from '@/lib/api'
import { useAuth } from './RealAuthContext'
import { useProducts } from './ProductsContext'
import { cartAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: CartItem }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ERROR'; payload: string }

const CartContext = createContext<{
  state: CartState
  addToCart: (product: Product) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getCartItem: (productId: string) => CartItem | undefined
  refreshCart: () => Promise<void>
} | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'LOAD_CART': {
      const items = action.payload
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
      const total = items.reduce((sum, item) => {
        const price = item.product?.price || 0
        return sum + (price * item.quantity)
      }, 0)
      return {
        ...state,
        items,
        itemCount,
        total,
        isLoading: false
      }
    }
    
    case 'ADD_ITEM': {
      const newItem = action.payload
      const existingItem = state.items.find(item => item.productId === newItem.productId)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.productId === newItem.productId ? newItem : item
        )
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const total = updatedItems.reduce((sum, item) => {
          const price = item.product?.price || 0
          return sum + (price * item.quantity)
        }, 0)
        return { ...state, items: updatedItems, itemCount, total }
      } else {
        const updatedItems = [...state.items, newItem]
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const total = updatedItems.reduce((sum, item) => {
          const price = item.product?.price || 0
          return sum + (price * item.quantity)
        }, 0)
        return { ...state, items: updatedItems, itemCount, total }
      }
    }
    
    case 'REMOVE_ITEM': {
      const itemId = action.payload
      const updatedItems = state.items.filter(item => item.id !== itemId)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const total = updatedItems.reduce((sum, item) => {
        const price = item.product?.price || 0
        return sum + (price * item.quantity)
      }, 0)
      return { ...state, items: updatedItems, itemCount, total }
    }
    
    case 'UPDATE_ITEM': {
      const updatedItem = action.payload
      const updatedItems = state.items.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const total = updatedItems.reduce((sum, item) => {
        const price = item.product?.price || 0
        return sum + (price * item.quantity)
      }, 0)
      return { ...state, items: updatedItems, itemCount, total }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        itemCount: 0,
        total: 0
      }
    
    case 'SET_ERROR':
      return { ...state, isLoading: false }
    
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false
  })
  const { isAuthenticated, user } = useAuth()
  const { getBackendProductId } = useProducts()
  const router = useRouter()

  // Load cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart()
    } else {
      // Clear cart when user is not authenticated
      dispatch({ type: 'CLEAR_CART' })
    }
  }, [isAuthenticated, user])

  const refreshCart = async () => {
    if (!isAuthenticated) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartAPI.getCart()
      
      if (response.success && response.data) {
        const cartItems = response.data.cartItems || []
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } else {
        dispatch({ type: 'LOAD_CART', payload: [] })
      }
      } catch (error) {
      console.error('Error loading cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' })
      }
    }

  const addToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart')
      router.push('/login')
      return
    }
    

    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Get the backend product ID for cart operations
      const backendProductId = getBackendProductId(product.id)
      if (!backendProductId) {
        toast.error('Product not found')
        return
      }
      
      const response = await cartAPI.addItem({
        productId: backendProductId,
        quantity: 1
      })
      
      if (response.success && response.data) {
        dispatch({ type: 'ADD_ITEM', payload: response.data })
    toast.success(`${product.name} added to cart!`)
      } else {
        toast.error('Failed to add item to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add item to cart')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!isAuthenticated) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartAPI.removeItem(itemId)
      
      if (response.success) {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId })
        toast.success('Item removed from cart!')
      } else {
        toast.error('Failed to remove item from cart')
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Failed to remove item from cart')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isAuthenticated) return
    
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartAPI.updateItem(itemId, { quantity })
      
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_ITEM', payload: response.data })
        toast.success('Cart updated!')
    } else {
        toast.error('Failed to update cart')
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      toast.error('Failed to update cart')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartAPI.clearCart()
      
      if (response.success) {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Cart cleared!')
      } else {
        toast.error('Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const getCartItem = (productId: string) => {
    return state.items.find(item => item.productId === productId)
  }

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItem,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 