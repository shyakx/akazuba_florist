'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Upload,
  Save,
  X,
  AlertCircle,
  CheckCircle
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

interface NewProduct {
  name: string
  description: string
  price: string
  stockQuantity: string
  categoryId: string
  images: string[]
  sku: string
  weight: string
  tags: string[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    images: [],
    sku: '',
    weight: '',
    tags: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Categories for the dropdown
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
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/admin/products', { headers })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data || data || [])
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!newProduct.name.trim()) {
      newErrors.name = 'Product name is required'
    } else if (newProduct.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters'
    }
    
    if (!newProduct.description.trim()) {
      newErrors.description = 'Product description is required'
    } else if (newProduct.description.trim().length < 10) {
      newErrors.description = 'Product description must be at least 10 characters'
    }
    
    if (!newProduct.price || Number(newProduct.price) <= 0) {
      newErrors.price = 'Valid price is required (must be greater than 0)'
    } else if (Number(newProduct.price) > 1000000) {
      newErrors.price = 'Price seems too high (max 1,000,000)'
    }
    
    if (!newProduct.stockQuantity || Number(newProduct.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required (must be 0 or greater)'
    } else if (Number(newProduct.stockQuantity) > 10000) {
      newErrors.stockQuantity = 'Stock quantity seems too high (max 10,000)'
    }
    
    if (!newProduct.categoryId) {
      newErrors.categoryId = 'Category is required'
    }
    
    if (newProduct.images.length === 0) {
      newErrors.images = 'At least one image is required'
    }
    
    if (newProduct.sku && newProduct.sku.trim().length < 3) {
      newErrors.sku = 'SKU must be at least 3 characters if provided'
    }
    
    if (newProduct.weight && Number(newProduct.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0 if provided'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProduct(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Validate files
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" is not an image. Please select only image files.`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`File "${file.name}" is too large. Please select images smaller than 5MB.`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Create local preview URLs immediately
    const newImageUrls: string[] = []
    
    validFiles.forEach(file => {
      const localUrl = URL.createObjectURL(file)
      newImageUrls.push(localUrl)
    })

    // Add to product images
    setNewProduct(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls]
    }))

    setMessage({ type: 'success', text: `Added ${validFiles.length} image(s) for preview!` })
    setTimeout(() => setMessage(null), 3000)

    // Clear the file input
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setNewProduct(prev => {
      const newImages = [...prev.images]
      const removedImage = newImages[index]
      
      // Clean up object URL to prevent memory leaks
      if (removedImage && removedImage.startsWith('blob:')) {
        URL.revokeObjectURL(removedImage)
      }
      
      return {
        ...prev,
        images: newImages.filter((_, i) => i !== index)
      }
    })
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    
    try {
      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // For now, use placeholder images to simplify the process
      const uploadedImageUrls = newProduct.images.length > 0 
        ? ['/images/placeholder-flower.jpg'] 
        : []

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newProduct.name.trim(),
          description: newProduct.description.trim(),
          price: Number(newProduct.price),
          categoryId: newProduct.categoryId,
          stockQuantity: Number(newProduct.stockQuantity) || 0,
          isActive: true,
          images: uploadedImageUrls,
          sku: newProduct.sku.trim() || undefined,
          weight: newProduct.weight ? Number(newProduct.weight) : undefined,
          tags: newProduct.tags
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Show success message
          setMessage({ type: 'success', text: 'Product added successfully!' })
          
          // Clean up object URLs before closing modal
          newProduct.images.forEach(url => {
            if (url.startsWith('blob:')) {
              URL.revokeObjectURL(url)
            }
          })
          
          // Close modal and reset form
          setShowAddModal(false)
          setNewProduct({ name: '', description: '', price: '', stockQuantity: '', categoryId: '', images: [], sku: '', weight: '', tags: [] })
          setErrors({})
          
          // Refresh the product list
          await fetchProducts()
          
          // Clear success message after 3 seconds
          setTimeout(() => setMessage(null), 3000)
        } else {
          throw new Error(result.message || 'Failed to add product')
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      setMessage({ type: 'error', text: `Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}` })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      setDeleting(productId)
      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          alert('Product deleted successfully!')
          // Remove the product from the local state immediately
          setProducts(prev => prev.filter(product => product.id !== productId))
          // Also refresh from server to ensure consistency
          fetchProducts()
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
    } finally {
      setDeleting(null)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <p className="mt-2 text-gray-600">{error}</p>
        <button 
          onClick={fetchProducts} 
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage your flowers and perfumes inventory</p>
            </div>
            <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
          </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {message.text}
          <button 
            onClick={() => setMessage(null)}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
            placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-flower.jpg'
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-pink-600">RWF {product.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500">Stock: {product.stockQuantity}</span>
                  </div>

              {/* Actions */}
                  <div className="flex items-center space-x-2">
                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                        <Edit className="w-4 h-4" />
                  <span>Edit</span>
                    </Link>
                    <button
                  onClick={() => handleDeleteProduct(product.id)}
                  disabled={deleting === product.id}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting === product.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                      <Trash2 className="w-4 h-4" />
                  )}
                    </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first product'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add New Product</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewProduct({ name: '', description: '', price: '', stockQuantity: '', categoryId: '', images: [], sku: '', weight: '', tags: [] })
                  setErrors({})
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddProduct} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newProduct.name}
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
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={newProduct.categoryId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.categoryId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product description"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (RWF) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
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
                    value={newProduct.stockQuantity}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.stockQuantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.stockQuantity && <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>}
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                    SKU (Optional)
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={newProduct.sku}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.sku ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., FLW-001, PRF-001"
                  />
                  {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg) (Optional)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={newProduct.weight}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.weight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.0"
                  />
                  {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 hover:bg-gray-50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Click to upload images</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Supports: JPG, PNG, GIF (Max 5MB each)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-md bg-pink-600 hover:bg-pink-700 cursor-pointer text-white transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Choose Files</span>
                  </label>
                </div>
                
                {errors.images && (
                  <p className="mt-2 text-sm text-red-600">{errors.images}</p>
                )}
                
                {newProduct.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Uploaded Images ({newProduct.images.length})</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {newProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder-flower.jpg'
                                e.currentTarget.alt = 'Failed to load image'
                              }}
                              onLoad={() => {
                                console.log(`✅ Image ${index + 1} loaded successfully:`, image)
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Image {index + 1}
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
                  onClick={() => {
                    // Clean up object URLs before closing modal
                    newProduct.images.forEach(url => {
                      if (url.startsWith('blob:')) {
                        URL.revokeObjectURL(url)
                      }
                    })
                    
                    setShowAddModal(false)
                    setNewProduct({ name: '', description: '', price: '', stockQuantity: '', categoryId: '', images: [], sku: '', weight: '', tags: [] })
                    setErrors({})
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Add Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}