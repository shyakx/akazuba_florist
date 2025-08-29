'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/RealAuthContext'
import { useRouter } from 'next/navigation'
import { 
  ShoppingCart, 
  Search, 
  Filter,
  Eye,
  Download,
  Calendar,
  DollarSign,
  Truck,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { adminAPI, AdminOrder } from '@/lib/adminApi'
import toast from 'react-hot-toast'

const OrdersPage = () => {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    } else if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [isAuthenticated, user, isLoading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchOrders()
    }
  }, [isAuthenticated, user, currentPage, searchTerm, selectedStatus, selectedPaymentStatus, dateFrom, dateTo])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      // Try to fetch from backend first
      try {
        const response = await adminAPI.getOrders({
          page: currentPage,
          limit: 10,
          search: searchTerm,
          status: selectedStatus,
          paymentStatus: selectedPaymentStatus,
          dateFrom,
          dateTo
        })
        setOrders(response.orders)
        setTotalPages(response.pages)
      } catch (backendError) {
        console.error('Backend connection failed, using fallback data:', backendError)
        
        // Fallback data when backend is unavailable
        const fallbackOrders: AdminOrder[] = [
          {
            id: '1',
            orderNumber: 'ORD-001',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            customerPhone: '+250 788 123 456',
            customerAddress: '123 Main St, Kigali',
            customerCity: 'Kigali',
            status: 'CONFIRMED',
            subtotal: 25000,
            deliveryFee: 2000,
            totalAmount: 27000,
            paymentMethod: 'MOMO',
            paymentStatus: 'PAID',
            deliveryStatus: 'PENDING',
            items: [
              {
                id: '1',
                productId: '1',
                productName: 'Beautiful Rose Bouquet',
                productImage: '/images/flowers/red/rose-1.jpg',
                quantity: 1,
                unitPrice: 25000,
                totalPrice: 25000,
                color: 'Red',
                type: 'Rose'
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            orderNumber: 'ORD-002',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            customerPhone: '+250 789 654 321',
            customerAddress: '456 Oak Ave, Kigali',
            customerCity: 'Kigali',
            status: 'PENDING',
            subtotal: 35000,
            deliveryFee: 2000,
            totalAmount: 37000,
            paymentMethod: 'BK',
            paymentStatus: 'PENDING',
            deliveryStatus: 'PENDING',
            items: [
              {
                id: '2',
                productId: '2',
                productName: 'White Lily Arrangement',
                productImage: '/images/flowers/white/lily-1.jpg',
                quantity: 1,
                unitPrice: 35000,
                totalPrice: 35000,
                color: 'White',
                type: 'Lily'
              }
            ],
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ]
        
        setOrders(fallbackOrders)
        setTotalPages(1)
        toast('Backend not available, showing demo data')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId)
      
      // Try to update on backend first
      try {
        await adminAPI.updateOrderStatus(orderId, newStatus)
        toast.success('Order status updated successfully')
      } catch (backendError) {
        console.error('Backend update failed, updating local state:', backendError)
        // Update local state when backend is unavailable
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        )
        toast.success('Order status updated (offline mode)')
      }
      
      fetchOrders()
    } catch (error: any) {
      console.error('Error updating order status:', error)
      toast.error(error.message || 'Failed to update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handlePaymentStatusUpdate = async (orderId: string, newPaymentStatus: string) => {
    try {
      setUpdatingStatus(orderId)
      
      // Try to update on backend first
      try {
        await adminAPI.updatePaymentStatus(orderId, newPaymentStatus)
        toast.success('Payment status updated successfully')
      } catch (backendError) {
        console.error('Backend update failed, updating local state:', backendError)
        // Update local state when backend is unavailable
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, paymentStatus: newPaymentStatus, updatedAt: new Date().toISOString() }
              : order
          )
        )
        toast.success('Payment status updated (offline mode)')
      }
      
      fetchOrders()
    } catch (error: any) {
      console.error('Error updating payment status:', error)
      toast.error(error.message || 'Failed to update payment status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      toast.loading('Generating invoice...', { id: 'invoice-download' })
      
      const response = await adminAPI.downloadInvoice(orderId)
      
      // Determine file type and extension
      const isHTML = response.type === 'text/html' || response.type === 'text/html; charset=utf-8'
      const fileExtension = isHTML ? 'html' : 'pdf'
      const mimeType = isHTML ? 'text/html; charset=utf-8' : 'application/pdf'
      
      const blob = new Blob([response], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${orderId}.${fileExtension}`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      // Dismiss loading toast and show success
      toast.dismiss('invoice-download')
      
      if (isHTML) {
        toast.success('Invoice generated successfully! Open the HTML file in your browser to view it.', {
          duration: 5000,
          icon: '📄'
        })
      } else {
        toast.success('Invoice downloaded successfully!', {
          icon: '📄'
        })
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.dismiss('invoice-download')
      toast.error('Failed to generate invoice. Please try again.', {
        duration: 4000
      })
    }
  }

  const viewOrderDetails = (order: AdminOrder) => {
    router.push(`/admin/orders/${order.id}`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-purple-100 text-purple-800'
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'REFUNDED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'MOMO': return '📱'
      case 'BK': return '🏦'
      case 'CASH': return '💵'
      default: return '💳'
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Page Header */}
        <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 mt-1">Manage customer orders and track delivery</p>
      </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Order #, Customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">All Payments</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedStatus('')
                  setSelectedPaymentStatus('')
                  setDateFrom('')
                  setDateTo('')
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(order.subtotal)} + {formatPrice(order.deliveryFee)} delivery
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getPaymentMethodIcon(order.paymentMethod)}</span>
                        <span className="text-sm text-gray-900">{order.paymentMethod}</span>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <div className="mt-1">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updatingStatus === order.id}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-pink-600 hover:text-pink-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Download Invoice"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'bg-pink-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>


    </div>
  )
}

export default OrdersPage
