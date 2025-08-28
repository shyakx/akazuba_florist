'use client'

import React, { useState } from 'react'
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
  const [imageError, setImageError] = useState(false)

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Image failed to load:', product.image)
    setImageError(true)
    
    // Try fallback image
    const img = e.currentTarget
    if (img.src !== '/images/placeholder-flower.jpg') {
      img.src = '/images/placeholder-flower.jpg'
    } else {
      // If fallback also fails, hide the image
      img.style.display = 'none'
    }
  }

  const handleImageLoad = () => {
    setImageError(false)
    console.log('✅ Image loaded successfully:', product.image)
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}>
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onLoad={handleImageLoad}
          onError={handleImageError}
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

        {/* Image Error Indicator */}
        {imageError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🌸</span>
              </div>
              <p className="text-xs">Image unavailable</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
        {showRating && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">({product.reviews || 12})</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <p className="text-pink-600 font-bold text-lg">
            {formatPrice(product.price)}
          </p>
          
          {product.salePrice && product.salePrice < product.price && (
            <p className="text-gray-400 text-sm line-through">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard 