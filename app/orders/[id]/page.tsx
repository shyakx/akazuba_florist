'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/RealAuthContext'
import { CheckCircle, Clock, Truck, CreditCard, MapPin, Phone, Mail } from 'lucide-react'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  subtotal: number
  product: {
    id: string
    name: string
    image: string
  }
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  status: string
  paymentStatus: string
  deliveryStatus: string
  subtotal: number
  deliveryFee: number
  totalAmount: number
  paymentMethod: string
  notes?: string
  createdAt: string
  orderItems: OrderItem[]
}

const OrderDetailPage = () => {
  const params = useParams()
  const { isAuthenticated } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }

        const orderData = await response.json()
        setOrder(orderData)
      } catch (error) {
        console.error('Error fetching order:', error)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && params.id) {
      fetchOrder()
    }
  }, [params.id, isAuthenticated])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600 bg-green-100'
      case 'PROCESSING':
        return 'text-blue-600 bg-blue-100'
      case 'SHIPPED':
        return 'text-purple-600 bg-purple-100'
      case 'DELIVERED':
        return 'text-green-600 bg-green-100'
      case 'CANCELLED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5" />
      case 'PROCESSING':
      case 'SHIPPED':
        return <Truck className="w-5 h-5" />
      case 'PENDING':
        return <Clock className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-responsive">
          <div className="container-wide">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h1>
              <p className="text-gray-600">You need to be signed in to view order details.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-responsive">
          <div className="container-wide">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-responsive">
          <div className="container-wide">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
              <p className="text-gray-600">{error || 'The order you are looking for does not exist.'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                  <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="font-medium capitalize">{order.status.toLowerCase()}</span>
                </div>
              </div>

              {/* Order Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Order Status</div>
                  <div className="font-semibold capitalize">{order.status.toLowerCase()}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Payment Status</div>
                  <div className="font-semibold capitalize">{order.paymentStatus.toLowerCase()}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Delivery Status</div>
                  <div className="font-semibold capitalize">{order.deliveryStatus.toLowerCase()}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">RWF {item.subtotal.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">RWF {order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium">RWF {order.deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>RWF {order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Payment Info */}
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Delivery Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Name</div>
                      <div className="font-medium">{order.customerName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {order.customerEmail}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {order.customerPhone}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Address</div>
                      <div className="font-medium">{order.customerAddress}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">City</div>
                      <div className="font-medium">{order.customerCity}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Payment Method</div>
                      <div className="font-medium capitalize">{order.paymentMethod.toLowerCase()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Payment Status</div>
                      <div className={`font-medium capitalize ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus.toLowerCase()}
                      </div>
                    </div>
                    {order.notes && (
                      <div>
                        <div className="text-sm text-gray-600">Order Notes</div>
                        <div className="font-medium">{order.notes}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Payment Instructions</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>MoMo:</strong> Send to 0784 5861 10 (Umwali Diane)</p>
                    <p><strong>BK:</strong> Transfer to 100161182448 (Umwali Diane)</p>
                    <p className="text-xs mt-2">Please include your order number (#{order.orderNumber}) in the payment reference.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage 