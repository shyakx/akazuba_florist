'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Tag, 
  Package, 
  Save, 
  Plus, 
  Trash2, 
  Edit,
  Eye,
  Star,
  DollarSign,
  Palette,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: 'flowers' | 'bouquets' | 'arrangements' | 'wedding' | 'seasonal'
  featured: boolean
  description: string
  color: string
  type: string
  stock?: number
  status?: 'active' | 'inactive'
}

interface EnhancedProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
  mode: 'add' | 'edit'
  onSave: (product: Product) => void
  onDelete?: (productId: number) => void
}

const EnhancedProductModal = ({ 
  isOpen, 
  onClose, 
  product, 
  mode, 
  onSave, 
  onDelete 
}: EnhancedProductModalProps) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    image: '',
    category: 'flowers',
    featured: false,
    description: '',
    color: 'red',
    type: 'Rose',
    stock: 10,
    status: 'active'
  })
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form data when product changes
  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        ...product,
        stock: product.stock || 10,
        status: product.status || 'active'
      })
      setUploadedImages([product.image])
      setPreviewImage(product.image)
    } else {
      setFormData({
        name: '',
        price: 0,
        image: '',
        category: 'flowers',
        featured: false,
        description: '',
        color: 'red',
        type: 'Rose',
        stock: 10,
        status: 'active'
      })
      setUploadedImages([])
      setPreviewImage('')
    }
    setErrors({})
  }, [product, mode])

  const categories = [
    { value: 'flowers', label: 'Flowers' },
    { value: 'bouquets', label: 'Bouquets' },
    { value: 'arrangements', label: 'Arrangements' },
    { value: 'wedding', label: 'Wedding Flowers' },
    { value: 'seasonal', label: 'Seasonal' }
  ]

  const colors = [
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'white', label: 'White', class: 'bg-white border border-gray-300' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'mixed', label: 'Mixed', class: 'bg-gradient-to-r from-pink-500 to-purple-500' }
  ]

  const flowerTypes = [
    'Rose', 'Tulip', 'Lily', 'Sunflower', 'Orchid', 'Carnation', 
    'Daisy', 'Peony', 'Chrysanthemum', 'Dahlia', 'Geranium', 'Poppy'
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required'
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }
    
    if (!formData.image?.trim()) {
      newErrors.image = 'Product image is required'
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.type?.trim()) {
      newErrors.type = 'Flower type is required'
    }
    
    if (!formData.color?.trim()) {
      newErrors.color = 'Color is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    
    try {
      const file = files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      // Create a preview URL
      const imageUrl = URL.createObjectURL(file)
      
      // In a real app, you would upload to your server/cloud storage here
      // For now, we'll use the preview URL
      const uploadedUrl = imageUrl
      
      setFormData(prev => ({ ...prev, image: uploadedUrl }))
      setUploadedImages([uploadedUrl])
      setPreviewImage(uploadedUrl)
      
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      const productData: Product = {
        id: product?.id || Date.now(),
        name: formData.name!,
        price: formData.price!,
        image: formData.image!,
        category: formData.category!,
        featured: formData.featured!,
        description: formData.description!,
        color: formData.color!,
        type: formData.type!,
        stock: formData.stock,
        status: formData.status
      }

      onSave(productData)
      toast.success(mode === 'add' ? 'Product added successfully' : 'Product updated successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to save product')
    }
  }

  const handleDelete = () => {
    if (!product?.id || !onDelete) return
    
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      onDelete(product.id)
      toast.success('Product deleted successfully')
      onClose()
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'add' ? 'Add New Product' : `Edit Product #${product?.id}`}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === 'add' ? 'Create a new product for your store' : `Update "${product?.name}" - Individual product editing`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-pink-500" />
                  <span>Basic Information</span>
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.description}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (RWF) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="100"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                    </div>
                    {formData.price && formData.price > 0 && (
                      <p className="mt-1 text-sm text-gray-600">
                        Display: {formatPrice(formData.price)}
                      </p>
                    )}
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.price}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Type */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-pink-500" />
                  <span>Category & Type</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flower Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select type</option>
                      {flowerTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.type}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-pink-500" />
                  <span>Color</span>
                </h3>
                
                <div className="grid grid-cols-4 gap-3">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        formData.color === color.value
                          ? 'border-pink-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-8 rounded ${color.class}`}></div>
                      <span className="block text-xs text-gray-700 mt-2 text-center">
                        {color.label}
                      </span>
                      {formData.color === color.value && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {errors.color && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.color}</span>
                  </p>
                )}
              </div>

              {/* Status & Featured */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-pink-500" />
                  <span>Status & Settings</span>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Featured Product
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-pink-500" />
                <span>Product Image</span>
              </h3>

              {/* Image Upload Area */}
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    errors.image 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
                  }`}
                >
                  {previewImage ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Product preview"
                          className="w-full h-64 object-cover rounded-lg"
                          onError={(e) => {
                            // Fallback for broken images
                            const target = e.target as HTMLImageElement
                            target.src = '/images/placeholder-flower.jpg'
                            target.onerror = null // Prevent infinite loop
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage('')
                            setFormData(prev => ({ ...prev, image: '' }))
                            setUploadedImages([])
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {mode === 'edit' && (
                          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            Product #{product?.id}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {mode === 'edit' ? 'Current product image - Click to change' : 'Product image preview'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-pink-600 hover:text-pink-500 cursor-pointer">
                            Click to upload
                          </span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        {mode === 'edit' && (
                          <p className="text-xs text-blue-600 mt-1">
                            This will replace the current image for this specific product
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Choose Image</span>
                    </>
                  )}
                </button>

                {errors.image && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.image}</span>
                  </p>
                )}
              </div>

              {/* Product Preview */}
              {formData.name && formData.price && formData.price > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Product Preview</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {mode === 'edit' && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Product ID: #{product?.id}</span>
                          <span className="text-xs text-blue-600 font-medium">Individual Product</span>
                        </div>
                      )}
                      <h5 className="font-semibold text-gray-900">{formData.name}</h5>
                      <p className="text-sm text-gray-600">{formData.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(formData.price || 0)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            formData.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {formData.status}
                          </span>
                          {formData.featured && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Type: {formData.type}</span>
                        <span>Color: {formData.color}</span>
                        <span>Stock: {formData.stock || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-3">
              {mode === 'edit' && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Product</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300"
              >
                <Save className="h-4 w-4" />
                <span>{mode === 'add' ? 'Add Product' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EnhancedProductModal 