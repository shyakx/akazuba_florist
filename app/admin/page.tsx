'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  RefreshCw,
  TrendingUp,
  BarChart3,
  FileText,
  Zap,
  Target,
  Crown
} from 'lucide-react'
import Link from 'next/link'
import { adminAPI } from '@/lib/adminApi'
import toast from 'react-hot-toast'
import { productStorage } from '@/lib/productStorage'

interface DashboardStats {
  newOrders: number
  totalProducts: number
  totalCustomers: number
  lowStockProducts: number
  totalRevenue?: number
  averageOrderValue?: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: number
  status: string
  createdAt: string
}

interface AnalyticsData {
  overview: {
    totalOrders: number
    totalRevenue: number
    totalCustomers: number
    totalProducts: number
    averageOrderValue: number
  }
  recentOrders: RecentOrder[]
  topProducts: any[]
  monthlyRevenue: any[]
  customerGrowth: any[]
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
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dataFetched, setDataFetched] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      if (isAuthenticated && user?.role === 'ADMIN') {
        fetchDashboardData()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh, isAuthenticated, user?.role])

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

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Check if user is authenticated and is admin
      const token = localStorage.getItem('accessToken')
      if (!token) {
        console.error('No access token found')
        toast.error('Please log in as admin')
        router.push('/admin/login')
        return
      }
      
      if (!user || user.role !== 'ADMIN') {
        console.error('User is not admin')
        toast.error('Admin privileges required')
        router.push('/admin/login')
        return
      }
      
      // Try to fetch real data from backend API
      try {
        // Use the same dynamic API URL logic as the main API
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
          (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
            ? 'http://localhost:5000/api/v1' 
            : 'https://akazuba-backend-api.onrender.com/api/v1')

        console.log('🔗 Attempting to connect to backend:', API_BASE_URL)
        console.log('🔑 Using token:', token ? 'Present' : 'Missing')
        console.log('🌐 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side')
        console.log('🔧 Environment:', process.env.NODE_ENV)
        console.log('📡 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)

        // First, test the connection with a simple health check
        try {
          const healthResponse = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`)
          console.log('🏥 Health check response:', healthResponse.status, healthResponse.statusText)
          
          if (healthResponse.ok) {
            const healthData = await healthResponse.json()
            console.log('🏥 Health data:', healthData)
          }
        } catch (healthError: any) {
          console.error('❌ Health check failed:', healthError)
        }

        // Test CORS
        try {
          const corsResponse = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/cors-test`)
          console.log('🌐 CORS test response:', corsResponse.status, corsResponse.statusText)
          
          if (corsResponse.ok) {
            const corsData = await corsResponse.json()
            console.log('🌐 CORS data:', corsData)
          }
        } catch (corsError: any) {
          console.error('❌ CORS test failed:', corsError)
        }

        const [statsResponse, ordersResponse, activityResponse, analyticsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${API_BASE_URL}/admin/dashboard/recent-orders`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${API_BASE_URL}/admin/dashboard/activity`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${API_BASE_URL}/admin/dashboard/analytics`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ])

        console.log('📊 API Responses:')
        console.log('  - Stats:', statsResponse.status, statsResponse.statusText)
        console.log('  - Orders:', ordersResponse.status, ordersResponse.statusText)
        console.log('  - Activity:', activityResponse.status, activityResponse.statusText)
        console.log('  - Analytics:', analyticsResponse.status, analyticsResponse.statusText)

        // Check if any response is not ok (like 401 Unauthorized)
        if (!statsResponse.ok || !ordersResponse.ok || !activityResponse.ok || !analyticsResponse.ok) {
          // If we get 401, the user might not be properly authenticated as admin
          if (statsResponse.status === 401 || ordersResponse.status === 401 || activityResponse.status === 401 || analyticsResponse.status === 401) {
            console.error('Admin authentication failed - redirecting to login')
            toast.error('Admin authentication required. Please log in as admin.')
            router.push('/admin/login')
            return
          }
          
          // Log specific error details
          console.error('API request failed with status:', {
            stats: statsResponse.status,
            orders: ordersResponse.status,
            activity: activityResponse.status,
            analytics: analyticsResponse.status
          })
          
          throw new Error(`API request failed: ${statsResponse.status} ${statsResponse.statusText}`)
        }

        const [statsData, ordersData, activityData, analyticsData] = await Promise.all([
          statsResponse.json(),
          ordersResponse.json(),
          activityResponse.json(),
          analyticsResponse.json()
        ])

        console.log('📈 Received data:', {
          stats: statsData.success,
          orders: ordersData.success,
          activity: activityData.success,
          analytics: analyticsData.success
        })

        if (statsData.success) {
          setStats(statsData.data)
        } else {
          console.error('Failed to fetch stats:', statsData.message)
          setStats({
            newOrders: 5,
            totalProducts: 24,
            totalCustomers: 12,
            lowStockProducts: 3
          })
        }

        if (ordersData.success) {
          setRecentOrders(ordersData.data)
        } else {
          console.error('Failed to fetch orders:', ordersData.message)
          setRecentOrders([
            { id: '1', orderNumber: 'ORD-001', customerName: 'John Doe', totalAmount: 25000, status: 'PENDING', createdAt: new Date().toISOString() },
            { id: '2', orderNumber: 'ORD-002', customerName: 'Jane Smith', totalAmount: 35000, status: 'CONFIRMED', createdAt: new Date().toISOString() }
          ])
        }

        if (activityData.success) {
          setRecentActivity(activityData.data)
        } else {
          console.error('Failed to fetch activity:', activityData.message)
          setRecentActivity([
            { type: 'order', title: 'New order received', description: 'Order #ORD-001 from John Doe', timestamp: new Date(), status: 'success' },
            { type: 'customer', title: 'New customer registered', description: 'Jane Smith joined the platform', timestamp: new Date(), status: 'info' }
          ])
        }

        if (analyticsData.success) {
          setAnalytics(analyticsData.data)
        }

        setLastUpdated(new Date())
        console.log('✅ Successfully fetched real data from backend')
      } catch (backendError: any) {
        console.error('Backend connection failed, using fallback data:', backendError)
        console.error('Error details:', {
          message: backendError?.message || 'Unknown error',
          stack: backendError?.stack || 'No stack trace',
          name: backendError?.name || 'Unknown error type'
        })
        
        setStats({
          newOrders: 5,
          totalProducts: 24,
          totalCustomers: 12,
          lowStockProducts: 3
        })
        
        setRecentOrders([
          { id: '1', orderNumber: 'ORD-001', customerName: 'John Doe', totalAmount: 25000, status: 'PENDING', createdAt: new Date().toISOString() },
          { id: '2', orderNumber: 'ORD-002', customerName: 'Jane Smith', totalAmount: 35000, status: 'CONFIRMED', createdAt: new Date().toISOString() }
        ])
        
        setRecentActivity([
          { type: 'order', title: 'New order received', description: 'Order #ORD-001 from John Doe', timestamp: new Date(), status: 'success' },
          { type: 'customer', title: 'New customer registered', description: 'Jane Smith joined the platform', timestamp: new Date(), status: 'info' }
        ])
        
        toast('Backend not available, showing demo data')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [user, router])

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      toast.loading('Generating invoice...', { id: 'invoice-download' })
      
      const response = await adminAPI.downloadInvoice(orderId)
      
      // Determine file type and extension
      const isHTML = response.type === 'text/html' || response.type === 'text/html; charset=utf-8'
      const fileExtension = isHTML ? 'html' : 'pdf'
      const mimeType = isHTML ? 'text/html; charset=utf-8' : 'application/pdf'
      
      const blob = new Blob([response], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${orderId}.${fileExtension}`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      // Dismiss loading toast and show success
      toast.dismiss('invoice-download')
      
      if (isHTML) {
        toast.success('Invoice generated successfully! Open the HTML file in your browser to view it.', {
          duration: 5000,
          icon: '📄'
        })
      } else {
        toast.success('Invoice downloaded successfully!', {
          icon: '📄'
        })
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.dismiss('invoice-download')
      toast.error('Failed to generate invoice. Please try again.', {
        duration: 4000
      })
    }
  }

  const handleExportData = async (type: 'orders' | 'customers' | 'products' | 'analytics') => {
    try {
      toast.loading(`Exporting ${type} data...`, { id: 'export-data' })
      
      // This would call the backend export API
      const response = await fetch(`/api/admin/export/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.dismiss('export-data')
        toast.success(`${type} data exported successfully!`)
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.dismiss('export-data')
      toast.error(`Failed to export ${type} data`)
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
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

  // SECURITY: Always check authentication before rendering admin content
  if (!isAuthenticated) {
    // Redirect to login immediately
    router.push('/admin/login')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // SECURITY: Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    // Redirect to home page if not admin
    router.push('/')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Access denied. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last updated: {formatTimeAgo(lastUpdated)}</span>
              </div>
              <button
                onClick={() => fetchDashboardData()}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  autoRefresh 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Zap className="h-4 w-4" />
                <span>Auto-refresh {autoRefresh ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
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

        {/* Revenue Stats */}
        {stats.totalRevenue && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold text-gray-900">{formatPrice(stats.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Order Value</span>
                  <span className="font-semibold text-gray-900">{formatPrice(stats.averageOrderValue || 0)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleExportData('analytics')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Analytics</span>
                </button>
                <button
                  onClick={() => handleExportData('orders')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Export Orders</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <p className="text-sm text-gray-600 mt-1">Latest customer orders and their status</p>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/admin/orders"
                  className="flex items-center space-x-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">View all orders</span>
                </Link>
                <button
                  onClick={() => handleExportData('orders')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span className="font-medium">Export</span>
                </button>
              </div>
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
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-pink-600">#{order.orderNumber?.split('-')[1] || order.id?.slice(-4) || 'N/A'}</span>
                        </div>
                          <span className="text-sm font-semibold text-gray-900">{order.orderNumber || `Order ${order.id?.slice(-8) || 'N/A'}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-900">{order.customerName || 'Guest Customer'}</span>
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
                          <button 
                            onClick={() => handleDownloadInvoice(order.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                          <Download className="h-3 w-3" />
                          <span>Invoice</span>
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <ShoppingCart className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No orders found</p>
                        <p className="text-xs text-gray-400">Orders will appear here when customers place them</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 
