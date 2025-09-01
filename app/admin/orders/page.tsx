'use client'

import React, { useState } from 'react'
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Package,
  User,
  Phone,
  MapPin
} from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  orderDate: string
  deliveryDate?: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: '#1234',
      customerName: 'John Doe',
      customerPhone: '+250 789 123 456',
      customerAddress: 'Kigali, Rwanda',
      items: [
        { name: 'Red Rose Bouquet', quantity: 1, price: 45500 },
        { name: 'Mixed Flowers', quantity: 1, price: 35000 }
      ],
      totalAmount: 80500,
      status: 'pending',
      orderDate: '2025-01-09T10:00:00Z'
    },
    {
      id: '2',
      orderNumber: '#1233',
      customerName: 'Jane Smith',
      customerPhone: '+250 789 123 457',
      customerAddress: 'Kigali, Rwanda',
      items: [
        { name: 'Perfume Gift Set', quantity: 1, price: 180000 }
      ],
      totalAmount: 180000,
      status: 'processing',
      orderDate: '2025-01-09T09:00:00Z'
    },
    {
      id: '3',
      orderNumber: '#1232',
      customerName: 'Mike Johnson',
      customerPhone: '+250 789 123 458',
      customerAddress: 'Kigali, Rwanda',
      items: [
        { name: 'Pink Rose Bouquet', quantity: 1, price: 41600 }
      ],
      totalAmount: 41600,
      status: 'completed',
      orderDate: '2025-01-08T15:00:00Z',
      deliveryDate: '2025-01-09T10:00:00Z'
    }
  ])

  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Order Management</h1>
            <p className="text-green-100 text-sm sm:text-lg">
              Process and manage customer orders
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6" />
            <span className="text-lg font-semibold">{orders.length} Orders</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Processing</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'processing').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                RWF {orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.customerAddress}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Order Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        {item.quantity}x {item.name} - RWF {item.price.toLocaleString()}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-lg font-semibold text-gray-900">
                      Total: RWF {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  <p>Ordered: {new Date(order.orderDate).toLocaleDateString()}</p>
                  {order.deliveryDate && (
                    <p>Delivered: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 lg:ml-6">
                <button className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </button>
                
                {order.status === 'pending' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'processing')}
                    className="flex items-center justify-center px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Start Processing
                  </button>
                )}
                
                {order.status === 'processing' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </button>
                )}
                
                {order.status === 'pending' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 sm:py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {selectedStatus === 'all' 
              ? 'No orders available yet'
              : `No ${selectedStatus} orders found`
            }
          </p>
        </div>
      )}
    </div>
  )
}
