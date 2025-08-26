'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/RealAuthContext'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import { 
  ShoppingCart, 
  Heart, 
  Package, 
  User, 
  Settings, 
  LogOut,
  Plus,
  Minus,
  Trash2,
  Eye,
  Star,
  Calendar,
  MapPin,
  CreditCard,
  Phone,
  Mail
} from 'lucide-react'
import { customerAPI } from '@/lib/customerApi'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: string
  productId: string
  createdAt: string
  product: {
    id: string
    name: string
    price: string | number
    images?: string[]
    image?: string
    category?: {
      name: string
    }
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  orderItems: Array<{
    productName: string
    quantity: number
    unitPrice: number
  }>
}

const CustomerDashboard = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { state: cartState, updateQuantity, removeFromCart } = useCart()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isRemovingWishlistItem, setIsRemovingWishlistItem] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    console.log('🔍 Dashboard auth check:', { isLoading, isAuthenticated, user })
    
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 User not authenticated, redirecting to login')
      router.push('/login')
    } else if (isAuthenticated && user) {
      console.log('✅ User authenticated in dashboard:', user.role)
    }
  }, [isAuthenticated, isLoading, router, user])

  // Load customer data
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCustomerData()
    }
  }, [isAuthenticated, user])

  const loadCustomerData = async () => {
    setIsLoadingData(true)
    try {
      // Load wishlist and orders data from API
      const [wishlistResponse, ordersResponse] = await Promise.all([
        customerAPI.getWishlist(),
        customerAPI.getOrders()
      ])

      if (wishlistResponse.success && wishlistResponse.data) {
        const wishlistData = wishlistResponse.data as WishlistItem[]
        setWishlistItems(wishlistData || [])
      }

      if (ordersResponse.success && ordersResponse.data) {
        const ordersData = ordersResponse.data as Order[]
        setOrders(ordersData || [])
      }
    } catch (error) {
      console.error('Error loading customer data:', error)
      // Fallback to mock data if API fails
      setWishlistItems([
        {
          id: '1',
          productId: 'prod-3',
          createdAt: '2025-01-20',
          product: {
            id: 'prod-3',
            name: 'Pink Peony Dream',
            price: 52000,
            images: ['/images/flowers/pink/pink-2.jpg']
          }
        },
        {
          id: '2',
          productId: 'prod-4',
          createdAt: '2025-01-18',
          product: {
            id: 'prod-4',
            name: 'Mixed Bouquet Special',
            price: 78000,
            images: ['/images/flowers/mixed/mixed-1.jpg']
          }
        }
      ])

      setOrders([
        {
          id: '1',
          orderNumber: 'AKZ-001',
          status: 'DELIVERED',
          totalAmount: 91000,
          createdAt: '2025-01-15',
          orderItems: [
            { productName: 'Red Rose Bouquet', quantity: 2, unitPrice: 45500 }
          ]
        },
        {
          id: '2',
          orderNumber: 'AKZ-002',
          status: 'PROCESSING',
          totalAmount: 52000,
          createdAt: '2025-01-10',
          orderItems: [
            { productName: 'Pink Peony Dream', quantity: 1, unitPrice: 52000 }
          ]
        }
      ])
    } finally {
      setIsLoadingData(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'text-green-600 bg-green-100'
      case 'PROCESSING':
        return 'text-blue-600 bg-blue-100'
      case 'SHIPPED':
        return 'text-purple-600 bg-purple-100'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const handleRemoveFromWishlist = async (itemId: string) => {
    setIsRemovingWishlistItem(itemId)
    try {
      const response = await customerAPI.removeFromWishlist(itemId)
      if (response.success) {
        // Remove item from local state
        setWishlistItems(prev => prev.filter(item => item.id !== itemId))
        toast.success('Item removed from wishlist')
      } else {
        console.error('Failed to remove item from wishlist:', response.message)
        toast.error('Failed to remove item from wishlist')
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error)
      toast.error('Failed to remove item from wishlist')
    } finally {
      setIsRemovingWishlistItem(null)
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Dashboard
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Welcome back, <span className="font-semibold text-pink-600">{user?.firstName || 'User'}</span>! 
                  Here's what's happening with your account.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group ${
                    activeTab === 'overview'
                      ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeTab === 'overview' ? 'bg-white/20' : 'bg-pink-100 group-hover:bg-pink-200'
                    }`}>
                      <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">Overview</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('cart')}
                  className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group ${
                    activeTab === 'cart'
                      ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeTab === 'cart' ? 'bg-white/20' : 'bg-pink-100 group-hover:bg-pink-200'
                    }`}>
                      <ShoppingCart className="h-4 w-4 text-pink-600" />
                    </div>
                    <span className="font-medium">My Cart ({cartState.itemCount})</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group ${
                    activeTab === 'wishlist'
                      ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeTab === 'wishlist' ? 'bg-white/20' : 'bg-pink-100 group-hover:bg-pink-200'
                    }`}>
                      <Heart className="h-4 w-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Wishlist ({wishlistItems.length})</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group ${
                    activeTab === 'orders'
                      ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeTab === 'orders' ? 'bg-white/20' : 'bg-pink-100 group-hover:bg-pink-200'
                    }`}>
                      <Package className="h-4 w-4 text-pink-600" />
                    </div>
                    <span className="font-medium">My Orders ({orders.length})</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group ${
                    activeTab === 'profile'
                      ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeTab === 'profile' ? 'bg-white/20' : 'bg-pink-100 group-hover:bg-pink-200'
                    }`}>
                      <Settings className="h-4 w-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Profile</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Enhanced Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <ShoppingCart className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Cart Items</p>
                        <p className="text-2xl font-bold text-gray-900">{cartState.itemCount}</p>
                        <p className="text-xs text-green-600 font-medium">Ready to checkout</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                        <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
                        <p className="text-xs text-pink-600 font-medium">Saved for later</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                        <p className="text-xs text-green-600 font-medium">All time</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Recent Orders */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-pink-600" />
                      Recent Orders
                    </h3>
                  </div>
                  <div className="p-6">
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No orders yet</p>
                        <p className="text-gray-400 text-sm mt-2">Start shopping to see your orders here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white">
                            <div>
                              <h4 className="font-semibold text-gray-900">{order.orderNumber}</h4>
                              <p className="text-sm text-gray-600">
                                {order.orderItems.length} items • {formatPrice(order.totalAmount)}
                              </p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Cart Tab */}
            {activeTab === 'cart' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-pink-600" />
                    Shopping Cart
                  </h3>
                </div>
                <div className="p-6">
                  {cartState.items.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
                      <p className="text-gray-400 text-sm mt-2">Add some beautiful flowers to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartState.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white">
                          <img 
                            src={item.product?.images?.[0] || '/placeholder-flower.jpg'} 
                            alt={item.product?.name || 'Product'}
                            className="w-16 h-16 object-cover rounded-xl shadow-sm"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.product?.name || 'Product'}</h4>
                            <p className="text-sm text-gray-500">{formatPrice(item.product?.price || 0)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice((item.product?.price || 0) * item.quantity)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                      
                      <div className="border-t border-gray-200 pt-6 mt-6">
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-pink-600">{formatPrice(cartState.total)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-pink-600" />
                    Wishlist
                  </h3>
                </div>
                <div className="p-6">
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">Your wishlist is empty</p>
                      <p className="text-gray-400 text-sm mt-2">Save your favorite flowers for later</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-2xl p-4 relative hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white">
                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            disabled={isRemovingWishlistItem === item.id}
                            className="absolute top-3 right-3 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-200 z-10 hover:scale-110"
                          >
                            {isRemovingWishlistItem === item.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-600" />
                            )}
                          </button>
                          
                          <img 
                            src={item.product?.images?.[0] || item.product?.image || '/images/placeholder-flower.jpg'} 
                            alt={item.product?.name || 'Product'}
                            className="w-full h-48 object-cover rounded-xl mb-4 shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-flower.jpg'
                            }}
                          />
                          <h4 className="font-semibold text-gray-900 mb-2">{item.product?.name || 'Product Name Not Available'}</h4>
                          <p className="text-lg font-bold text-pink-600 mb-2">
                            {item.product?.price ? formatPrice(Number(item.product.price)) : 'Price Not Available'}
                          </p>
                          <p className="text-sm text-gray-500">Added {formatDate(item.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-pink-600" />
                    My Orders
                  </h3>
                </div>
                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">No orders yet</p>
                      <p className="text-gray-400 text-sm mt-2">Your order history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900">{order.orderNumber}</h4>
                              <p className="text-sm text-gray-600">Placed {formatDate(order.createdAt)}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="space-y-3 mb-4 bg-white p-4 rounded-xl border border-gray-100">
                            {order.orderItems.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="font-medium">{item.productName} x {item.quantity}</span>
                                <span className="font-semibold">{formatPrice(item.unitPrice * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                              <span className="font-semibold text-gray-900">Total</span>
                              <span className="text-xl font-bold text-pink-600">{formatPrice(order.totalAmount)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-pink-600" />
                    Profile Information
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <p className="text-lg font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <p className="text-lg font-semibold text-gray-900">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(user?.createdAt || new Date().toISOString())}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard 