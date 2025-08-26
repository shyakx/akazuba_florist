'use client'

import React, { useState } from 'react'
import { adminAPI, AdminProduct } from '@/lib/adminApi'
import ProductPreviewModal from '../components/ProductPreviewModal'
import ProductFiltersPanel from '../components/ProductFiltersPanel'
import BulkOperationsPanel from '../components/BulkOperationsPanel'
import ProductAnalyticsPanel from '../components/ProductAnalyticsPanel'
import StockManagementModal from '../components/StockManagementModal'
import ImageManagementModal from '../components/ImageManagementModal'
import ExportModal from '../components/ExportModal'

const TestPage = () => {
  const [testProduct] = useState<AdminProduct>({
    id: '1',
    name: 'Test Product',
    slug: 'test-product',
    description: 'This is a test product for testing components',
    price: 25000,
    stockQuantity: 15,
    minStockAlert: 5,
    categoryId: '1',
    categoryName: 'Test Category',
    images: ['/images/flowers/red/red-1.jpg'],
    isActive: true,
    isFeatured: true,
    tags: ['test', 'demo'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 100,
    sales: 25,
    revenue: 625000,
    rating: 4.5,
    reviewCount: 10
  })

  const [showPreview, setShowPreview] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showStock, setShowStock] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [showExport, setShowExport] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Component Test Page</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setShowPreview(true)}
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Test Preview Modal
          </button>
          
          <button
            onClick={() => setShowFilters(true)}
            className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Test Filters Panel
          </button>
          
          <button
            onClick={() => setShowBulk(true)}
            className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Test Bulk Operations
          </button>
          
          <button
            onClick={() => setShowAnalytics(true)}
            className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Test Analytics Panel
          </button>
          
          <button
            onClick={() => setShowStock(true)}
            className="p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Test Stock Modal
          </button>
          
          <button
            onClick={() => setShowImage(true)}
            className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Test Image Modal
          </button>
          
          <button
            onClick={() => setShowExport(true)}
            className="p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Test Export Modal
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Product Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(testProduct, null, 2)}
          </pre>
        </div>
      </div>

      {/* Test Modals */}
      {showPreview && (
        <ProductPreviewModal
          product={testProduct}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showFilters && (
        <ProductFiltersPanel
          filters={{
            search: '',
            category: '',
            status: 'all',
            stockStatus: 'all',
            priceRange: undefined,
            featured: undefined,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            tags: [],
            dateRange: undefined
          }}
          onFiltersChange={() => {}}
          onClose={() => setShowFilters(false)}
        />
      )}

      {showBulk && (
        <BulkOperationsPanel
          selectedCount={5}
          onClose={() => setShowBulk(false)}
          onOperation={async () => {}}
        />
      )}

      {showAnalytics && (
        <ProductAnalyticsPanel
          analytics={[{
            productId: '1',
            productName: 'Test Product',
            views: 100,
            sales: 25,
            revenue: 625000,
            rating: 4.5,
            reviewCount: 10,
            stockTurnover: 2.5,
            profitMargin: 0.35,
            lastUpdated: new Date().toISOString()
          }]}
          loading={false}
          onFetchAnalytics={async () => {}}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {showStock && (
        <StockManagementModal
          product={testProduct}
          onClose={() => setShowStock(false)}
          onUpdate={async () => {}}
        />
      )}

      {showImage && (
        <ImageManagementModal
          product={testProduct}
          onClose={() => setShowImage(false)}
          onUpdate={async () => {}}
        />
      )}

      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          onExport={async () => {}}
        />
      )}
    </div>
  )
}

export default TestPage
