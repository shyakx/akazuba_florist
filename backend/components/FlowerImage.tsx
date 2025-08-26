'use client'

import React, { useState } from 'react'
import { Flower, Image } from 'lucide-react'

interface FlowerImageProps {
  src: string
  alt: string
  className?: string
  fallbackColor?: string
}

const FlowerImage: React.FC<FlowerImageProps> = ({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackColor = "bg-pink-100"
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    console.log('Image failed to load:', src)
    setImageError(true)
    setImageLoading(false)
  }

  // If there's an error, show fallback
  if (imageError) {
    return (
      <div className={`${className} ${fallbackColor} flex items-center justify-center`}>
        <div className="text-center">
          <Flower className="w-12 h-12 text-pink-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 font-medium">{alt}</p>
          <p className="text-xs text-gray-500">Image coming soon</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`${className} ${fallbackColor} flex items-center justify-center`}>
          <div className="text-center">
            <Image className="w-8 h-8 text-pink-400 mx-auto mb-2 animate-pulse" />
            <p className="text-xs text-gray-500">Loading...</p>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoading ? 'hidden' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  )
}

export default FlowerImage 