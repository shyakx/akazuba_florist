'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { updateProduct, refreshProducts, markChangesSaved } = useAdmin()
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    status: 'active',
    images: [] as string[]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch('/api/admin/categories', {
          method: 'GET',
          headers
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            // Backend returns data directly as array, not wrapped in categories property
            setCategories(Array.isArray(result.data) ? result.data : result.data.categories || [])
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    
    loadCategories()
  }, [])

  // Load product data from API
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setInitialLoading(true)
        
        // Get the JWT token using the proper utility function
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch(`/api/admin/products/${productId}`, {
          headers
        })
        if (!response.ok) throw new Error('Failed to fetch product')
        
        const result = await response.json()
        if (result.success && result.data) {
          const product = result.data
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            category: product.category || '',
            stock: product.stock?.toString() || '',
            status: product.status || 'active',
            images: product.images || []
          })
        } else {
          throw new Error('Failed to fetch product data')
        }
      } catch (error) {
        console.error('Error loading product:', error)
        alert('Failed to load product. Please try again.')
      } finally {
        setInitialLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleDragDropUpload = async (files: File[]) => {
    if (files.length === 0) return
    
    setUploadingImages(true)
    const uploadPromises = Array.from(files).map(async (file) => {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('image', file)
      
      try {
        // Upload to backend
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
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
          const imageUrl = result.data?.url || result.url
          console.log('✅ Upload successful, returned URL:', imageUrl)
          return imageUrl
        } else {
          console.error('Upload failed:', response.statusText)
          // Fallback to a placeholder image
          return '/api/uploads/placeholder-product.jpg'
        }
      } catch (error) {
        console.error('Upload error:', error)
        // Fallback to a placeholder image
        return '/api/uploads/placeholder-product.jpg'
      }
    })
    
    try {
      const uploadedUrls = await Promise.all(uploadPromises)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload some images. Please try again.')
    } finally {
      setUploadingImages(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setUploadingImages(true)
      const uploadPromises = Array.from(files).map(async (file) => {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append('image', file)
        
        try {
          // Upload to backend
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
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
            console.error('Upload failed:', response.statusText)
            // Fallback to a placeholder image
            return '/api/uploads/placeholder-product.jpg'
          }
        } catch (error) {
          console.error('Upload error:', error)
          // Fallback to a placeholder image
          return '/api/uploads/placeholder-product.jpg'
        }
      })
      
      try {
        const uploadedUrls = await Promise.all(uploadPromises)
      setFormData(prev => ({
        ...prev,
          images: [...prev.images, ...uploadedUrls]
        }))
      } catch (error) {
        console.error('Error uploading images:', error)
        alert('Failed to upload some images. Please try again.')
      } finally {
        setUploadingImages(false)
      }
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      // Get the JWT token using the proper utility function
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        status: formData.status,
        images: formData.images
      }
      
      console.log('🔄 Updating product with data:', updateData)
      
      // Use the unified service via AdminContext
      await updateProduct(productId, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        status: formData.status as 'active' | 'inactive',
        images: formData.images
      })
      
      alert('Product updated successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      alert(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="admin-content">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Loading product...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product information</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category: Category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (RWF) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.stock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images
              </label>
              
              {/* Drag and Drop Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('border-blue-400', 'bg-blue-50')
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                  
                  const files = Array.from(e.dataTransfer.files).filter(file => 
                    file.type.startsWith('image/')
                  )
                  
                  if (files.length > 0) {
                    handleDragDropUpload(files)
                  }
                }}
              >
                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <div className="text-center">
                      <div className="text-sm text-gray-600">
                        Drag and drop images here, or{' '}
                        <label className={`inline-flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                          uploadingImages 
                            ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer text-white'
                        }`}>
                          {uploadingImages ? (
                            <>
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3" />
                              <span>Choose Files</span>
                            </>
                          )}
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImages}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        PNG, JPG up to 5MB each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {formData.images.length} image(s) selected
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, images: [] }))}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.startsWith('blob:') ? image : image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.src = '/images/placeholder-product.jpg'
                        }}
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded truncate">
                          {image.includes('/uploads/') ? 'New Upload' : 'Existing'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
