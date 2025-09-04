'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Heart, ShoppingCart, Star, Truck, Shield, ArrowLeft, Share2, Eye } from 'lucide-react'
import { useProducts } from '@/contexts/ProductsContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { Product } from '@/types'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

const ProductDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const { getProductById } = useProducts()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId)
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        toast.error('Product not found')
        router.push('/products')
      }
      setLoading(false)
    }
  }, [productId, getProductById, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
    }
  }

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
        toast.success('Removed from wishlist')
      } else {
        addToWishlist(product)
        toast.success('Added to wishlist')
      }
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-responsive py-8">
          <div className="container-wide">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading product...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-responsive py-8">
          <div className="container-wide">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
              <button
                onClick={() => router.push('/products')}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-4">
          <div className="container-wide">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-pink-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-flower.jpg'
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-pink-500 shadow-md'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-flower.jpg'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Product Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {product.color && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
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
                    )}
                    {product.type && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        {product.type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-2 rounded-full transition-colors ${
                        isInWishlist(product.id)
                          ? 'bg-pink-100 text-pink-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {product.brand && (
                  <p className="text-lg text-gray-600 mb-4">by {product.brand}</p>
                )}

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">(12 reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-600">
                    {formatPrice(product.price)}
                  </p>
                  {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      Only {product.stockQuantity} left in stock!
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <p className="font-medium">{product.categoryName}</p>
                  </div>
                  {product.size && (
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <p className="font-medium">{product.size}</p>
                    </div>
                  )}
                  {product.concentration && (
                    <div>
                      <span className="text-gray-500">Concentration:</span>
                      <p className="font-medium">{product.concentration}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Stock:</span>
                    <p className="font-medium">{product.stockQuantity} available</p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stockQuantity}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    className="w-full bg-pink-500 text-white py-4 px-6 rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-semibold"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                      {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </span>
                  </button>

                  {product.stockQuantity === 0 && (
                    <p className="text-center text-red-600 text-sm">
                      This product is currently out of stock
                    </p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Free delivery on orders over RWF 50,000</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Secure payment</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Quality guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductDetailPage
