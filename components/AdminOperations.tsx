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
    <div>
      {/* Search and Filter Bar */}
      <div>
        <div>
          {/* Search Section */}
          <div>
            <div>
              <Search />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
            >
              <option value="products">Products</option>
              <option value="customers">Customers</option>
              <option value="orders">Orders</option>
            </select>
            <button
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Action Buttons */}
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter />
              Filters
            </button>
            <button
              onClick={onRefreshData}
              disabled={isLoading}
            >
              <RefreshCw />
              Refresh
            </button>
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              disabled={selectedItems.length === 0}
            >
              <MoreHorizontal />
              Bulk Actions
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div>
            <div>
              <h3>Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
              >
                <X />
              </button>
            </div>
            <div>
              <div>
                <label>Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {orderStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <div>
          <div>
            <h3>Bulk Actions</h3>
            <button
              onClick={() => setShowBulkActions(false)}
            >
              <X />
            </button>
          </div>
          <div>
            <div>
              <label>Action:</label>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value as 'update' | 'delete')}
              >
                <option value="update">Update Status</option>
                <option value="delete">Delete</option>
              </select>
            </div>
            {bulkAction === 'update' && (
              <div>
                <label>New Status:</label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  {orderStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={handleBulkAction}
              disabled={isBulkActionLoading || (bulkAction === 'update' && !bulkStatus)}
            >
              {isBulkActionLoading ? 'Processing...' : 'Apply'}
            </button>
          </div>
        </div>
      )}

      {/* Export Section */}
      <div>
        <h3>Export Data</h3>
        <div>
          <button
            onClick={() => handleExport('orders', 'csv')}
            disabled={isExporting}
          >
            <Download />
            Export Orders (CSV)
          </button>
          <button
            onClick={() => handleExport('orders', 'excel')}
            disabled={isExporting}
          >
            <Download />
            Export Orders (Excel)
          </button>
          <button
            onClick={() => handleExport('customers', 'csv')}
            disabled={isExporting}
          >
            <Download />
            Export Customers (CSV)
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <div>
          <div>
            <Package />
            <div>
              <span>Total Products</span>
              <span>Loading...</span>
            </div>
          </div>
          <div>
            <ShoppingCart />
            <div>
              <span>Total Orders</span>
              <span>Loading...</span>
            </div>
          </div>
          <div>
            <Users />
            <div>
              <span>Total Customers</span>
              <span>Loading...</span>
            </div>
          </div>
          <div>
            <DollarSign />
            <div>
              <span>Total Revenue</span>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOperations
