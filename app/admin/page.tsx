'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/RealAuthContext'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Plus, 
  Eye, 
  AlertTriangle,
  LogOut,
  User,
  Shield,
  Bell,
  Flower,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { adminAPI } from '@/lib/adminApi'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/AdminLayout'
import { productStorage } from '@/lib/productStorage'

interface DashboardStats {
  newOrders: number
  totalProducts: number
  totalCustomers: number
  lowStockProducts: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: number
  status: string
  createdAt: string
}

const AdminDashboard = () => {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    newOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockProducts: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dataFetched, setDataFetched] = useState(false)
  const [showLowStockAlert, setShowLowStockAlert] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    } else if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
        router.push('/')
    }
  }, [isAuthenticated, user, isLoading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN' && !dataFetched) {
      fetchDashboardData()
      setDataFetched(true)
    }
  }, [isAuthenticated, user?.role, dataFetched])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch real data from backend API
      const [statsResponse, ordersResponse, activityResponse] = await Promise.all([
        fetch('/api/admin/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/admin/dashboard/recent-orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/admin/dashboard/activity', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ])

      const [statsData, ordersData, activityData] = await Promise.all([
        statsResponse.json(),
        ordersResponse.json(),
        activityResponse.json()
      ])

      if (statsData.success) {
        setStats(statsData.data)
      } else {
        console.error('Failed to fetch stats:', statsData.message)
        toast.error('Failed to load dashboard statistics')
      }

      if (ordersData.success) {
        setRecentOrders(ordersData.data)
      } else {
        console.error('Failed to fetch orders:', ordersData.message)
        toast.error('Failed to load recent orders')
      }

      if (activityData.success) {
        setRecentActivity(activityData.data)
      } else {
        console.error('Failed to fetch activity:', activityData.message)
        toast.error('Failed to load recent activity')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
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

  if (isLoading || loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">New Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.newOrders}</p>
                  <p className="text-xs text-green-600 mt-1">+12% from yesterday</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                  <p className="text-xs text-blue-600 mt-1">Active inventory</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                  <p className="text-xs text-purple-600 mt-1">Registered users</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Low Stock Alert</p>
                  <p className="text-3xl font-bold text-red-600">{stats.lowStockProducts}</p>
                  <p className="text-xs text-red-600 mt-1">Needs attention</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
                      </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Product Categories</h2>
              <p className="text-sm text-gray-600 mt-1">Distribution of products by color category</p>
            </div>
            <div className="flex items-center space-x-2">
              <Flower className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">Real-time data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {productStorage.getCategories().map((category) => (
              <div key={category.id} className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{category.name.replace(' Flowers', '')}</h3>
                    <p className="text-2xl font-bold text-pink-600">{category.count}</p>
                    <p className="text-xs text-pink-600">products</p>
                  </div>
                  <div className="w-8 h-8 bg-pink-200 rounded-lg flex items-center justify-center">
                    <Flower className="h-4 w-4 text-pink-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your flower shop operations</p>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/products"
                className="group relative bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-900">Add Product</h3>
                    <p className="text-sm text-gray-600">Manage inventory</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
              </Link>
              
              <Link
                href="/admin/orders"
                className="group relative bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:from-green-100 hover:to-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-900">View Orders</h3>
                    <p className="text-sm text-gray-600">Track deliveries</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-4 w-4 text-green-600" />
                </div>
              </Link>
              
              <Link
                href="/admin/customers"
                className="group relative bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500 rounded-lg group-hover:bg-purple-600 transition-colors">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-900">Manage Customers</h3>
                    <p className="text-sm text-gray-600">Customer database</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
              </Link>

              <Link
                href="/admin/settings"
                className="group relative bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-500 rounded-lg group-hover:bg-orange-600 transition-colors">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-900">Settings</h3>
                    <p className="text-sm text-gray-600">Configure shop</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Settings className="h-4 w-4 text-orange-600" />
                </div>
              </Link>
            </div>
                  </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-600 mt-1">Latest updates and system activities</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">Last 24 hours</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  activity.status === 'success' ? 'bg-green-50' :
                  activity.status === 'warning' ? 'bg-yellow-50' :
                  activity.status === 'info' ? 'bg-blue-50' :
                  'bg-gray-50'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'info' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                  <p className="text-sm text-gray-600 mt-1">Latest customer orders and their status</p>
                </div>
                <Link
                  href="/admin/orders"
                  className="flex items-center space-x-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">View all orders</span>
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-pink-600">#{order.orderNumber.split('-')[1]}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{order.orderNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                            <p className="text-xs text-gray-500">Customer</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-sm font-bold text-gray-900">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-700">MOMO</span>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            order.status === 'PENDING' ? 'bg-yellow-400' :
                            order.status === 'CONFIRMED' ? 'bg-blue-400' :
                            order.status === 'SHIPPED' ? 'bg-purple-400' :
                            order.status === 'DELIVERED' ? 'bg-green-400' :
                            'bg-red-400'
                          }`}></div>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="flex items-center space-x-1 px-3 py-1 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </Link>
                          <button className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                            <Download className="h-3 w-3" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard 
