'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Filter,
  Eye,
  FileText,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'

interface ReportData {
  id: string
  title: string
  type: 'sales' | 'orders' | 'customers' | 'products'
  period: string
  value: number
  change: number
  changeType: 'increase' | 'decrease'
  description: string
  lastUpdated: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedType, setSelectedType] = useState('all')

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/admin/reports/public')
      if (!response.ok) throw new Error('Failed to fetch reports')
      
      const result = await response.json()
      if (result.success) {
        setReports(result.data)
      } else {
        throw new Error('Failed to fetch reports')
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      // Fallback to empty array on error
      setReports([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType
    return matchesType
  })

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'sales': return DollarSign
      case 'orders': return ShoppingCart
      case 'customers': return Users
      case 'products': return Package
      default: return BarChart3
    }
  }

  const getReportColor = (type: string) => {
    switch (type) {
      case 'sales': return 'from-green-600 to-emerald-600'
      case 'orders': return 'from-blue-600 to-cyan-600'
      case 'customers': return 'from-purple-600 to-violet-600'
      case 'products': return 'from-orange-600 to-amber-600'
      default: return 'from-gray-600 to-slate-600'
    }
  }

  const getReportBgColor = (type: string) => {
    switch (type) {
      case 'sales': return 'from-green-50 to-emerald-50'
      case 'orders': return 'from-blue-50 to-cyan-50'
      case 'customers': return 'from-purple-50 to-violet-50'
      case 'products': return 'from-orange-50 to-amber-50'
      default: return 'from-gray-50 to-slate-50'
    }
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-indigo-100 text-lg">Comprehensive insights into your business performance</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{reports.length}</div>
                  <div className="text-sm text-indigo-100">Total Reports</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{reports.filter(r => r.changeType === 'increase').length}</div>
                  <div className="text-sm text-indigo-100">Positive Trends</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">RWF {reports.find(r => r.type === 'sales')?.value.toLocaleString() || '0'}</div>
                  <div className="text-sm text-indigo-100">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 h-32">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 h-32">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">RWF {reports.find(r => r.type === 'sales')?.value.toLocaleString() || '0'}</p>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+15%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 h-32">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive Trends</p>
              <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.changeType === 'increase').length}</p>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="btn btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
            <Download className="w-5 h-5 mr-2" />
            Export All Reports
          </button>
          <button className="btn btn-secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Reports
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="sales">Sales Reports</option>
                <option value="orders">Order Reports</option>
                <option value="customers">Customer Reports</option>
                <option value="products">Product Reports</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary px-6 py-3">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const IconComponent = getReportIcon(report.type)
          const gradientClass = getReportColor(report.type)
          const bgGradientClass = getReportBgColor(report.type)
          
          return (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
              {/* Report Header */}
              <div className={`h-32 bg-gradient-to-br ${bgGradientClass} flex items-center justify-center relative`}>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-gray-600" />
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.changeType === 'increase' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {report.changeType === 'increase' ? '+' : ''}{report.change}%
                  </span>
                </div>
              </div>

              {/* Report Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">
                      {report.type === 'sales' ? `RWF ${report.value.toLocaleString()}` : 
                       report.type === 'customers' && report.title.includes('Retention') ? `${report.value}%` :
                       report.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {report.type === 'sales' ? 'Revenue' : 
                       report.type === 'orders' ? 'Orders' :
                       report.type === 'customers' ? 'Customers' : 'Products'}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Change</span>
                    <span className={`text-sm font-medium flex items-center ${
                      report.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {report.changeType === 'increase' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {report.changeType === 'increase' ? '+' : ''}{report.change}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last Updated</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(report.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {report.period}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {selectedType !== 'all' 
              ? 'Try adjusting your filter criteria to find the reports you\'re looking for.'
              : 'No reports are available for the selected period. Reports will appear here once data is available.'
            }
          </p>
        </div>
      )}
    </div>
  )
}
