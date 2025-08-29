'use client'

import React, { useState, useEffect } from 'react'
import { X, Filter, Search, DollarSign, Package, Star, Calendar, Tag } from 'lucide-react'
import { ProductFilters, AdminCategory } from '@/lib/adminApi'

interface ProductFiltersPanelProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  onClose: () => void
}

const ProductFiltersPanel: React.FC<ProductFiltersPanelProps> = ({ filters, onFiltersChange, onClose }) => {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      // Fetch real categories from backend API
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
        (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
          ? 'http://localhost:5000/api/v1' 
          : 'https://akazuba-backend-api.onrender.com/api/v1')

      const token = localStorage.getItem('accessToken')
      if (!token) {
        console.error('No access token found')
        return
      }

      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCategories(data.data)
        } else {
          console.error('Failed to fetch categories:', data.message)
          // Fallback to empty array if API fails
          setCategories([])
        }
      } else {
        console.error('Failed to fetch categories:', response.status, response.statusText)
        // Fallback to empty array if API fails
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback to empty array if API fails
      setCategories([])
    }
  }

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const clearFilters = () => {
    const clearedFilters: ProductFilters = {
      search: '',
      category: '',
      status: 'all',
      stockStatus: 'all',
      priceRange: undefined,
      featured: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      tags: [],
      dateRange: undefined,
      perfumeType: 'all',
      perfumeBrand: '',
      concentration: 'all'
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    onClose()
  }

  const hasActiveFilters = () => {
    return (
      localFilters.search ||
      localFilters.category ||
      localFilters.status !== 'all' ||
      localFilters.stockStatus !== 'all' ||
      localFilters.priceRange ||
      localFilters.featured !== undefined ||
      (localFilters.tags && localFilters.tags.length > 0) ||
      localFilters.dateRange ||
      localFilters.perfumeType !== 'all' ||
      localFilters.perfumeBrand ||
      localFilters.concentration !== 'all'
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="h-4 w-4 inline mr-1" />
            Search
          </label>
          <input
            type="text"
            placeholder="Search products..."
            value={localFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="h-4 w-4 inline mr-1" />
            Category
          </label>
          <select
            value={localFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.productCount})
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="h-4 w-4 inline mr-1" />
            Status
          </label>
          <select
            value={localFilters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Package className="h-4 w-4 inline mr-1" />
            Stock Status
          </label>
          <select
            value={localFilters.stockStatus || 'all'}
            onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Stock</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        {/* Featured */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="h-4 w-4 inline mr-1" />
            Featured
          </label>
          <select
            value={localFilters.featured === undefined ? 'all' : localFilters.featured.toString()}
            onChange={(e) => {
              const value = e.target.value
              handleFilterChange('featured', value === 'all' ? undefined : value === 'true')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Products</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Filter className="h-4 w-4 inline mr-1" />
            Sort By
          </label>
          <select
            value={localFilters.sortBy || 'createdAt'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
            <option value="createdAt">Date Created</option>
            <option value="sales">Sales</option>
            <option value="views">Views</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Filter className="h-4 w-4 inline mr-1" />
            Sort Order
          </label>
          <select
            value={localFilters.sortOrder || 'desc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Price Range */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="h-4 w-4 inline mr-1" />
          Price Range (RWF)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              placeholder="Min price"
              value={localFilters.priceRange?.min || ''}
              onChange={(e) => handleFilterChange('priceRange', {
                ...localFilters.priceRange,
                min: e.target.value ? Number(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max price"
              value={localFilters.priceRange?.max || ''}
              onChange={(e) => handleFilterChange('priceRange', {
                ...localFilters.priceRange,
                max: e.target.value ? Number(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          Date Range
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="date"
              value={localFilters.dateRange?.from || ''}
              onChange={(e) => handleFilterChange('dateRange', {
                ...localFilters.dateRange,
                from: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="date"
              value={localFilters.dateRange?.to || ''}
              onChange={(e) => handleFilterChange('dateRange', {
                ...localFilters.dateRange,
                to: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Tag className="h-4 w-4 inline mr-1" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {['roses', 'tulips', 'bouquet', 'red', 'pink', 'white', 'spring', 'romantic'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                const currentTags = localFilters.tags || []
                const newTags = currentTags.includes(tag)
                  ? currentTags.filter(t => t !== tag)
                  : [...currentTags, tag]
                handleFilterChange('tags', newTags)
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                localFilters.tags?.includes(tag)
                  ? 'bg-pink-100 text-pink-800 border border-pink-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Perfume-specific filters */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h4 className="text-sm font-semibold text-purple-800 mb-4">Perfume Filters</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Perfume Type */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Perfume Type
            </label>
            <select
              value={localFilters.perfumeType || 'all'}
              onChange={(e) => handleFilterChange('perfumeType', e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Perfume Brand */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              placeholder="Search by brand..."
              value={localFilters.perfumeBrand || ''}
              onChange={(e) => handleFilterChange('perfumeBrand', e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Concentration */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Concentration
            </label>
            <select
              value={localFilters.concentration || 'all'}
              onChange={(e) => handleFilterChange('concentration', e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All Concentrations</option>
              <option value="EDP">EDP</option>
              <option value="EDT">EDT</option>
              <option value="Parfum">Parfum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
          {hasActiveFilters() && (
            <span className="text-sm text-gray-500">
              {Object.keys(localFilters).filter(key => localFilters[key as keyof ProductFilters]).length} filters active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductFiltersPanel
