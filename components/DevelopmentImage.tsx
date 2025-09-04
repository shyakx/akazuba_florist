'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface DevelopmentImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
}

const DevelopmentImage: React.FC<DevelopmentImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  fallbackSrc = '/images/placeholder-flower.jpg'
}) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    setImgSrc(src)
    setHasError(false)
  }, [src])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      if (isDevelopment) {
        // In development, try to use HTTP instead of HTTPS for external images
        if (imgSrc.startsWith('https://images.unsplash.com')) {
          const httpSrc = imgSrc.replace('https://', 'http://')
          setImgSrc(httpSrc)
        } else {
          // Use fallback image
          setImgSrc(fallbackSrc)
        }
      } else {
        // In production, use fallback
        setImgSrc(fallbackSrc)
      }
    } else {
      // If we already tried HTTP and it failed, use fallback
      setImgSrc(fallbackSrc)
    }
  }

  // In development, try to handle SSL issues by using a different approach
  if (isDevelopment && src.includes('unsplash.com')) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={handleError}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          crossOrigin="anonymous"
        />
      </div>
    )
  }

  // In production, use Next.js Image component
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={isDevelopment}
    />
  )
}

export default DevelopmentImage 