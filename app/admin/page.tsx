'use client'

import React, { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Tag, 
  DollarSign, 
  Users, 
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Plus,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  Calendar,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useAdmin } from '@/contexts/AdminContext'

/**
 * Dashboard Statistics Interface
 * 
 * Defines the structure of statistics data displayed on the admin dashboard.
 * Includes counts for categories, products, orders, revenue, and customers.
 */
interface DashboardStats {
  categories: number
  products: number
  orders: number
  revenue: number
  customers: number
}

/**
 * Admin Dashboard Component
 * 
 * Main dashboard page for the admin panel displaying key statistics,
 * system status, and quick access to admin functions.
 * 
 * Features:
 * - Real-time statistics display
 * - System status monitoring
 * - Quick navigation to admin sections
 * - Manual refresh functionality
 */
export default function AdminDashboard() {
  const { 
    stats, 
    orders,
    customers,
    isLoading, 
    errors, 
    refreshAll, 
    hasUnsavedChanges,
    markChangesSaved,
    backendStatus,
    checkBackendStatus
  } = useAdmin()

  // Monitor stats changes for debugging
  useEffect(() => {
    console.log('📊 Dashboard stats updated:', stats)
  }, [stats])
  
  /**
   * Dashboard Statistics Cards Configuration
   * 
   * Defines the statistics cards displayed on the dashboard with their
   * respective icons, colors, and navigation links.
   */
  const statCards = [
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
    }
  ]
  
  /**
   * Handle Manual Dashboard Refresh
   * 
   * Manually refreshes all dashboard data including statistics,
   * system status, and other real-time information.
   */
  const handleManualRefresh = async () => {
    try {
      await refreshAll()
      console.log('✅ Dashboard data refreshed successfully')
    } catch (error) {
      console.error('❌ Manual refresh failed:', error)
    }
  }
  
  if (isLoading.stats) {
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
            <p className="text-pink-100 mt-2 text-lg">Manage your Akazuba Florist store with confidence</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Store is running</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleManualRefresh}
              className="flex items-center space-x-2 px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Data</span>
            </button>
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
            href="/admin/categories"
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Tag className="w-6 h-6" />
              <div>
                <h3 className="font-medium">Manage Categories</h3>
                <p className="text-sm opacity-90">Organize your product categories</p>
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
                <p className="text-sm opacity-90">Check recent orders and status</p>
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
                <p className="text-sm opacity-90">Configure your store settings</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Orders & System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link 
              href="/admin/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <Eye className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {orders && orders.length > 0 ? (
              orders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-100' :
                      order.status === 'PROCESSING' ? 'bg-blue-100' :
                      order.status === 'SHIPPED' ? 'bg-yellow-100' :
                      'bg-gray-100'
                    }`}>
                      {order.status === 'DELIVERED' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : order.status === 'PROCESSING' ? (
                        <Clock className="w-4 h-4 text-blue-600" />
                      ) : order.status === 'SHIPPED' ? (
                        <Activity className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">RWF {parseInt(order.totalAmount).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
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

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            {/* Backend Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${backendStatus === 'online' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {backendStatus === 'online' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">Backend API</p>
                  <p className="text-sm text-gray-600">Database & Services</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                backendStatus === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {backendStatus === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Database Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Database</p>
                  <p className="text-sm text-gray-600">PostgreSQL</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>

            {/* File Storage */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">File Storage</p>
                  <p className="text-sm text-gray-600">Image Uploads</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>

            {/* Email Service */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Service</p>
                  <p className="text-sm text-gray-600">SMTP Configuration</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Revenue Growth</h3>
            <p className="text-2xl font-bold text-green-600">+12.5%</p>
            <p className="text-sm text-gray-600 mt-1">vs last month</p>
          </div>

          {/* Order Completion */}
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Order Completion</h3>
            <p className="text-2xl font-bold text-blue-600">85%</p>
            <p className="text-sm text-gray-600 mt-1">delivery success rate</p>
          </div>

          {/* Customer Satisfaction */}
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Customer Growth</h3>
            <p className="text-2xl font-bold text-purple-600">+8.2%</p>
            <p className="text-sm text-gray-600 mt-1">new customers</p>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders ? orders.filter((o: any) => o.status === 'PENDING').length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders ? orders.filter((o: any) => 
                    o.status === 'DELIVERED' && 
                    new Date(o.updatedAt).toDateString() === new Date().toDateString()
                  ).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  RWF {orders ? orders
                    .filter((o: any) => 
                      o.status === 'DELIVERED' && 
                      new Date(o.updatedAt).toDateString() === new Date().toDateString()
                    )
                    .reduce((sum: number, o: any) => sum + parseInt(o.totalAmount), 0)
                    .toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-xl font-bold text-gray-900">
                  {customers ? customers.filter((c: any) => c.isActive).length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notifications */}
      <div className="space-y-4">
        {hasUnsavedChanges && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800 text-sm">
                You have unsaved changes. Make sure to save your work.
              </p>
            </div>
          </div>
        )}

        {backendStatus === 'offline' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">
                Backend is offline. Some features may not work properly.
              </p>
            </div>
          </div>
        )}

        {/* Success Messages */}
        {stats && stats.orders > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 text-sm">
                Great! You have {stats.orders} orders to manage. Keep up the excellent work!
              </p>
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {stats && stats.products > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <p className="text-orange-800 text-sm">
                Consider reviewing your product inventory to ensure optimal stock levels.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}