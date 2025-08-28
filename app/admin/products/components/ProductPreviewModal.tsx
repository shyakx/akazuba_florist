'use client'

import React from 'react'
import { X, Star, Eye, TrendingUp, Package, Tag, Calendar, DollarSign } from 'lucide-react'
import { AdminProduct } from '@/lib/adminApi'

interface ProductPreviewModalProps {
  product: AdminProduct
  onClose: () => void
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({ product, onClose }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStockStatusColor = (product: AdminProduct) => {
    if (product.stockQuantity === 0) return 'text-red-600 bg-red-50'
    if (product.stockQuantity <= product.minStockAlert) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getStockStatusText = (product: AdminProduct) => {
    if (product.stockQuantity === 0) return 'Out of Stock'
    if (product.stockQuantity <= product.minStockAlert) return 'Low Stock'
    return 'In Stock'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Product Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Additional Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                {/* Price */}
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                  {product.salePrice && (
                    <span className="text-lg text-green-600 font-semibold">{formatPrice(product.salePrice)}</span>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(product)}`}>
                    {getStockStatusText(product)}
                  </span>
                  {product.isFeatured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <Star className="h-4 w-4 mr-1" />
                      Featured
                    </span>
                  )}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Stock</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{product.stockQuantity}</p>
                    <p className="text-xs text-gray-500">Min alert: {product.minStockAlert}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Category</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{product.categoryName}</p>
                  </div>
                </div>

                {/* SKU and Cost */}
                <div className="grid grid-cols-2 gap-4">
                  {product.sku && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">SKU</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{product.sku}</p>
                    </div>
                  )}
                  
                  {product.costPrice && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Cost Price</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{formatPrice(product.costPrice)}</p>
                    </div>
                  )}
                </div>

                {/* Analytics */}
                {(product.views || product.sales || product.rating) && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-3">Analytics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {product.views && (
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">Views</span>
                          </div>
                          <p className="text-lg font-bold text-blue-900">{product.views}</p>
                        </div>
                      )}
                      
                      {product.sales && (
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Sales</span>
                          </div>
                          <p className="text-lg font-bold text-green-900">{product.sales}</p>
                        </div>
                      )}
                      
                      {product.rating && (
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-700">Rating</span>
                          </div>
                          <p className="text-lg font-bold text-yellow-900">{product.rating}/5</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Perfume-specific information */}
                {product.categoryId === 'perfumes' && product.brand && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="text-sm font-medium text-purple-900 mb-3">Perfume Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-medium text-purple-700">Brand</span>
                        <p className="text-sm font-semibold text-purple-900">{product.brand}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-purple-700">Type</span>
                        <p className="text-sm font-semibold text-purple-900">{product.perfumeType}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-purple-700">Size</span>
                        <p className="text-sm font-semibold text-purple-900">{product.size}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-purple-700">Concentration</span>
                        <p className="text-sm font-semibold text-purple-900">{product.concentration}</p>
                      </div>
                    </div>
                    {product.notes && (
                      <div className="mt-3">
                        <span className="text-xs font-medium text-purple-700">Notes</span>
                        <p className="text-sm text-purple-800 italic">{product.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Created</span>
                    </div>
                    <p className="text-sm text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Updated</span>
                    </div>
                    <p className="text-sm text-gray-900">{new Date(product.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPreviewModal
