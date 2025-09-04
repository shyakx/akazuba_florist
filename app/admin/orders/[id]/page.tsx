'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar } from 'lucide-react'

export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)

  // Mock order data - in real app, fetch from API
  const mockOrder = {
    id: orderId,
    orderNumber: 'ORD-001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+250 788 123 456'
    },
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'mobile_money',
    total: 25000,
    subtotal: 22000,
    shipping: 3000,
    createdAt: '2024-01-15T10:30:00Z',
    deliveredAt: '2024-01-17T14:20:00Z',
    shippingAddress: {
      street: 'KG 123 St',
      city: 'Kigali',
      district: 'Nyarugenge',
      country: 'Rwanda'
    },
    items: [
      {
        id: '1',
        product: {
          name: 'Red Roses Bouquet',
          price: 15000,
          image: '/api/placeholder/100/100'
        },
        quantity: 1,
        total: 15000
      },
      {
        id: '2',
        product: {
          name: 'White Lilies',
          price: 7000,
          image: '/api/placeholder/100/100'
        },
        quantity: 1,
        total: 7000
      }
    ]
  }

  useEffect(() => {
    // Simulate loading order data
    const loadOrder = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/admin/orders/${orderId}`)
        // const orderData = await response.json()
        
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        setOrder(mockOrder)
      } catch (error) {
        console.error('Error loading order:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="admin-content">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Loading order...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="admin-content">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Order not found</h3>
            <p className="text-gray-600">The order you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order #{order.orderNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-gray-900">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="text-gray-900">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
            </div>
            
            <div className="text-gray-900">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.district}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {order.items.map((item: any) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">RWF {item.product.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total: RWF {item.total.toLocaleString()}</p>
                    </div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">RWF {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">RWF {order.shipping.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">RWF {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900 capitalize">{order.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Order Timeline</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Order Placed</p>
                <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              {order.deliveredAt && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-sm text-gray-900">{new Date(order.deliveredAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
