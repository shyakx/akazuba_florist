'use client'

import React, { useState, useEffect } from 'react'
import { 
  Tag, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Flower,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { flowerCategories, perfumeCategories, Category } from '@/data/categories'
import { useProducts } from '@/contexts/ProductsContext'
import { findProductCategories, getAllCategoryMappings } from '@/data/category-product-mapping'


export default function CategoriesPage() {
  const router = useRouter()
  const { products } = useProducts()
  const [categoryProductCounts, setCategoryProductCounts] = useState<Record<string, number>>({})
  const [searchTerm, setSearchTerm] = useState('')

  // Calculate product counts for each category
  useEffect(() => {
    if (products && products.length > 0) {
      const counts: Record<string, number> = {}
      
      // Get all category mappings
      const allMappings = getAllCategoryMappings()
      
      // Count products for each category
      allMappings.forEach(mapping => {
        const count = products.filter(product => {
          // Check if product has explicit category IDs
          if (product.categoryIds && product.categoryIds.includes(mapping.categoryId)) {
            return true
          }
          
          // Fallback to keyword matching
          const productCategories = findProductCategories(product)
          return productCategories.includes(mapping.categoryId)
        }).length
        
        counts[mapping.categoryId] = count
      })
      
      setCategoryProductCounts(counts)
    }
  }, [products])

  // Combine flower and perfume categories
  const allCategories = [...flowerCategories, ...perfumeCategories]

  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-2">Manage your product categories and subcategories</p>
        </div>
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

      {/* Flower Categories */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <Flower className="h-6 w-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-900">Flower Categories</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.filter(cat => cat.type === 'flowers').map((category) => {
            const productCount = categoryProductCounts[category.id] || 0
            return (
              <div 
                key={category.id} 
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/placeholder-flower.jpg'
                    }}
                  />
                  <div className={`absolute top-4 right-4 ${category.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {category.icon}
                  </div>
                  {/* Product Count Badge */}
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {productCount} product{productCount !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <button 
                        className="p-1 text-gray-400 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/admin/products?category=${category.id}`)
                        }}
                        title="View Products"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-green-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/admin/categories/edit/${category.id}`)
                        }}
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {category.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-pink-50 text-pink-700 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                      {category.features.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{category.features.length - 2} more
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Perfume Categories */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-900">Perfume Categories</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.filter(cat => cat.type === 'perfumes').map((category) => {
            const productCount = categoryProductCounts[category.id] || 0
            return (
              <div 
                key={category.id} 
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/placeholder-perfume.jpg'
                    }}
                  />
                  <div className={`absolute top-4 right-4 ${category.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {category.icon}
                  </div>
                  {/* Product Count Badge */}
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {productCount} product{productCount !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <button 
                        className="p-1 text-gray-400 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/admin/products?category=${category.id}`)
                        }}
                        title="View Products"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-green-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/admin/categories/edit/${category.id}`)
                        }}
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {category.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                      {category.features.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{category.features.length - 2} more
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {filteredCategories.length === 0 && (
        <div className="card">
          <div className="text-center py-8">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Categories are loaded from the static data file'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}