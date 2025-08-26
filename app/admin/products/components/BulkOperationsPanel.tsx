'use client'

import React, { useState } from 'react'
import { X, Trash2, CheckCircle, EyeOff, Star, Package, AlertTriangle } from 'lucide-react'
import { BulkOperation } from '@/lib/adminApi'

interface BulkOperationsPanelProps {
  selectedCount: number
  onClose: () => void
  onOperation: (operation: BulkOperation) => Promise<void>
}

const BulkOperationsPanel: React.FC<BulkOperationsPanelProps> = ({ selectedCount, onClose, onOperation }) => {
  const [loading, setLoading] = useState(false)
  const [stockQuantity, setStockQuantity] = useState('')
  const [stockOperation, setStockOperation] = useState<'add' | 'subtract' | 'set'>('add')

  const handleOperation = async (operation: BulkOperation['operation'], data?: any) => {
    try {
      setLoading(true)
      await onOperation({
        productIds: [], // This will be filled by the parent component
        operation,
        data
      })
      onClose()
    } catch (error) {
      console.error('Bulk operation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async () => {
    if (!stockQuantity || isNaN(Number(stockQuantity))) {
      return
    }

    await handleOperation('updateStock', {
      operation: stockOperation,
      quantity: Number(stockQuantity)
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bulk Operations</h2>
            <p className="text-sm text-gray-600 mt-1">{selectedCount} products selected</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Status Operations */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Status Operations</h3>
            
            <button
              onClick={() => handleOperation('activate')}
              disabled={loading}
              className="w-full flex items-center space-x-3 p-3 text-left bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <span className="font-medium text-green-800">Activate Products</span>
                <p className="text-sm text-green-600">Make selected products active</p>
              </div>
            </button>

            <button
              onClick={() => handleOperation('deactivate')}
              disabled={loading}
              className="w-full flex items-center space-x-3 p-3 text-left bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50"
            >
              <EyeOff className="h-5 w-5 text-yellow-600" />
              <div>
                <span className="font-medium text-yellow-800">Deactivate Products</span>
                <p className="text-sm text-yellow-600">Make selected products inactive</p>
              </div>
            </button>
          </div>

          {/* Feature Operations */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Feature Operations</h3>
            
            <button
              onClick={() => handleOperation('feature')}
              disabled={loading}
              className="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
              <Star className="h-5 w-5 text-purple-600" />
              <div>
                <span className="font-medium text-purple-800">Feature Products</span>
                <p className="text-sm text-purple-600">Mark selected products as featured</p>
              </div>
            </button>

            <button
              onClick={() => handleOperation('unfeature')}
              disabled={loading}
              className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Star className="h-5 w-5 text-gray-600" />
              <div>
                <span className="font-medium text-gray-800">Unfeature Products</span>
                <p className="text-sm text-gray-600">Remove featured status from products</p>
              </div>
            </button>
          </div>

          {/* Stock Operations */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Stock Operations</h3>
            
            <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Update Stock</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={stockOperation}
                  onChange={(e) => setStockOperation(e.target.value as 'add' | 'subtract' | 'set')}
                  className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                  <option value="set">Set to</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Quantity"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              <button
                onClick={handleStockUpdate}
                disabled={loading || !stockQuantity || isNaN(Number(stockQuantity))}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
              >
                Update Stock
              </button>
            </div>
          </div>

          {/* Delete Operation */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Danger Zone</h3>
            
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${selectedCount} products? This action cannot be undone.`)) {
                  handleOperation('delete')
                }
              }}
              disabled={loading}
              className="w-full flex items-center space-x-3 p-3 text-left bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-5 w-5 text-red-600" />
              <div>
                <span className="font-medium text-red-800">Delete Products</span>
                <p className="text-sm text-red-600">Permanently delete selected products</p>
              </div>
            </button>
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
        </div>
      </div>
    </div>
  )
}

export default BulkOperationsPanel
