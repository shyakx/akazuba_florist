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
  ShoppingBag,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useAdmin } from '@/contexts/AdminContext'
import { showBackendOfflineNotification, showBackendOnlineNotification } from '@/lib/adminNotifications'

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
  
  const { 
    stats, 
    topProducts, 
    isLoading, 
    errors, 
    refreshAll, 
    hasUnsavedChanges,
    markChangesSaved 
  } = useAdmin()

  
  const statCards = [
    {
      title: 'Products',
      value: stats?.products ?? '...',
      icon: Package,
      color: 'bg-green-500',
      link: '/admin/products'
    },
    {
      title: 'Orders',
      value: stats?.orders ?? '...',
      icon: ShoppingCart,
      color: 'bg-yellow-500',
      link: '/admin/orders'
    },
    {
      title: 'Revenue',
      value: `RWF ${(stats?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      link: '/admin/orders'
    },
    {
      title: 'Customers',
      value: stats?.customers ?? '...',
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/customers'
    },
    {
      title: 'Wishlist Items',
      value: stats?.totalWishlistItems ?? '...',
      icon: Heart,
      color: 'bg-pink-500',
      link: '/admin/customers'
    },
    {
      title: 'Active Carts',
      value: stats?.activeCarts ?? '...',
      icon: ShoppingBag,
      color: 'bg-orange-500',
      link: '/admin/customers'
    }
  ]
  
  
  // Manual refresh function
  const handleManualRefresh = async () => {
    try {
      await refreshAll()
    } catch (error) {
      console.error('❌ Manual refresh failed:', error)
    }
  }
  
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')



  const checkBackendStatus = async () => {
    try {
      // Try a more reliable endpoint that we know exists
      const backendUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api/v1/admin/products'
        : 'https://akazuba-backend-api.onrender.com/api/v1/admin/products'
      
      const response = await fetch(backendUrl, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // If we get any response (even 401/403), the backend is online
      if (response.status < 500) {
        const wasOffline = backendStatus === 'offline'
        setBackendStatus('online')
        if (wasOffline) {
          showBackendOnlineNotification()
        }
      } else {
        const wasOnline = backendStatus === 'online'
        setBackendStatus('offline')
        if (wasOnline) {
          showBackendOfflineNotification()
        }
      }
    } catch (error) {
      const wasOnline = backendStatus === 'online'
      setBackendStatus('offline')
      if (wasOnline) {
        showBackendOfflineNotification()
      }
    }
  }

  useEffect(() => {
    checkBackendStatus()
  }, [])

  if (isLoading.stats || isLoading.topProducts) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  if (errors.stats) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <p className="mt-2 text-gray-600">{errors.stats}</p>
        <button onClick={refreshAll} className="btn btn-primary mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 text-orange-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Unsaved changes</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <button 
              onClick={markChangesSaved} 
              className="btn btn-primary bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Saved
            </button>
          )}
          <button onClick={refreshAll} className="btn btn-secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </div>
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
                RWF {(stats.revenue || 0).toLocaleString()}
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
                RWF {stats.orders > 0 ? Math.round((stats.revenue || 0) / stats.orders).toLocaleString() : '0'}
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
                  <div key={product.id || `product-${index}`} className="flex items-center justify-between">
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
                      <div className="text-xs text-gray-500">RWF {(product.revenue || 0).toLocaleString()}</div>
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
              <span className="text-sm text-gray-600">Backend Server</span>
              <span className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  backendStatus === 'online' ? 'bg-green-500' : 
                  backendStatus === 'offline' ? 'bg-red-500' : 
                  'bg-yellow-500'
                }`}></div>
                <span className={`text-sm ${
                  backendStatus === 'online' ? 'text-green-600' : 
                  backendStatus === 'offline' ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  {backendStatus === 'online' ? 'Online' : 
                   backendStatus === 'offline' ? 'Offline' : 
                   'Checking...'}
                </span>
              </span>
            </div>
            {backendStatus === 'offline' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-800">
                  ⚠️ Backend server is offline. Product deletions and other operations may not persist.
                </p>
              </div>
            )}
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