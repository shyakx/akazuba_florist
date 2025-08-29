'use client'

import React, { useState } from 'react'
import { Heart, ShoppingCart, Star, Sparkles, Droplets } from 'lucide-react'
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

interface PerfumeCardProps {
  product: any
  showRating?: boolean
  className?: string
}

const PerfumeCard = ({ product, showRating = true, className = '' }: PerfumeCardProps) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = (product: any) => {
    addToCart({
      ...product,
      quantity: 1
    })
  }

  const handleWishlistToggle = async (product: any) => {
    if (isInWishlist(product.id.toString())) {
      await removeFromWishlist(product.id.toString())
    } else {
      await addToWishlist(product)
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Perfume image failed to load:', product.image)
    setImageError(true)
    
    // Try fallback image
    const img = e.currentTarget
    const fallbackImages = [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1592945403244-b3faa74b2c98?w=400&h=400&fit=crop'
    ]
    
    const currentIndex = fallbackImages.indexOf(img.src)
    const nextIndex = (currentIndex + 1) % fallbackImages.length
    
    if (currentIndex === -1 || currentIndex < fallbackImages.length - 1) {
      img.src = fallbackImages[nextIndex]
    } else {
      img.style.display = 'none'
    }
  }

  const handleImageLoad = () => {
    setImageError(false)
    console.log('✅ Perfume image loaded successfully:', product.image)
  }

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'men': return 'bg-blue-500'
      case 'women': return 'bg-pink-500'
      case 'unisex': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getConcentrationColor = (concentration: string) => {
    switch (concentration?.toLowerCase()) {
      case 'edp': return 'bg-amber-500'
      case 'edt': return 'bg-green-500'
      case 'cologne': return 'bg-cyan-500'
      default: return 'bg-gray-500'
    }
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Brand Badge */}
        {product.brand && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
              {product.brand}
            </span>
          </div>
        )}

        {/* Type Badge */}
        {product.type && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(product.type)}`}>
              {product.type}
            </span>
          </div>
        )}

        {/* Concentration Badge */}
        {product.concentration && (
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getConcentrationColor(product.concentration)} flex items-center gap-1`}>
              <Droplets className="w-3 h-3" />
              {product.concentration}
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
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs">Image unavailable</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
        {/* Brand and Size Info */}
        <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
          {product.brand && (
            <span className="font-medium">{product.brand}</span>
          )}
          {product.size && (
            <span className="text-gray-500">{product.size}</span>
          )}
        </div>
        
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
            <span className="text-sm text-gray-500 ml-1">({product.reviews || 8})</span>
          </div>
        )}
        
        {/* Fragrance Notes Preview */}
        {product.notes && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 line-clamp-1">
              <span className="font-medium">Notes:</span> {product.notes}
            </p>
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

export default PerfumeCard
