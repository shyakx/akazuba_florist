'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Save,
  ArrowLeft,
  Upload,
  X,
  AlertCircle,
  Package
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  isActive: boolean
  images: string[]
  categoryId: string
  createdAt: string
  updatedAt: string
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    { id: 'flowers', name: 'Flowers' },
    { id: 'perfumes', name: 'Perfumes' },
    { id: 'wedding', name: 'Wedding Flowers' },
    { id: 'funerals', name: 'Funeral Flowers' },
    { id: 'birthday', name: 'Birthday Flowers' },
    { id: 'valentine', name: 'Valentine Flowers' },
    { id: 'male', name: 'Men Perfumes' },
    { id: 'female', name: 'Women Perfumes' }
  ]

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {}
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
      const response = await fetch(`/api/admin/products/${productId}`, { headers })
        if (response.ok) {
        const data = await response.json()
        setProduct(data.data || data)
      } else {
        throw new Error('Failed to fetch product')
        }
      } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    if (!product) {
      console.error('❌ No product in validation')
      return false
    }
    
    console.log('🔍 Validating product:', { 
      name: product.name, 
      description: product.description, 
      price: product.price, 
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId 
    })
    
    const newErrors: Record<string, string> = {}
    
    if (!product.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    
    if (!product.description.trim()) {
      newErrors.description = 'Product description is required'
    }
    
    if (!product.price || product.price <= 0) {
      newErrors.price = 'Valid price is required'
    }
    
    if (product.stockQuantity < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required'
    }
    
    if (!product.categoryId) {
      newErrors.categoryId = 'Category is required'
    }
    
    console.log('🔍 Validation errors:', newErrors)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!product) return
    
    const { name, value } = e.target
    
    // Prevent changes to categoryId (read-only field)
    if (name === 'categoryId') {
      return
    }
    
    setProduct(prev => prev ? {
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' 
        ? Number(value) 
        : name === 'isActive'
        ? e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        : value
    } : null)
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !product) return

      setUploadingImages(true)
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('image', file)
        
        const token = localStorage.getItem('accessToken')
          const headers: Record<string, string> = {}
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers,
            body: formData
          })
          
          if (response.ok) {
            const result = await response.json()
            return result.data?.url || result.url
          } else {
          throw new Error('Upload failed')
        }
      })
      
        const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter(url => url)
      
      setProduct(prev => prev ? {
        ...prev,
        images: [...prev.images, ...validUrls]
      } : null)
      } catch (error) {
        console.error('Error uploading images:', error)
      alert('Failed to upload images. Please try again.')
      } finally {
        setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    if (!product) return
    
    setProduct(prev => prev ? {
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    } : null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔍 Form submission started:', { product, productId })
    
    if (!product) {
      console.error('❌ No product data found')
      return
    }
    
    const isValid = validateForm()
    console.log('🔍 Form validation result:', { isValid, errors })
    
    if (!isValid) {
      console.error('❌ Form validation failed:', errors)
      return
    }

    setSaving(true)
    console.log('🔄 Starting save process...')
    
    try {
      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
          stockQuantity: product.stockQuantity,
          isActive: product.isActive,
          images: product.images
        })
      })

      if (response.ok) {
          alert('Product updated successfully!')
          router.push('/admin/products')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <p className="mt-2 text-gray-600">{error || 'Product not found'}</p>
        <Link 
          href="/admin/products"
          className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/products"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-2">Update product information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                value={product.name}
                  onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 flex items-center">
                  <span>{categories.find(cat => cat.id === product.categoryId)?.name || 'Unknown Category'}</span>
                  <span className="ml-2 text-xs text-gray-400">(Read Only)</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Category cannot be changed after product creation</p>
              </div>
            </div>

          <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
              value={product.description}
                onChange={handleInputChange}
                rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (RWF) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                value={product.price}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={product.stockQuantity}
                  onChange={handleInputChange}
                  min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.stockQuantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
              {errors.stockQuantity && <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>}
              </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={product.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                Product is active
                </label>
            </div>
          </div>

          {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
              </label>
              
            {/* Current Images */}
            {product.images && product.images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative">
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-24 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-flower.jpg'
                          }}
                        />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                {uploadingImages ? 'Uploading...' : 'Add more images'}
              </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                  uploadingImages 
                    ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                    : 'bg-pink-600 hover:bg-pink-700 cursor-pointer text-white'
                }`}
              >
                <Upload className="w-3 h-3" />
                <span>Choose Files</span>
                </label>
                </div>
              </div>
            </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
            <button
              type="submit"
            disabled={saving}
            onClick={() => console.log('🔘 Save button clicked!')}
            className="flex items-center space-x-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
    </div>
  )
}
