'use client'

import React, { useState } from 'react'

const TestImagesPage = () => {
  const [imageStatus, setImageStatus] = useState<Record<string, string>>({})

  const testImages = [
    '/images/flowers/red/red-1.jpg',
    '/images/flowers/pink/pink-1.jpg',
    '/images/flowers/white/white-1.jpg',
    '/images/flowers/yellow/yellow-1.jpg',
    '/images/flowers/mixed/mixed-1.jpg',
    '/images/placeholder-flower.jpg'
  ]

  const handleImageLoad = (src: string) => {
    setImageStatus(prev => ({ ...prev, [src]: 'loaded' }))
    console.log('✅ Image loaded successfully:', src)
  }

  const handleImageError = (src: string) => {
    setImageStatus(prev => ({ ...prev, [src]: 'failed' }))
    console.error('❌ Image failed to load:', src)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Image Loading Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testImages.map((imageSrc) => (
            <div key={imageSrc} className="bg-white rounded-lg shadow-md p-4">
              <div className="aspect-square mb-4">
                <img
                  src={imageSrc}
                  alt={`Test image: ${imageSrc}`}
                  className="w-full h-full object-cover rounded-lg"
                  onLoad={() => handleImageLoad(imageSrc)}
                  onError={() => handleImageError(imageSrc)}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {imageSrc}
                </p>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  imageStatus[imageSrc] === 'loaded' 
                    ? 'bg-green-100 text-green-800' 
                    : imageStatus[imageSrc] === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {imageStatus[imageSrc] || 'loading...'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Base URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server'}</p>
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestImagesPage
