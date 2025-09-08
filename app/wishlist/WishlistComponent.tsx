'use client'

import React from 'react'
import Link from 'next/link'
import { Heart, ArrowLeft, Trash2, ShoppingCart, Eye } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

const WishlistComponent = () => {
  const { items, removeFromWishlist, clearWishlist, isLoading } = useWishlist()
  const { addToCart } = useCart()
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Recently added'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Recently added'
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    const success = await removeFromWishlist(productId)
    if (success) {
      toast.success('Removed from wishlist')
    } else {
      toast.error('Failed to remove from wishlist')
    }
  }

  const handleClearWishlist = async () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      const success = await clearWishlist()
      if (success) {
        toast.success('Wishlist cleared')
      } else {
        toast.error('Failed to clear wishlist')
      }
    }
  }

  const handleAddToCart = (product: any) => {
    addToCart(product)
    // Toast message is handled by the cart context
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start adding your favorite flowers to your wishlist to save them for later!
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
      <div className="bg-gradient-to-br from-red-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <button
              onClick={handleClearWishlist}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              My Wishlist
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your saved flowers and arrangements ({items.length} items)
            </p>
          </div>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-pink-100 to-rose-100">
                  <img
                    src={item.product?.images?.[0] || item.product?.image || '/images/placeholder-flower.jpg'}
                    alt={item.product?.name || 'Product'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-flower.jpg'
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.product?.name || 'Product Name Not Available'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 capitalize">
                    {item.product?.category?.name || 'Flowers'}
                  </p>
                  <p className="text-xl font-bold text-red-600 mb-2">
                    {item.product?.price ? formatPrice(Number(item.product.price)) : 'Price Not Available'}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Added {formatDate(item.createdAt)}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Link
                      href={`/product/${item.productId}`}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(item.product)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default WishlistComponent
