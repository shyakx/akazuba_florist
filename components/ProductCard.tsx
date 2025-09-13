'use client'

import React from 'react'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'

/**
 * Product Card Props Interface
 * 
 * Defines the properties for the ProductCard component including
 * product data and callback functions for user interactions.
 */
interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
  isAddingToCart?: boolean
}

/**
 * Product Card Component
 * 
 * Displays individual product information in a card format with:
 * - Product image with sale badge
 * - Product name and description
 * - Price display with sale pricing
 * - Add to cart and wishlist functionality
 * - Responsive design
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isAddingToCart = false
}) => {
  /**
   * Format Price for Display
   * 
   * Formats numeric price values into Rwandan Franc currency format
   * with proper localization and no decimal places.
   * 
   * @param price - Numeric price value
   * @returns Formatted currency string
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={product.images[0] || '/images/placeholder-flower.jpg'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Sale Badge */}
        {product.salePrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Sale
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-pink-600 font-medium mb-2">
          {product.categoryName}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-red-600">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
            {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={product.stockQuantity === 0 || isAddingToCart}
            className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isAddingToCart ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </>
            )}
          </button>
          
          <button
            onClick={() => onAddToWishlist?.(product)}
            className="p-2 text-gray-400 hover:text-pink-600 transition-colors duration-200 border border-gray-200 rounded hover:border-pink-300"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard 