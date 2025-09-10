'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Tag, Package, Calendar, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { flowerCategories, perfumeCategories } from '@/data/categories'

interface Category {
  id: string
  name: string
  description: string
  productCount: number
  status: 'active' | 'inactive'
  imageUrl?: string
  createdAt: string
}

export default function CategoryViewPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategory = () => {
      try {
        setLoading(true)
        
        // Combine all categories
        const allCategories = [...flowerCategories, ...perfumeCategories]
        
        // Find the specific category by ID
        const foundCategory = allCategories.find(c => c.id === categoryId)
        
        if (foundCategory) {
          setCategory({
            id: foundCategory.id,
            name: foundCategory.name,
            description: foundCategory.description,
            productCount: foundCategory.productCount,
            status: 'active', // Static categories are always active
            imageUrl: foundCategory.image,
            createdAt: new Date().toISOString() // Default creation date
          })
        } else {
          throw new Error('Category not found')
        }
      } catch (error) {
        console.error('Error loading category:', error)
        setCategory(null)
        // Redirect to categories page if category not found
        router.push('/admin/categories')
      } finally {
        setLoading(false)
      }
    }
    loadCategory()
  }, [categoryId])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}/delete`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          alert('Category deleted successfully!')
          router.push('/admin/categories')
        } else {
          throw new Error('Failed to delete category')
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Failed to delete category. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading category...</p>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Link href="/admin/categories" className="btn btn-primary">
            Back to Categories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-600">Category Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/admin/categories/edit/${category.id}`}>
            <button className="btn btn-secondary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Category
            </button>
          </Link>
          <button 
            onClick={handleDelete}
            className="btn btn-danger"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Image */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Image</h2>
          {category.imageUrl ? (
            <div className="relative">
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No image available</p>
            </div>
          )}
        </div>

        {/* Category Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  category.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Products</span>
                <span className="flex items-center">
                  <Package className="w-4 h-4 mr-1 text-blue-600" />
                  {category.productCount} products
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created</span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-600" />
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href={`/admin/products?category=${category.name}`} className="block">
                <button className="w-full btn btn-primary text-left">
                  <Eye className="w-4 h-4 mr-2" />
                  View Products in This Category
                </button>
              </Link>
              <Link href={`/admin/categories/edit/${category.id}`} className="block">
                <button className="w-full btn btn-secondary text-left">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Category
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {category.description && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{category.description}</p>
        </div>
      )}
    </div>
  )
}
