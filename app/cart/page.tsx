'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import Footer from '@/components/Footer'

const CartPage = () => {
  const { state, updateQuantity, removeFromCart } = useCart()
  
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  const deliveryFee = 0  // Free delivery everywhere
  const total = state.total + deliveryFee
  
  
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-pink-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven&apos;t added any beautiful flowers to your cart yet. 
                Let&apos;s find something special for you!
              </p>
              <Link href="/" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link href="/" className="flex items-center text-gray-600 hover:text-pink-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Shopping Cart
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Review your beautiful flower selections and proceed to checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                  Cart Items ({state.items.length})
                </h2>
                
                <div className="space-y-6">
                  {state.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center space-x-6 p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-pink-100 rounded-xl flex items-center justify-center">
                        <img
                          src={item.product?.images?.[0] || '/placeholder-flower.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.product?.name || 'Product'}</h3>
                        <p className="text-gray-600 capitalize">{item.product?.categoryName || 'Category'}</p>
                        <p className="text-xl font-bold text-pink-600">
                          {formatPrice(item.product?.price || 0)}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        
                        <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      
                      {/* Total Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-pink-600">
                          {formatPrice((item.product?.price || 0) * item.quantity)}
                        </p>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({state.itemCount} items)</span>
                    <span>{formatPrice(state.total)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  href="/checkout"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg mt-6 block text-center transition-colors"
                >
                  Proceed to Checkout
                </Link>
                
                <p className="text-sm text-green-600 text-center mt-2">
                  🎉 Free delivery on all orders!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CartPage 