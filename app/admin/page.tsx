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
  AlertCircle,
  Heart,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  categories: number
  products: number
  orders: number
  revenue: number
  customers: number
  totalWishlistItems: number
  totalCartItems: number
  activeCarts: number
}

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
}


export default function AdminDashboard() {
  console.log('🏠 Admin Dashboard component rendered')
  
  const [stats, setStats] = useState<DashboardStats>({
    categories: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0,
    totalWishlistItems: 0,
    totalCartItems: 0,
    activeCarts: 0
  })
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching dashboard stats...')
      setIsLoading(true)
      setError(null)
      
      // Get the JWT token using the proper utility function
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/dashboard/stats', { headers })
      
      console.log('📊 Stats response status:', statsResponse.status)
      
      if (!statsResponse.ok) throw new Error('Failed to fetch stats')
      
      const statsData = await statsResponse.json()
      
      console.log('📊 Stats data received:', statsData)
      
      setStats({
        categories: statsData.categories || 0,
        products: statsData.products || 0,
        orders: statsData.orders || 0,
        revenue: statsData.revenue || 0,
        customers: statsData.customers || 0,
        totalWishlistItems: statsData.totalWishlistItems || 0,
        totalCartItems: statsData.totalCartItems || 0,
        activeCarts: statsData.activeCarts || 0
      })
      
      console.log('✅ Dashboard data loaded successfully')
    } catch (error) {
      console.error('❌ Error fetching stats:', error)
      setError('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTopProducts = async () => {
    try {
      console.log('📈 Fetching top products...')
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch('/api/admin/dashboard/analytics', { headers })
      
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      const data = await response.json()
      
      if (data.success && data.data.topProducts) {
        setTopProducts(data.data.topProducts)
        console.log('✅ Top products loaded:', data.data.topProducts)
      }
    } catch (error) {
      console.error('❌ Error fetching top products:', error)
      // Don't set error state for top products, just log it
    }
  }

  useEffect(() => {
    fetchStats()
    fetchTopProducts()
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
    },
    {
      title: 'Customers',
      value: stats.customers,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/customers'
    },
    {
      title: 'Wishlist Items',
      value: stats.totalWishlistItems,
      icon: Heart,
      color: 'bg-pink-500',
      link: '/admin/customers'
    },
    {
      title: 'Active Carts',
      value: stats.activeCarts,
      icon: ShoppingBag,
      color: 'bg-orange-500',
      link: '/admin/customers'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>

      {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats.orders > 0 ? (
              // Placeholder for recent orders - you can add real order data here later
              [1, 2, 3].map((index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Order #{1000 + index}</p>
                    <p className="text-xs text-gray-500">Customer {index} - RWF {(50000 + index * 10000).toLocaleString()}</p>
                  </div>
                  <span className="text-xs text-gray-400">Today</span>
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
                RWF {stats.revenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-lg font-bold text-blue-600">
                {stats.orders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Order Value</span>
              <span className="text-lg font-bold text-purple-600">
                RWF {stats.orders > 0 ? Math.round(stats.revenue / stats.orders).toLocaleString() : '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Carts</span>
              <span className="text-lg font-bold text-orange-600">
                {stats.activeCarts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Wishlist Items</span>
              <span className="text-lg font-bold text-pink-600">
                {stats.totalWishlistItems}
              </span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => {
                const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100']
                const textColors = ['text-blue-600', 'text-green-600', 'text-yellow-600', 'text-purple-600', 'text-pink-600']
                return (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 ${colors[index % colors.length]} rounded flex items-center justify-center`}>
                        <Package className={`w-3 h-3 ${textColors[index % textColors.length]}`} />
                      </div>
                      <span className="text-sm text-gray-900 truncate max-w-[200px]" title={product.name}>
                        {product.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-600">{product.sales} sales</span>
                      <div className="text-xs text-gray-500">RWF {product.revenue.toLocaleString()}</div>
                    </div>
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
              <span className="text-sm text-gray-600">{stats.products}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-sm text-gray-600">{stats.orders}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}