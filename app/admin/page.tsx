'use client'

import React, { useState, useEffect } from 'react'
import { 
  Package, 
  ShoppingCart, 
  Tag, 
  DollarSign, 
  Users, 
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  categories: number
  products: number
  orders: number
  revenue: number
  customers: number
}

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  topProducts: Array<{ name: string; sales: number }>
  recentOrders: Array<{ id: string; orderNumber: string; customerName: string; total: number; status: string; createdAt: string }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    categories: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0
  })
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch both dashboard stats and analytics data
      const [statsResponse, analyticsResponse] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/analytics/public')
      ])
      
      if (!statsResponse.ok) throw new Error('Failed to fetch stats')
      if (!analyticsResponse.ok) throw new Error('Failed to fetch analytics')
      
      const statsData = await statsResponse.json()
      const analyticsData = await analyticsResponse.json()
      
      setStats({
        categories: statsData.categories || 0,
        products: statsData.products || 0,
        orders: statsData.orders || 0,
        revenue: statsData.revenue || 0,
        customers: statsData.customers || 0
      })
      
      if (analyticsData.success) {
        setAnalytics(analyticsData)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <p className="mt-2 text-gray-600">{error}</p>
        <button onClick={fetchStats} className="btn btn-primary mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      color: 'bg-green-500',
      link: '/admin/products'
    },
    {
      title: 'Orders',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-yellow-500',
      link: '/admin/orders'
    },
    {
      title: 'Revenue',
      value: `RWF ${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      link: '/admin/orders'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <button onClick={fetchStats} className="btn btn-secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.link} className="block">
            <div className="stat-card h-32">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`stat-icon ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/admin/products/new" className="btn btn-primary text-center">
              <Package className="w-5 h-5 mr-2" />
              Add Product
            </Link>
            <Link href="/admin/categories/new" className="btn btn-primary text-center">
              <Tag className="w-5 h-5 mr-2" />
              Add Category
            </Link>
            <Link href="/admin/orders" className="btn btn-primary text-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Orders
            </Link>
            <Link href="/admin/analytics" className="btn btn-primary text-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              View Analytics
            </Link>
          </div>
        </div>

      {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {analytics?.recentOrders?.length > 0 ? (
              analytics.recentOrders.slice(0, 3).map((order, index) => (
                <div key={order.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Order {order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customerName} - RWF {order.total.toLocaleString()}</p>
                  </div>
                  <span className="text-xs text-gray-400">{order.createdAt}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No recent orders</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <span className="text-lg font-bold text-green-600">
                RWF {analytics?.totalRevenue?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-lg font-bold text-blue-600">
                {analytics?.totalOrders || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Customers</span>
              <span className="text-lg font-bold text-purple-600">
                {analytics?.totalCustomers || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {analytics?.topProducts?.length > 0 ? (
              analytics.topProducts.slice(0, 3).map((product, index) => {
                const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100']
                const textColors = ['text-blue-600', 'text-green-600', 'text-yellow-600']
  return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 ${colors[index]} rounded flex items-center justify-center`}>
                        <Package className={`w-3 h-3 ${textColors[index]}`} />
                      </div>
                      <span className="text-sm text-gray-900">{product.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{product.sales} sales</span>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No sales data available</p>
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Status</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Online</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Products</span>
              <span className="text-sm text-gray-600">{analytics?.totalProducts || '0'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-sm text-gray-600">{analytics?.totalOrders || '0'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}