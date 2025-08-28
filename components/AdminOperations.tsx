'use client'

import React, { useState } from 'react'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  Plus,
  X,
  Check,
  AlertTriangle,
  Settings,
  Bell,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Heart,
  Shield,
  Zap,
  Target,
  Activity,
  BarChart3,
  FileText,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Crown,
  Gift,
  Award
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminOperationsProps {
  // Order operations
  onOrderStatusUpdate?: (orderId: string, newStatus: string) => Promise<void>
  onOrderDelete?: (orderId: string) => Promise<void>
  onBulkOrderUpdate?: (orderIds: string[], updates: any) => Promise<void>
  
  // Customer operations
  onCustomerUpdate?: (customerId: string, updates: any) => Promise<void>
  onCustomerDelete?: (customerId: string) => Promise<void>
  
  // Product operations
  onProductUpdate?: (productId: string, updates: any) => Promise<void>
  onProductDelete?: (productId: string) => Promise<void>
  onBulkProductDelete?: (productIds: string[]) => Promise<void>
  
  // Export operations
  onExportData?: (type: 'orders' | 'customers', format: 'csv' | 'excel') => Promise<void>
  
  // Search operations
  onSearch?: (query: string, type: 'products' | 'customers' | 'orders') => Promise<void>
  
  // Data refresh
  onRefreshData?: () => Promise<void>
  
  // Loading states
  isBulkActionLoading?: boolean
  isExporting?: boolean
  isLoading?: boolean
}

const AdminOperations: React.FC<AdminOperationsProps> = ({
  onOrderStatusUpdate,
  onOrderDelete,
  onBulkOrderUpdate,
  onCustomerUpdate,
  onCustomerDelete,
  onProductUpdate,
  onProductDelete,
  onBulkProductDelete,
  onExportData,
  onSearch,
  onRefreshData,
  isBulkActionLoading = false,
  isExporting = false,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'products' | 'customers' | 'orders'>('products')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkAction, setBulkAction] = useState<'update' | 'delete'>('update')
  const [bulkStatus, setBulkStatus] = useState('')

  // Order status options
  const orderStatuses = [
    { value: 'PENDING', label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'text-blue-600', bg: 'bg-blue-100' },
    { value: 'PROCESSING', label: 'Processing', color: 'text-purple-600', bg: 'bg-purple-100' },
    { value: 'SHIPPED', label: 'Shipped', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { value: 'DELIVERED', label: 'Delivered', color: 'text-green-600', bg: 'bg-green-100' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100' }
  ]

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery, searchType)
    }
  }

  const handleBulkAction = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items first')
      return
    }

    if (bulkAction === 'update' && bulkStatus) {
      if (onBulkOrderUpdate) {
        await onBulkOrderUpdate(selectedItems, { status: bulkStatus })
      }
    } else if (bulkAction === 'delete') {
      if (onBulkProductDelete) {
        await onBulkProductDelete(selectedItems)
      }
    }
    
    setSelectedItems([])
    setShowBulkActions(false)
  }

  const handleExport = async (type: 'orders' | 'customers', format: 'csv' | 'excel') => {
    if (onExportData) {
      await onExportData(type, format)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Section */}
          <div className="flex flex-1 gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="products">Products</option>
              <option value="customers">Customers</option>
              <option value="orders">Orders</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              onClick={onRefreshData}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="relative">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                disabled={selectedItems.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <MoreHorizontal className="h-4 w-4" />
                Bulk Actions ({selectedItems.length})
              </button>
              
              {/* Bulk Actions Dropdown */}
              {showBulkActions && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Bulk Actions</h3>
                    
                    {/* Order Status Update */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Update Order Status
                        </label>
                        <select
                          value={bulkStatus}
                          onChange={(e) => setBulkStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="">Select Status</option>
                          {orderStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleBulkAction}
                          disabled={isBulkActionLoading || !bulkStatus}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                        >
                          {isBulkActionLoading ? 'Updating...' : 'Update'}
                        </button>
                        <button
                          onClick={() => setShowBulkActions(false)}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  {orderStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Export</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport('orders', 'csv')}
                    disabled={isExporting}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    CSV
                  </button>
                  <button
                    onClick={() => handleExport('orders', 'excel')}
                    disabled={isExporting}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Order Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Orders</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Management</h3>
          <p className="text-sm text-gray-600 mb-4">Update status, track deliveries, manage returns</p>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              View Orders
            </button>
            <button className="w-full px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
              Process Orders
            </button>
          </div>
        </div>

        {/* Customer Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Customers</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Management</h3>
          <p className="text-sm text-gray-600 mb-4">View profiles, manage accounts, track activity</p>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              View Customers
            </button>
            <button className="w-full px-3 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm">
              Manage Accounts
            </button>
          </div>
        </div>

        {/* Product Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Products</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Management</h3>
          <p className="text-sm text-gray-600 mb-4">Add products, update inventory, manage categories</p>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              Add Product
            </button>
            <button className="w-full px-3 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm">
              Manage Inventory
            </button>
          </div>
        </div>

        {/* Analytics & Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Analytics</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
          <p className="text-sm text-gray-600 mb-4">View insights, generate reports, track performance</p>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
              View Analytics
            </button>
            <button className="w-full px-3 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm">
              Generate Reports
            </button>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">12</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">5</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today&apos;s Revenue</p>
              <p className="text-2xl font-bold text-green-600">RWF 450K</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOperations
