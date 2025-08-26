'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart, Truck, Shield, Star, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const CartSummary = () => {
  const { state } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Your Cart</h3>
            <p className="text-sm text-gray-600">{state.itemCount} items</p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      {state.itemCount === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <p className="text-sm text-gray-500">Add some beautiful flowers to get started!</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {state.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <img
                  src={item.product?.images?.[0] || '/images/placeholder-flower.jpg'}
                  alt={item.product?.name || 'Product'}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{item.product?.name || 'Product'}</h4>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-pink-600">{formatPrice((item.product?.price || 0) * item.quantity)}</p>
                </div>
              </div>
            ))}
            
            {state.items.length > 3 && (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">+{state.items.length - 3} more items</p>
              </div>
            )}
          </div>

          {/* Cart Total */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatPrice(state.total)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Delivery:</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-pink-600">
              <span>Total:</span>
              <span>{formatPrice(state.total)}</span>
            </div>
          </div>
        </>
      )}

      {/* Benefits */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Truck className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-gray-700">Free same-day delivery in Kigali</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="h-3 w-3 text-blue-600" />
          </div>
          <span className="text-gray-700">Secure MoMo & BK payments</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <Star className="h-3 w-3 text-yellow-600" />
          </div>
          <span className="text-gray-700">Fresh flowers guarantee</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {state.itemCount > 0 ? (
          <>
            <Link href="/checkout" className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg block text-center">
              Checkout Now
            </Link>
            <Link href="/cart" className="w-full border-2 border-pink-600 text-pink-600 py-3 px-6 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300 block text-center">
              View Full Cart
            </Link>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Link href="/" className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm block text-center">
              Shop Flowers
            </Link>
            <Link href="/category/mixed-bouquets" className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-rose-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm block text-center">
              View Bouquets
            </Link>
          </div>
        )}
      </div>

      {/* Trust Badge */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          </div>
          <span className="text-sm font-medium text-gray-700">4.9/5 Rating</span>
        </div>
      </div>
    </div>
  )
}

export default CartSummary 