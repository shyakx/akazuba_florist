'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: string
  status: string
  paymentStatus: string
  deliveryAddress: string
  items: Array<{
    productName: string
    quantity: number
    price: number
  }>
  createdAt: string
  updatedAt: string
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
      try {
        setLoading(true)
      setError(null)

      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setOrder(data.data || data)
        } else {
        throw new Error('Failed to fetch order')
        }
      } catch (error) {
      console.error('Error fetching order:', error)
      setError('Failed to load order')
      } finally {
        setLoading(false)
      }
    }

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return

    try {
      setSaving(true)

      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        alert('Order status updated successfully!')
        setOrder(prev => prev ? { ...prev, status: newStatus } : null)
      } else {
        throw new Error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    } finally {
      setSaving(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'PROCESSING':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-yellow-600" />
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Error</h2>
          </div>
        <p className="mt-2 text-gray-600">{error || 'Order not found'}</p>
        <Link 
          href="/admin/orders"
          className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/orders"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-2">Order #{order.orderNumber}</p>
          </div>
          </div>
        </div>
        
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                disabled={saving}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              {saving && (
                <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
              )}
        </div>
      </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                </div>
            </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
              <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{order.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
              <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{order.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
                    </div>
                    <div className="text-right">
                    <p className="font-semibold text-gray-900">RWF {item.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">RWF {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Order Number</span>
                <span className="font-medium text-gray-900">{order.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-lg font-bold text-pink-600">RWF {parseInt(order.totalAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => updateOrderStatus('PROCESSING')}
                disabled={saving || order.status === 'PROCESSING'}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Mark as Processing</span>
              </button>
              <button
                onClick={() => updateOrderStatus('SHIPPED')}
                disabled={saving || order.status === 'SHIPPED'}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span>Mark as Shipped</span>
              </button>
              <button
                onClick={() => updateOrderStatus('DELIVERED')}
                disabled={saving || order.status === 'DELIVERED'}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark as Delivered</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
