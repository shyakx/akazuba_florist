'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Package, 
  ArrowLeft,
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Tag,
  ShoppingBag,
  DollarSign,
  Star,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  status: 'active' | 'inactive'
  images: string[]
  createdAt: string
  sales?: number
  rating?: number
  description?: string
}

interface Category {
  id: string
  name: string
  description: string
  productCount: number
  status: 'active' | 'inactive'
  imageUrl?: string
  createdAt: string
}

export default function CategoryProductsPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCategoryAndProducts = async () => {
    try {
      setIsLoading(true)
      
      // Fetch categories to find the specific category
      const categoriesResponse = await fetch('/api/admin/categories')
      if (!categoriesResponse.ok) throw new Error('Failed to fetch categories')
      const categoriesResult = await categoriesResponse.json()
      
      if (categoriesResult.success) {
        const foundCategory = categoriesResult.data.categories.find((cat: Category) => cat.id === categoryId)
        if (foundCategory) {
          setCategory(foundCategory)
        } else {
          throw new Error('Category not found')
        }
      }
      
      // Fetch all products
      const productsResponse = await fetch('/api/products')
      if (!productsResponse.ok) throw new Error('Failed to fetch products')
      const productsResult = await productsResponse.json()
      
      if (productsResult.success) {
        // Filter products by this category - ensure data is an array
        const productsData = productsResult.data?.products || productsResult.data || []
        const categoryProducts = Array.isArray(productsData) 
          ? productsData.filter((product: Product) => product.category === category?.name)
          : []
        setProducts(categoryProducts)
      }
    } catch (error) {
      console.error('Error fetching category and products:', error)
      setCategory(null)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAndProducts()
    }
  }, [categoryId, category?.name])

  // Filter products by search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/admin/products/${productId}/delete`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Remove product from local state
        setProducts(products.filter(p => p.id !== productId))
        // Update category product count
        if (category) {
          setCategory({ ...category, productCount: category.productCount - 1 })
        }
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading category products...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Category Not Found</h2>
        <p className="text-gray-500 mb-6">The category you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/admin/categories')}
          className="btn btn-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/categories')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold mb-1">Products in {category.name}</h1>
              <p className="text-blue-100">{category.description}</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{filteredProducts.length}</div>
                  <div className="text-sm text-blue-100">Products</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{filteredProducts.filter(p => p.status === 'active').length}</div>
                  <div className="text-sm text-blue-100">Active</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${(filteredProducts.reduce((sum, p) => sum + (p.price || 0), 0) || 0).toLocaleString()}</div>
                  <div className="text-sm text-blue-100">Total Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products in this category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Link 
          href="/admin/products/new" 
          className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Package className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm ? 'No products found' : 'No products in this category'}
          </h2>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? `No products match "${searchTerm}" in ${category.name}`
              : `This category doesn't have any products yet.`
            }
          </p>
          <Link 
            href="/admin/products/new" 
            className="btn btn-primary"
          >
            <Package className="w-4 h-4 mr-2" />
            Add First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card hover:shadow-lg transition-all duration-200">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100 rounded-t-xl overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-600">${(product.price || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{product.stock} in stock</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => router.push(`/admin/products/view/${product.id}`)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
