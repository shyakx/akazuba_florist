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
  Plus,
  Settings
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your Akazuba Florist store</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>Store is running</span>
            </div>
            <button
              onClick={handleManualRefresh}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
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

      {/* Status Messages */}
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
    </div>
  )
}