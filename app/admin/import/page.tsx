'use client'

import React, { useState, useRef } from 'react'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Eye,
  Trash2,
  Plus,
  X
} from 'lucide-react'

interface ImportResult {
  success: number
  errors: number
  total: number
  details: Array<{
    row: number
    product: string
    status: 'success' | 'error'
    message: string
  }>
}

interface ImportPreview {
  name: string
  price: number
  description: string
  category: string
  color?: string
  type?: string
  images: string[]
  videos: string[]
}

export default function ImportPage() {
  const [importType, setImportType] = useState<'csv' | 'json' | 'manual'>('csv')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ImportPreview[]>([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Manual product entry
  const [manualProduct, setManualProduct] = useState<ImportPreview>({
    name: '',
    price: 0,
    description: '',
    category: 'flowers',
    color: '',
    type: '',
    images: [],
    videos: []
  })

  const categories = [
    { id: 'flowers', name: 'Flowers' },
    { id: 'perfumes', name: 'Perfumes' },
    { id: 'wedding', name: 'Wedding Flowers' },
    { id: 'funerals', name: 'Funeral Flowers' },
    { id: 'birthday', name: 'Birthday Flowers' },
    { id: 'valentine', name: 'Valentine Flowers' }
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)

    try {
      if (importType === 'csv') {
        await parseCSV(selectedFile)
      } else if (importType === 'json') {
        await parseJSON(selectedFile)
      }
    } catch (error) {
      console.error('Error parsing file:', error)
      setError('Error parsing file. Please check the format.')
    }
  }

  const parseCSV = async (file: File) => {
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row')
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredHeaders = ['name', 'price', 'description', 'category']
    
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        throw new Error(`Missing required column: ${required}`)
      }
    }

    const preview: ImportPreview[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row: any = {}
      
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })

      // Parse images and videos from comma-separated strings
      const images = row.images ? row.images.split('|').filter((img: string) => img.trim()) : []
      const videos = row.videos ? row.videos.split('|').filter((vid: string) => vid.trim()) : []

      preview.push({
        name: row.name,
        price: parseFloat(row.price) || 0,
        description: row.description,
        category: row.category,
        color: row.color || '',
        type: row.type || '',
        images,
        videos
      })
    }

    setPreview(preview)
  }

  const parseJSON = async (file: File) => {
    const text = await file.text()
    const data = JSON.parse(text)
    
    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of products')
    }

    const preview: ImportPreview[] = data.map((item: any) => ({
      name: item.name || '',
      price: parseFloat(item.price) || 0,
      description: item.description || '',
      category: item.category || 'flowers',
      color: item.color || '',
      type: item.type || '',
      images: Array.isArray(item.images) ? item.images : [],
      videos: Array.isArray(item.videos) ? item.videos : []
    }))

    setPreview(preview)
  }

  const addManualProduct = () => {
    if (manualProduct.name && manualProduct.description && manualProduct.price > 0) {
      setPreview([...preview, { ...manualProduct }])
      setManualProduct({
        name: '',
        price: 0,
        description: '',
        category: 'flowers',
        color: '',
        type: '',
        images: [],
        videos: []
      })
    }
  }

  const removePreviewItem = (index: number) => {
    setPreview(preview.filter((_, i) => i !== index))
  }

  const startImport = async () => {
    if (preview.length === 0) {
      setError('No products to import')
      return
    }

    setImporting(true)
    setError(null)

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ products: preview })
      })

      const result = await response.json()
      
      if (result.success) {
        setImportResult(result.data)
        setPreview([])
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setError(result.message || 'Import failed')
      }
    } catch (error) {
      console.error('Import error:', error)
      setError('Import failed. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `name,price,description,category,color,type,images,videos
Red Rose,45500,"Beautiful red rose perfect for any occasion",flowers,red,Rose,"/images/flowers/red-rose-1.jpg|/images/flowers/red-rose-2.jpg","/videos/red-rose-demo.mp4"
White Lily,39000,"Elegant white lily for special moments",flowers,white,Lily,"/images/flowers/white-lily-1.jpg","/videos/white-lily-demo.mp4"
Pink Peony,52000,"Gorgeous pink peony for celebrations",flowers,pink,Peony,"/images/flowers/pink-peony-1.jpg|/images/flowers/pink-peony-2.jpg",""`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-import-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Import Products</h1>
            <p className="text-gray-600 mt-1">Bulk import products from CSV, JSON, or add them manually</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Template</span>
          </button>
        </div>
      </div>

      {/* Import Type Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setImportType('csv')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              importType === 'csv'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-medium">CSV File</h3>
            <p className="text-sm text-gray-600">Upload a CSV file with product data</p>
          </button>
          
          <button
            onClick={() => setImportType('json')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              importType === 'json'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-medium">JSON File</h3>
            <p className="text-sm text-gray-600">Upload a JSON file with product data</p>
          </button>
          
          <button
            onClick={() => setImportType('manual')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              importType === 'manual'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Plus className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-medium">Manual Entry</h3>
            <p className="text-sm text-gray-600">Add products one by one</p>
          </button>
        </div>
      </div>

      {/* File Upload or Manual Entry */}
      {importType !== 'manual' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {importType === 'csv' ? 'Upload CSV File' : 'Upload JSON File'}
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {importType === 'csv' 
                ? 'Upload a CSV file with product data. Use the template for proper formatting.'
                : 'Upload a JSON file with product data.'
              }
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={importType === 'csv' ? '.csv' : '.json'}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Choose File
            </button>
            {file && (
              <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>
            )}
          </div>
        </div>
      ) : (
        /* Manual Entry Form */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Product Manually</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={manualProduct.name}
                onChange={(e) => setManualProduct({...manualProduct, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (RWF) *</label>
              <input
                type="number"
                value={manualProduct.price}
                onChange={(e) => setManualProduct({...manualProduct, price: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter price"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={manualProduct.description}
                onChange={(e) => setManualProduct({...manualProduct, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter product description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={manualProduct.category}
                onChange={(e) => setManualProduct({...manualProduct, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={manualProduct.color}
                onChange={(e) => setManualProduct({...manualProduct, color: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Red, Pink, White"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                value={manualProduct.type}
                onChange={(e) => setManualProduct({...manualProduct, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Rose, Lily, Perfume"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Images (URLs, separated by |)</label>
              <input
                type="text"
                value={manualProduct.images.join('|')}
                onChange={(e) => setManualProduct({...manualProduct, images: e.target.value.split('|').filter(url => url.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="/images/product1.jpg|/images/product2.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Videos (URLs, separated by |)</label>
              <input
                type="text"
                value={manualProduct.videos.join('|')}
                onChange={(e) => setManualProduct({...manualProduct, videos: e.target.value.split('|').filter(url => url.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="/videos/product1.mp4|/videos/product2.mp4"
              />
            </div>
          </div>
          
          <button
            onClick={addManualProduct}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Preview</span>
          </button>
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Preview ({preview.length} products)
            </h2>
            <button
              onClick={startImport}
              disabled={importing}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Import Products</span>
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-4">
            {preview.map((product, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Price: RWF {product.price.toLocaleString()}</span>
                      <span>Category: {product.category}</span>
                      {product.color && <span>Color: {product.color}</span>}
                      {product.type && <span>Type: {product.type}</span>}
                    </div>
                    {product.images.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Images: {product.images.length} file(s)
                      </p>
                    )}
                    {product.videos.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Videos: {product.videos.length} file(s)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removePreviewItem(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import Results */}
      {importResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            {importResult.success > 0 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
            <h2 className="text-lg font-semibold text-gray-900">Import Results</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
              <div className="text-sm text-green-700">Successfully Imported</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{importResult.errors}</div>
              <div className="text-sm text-red-700">Errors</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{importResult.total}</div>
              <div className="text-sm text-blue-700">Total Processed</div>
            </div>
          </div>
          
          {importResult.details.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Details:</h3>
              {importResult.details.map((detail, index) => (
                <div key={index} className={`p-2 rounded text-sm ${
                  detail.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  Row {detail.row}: {detail.product} - {detail.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
