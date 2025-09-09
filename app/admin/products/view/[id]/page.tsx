'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Package, Tag, DollarSign, ShoppingCart, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  status: 'active' | 'inactive'
  images?: string[]
  createdAt: string
  sales?: number
  rating?: number
  description?: string
}

export default function ProductViewPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        console.log('🔍 Loading product with ID:', productId)
        
        // Get the JWT token using the proper utility function
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch(`/api/admin/products/public`, {
          headers
        })
        if (!response.ok) throw new Error('Failed to fetch products')

        const result = await response.json()
        console.log('📊 API Response:', result)
        
        if (result.success && result.data && result.data.products) {
          console.log('📦 Available products:', result.data.products.map((p: any) => ({ id: p.id, name: p.name })))
          
          const foundProduct = result.data.products.find((p: any) => p.id === productId)
          console.log('🎯 Found product:', foundProduct)
          
          if (foundProduct) {
            setProduct(foundProduct)
          } else {
            throw new Error('Product not found')
          }
        } else {
          throw new Error('Failed to fetch product data')
        }
      } catch (error) {
        console.error('❌ Error loading product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    
    if (productId) {
      loadProduct()
    }
  }, [productId])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        // Get the JWT token using the proper utility function
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch(`/api/admin/products/${productId}/delete`, {
          method: 'DELETE',
          headers
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            alert('Product deleted successfully!')
            router.push('/admin/products')
          } else {
            throw new Error(result.message || 'Failed to delete product')
          }
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to delete product')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        alert(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
          <p className="text-sm text-gray-500 mt-2">Product ID: {productId}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/admin/products" className="btn btn-primary">
            Back to Products
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
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">Product Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/admin/products/edit/${product.id}`}>
            <button className="btn btn-secondary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
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
        {/* Product Images */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
          {product.images && product.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No images available</p>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category</span>
                <span className="flex items-center">
                  <Tag className="w-4 h-4 mr-1 text-blue-600" />
                  {product.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price</span>
                <span className="flex items-center font-bold text-green-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  RWF {product.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Stock</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stock} units
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>

          {/* Sales & Performance */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales & Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Sales</span>
                <span className="flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-1 text-blue-600" />
                  {product.sales || 0} sold
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rating</span>
                <span className="flex items-center">
                  ⭐ {product.rating || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created</span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-600" />
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}
    </div>
  )
}
