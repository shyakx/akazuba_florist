'use client'

import React, { useState, useEffect } from 'react'
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Calendar, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }>
  total: number
  createdAt: string
  estimatedDelivery?: string
  shippingAddress: string
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        status: 'delivered',
        items: [
          {
            id: '1',
            name: 'Red Rose Bouquet',
            quantity: 1,
            price: 25000,
            image: '/placeholder-flower.jpg'
          }
        ],
        total: 25000,
        createdAt: '2024-01-15T10:30:00Z',
        estimatedDelivery: '2024-01-17T14:00:00Z',
        shippingAddress: 'Kigali, Rwanda'
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        status: 'shipped',
        items: [
          {
            id: '2',
            name: 'Mixed Tulip Arrangement',
            quantity: 2,
            price: 18000,
            image: '/placeholder-flower.jpg'
          }
        ],
        total: 36000,
        createdAt: '2024-01-16T09:15:00Z',
        estimatedDelivery: '2024-01-18T16:00:00Z',
        shippingAddress: 'Kigali, Rwanda'
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        status: 'processing',
        items: [
          {
            id: '3',
            name: 'Wedding Flower Package',
            quantity: 1,
            price: 75000,
            image: '/placeholder-flower.jpg'
          }
        ],
        total: 75000,
        createdAt: '2024-01-17T14:20:00Z',
        shippingAddress: 'Kigali, Rwanda'
      }
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Error Loading Orders</h2>
              <p className="mt-2 text-gray-600">{error}</p>
              <Link
                href="/"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              My Orders
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your flower orders and delivery status. Every order tells a story of beauty and care.
            </p>
          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-pink-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Orders Yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start shopping to see your beautiful flower orders here. We can&apos;t wait to create something special for you.
              </p>
              <Link
                href="/"
                className="btn-primary inline-flex items-center"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Order Header */}
                  <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{order.orderNumber}</h3>
                          <p className="text-gray-500">
                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {new Intl.NumberFormat('en-RW', {
                            style: 'currency',
                            currency: 'RWF',
                            minimumFractionDigits: 0,
                          }).format(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-8 py-6">
                    <div className="space-y-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center">
                            <Package className="h-10 w-10 text-pink-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              {new Intl.NumberFormat('en-RW', {
                                style: 'currency',
                                currency: 'RWF',
                                minimumFractionDigits: 0,
                              }).format(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Shipping Address</p>
                          <p className="text-gray-600">{order.shippingAddress}</p>
                        </div>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Estimated Delivery</p>
                            <p className="text-gray-600">
                              {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Tag className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Total Amount</p>
                          <p className="text-gray-600">
                            {new Intl.NumberFormat('en-RW', {
                              style: 'currency',
                              currency: 'RWF',
                              minimumFractionDigits: 0,
                            }).format(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back to Shopping */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="btn-outline inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default OrdersPage 
