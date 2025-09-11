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
  ArrowRight,
  Heart,
  Cross,
  GraduationCap,
  Users,
  Calendar,
  Gift,
  Plane,
  X
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    images: []
  })
  const [loading, setLoading] = useState(false)

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

  // Function to get the appropriate icon component for each category
  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'wedding': <Heart className="w-16 h-16 text-pink-500" />,
      'funerals': <Cross className="w-16 h-16 text-gray-500" />,
      'graduation': <GraduationCap className="w-16 h-16 text-yellow-500" />,
      'mothers-day': <Users className="w-16 h-16 text-pink-400" />,
      'anniversary': <Heart className="w-16 h-16 text-red-500" />,
      'birthday': <Gift className="w-16 h-16 text-purple-500" />,
      'valentine': <Heart className="w-16 h-16 text-red-600" />,
      'date': <Heart className="w-16 h-16 text-rose-400" />,
      'engagement': <Heart className="w-16 h-16 text-pink-300" />,
      'airport-pickup': <Plane className="w-16 h-16 text-blue-400" />,
      'male': <Users className="w-16 h-16 text-blue-600" />,
      'female': <Users className="w-16 h-16 text-pink-500" />,
      'strong-scent': <Package className="w-16 h-16 text-purple-600" />,
      'soft-scent': <Flower className="w-16 h-16 text-green-400" />,
      'casual-everyday': <Calendar className="w-16 h-16 text-blue-400" />,
      'special-occasions': <Gift className="w-16 h-16 text-yellow-500" />
    }
    return iconMap[categoryId] || <Package className="w-16 h-16 text-gray-500" />
  }

  // Function to open category and show add product modal
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setShowAddProductModal(true)
  }

  // Function to handle adding a new product to the category
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCategory || !newProduct.name || !newProduct.price) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    try {
      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: Number(newProduct.price),
          categoryId: selectedCategory.id,
          stockQuantity: Number(newProduct.stockQuantity) || 0,
          isActive: true,
          images: newProduct.images
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          alert('Product added successfully!')
          setShowAddProductModal(false)
          setNewProduct({ name: '', description: '', price: '', stockQuantity: '', images: [] })
          setSelectedCategory(null)
          // Refresh the page to show updated product counts
          window.location.reload()
        } else {
          throw new Error(result.message || 'Failed to add product')
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert(`Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

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
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Click on any category card to add products directly to that category. 
              Use the eye icon to view existing products in each category.
            </p>
          </div>
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
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-200 cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  {/* Category Icon */}
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {getCategoryIcon(category.id)}
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {productCount} product{productCount !== 1 ? 's' : ''}
                  </div>
                  
                  {/* Add Product Badge */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    + Add Product
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/admin/products?category=${category.id}`)
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Products"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
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
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-200 cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
                  {/* Category Icon */}
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {getCategoryIcon(category.id)}
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {productCount} product{productCount !== 1 ? 's' : ''}
                  </div>
                  
                  {/* Add Product Badge */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    + Add Product
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/admin/products?category=${category.id}`)
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Products"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
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

      {/* Add Product Modal */}
      {showAddProductModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Product to {selectedCategory.name}
              </h3>
              <button
                onClick={() => {
                  setShowAddProductModal(false)
                  setSelectedCategory(null)
                  setNewProduct({ name: '', description: '', price: '', stockQuantity: '', images: [] })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProductModal(false)
                    setSelectedCategory(null)
                    setNewProduct({ name: '', description: '', price: '', stockQuantity: '', images: [] })
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}