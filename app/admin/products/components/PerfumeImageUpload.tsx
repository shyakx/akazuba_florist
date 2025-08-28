'use client'

import React, { useState } from 'react'
import { X, Upload, Trash2, Image as ImageIcon, Plus, Save, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

interface PerfumeImageUploadProps {
  productId: string
  productName: string
  currentImage: string
  onClose: () => void
  onUpdate: (newImagePath: string) => Promise<void>
}

const PerfumeImageUpload: React.FC<PerfumeImageUploadProps> = ({ 
  productId, 
  productName, 
  currentImage, 
  onClose, 
  onUpdate 
}) => {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image file')
      return
    }

    try {
      setLoading(true)
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('productId', productId)
      formData.append('productName', productName)

      // Here you would call your API to upload the image
      // For now, we'll simulate the upload and generate a local path
      const fileName = `perfume-${productId}.jpg`
      const newImagePath = `/images/perfumes/${fileName}`
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await onUpdate(newImagePath)
      toast.success('Image updated successfully!')
      onClose()
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setLoading(false)
    }
  }

  const handleImageDelete = async () => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        setLoading(true)
        
        // Here you would call your API to delete the image
        // For now, we'll use a placeholder image
        const placeholderPath = '/images/perfumes/placeholder.jpg'
        
        await onUpdate(placeholderPath)
        toast.success('Image deleted successfully!')
        onClose()
      } catch (error) {
        console.error('Error deleting image:', error)
        toast.error('Failed to delete image')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Perfume Image Management</h2>
            <p className="text-sm text-gray-600 mt-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Image */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Image</h3>
            <div className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden max-w-xs">
                <img
                  src={currentImage}
                  alt={productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/perfumes/placeholder.jpg'
                  }}
                />
              </div>
              <button
                onClick={handleImageDelete}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Upload New Image */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Upload New Image</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
                disabled={loading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {previewUrl ? (
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden max-w-xs mb-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  {previewUrl ? 'Click to change image' : 'Click to upload image'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleImageUpload}
              disabled={!selectedFile || loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Upload Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfumeImageUpload
