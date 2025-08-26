'use client'

import React from 'react'
import { X, TrendingUp, TrendingDown, Eye, Star, DollarSign, Package, BarChart3 } from 'lucide-react'
import { ProductAnalytics } from '@/lib/adminApi'

interface ProductAnalyticsPanelProps {
  analytics: ProductAnalytics[]
  loading: boolean
  onFetchAnalytics: () => Promise<void>
  onClose: () => void
}

const ProductAnalyticsPanel: React.FC<ProductAnalyticsPanelProps> = ({ analytics, loading, onFetchAnalytics, onClose }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getTopProducts = (metric: keyof ProductAnalytics, count: number = 5) => {
    return [...analytics]
      .sort((a, b) => (b[metric] as number) - (a[metric] as number))
      .slice(0, count)
  }

  const getTotalRevenue = () => {
    return analytics.reduce((sum, item) => sum + item.revenue, 0)
  }

  const getTotalSales = () => {
    return analytics.reduce((sum, item) => sum + item.sales, 0)
  }

  const getTotalViews = () => {
    return analytics.reduce((sum, item) => sum + item.views, 0)
  }

  const getAverageRating = () => {
    const ratings = analytics.filter(item => item.rating > 0)
    if (ratings.length === 0) return 0
    return ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Product Analytics</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onFetchAnalytics}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      ) : analytics.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
          <p className="text-gray-600">Analytics data will appear here once products have activity.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{formatPrice(getTotalRevenue())}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Total Sales</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{getTotalSales()}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Total Views</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{getTotalViews().toLocaleString()}</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{getAverageRating().toFixed(1)}/5</p>
            </div>
          </div>

          {/* Top Products by Revenue */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Top Products by Revenue</h4>
            <div className="space-y-2">
              {getTopProducts('revenue').map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(product.revenue)}</p>
                    <p className="text-xs text-gray-500">{formatPercentage(product.profitMargin)} margin</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products by Views */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Top Products by Views</h4>
            <div className="space-y-2">
              {getTopProducts('views').map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-500">{product.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{product.sales} sales</p>
                    <p className="text-xs text-gray-500">{formatPrice(product.revenue)} revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products by Rating */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Top Products by Rating</h4>
            <div className="space-y-2">
              {getTopProducts('rating').filter(p => p.rating > 0).map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-500">{product.rating}/5</span>
                        <span className="text-xs text-gray-400">({product.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{product.sales} sales</p>
                    <p className="text-xs text-gray-500">{formatPrice(product.revenue)} revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Performance */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Stock Performance</h4>
            <div className="space-y-2">
              {analytics
                .filter(product => product.stockTurnover > 0)
                .sort((a, b) => b.stockTurnover - a.stockTurnover)
                .slice(0, 5)
                .map((product, index) => (
                  <div key={product.productId} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                        <p className="text-xs text-gray-500">Turnover: {product.stockTurnover.toFixed(1)}x</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{product.sales} sales</p>
                      <p className="text-xs text-gray-500">{formatPrice(product.revenue)} revenue</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Detailed Analytics Table */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Detailed Analytics</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.slice(0, 10).map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.views.toLocaleString()}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.sales}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatPrice(product.revenue)}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-900">{product.rating}/5</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatPercentage(product.profitMargin)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductAnalyticsPanel
