'use client'

import React, { useState, useEffect } from 'react'
import { 
  Tag, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Package
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  description: string
  productCount: number
  status: 'active' | 'inactive'
  createdAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/admin/categories/public')
      if (!response.ok) throw new Error('Failed to fetch categories')
      
      const result = await response.json()
      if (result.success) {
        setCategories(result.data)
      } else {
        throw new Error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback to empty array on error
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-end">
        <Link href="/admin/categories/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Link>
      </div>

      {/* Search */}
        <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-blue-600" />
          </div>
                    <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {category.status}
                    </span>
                </div>
                  </div>
              <div className="flex items-center space-x-1">
                <button 
                  className="p-1 text-gray-400 hover:text-blue-600"
                  onClick={() => {
                    // TODO: View category details
                    console.log('View category:', category.id)
                  }}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <Link href={`/admin/categories/edit/${category.id}`}>
                  <button className="p-1 text-gray-400 hover:text-green-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </Link>
                <button 
                  className="p-1 text-gray-400 hover:text-red-600"
                  onClick={() => {
                    // TODO: Delete category
                    if (confirm('Are you sure you want to delete this category?')) {
                      console.log('Delete category:', category.id)
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
                </div>
            
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Package className="w-4 h-4" />
                <span>{category.productCount} products</span>
              </div>
              <span className="text-xs text-gray-400">
                Created {new Date(category.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="card">
          <div className="text-center py-8">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first category'
              }
            </p>
            {!searchTerm && (
              <Link href="/admin/categories/new" className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}