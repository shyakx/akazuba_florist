'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { getOrderPrimaryImage, getOrderProductNames, getOrderItemImage } from '@/lib/orderUtils'
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  Filter,
  Download,
  Calendar,
  User,
  MapPin,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  DollarSign,
  Package,
  Star,
  BarChart3,
  Trash2,
  ZoomIn
} from 'lucide-react'

// Import Order type from orderUtils
import type { Order } from '@/lib/orderUtils'

export default function OrdersPage() {
  const router = useRouter()
  const { orders, isLoading, refreshOrders } = useAdmin()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12) // Limit items per page for memory optimization
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus])

  // Handle ESC key for image modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showImageModal) {
        closeImageModal()
      }
    }

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showImageModal])

  // Delete order function
  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (confirm(`Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`)) {
      try {
        // Get the JWT token
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: 'DELETE',
          headers
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            alert(`Order ${orderNumber} deleted successfully!`)
            // Refresh the orders list
            await refreshOrders()
          } else {
            throw new Error(result.message || 'Failed to delete order')
          }
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to delete order')
        }
      } catch (error) {
        console.error('Error deleting order:', error)
        alert(`Failed to delete order: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  // Image zoom functions
  const handleImageZoom = (imageUrl: string) => {
    setZoomedImage(imageUrl)
    setShowImageModal(true)
  }

  const closeImageModal = () => {
    setShowImageModal(false)
    setZoomedImage(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  if (isLoading.orders) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    )
  }

    return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Management</h1>
            <p className="text-green-100 text-lg">Track and manage all customer orders efficiently</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{orders?.length || 0}</div>
                  <div className="text-sm text-green-100">Total Orders</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{orders?.filter(o => o.status === 'delivered').length || 0}</div>
                  <div className="text-sm text-green-100">Delivered</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">RWF {(orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0).toLocaleString()}</div>
                  <div className="text-sm text-green-100">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+15%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{orders?.filter(o => o.status === 'pending').length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+8%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{orders?.filter(o => o.status === 'processing').length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">RWF {(orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+28%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            className="btn btn-primary bg-green-600 hover:bg-green-700 shadow-lg"
            onClick={() => {
              // Export orders data as CSV
              const csvContent = [
                ['Order #', 'Customer', 'Email', 'Phone', 'Status', 'Payment Status', 'Total Amount', 'Created At'],
                ...(orders || []).map(order => [
                  order.orderNumber,
                  order.customerName,
                  order.customerEmail,
                  order.customerPhone,
                  order.status,
                  order.paymentStatus,
                  order.totalAmount,
                  new Date(order.createdAt).toLocaleDateString()
                ])
              ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              if (typeof window !== 'undefined') {
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
              }
            }}
          >
            <Download className="w-5 h-5 mr-2" />
            Export Orders
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              // Navigate to dashboard
              router.push('/admin')
            }}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Dashboard
          </button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Canceled</option>
            </select>
            <button 
              className="btn btn-secondary px-6 py-3"
              onClick={() => {
                {/* Advanced filters can be implemented here */}
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Order Header with Product Image */}
            <div className="h-32 bg-gray-100 flex items-center justify-center relative">
              {(() => {
                const primaryImage = getOrderPrimaryImage(order)
                return primaryImage
              })() ? (
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group relative" onClick={() => handleImageZoom(getOrderPrimaryImage(order) ?? '')}>
                  <img
                    src={getOrderPrimaryImage(order) ?? ''}
                    alt={getOrderProductNames(order)}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to shopping cart icon if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path></svg></div>'
                      }
                    }}
                  />
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ) : (
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
                  </div>

            {/* Order Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                  <p className="text-xs text-gray-400 mt-1 truncate" title={getOrderProductNames(order)}>
                    {getOrderProductNames(order)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">RWF {order.totalAmount?.toLocaleString() || '0'}</p>
                  <p className="text-sm text-gray-500">{order.itemsCount || order.items?.length || 0} items</p>
                  </div>
                  </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Customer</span>
                  <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                  </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-32">{order.customerEmail}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="text-sm font-medium text-gray-900">{order.deliveryAddress}</span>
                      </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                  </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowOrderModal(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                      onClick={async () => {
                        if (confirm('Mark this order as completed?')) {
                          try {
                            // Get the JWT token
                            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
                            const headers: Record<string, string> = {
                              'Content-Type': 'application/json',
                            }
                            
                            if (token) {
                              headers['Authorization'] = `Bearer ${token}`
                            }

                            const response = await fetch(`/api/admin/orders/${order.id}`, {
                              method: 'PUT',
                              headers,
                              body: JSON.stringify({
                                status: 'DELIVERED'
                              })
                            })
                            
                            if (response.ok) {
                              // Refresh orders from AdminContext
                              await refreshOrders()
                              alert('Order marked as completed!')
                            } else {
                              const errorData = await response.json()
                              throw new Error(errorData.error || 'Failed to update order')
                            }
                          } catch (error) {
                            console.error('Error updating order:', error)
                            alert(`Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`)
                          }
                        }
                      }}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={async () => {
                        const newStatus = prompt('Enter new delivery status (PENDING, PREPARING, OUT_FOR_DELIVERY, DELIVERED):', order.deliveryStatus?.toUpperCase() || 'PENDING')
                        if (newStatus && ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(newStatus.toUpperCase())) {
                          try {
                            // Get the JWT token
                            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
                            const headers: Record<string, string> = {
                                'Content-Type': 'application/json',
                            }
                            
                            if (token) {
                              headers['Authorization'] = `Bearer ${token}`
                            }

                            const response = await fetch(`/api/admin/orders/${order.id}/delivery`, {
                              method: 'PATCH',
                              headers,
                              body: JSON.stringify({
                                deliveryStatus: newStatus.toUpperCase()
                              })
                            })
                            
                            if (response.ok) {
                              // Refresh orders from AdminContext
                              await refreshOrders()
                              alert('Delivery status updated!')
                            } else {
                              const errorData = await response.json()
                              throw new Error(errorData.error || 'Failed to update delivery status')
                            }
                          } catch (error) {
                            console.error('Error updating delivery status:', error)
                            alert(`Failed to update delivery status: ${error instanceof Error ? error.message : 'Unknown error'}`)
                          }
                        } else if (newStatus) {
                          alert('Invalid status. Please use: PENDING, PREPARING, OUT_FOR_DELIVERY, or DELIVERED')
                        }
                      }}
                    >
                      <Truck className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-green-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {(orders || []).length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
              : 'No orders have been placed yet. Orders will appear here once customers start making purchases.'
            }
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Order Number</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-lg font-semibold text-gray-900">RWF {selectedOrder.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(selectedOrder.paymentStatus || 'pending').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedOrder.customerEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedOrder.customerPhone || selectedOrder.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Order Date</label>
                      <p className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.deliveryAddress && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
                    <p className="text-gray-900">{selectedOrder.deliveryAddress}</p>
                  </div>
                )}

                {/* Order Items */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: any, index: number) => {
                      const itemImage = getOrderItemImage(item)
                      return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            {itemImage ? (
                            <img 
                                src={itemImage} 
                                alt={item.name || item.product?.name} 
                              className="w-12 h-12 object-cover rounded-lg"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                            />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                          )}
                          <div>
                              <p className="font-medium text-gray-900">{item.name || item.product?.name || 'Unknown Product'}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">RWF {((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {showImageModal && zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={zoomedImage}
              alt="Zoomed product image"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
              Click outside or press ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  )
}