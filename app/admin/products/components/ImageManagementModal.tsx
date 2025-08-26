'use client'

import React, { useState } from 'react'
import { X, Upload, Trash2, Image as ImageIcon, Plus } from 'lucide-react'
import { AdminProduct } from '@/lib/adminApi'

interface ImageManagementModalProps {
  product: AdminProduct
  onClose: () => void
  onUpdate: () => Promise<void>
}

const ImageManagementModal: React.FC<ImageManagementModalProps> = ({ product, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [operation, setOperation] = useState<'add' | 'replace'>('add')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return

    try {
      setLoading(true)
      // Here you would call your API to upload images
      // await adminAPI.updateProductImages({
      //   productId: product.id,
      //   images: selectedFiles,
      //   operation
      // })
      
      await onUpdate()
      onClose()
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageDelete = async (imageUrl: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        setLoading(true)
        // Here you would call your API to delete the image
        // await adminAPI.updateProductImages({
        //   productId: product.id,
        //   images: [],
        //   operation: 'remove',
        //   imageUrls: [imageUrl]
        // })
        
        await onUpdate()
      } catch (error) {
        console.error('Error deleting image:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Image Management</h2>
            <p className="text-sm text-gray-600 mt-1">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Images */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images ({product.images.length})</h3>
            {product.images.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No images uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleImageDelete(image)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload New Images */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700 mb-3">Upload New Images</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value as 'add' | 'replace')}
                  className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="add">Add to existing</option>
                  <option value="replace">Replace all images</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-blue-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-blue-500 mb-4">
                  PNG, JPG, GIF up to 10MB each
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Select Images</span>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-blue-700 mb-2">Selected Files ({selectedFiles.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image Guidelines */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-700 mb-2">Image Guidelines</h3>
            <ul className="text-sm text-yellow-600 space-y-1">
              <li>• First image will be the primary product image</li>
              <li>• Recommended size: 800x800 pixels or larger</li>
              <li>• Supported formats: JPG, PNG, GIF</li>
              <li>• Maximum file size: 10MB per image</li>
              <li>• Use high-quality, well-lit images</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImageUpload}
            disabled={loading || selectedFiles.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Images</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageManagementModal
