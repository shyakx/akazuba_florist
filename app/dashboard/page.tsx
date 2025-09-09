'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/RealAuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  LogOut,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  Star,
  ArrowRight,
  Edit
} from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { ordersAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  createdAt: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
}

const DashboardPage = () => {
  const { user, isAuthenticated, isInitialized, logout } = useAuth()
  const { state: cartState } = useCart()
  const { items: wishlistItems } = useWishlist()
  const router = useRouter()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    // Wait for authentication to be initialized before checking auth status
    if (!isInitialized) {
      return
    }

    if (!isAuthenticated) {
      router.push('/unified-login')
      return
    }

    const fetchRecentOrders = async () => {
      try {
        setLoading(true)
        const response = await ordersAPI.getUserOrders()
        
        if (response.success && response.data && Array.isArray(response.data)) {
          const orders: Order[] = response.data.slice(0, 3).map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status.toLowerCase(),
            total: order.totalAmount,
            createdAt: order.createdAt,
            items: order.orderItems?.map((item: any) => ({
              id: item.id,
              name: item.productName,
              quantity: item.quantity,
              price: item.unitPrice
            })) || []
          }))
          setRecentOrders(orders)
      }
    } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load recent orders')
    } finally {
        setLoading(false)
      }
    }

    fetchRecentOrders()
  }, [isAuthenticated, isInitialized, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
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

  if (!isAuthenticated) {
    return null
  }

  // Show loading while authentication is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 py-20">
        <div className="container-responsive">
          <div className="container-wide">
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-pink-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Welcome back, {user?.firstName}!
                </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Manage your account, track orders, and explore our beautiful collection.
                </p>
              </div>
            </div>
          </div>
        </div>

      <div className="container-responsive py-8">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
          <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                {/* User Info */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-pink-600" />
                    </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-gray-600">{user?.email}</p>
                  </div>

                {/* Quick Actions */}
                <div className="space-y-2 mb-6">

                  
                  <Link
                    href="/wishlist"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-pink-600" />
                    <span className="text-gray-700">Wishlist</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                  
                  <Link
                    href="/cart"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Shopping Cart</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                  
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Account Settings</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                  </div>
                
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
            </div>
          </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </Link>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                    </div>
                  </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                </div>

                  <div className="space-y-4">
                    {user?.phone && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600" />
                      </div>
                            <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium text-gray-900">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                      </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                  
              </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading orders...</p>
                </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                    <Link
                      href="/products"
                      className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Start Shopping
                    </Link>
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                            <h4 className="font-medium text-gray-900">{order.orderNumber}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              RWF {order.total.toLocaleString()}
                            </p>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          </div>
                          
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-6 h-6 text-blue-600" />
              </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {recentOrders.length}
                  </h3>
                  <p className="text-gray-600">Total Orders</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {cartState.items.length}
                  </h3>
                  <p className="text-gray-600">Cart Items</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {wishlistItems.length}
                  </h3>
                  <p className="text-gray-600">Wishlist Items</p>
                    </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">4.8</h3>
                  <p className="text-gray-600">Average Rating</p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>

      <Footer />
    </div>
  )
}

export default DashboardPage 