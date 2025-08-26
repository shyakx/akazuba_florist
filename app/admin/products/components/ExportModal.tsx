'use client'

import React, { useState } from 'react'
import { X, Download, FileText, FileSpreadsheet, File } from 'lucide-react'
import { ExportOptions } from '@/lib/adminApi'

interface ExportModalProps {
  onClose: () => void
  onExport: (options: ExportOptions) => Promise<void>
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, onExport }) => {
  const [loading, setLoading] = useState(false)
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv')
  const [includeImages, setIncludeImages] = useState(false)
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'id', 'name', 'price', 'stockQuantity', 'categoryName', 'isActive', 'isFeatured'
  ])

  const availableFields = [
    { key: 'id', label: 'Product ID' },
    { key: 'name', label: 'Product Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'salePrice', label: 'Sale Price' },
    { key: 'costPrice', label: 'Cost Price' },
    { key: 'sku', label: 'SKU' },
    { key: 'stockQuantity', label: 'Stock Quantity' },
    { key: 'minStockAlert', label: 'Min Stock Alert' },
    { key: 'categoryName', label: 'Category' },
    { key: 'isActive', label: 'Active Status' },
    { key: 'isFeatured', label: 'Featured Status' },
    { key: 'tags', label: 'Tags' },
    { key: 'createdAt', label: 'Created Date' },
    { key: 'updatedAt', label: 'Updated Date' },
    { key: 'views', label: 'Views' },
    { key: 'sales', label: 'Sales' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'rating', label: 'Rating' },
    { key: 'reviewCount', label: 'Review Count' }
  ]

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    )
  }

  const handleExport = async () => {
    if (selectedFields.length === 0) return

    try {
      setLoading(true)
      const options: ExportOptions = {
        format,
        includeImages,
        fields: selectedFields
      }
      await onExport(options)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFormatIcon = (formatType: string) => {
    switch (formatType) {
      case 'csv':
        return <FileText className="h-5 w-5" />
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5" />
      case 'pdf':
        return <File className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getFormatLabel = (formatType: string) => {
    switch (formatType) {
      case 'csv':
        return 'CSV (Comma Separated Values)'
      case 'excel':
        return 'Excel (.xlsx)'
      case 'pdf':
        return 'PDF Document'
      default:
        return formatType.toUpperCase()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Export Products</h2>
            <p className="text-sm text-gray-600 mt-1">Export your product data in various formats</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['csv', 'excel', 'pdf'] as const).map((formatType) => (
                <button
                  key={formatType}
                  onClick={() => setFormat(formatType)}
                  className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                    format === formatType
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {getFormatIcon(formatType)}
                  <div className="text-left">
                    <div className="font-medium">{formatType.toUpperCase()}</div>
                    <div className="text-xs text-gray-500">{getFormatLabel(formatType)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Include Images */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Options</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">Include product images (may increase file size)</span>
              </label>
            </div>
          </div>

          {/* Fields Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Select Fields to Export ({selectedFields.length} selected)
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableFields.map((field) => (
                  <label key={field.key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.key)}
                      onChange={() => handleFieldToggle(field.key)}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">{field.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => setSelectedFields(availableFields.map(f => f.key))}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedFields([])}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Export Preview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700 mb-2">Export Preview</h3>
            <div className="text-sm text-blue-600 space-y-1">
              <p>• Format: {getFormatLabel(format)}</p>
              <p>• Fields: {selectedFields.length} selected</p>
              <p>• Images: {includeImages ? 'Included' : 'Not included'}</p>
              {format === 'csv' && <p>• Compatible with Excel, Google Sheets, and other spreadsheet applications</p>}
              {format === 'excel' && <p>• Full formatting and styling preserved</p>}
              {format === 'pdf' && <p>• Professional document format with layout preserved</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading || selectedFields.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{loading ? 'Exporting...' : 'Export Products'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
