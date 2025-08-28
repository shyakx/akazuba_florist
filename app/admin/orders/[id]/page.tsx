'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/RealAuthContext'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Eye,
  Download,
  Calendar,
  DollarSign,
  Truck,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Edit,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'
import { adminAPI, AdminOrder } from '@/lib/adminApi'
import toast from 'react-hot-toast'

const OrderDetailsPage = () => {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<AdminOrder>>({})

  const orderId = params.id as string

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    } else if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [isAuthenticated, user, isLoading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN' && orderId) {
      fetchOrderDetails()
    }
  }, [isAuthenticated, user, orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      
      // Try to fetch from backend first
      try {
        const orderData = await adminAPI.getOrder(orderId)
        setOrder(orderData)
        setEditData(orderData)
      } catch (backendError) {
        console.error('Backend connection failed, using fallback data:', backendError)
        
        // Fallback data when backend is unavailable
        const fallbackOrder: AdminOrder = {
          id: orderId,
          orderNumber: `ORD-${orderId.slice(-3).toUpperCase()}`,
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
          trackingNumber: 'TRK123456789',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Customer requested delivery in the afternoon',
          adminNotes: 'Order confirmed and ready for processing',
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
        }
        
        setOrder(fallbackOrder)
        setEditData(fallbackOrder)
        toast('Backend not available, showing demo data')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return
    
    try {
      setUpdating(true)
      
      // Try to update on backend first
      try {
        await adminAPI.updateOrderStatus(order.id, newStatus)
        toast.success('Order status updated successfully')
      } catch (backendError) {
        console.error('Backend update failed, updating local state:', backendError)
        setOrder(prev => prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : null)
        toast.success('Order status updated (offline mode)')
      }
    } catch (error: any) {
      console.error('Error updating order status:', error)
      toast.error(error.message || 'Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const handlePaymentStatusUpdate = async (newPaymentStatus: string) => {
    if (!order) return
    
    try {
      setUpdating(true)
      
      // Try to update on backend first
      try {
        await adminAPI.updatePaymentStatus(order.id, newPaymentStatus)
        toast.success('Payment status updated successfully')
      } catch (backendError) {
        console.error('Backend update failed, updating local state:', backendError)
        setOrder(prev => prev ? { ...prev, paymentStatus: newPaymentStatus, updatedAt: new Date().toISOString() } : null)
        toast.success('Payment status updated (offline mode)')
      }
    } catch (error: any) {
      console.error('Error updating payment status:', error)
      toast.error(error.message || 'Failed to update payment status')
    } finally {
      setUpdating(false)
    }
  }

  const handleDownloadInvoice = async () => {
    if (!order) return
    
    try {
      toast.loading('Generating invoice...', { id: 'invoice-download' })
      
      const response = await adminAPI.downloadInvoice(order.id)
      
      // Determine file type and extension
      const isHTML = response.type === 'text/html' || response.type === 'text/html; charset=utf-8'
      const fileExtension = isHTML ? 'html' : 'pdf'
      const mimeType = isHTML ? 'text/html; charset=utf-8' : 'application/pdf'
      
      const blob = new Blob([response], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${order.orderNumber}.${fileExtension}`
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

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/orders"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDownloadInvoice}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
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
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusUpdate(e.target.value)}
                    disabled={updating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-500">{item.color} {item.type}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.unitPrice)}</p>
                      <p className="text-sm text-gray-500">Total: {formatPrice(item.totalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Information & Summary */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-500">Customer</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900">{order.customerEmail}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900">{order.customerPhone}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{order.customerAddress}</p>
                    <p className="text-sm text-gray-500">{order.customerCity}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-gray-900">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking:</span>
                    <span className="font-medium">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Notes */}
            {(order.notes || order.adminNotes) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
                <div className="space-y-3">
                  {order.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Customer Notes:</p>
                      <p className="text-sm text-gray-600">{order.notes}</p>
                    </div>
                  )}
                  {order.adminNotes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Admin Notes:</p>
                      <p className="text-sm text-gray-600">{order.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsPage
