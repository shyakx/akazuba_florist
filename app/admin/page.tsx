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

interface DashboardStats {
  categories: number
  products: number
  orders: number
  revenue: number
  customers: number
}

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

  // Debug: Log stats changes
  useEffect(() => {
    console.log('📊 Dashboard stats changed:', stats)
  }, [stats])
  
  // Essential stat cards only
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
  
  // Manual refresh function
  const handleManualRefresh = async () => {
    try {
      await refreshAll()
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your admin panel</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Backend Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${backendStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {backendStatus ? 'Backend Online' : 'Backend Offline'}
            </span>
          </div>
          
          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 text-orange-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Unsaved changes</span>
            </div>
          )}
          
          {/* Refresh Button */}
          <button 
            onClick={handleManualRefresh}
            className="btn btn-secondary"
            disabled={isLoading.stats}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading.stats ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link key={index} href={card.link}>
            <div className="stat-card group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`stat-icon ${card.color} group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Product */}
        <Link href="/admin/products/new">
          <div className="card hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="stat-icon bg-green-500 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
          </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
                <p className="text-gray-600">Create a new flower or perfume product</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Manage Categories */}
        <Link href="/admin/categories">
          <div className="card hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="stat-icon bg-blue-500 group-hover:scale-110 transition-transform">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Categories</h3>
                <p className="text-gray-600">Organize your product categories</p>
              </div>
            </div>
            </div>
        </Link>

        {/* Settings */}
        <Link href="/admin/settings">
          <div className="card hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="stat-icon bg-gray-500 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
            </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-gray-600">Configure your store settings</p>
            </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>

          <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Dashboard loaded successfully</span>
            <span className="text-gray-400 ml-auto">{new Date().toLocaleTimeString()}</span>
        </div>

          {backendStatus ? (
            <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Backend connection established</span>
              <span className="text-gray-400 ml-auto">Connected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Backend connection failed</span>
              <span className="text-gray-400 ml-auto">Offline</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Admin panel ready</span>
            <span className="text-gray-400 ml-auto">Ready</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>Akazuba Flower Shop Admin Panel</p>
        <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}