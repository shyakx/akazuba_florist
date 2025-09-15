'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Eye, 
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  RefreshCw
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ]

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/admin/orders', { headers })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.data || data || [])
      } else {
        throw new Error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId)

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
        fetchOrders() // Refresh the list
          } else {
        throw new Error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'PROCESSING':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'SHIPPED':
        return <Truck className="w-4 h-4 text-yellow-600" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <p className="mt-2 text-gray-600">{error}</p>
        <button 
          onClick={fetchOrders} 
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-2">View and manage customer orders</p>
        </div>
          <button 
          onClick={fetchOrders}
          className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
          </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
              placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
          </div>
            <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Customer</p>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                        <p className="text-sm text-gray-600">{order.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-lg font-bold text-pink-600">RWF {parseInt(order.totalAmount).toLocaleString()}</p>
                      </div>
                <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                      <div>
                        <p className="text-sm text-gray-600">Delivery Address</p>
                        <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                  </div>
                  </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Order Items:</p>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-900">{item.productName} x {item.quantity}</span>
                            <span className="text-gray-600">RWF {item.price.toLocaleString()}</span>
                  </div>
                        ))}
                      </div>
                </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>

                    {/* Status Update */}
                    <div className="flex items-center space-x-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      {updatingStatus === order.id && (
                        <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No orders have been placed yet'
            }
          </p>
        </div>
      )}
      </div>

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
                  <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'PENDING').length}
                </p>
                  </div>
                  </div>
                </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Truck className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'PROCESSING').length}
                </p>
                    </div>
                  </div>
                </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  RWF {orders
                    .filter(o => o.status === 'DELIVERED')
                    .reduce((sum, o) => sum + parseInt(o.totalAmount), 0)
                    .toLocaleString()}
                </p>
        </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}