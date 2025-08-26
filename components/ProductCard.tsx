'use client'

import React from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import toast from 'react-hot-toast'

// Format price function for RWF currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price)
}

interface ProductCardProps {
  product: any
  showRating?: boolean
  className?: string
}

const ProductCard = ({ product, showRating = true, className = '' }: ProductCardProps) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = (product: any) => {
    addToCart({
      ...product,
      quantity: 1
    })
    // Toast message is handled by the cart context
  }

  const handleWishlistToggle = async (product: any) => {
    if (isInWishlist(product.id.toString())) {
      await removeFromWishlist(product.id.toString())
      // Toast message is handled by the wishlist context
    } else {
      await addToWishlist(product)
      // Toast message is handled by the wishlist context
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}>
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            console.log('Image failed to load:', product.image)
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Color Badge */}
        {product.color && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
              product.color === 'red' ? 'bg-red-500' :
              product.color === 'pink' ? 'bg-pink-500' :
              product.color === 'white' ? 'bg-gray-500' :
              product.color === 'yellow' ? 'bg-yellow-500' :
              product.color === 'purple' ? 'bg-purple-500' :
              product.color === 'orange' ? 'bg-orange-500' :
              'bg-pink-500'
            }`}>
              {product.color.charAt(0).toUpperCase() + product.color.slice(1)}
            </span>
          </div>
        )}

        {/* Type Badge */}
        {product.type && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
              {product.type}
            </span>
          </div>
        )}

        {/* Action Buttons - Overlay on Image */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => handleWishlistToggle(product)}
            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200"
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id.toString()) ? 'text-pink-500' : 'text-gray-600'}`} />
          </button>
          <button 
            onClick={() => handleAddToCart(product)}
            className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          {showRating ? (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">(4.8)</span>
            </div>
          ) : (
            <div></div>
          )}
          <div className="text-right">
            <div className="font-bold text-lg text-gray-800">
              {formatPrice(product.price)}
            </div>
          </div>
        </div>

        {/* Add to Cart Button - Consistent Pink Color */}
        <button
          onClick={() => handleAddToCart(product)}
          className="w-full mt-3 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard 