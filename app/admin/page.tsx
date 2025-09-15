'use client'

import React, { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Users, 
  Plus,
  Eye,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  orders: number
  products: number
  revenue: number
  customers: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    orders: 0,
    products: 0,
    revenue: 0,
    customers: 0
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats', { headers })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.data || statsData)
      }

      // Fetch recent orders
      const ordersResponse = await fetch('/api/admin/orders?limit=5', { headers })
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setOrders(ordersData.data || ordersData || [])
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Products',
      value: stats.products,
      icon: Package,
      color: 'bg-green-500',
      link: '/admin/products'
    },
    {
      title: 'Total Revenue',
      value: `RWF ${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Customers',
      value: stats.customers,
      icon: Users,
      color: 'bg-orange-500',
      link: '/admin/customers'
    }
  ]
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'PROCESSING':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'SHIPPED':
        return <TrendingUp className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <p className="mt-2 text-gray-600">{error}</p>
        <button 
          onClick={fetchDashboardData} 
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
            <p className="text-pink-100 mt-2 text-lg">Manage your Akazuba Florist store</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Store is running</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={index}
              href={stat.link}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Plus className="w-6 h-6" />
              <div>
                <h3 className="font-medium">Add New Product</h3>
                <p className="text-sm opacity-90">Create a new product listing</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/products"
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6" />
              <div>
                <h3 className="font-medium">Manage Products</h3>
                <p className="text-sm opacity-90">View and edit products</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6" />
              <div>
                <h3 className="font-medium">View Orders</h3>
                <p className="text-sm opacity-90">Check recent orders</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/settings"
            className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6" />
              <div>
                <h3 className="font-medium">Settings</h3>
                <p className="text-sm opacity-90">Configure store settings</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link 
              href="/admin/orders"
            className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <Eye className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {orders && orders.length > 0 ? (
            orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-white">
                    {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">RWF {parseInt(order.totalAmount).toLocaleString()}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No recent orders</p>
              </div>
            )}
          </div>
      </div>
    </div>
  )
}