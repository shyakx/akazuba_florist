'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Product, CartItem } from '@/types'
import toast from 'react-hot-toast'

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartItem: (productId: number) => CartItem | undefined
} | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        const newState = {
          ...state,
          items: updatedItems,
          itemCount: state.itemCount + 1,
          total: state.total + action.payload.price
        }
        localStorage.setItem('cart', JSON.stringify(newState.items))
        return newState
      } else {
        const newItem: CartItem = { ...action.payload, quantity: 1 }
        const newState = {
          ...state,
          items: [...state.items, newItem],
          itemCount: state.itemCount + 1,
          total: state.total + action.payload.price
        }
        localStorage.setItem('cart', JSON.stringify(newState.items))
        return newState
      }
    }
    
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload)
      if (!itemToRemove) return state
      
      const newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        itemCount: state.itemCount - itemToRemove.quantity,
        total: state.total - (itemToRemove.price * itemToRemove.quantity)
      }
      localStorage.setItem('cart', JSON.stringify(newState.items))
      return newState
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload
      const item = state.items.find(item => item.id === productId)
      if (!item) return state
      
      const quantityDiff = quantity - item.quantity
      const newState = {
        ...state,
        items: state.items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        ),
        itemCount: state.itemCount + quantityDiff,
        total: state.total + (item.price * quantityDiff)
      }
      localStorage.setItem('cart', JSON.stringify(newState.items))
      return newState
    }
    
    case 'CLEAR_CART': {
      const newState = {
        ...state,
        items: [],
        itemCount: 0,
        total: 0
      }
      localStorage.removeItem('cart')
      return newState
    }
    
    case 'LOAD_CART': {
      const items = action.payload
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      return {
        ...state,
        items,
        itemCount,
        total
      }
    }
    
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  })

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem('cart')
      }
    }
  }, [])

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
    toast.success(`${product.name} added to cart!`)
  }

  const removeFromCart = (productId: number) => {
    const item = state.items.find(item => item.id === productId)
    if (item) {
      dispatch({ type: 'REMOVE_ITEM', payload: productId })
      toast.success(`${item.name} removed from cart!`)
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Cart cleared!')
  }

  const getCartItem = (productId: number) => {
    return state.items.find(item => item.id === productId)
  }

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItem
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