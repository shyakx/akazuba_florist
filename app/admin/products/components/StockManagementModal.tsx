'use client'

import React, { useState } from 'react'
import { X, Package, Plus, Minus, Save, AlertTriangle } from 'lucide-react'
import { AdminProduct } from '@/lib/adminApi'

interface StockManagementModalProps {
  product: AdminProduct
  onClose: () => void
  onUpdate: () => Promise<void>
}

const StockManagementModal: React.FC<StockManagementModalProps> = ({ product, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [stockQuantity, setStockQuantity] = useState(product.stockQuantity.toString())
  const [minStockAlert, setMinStockAlert] = useState(product.minStockAlert.toString())
  const [operation, setOperation] = useState<'set' | 'add' | 'subtract'>('set')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')

  const handleStockUpdate = async () => {
    if (!stockQuantity || isNaN(Number(stockQuantity))) {
      return
    }

    try {
      setLoading(true)
      // Here you would call your API to update the stock
      // await adminAPI.updateStock({
      //   productId: product.id,
      //   quantity: Number(stockQuantity),
      //   operation: 'set',
      //   reason,
      //   notes
      // })
      
      await onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating stock:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickOperation = async () => {
    if (!quantity || isNaN(Number(quantity))) {
      return
    }

    try {
      setLoading(true)
      let newStock = product.stockQuantity
      
      switch (operation) {
        case 'add':
          newStock += Number(quantity)
          break
        case 'subtract':
          newStock = Math.max(0, newStock - Number(quantity))
          break
        case 'set':
          newStock = Number(quantity)
          break
      }

      setStockQuantity(newStock.toString())
      setQuantity('')
      
      // Here you would call your API to update the stock
      // await adminAPI.updateStock({
      //   productId: product.id,
      //   quantity: Number(quantity),
      //   operation,
      //   reason,
      //   notes
      // })
      
      await onUpdate()
    } catch (error) {
      console.error('Error updating stock:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStockStatusColor = () => {
    if (Number(stockQuantity) === 0) return 'text-red-600 bg-red-50'
    if (Number(stockQuantity) <= Number(minStockAlert)) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getStockStatusText = () => {
    if (Number(stockQuantity) === 0) return 'Out of Stock'
    if (Number(stockQuantity) <= Number(minStockAlert)) return 'Low Stock'
    return 'In Stock'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Stock Management</h2>
            <p className="text-sm text-gray-600 mt-1">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Stock Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Stock Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{product.stockQuantity}</div>
                <div className="text-sm text-gray-500">Current Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{product.minStockAlert}</div>
                <div className="text-sm text-gray-500">Min Stock Alert</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getStockStatusColor()}`}>
                  {getStockStatusText()}
                </div>
                <div className="text-sm text-gray-500">Status</div>
              </div>
            </div>
          </div>

          {/* Quick Stock Operations */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700 mb-3">Quick Stock Operations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value as 'set' | 'add' | 'subtract')}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="add">Add Stock</option>
                <option value="subtract">Subtract Stock</option>
                <option value="set">Set Stock</option>
              </select>
              
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              
              <button
                onClick={handleQuickOperation}
                disabled={loading || !quantity || isNaN(Number(quantity))}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
              >
                {operation === 'add' && <Plus className="h-4 w-4 inline mr-1" />}
                {operation === 'subtract' && <Minus className="h-4 w-4 inline mr-1" />}
                {operation === 'set' && <Package className="h-4 w-4 inline mr-1" />}
                {operation === 'add' ? 'Add' : operation === 'subtract' ? 'Subtract' : 'Set'}
              </button>
            </div>
          </div>

          {/* Manual Stock Update */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Manual Stock Update</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Stock Alert
                </label>
                <input
                  type="number"
                  value={minStockAlert}
                  onChange={(e) => setMinStockAlert(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Update
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select a reason</option>
                <option value="restock">Restock</option>
                <option value="sale">Sale</option>
                <option value="damage">Damage/Loss</option>
                <option value="adjustment">Inventory Adjustment</option>
                <option value="return">Customer Return</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add any additional notes about this stock update..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stock Alerts */}
          {Number(stockQuantity) <= Number(minStockAlert) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Low Stock Alert</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Current stock ({stockQuantity}) is at or below the minimum alert level ({minStockAlert}).
                  </p>
                </div>
              </div>
            </div>
          )}

          {Number(stockQuantity) === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Out of Stock</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This product is currently out of stock. Consider restocking soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stockQuantity}</div>
                <div className="text-sm text-gray-500">New Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{minStockAlert}</div>
                <div className="text-sm text-gray-500">New Min Alert</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getStockStatusColor()}`}>
                  {getStockStatusText()}
                </div>
                <div className="text-sm text-gray-500">New Status</div>
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
            Cancel
          </button>
          <button
            onClick={handleStockUpdate}
            disabled={loading || !stockQuantity || isNaN(Number(stockQuantity))}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>Update Stock</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StockManagementModal
