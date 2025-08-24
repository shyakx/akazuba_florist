'use client'

import React, { useState } from 'react'
import { realFlowerProducts } from '@/data/real-flowers'

const TestOrdersSimplePage = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: 'Kigali',
    paymentMethod: 'BK',
    notes: ''
  })

  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [orderResult, setOrderResult] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addToOrder = (product: any) => {
    const existingItem = selectedItems.find(item => item.productId === product.id)
    if (existingItem) {
      setSelectedItems(prev => prev.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setSelectedItems(prev => [...prev, {
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
        color: product.color,
        type: product.type,
        sku: product.sku
      }])
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(prev => prev.filter(item => item.productId !== productId))
      return
    }
    setSelectedItems(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, quantity }
        : item
    ))
  }

  const calculateSubtotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal()
    const city = formData.customerCity.toLowerCase()
    
    if (city === 'kigali') return 0
    if (subtotal >= 50000) return 0
    if (subtotal >= 25000) return 0
    
    if (['butare', 'gisenyi', 'ruhengeri'].includes(city)) return 3000
    return 5000
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee()
  }

  const generateOrderNumber = () => {
    // Simple order number generation for testing
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `AKZ-${String(random).padStart(3, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        customerCity: formData.customerCity,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        items: selectedItems
      }

      const response = await fetch('http://localhost:5000/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()
      setOrderResult(result)

      if (result.success) {
        alert(`Order created successfully! Order Number: ${result.data.order.orderNumber}`)
        // Reset form
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerAddress: '',
          customerCity: 'Kigali',
          paymentMethod: 'BK',
          notes: ''
        })
        setSelectedItems([])
      } else {
        alert(`Error: ${result.message}`)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Real Orders Test</h1>
          <p className="text-gray-600">Testing order functionality with real backend and database persistence</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Products Selection */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Products</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {realFlowerProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.color} {product.type}</p>
                    <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                  </div>
                  <button
                    onClick={() => addToOrder(product)}
                    className="bg-pink-600 text-white px-3 py-1 rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Form */}
          <div className="space-y-6">
            {/* Selected Items */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              {selectedItems.length === 0 ? (
                <p className="text-gray-500">No items selected</p>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.color} {item.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                        <span className="font-semibold text-gray-900 min-w-[80px] text-right">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="font-semibold">{formatPrice(calculateDeliveryFee())}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    required
                    value={formData.customerAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    value={formData.customerCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerCity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="Kigali">Kigali</option>
                    <option value="Butare">Butare</option>
                    <option value="Gisenyi">Gisenyi</option>
                    <option value="Ruhengeri">Ruhengeri</option>
                    <option value="Other">Other Province</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="BK">BK Transfer</option>
                    <option value="MOMO">Mobile Money</option>
                    <option value="CASH">Cash on Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={2}
                    placeholder="Special instructions, delivery preferences..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={selectedItems.length === 0 || isSubmitting}
                  className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Creating Order...' : 'Create Real Order'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Order Result */}
        {orderResult && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Result</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium">✅ {orderResult.message}</p>
              <p className="text-green-700 text-sm mt-1">Order Number: {orderResult.data.order.orderNumber}</p>
            </div>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(orderResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Features Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">✅ Working Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Order Management</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Product selection with images</li>
                <li>• Quantity management</li>
                <li>• Real-time price calculation</li>
                <li>• AKZ-001 format order numbers</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Delivery System</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Smart delivery fee calculation</li>
                <li>• Free delivery for Kigali</li>
                <li>• Free delivery for large orders</li>
                <li>• City-based pricing</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Customer Information</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete customer details</li>
                <li>• Address and city selection</li>
                <li>• Payment method selection</li>
                <li>• Order notes</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Payment Options</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• BK Transfer</li>
                <li>• Mobile Money</li>
                <li>• Cash on Delivery</li>
                <li>• Payment proof upload ready</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestOrdersSimplePage 