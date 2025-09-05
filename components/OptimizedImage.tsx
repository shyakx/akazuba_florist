'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import { logger } from '@/lib/logger'

/**
 * Props for the OptimizedImage component
 * @interface OptimizedImageProps
 */
interface OptimizedImageProps {
  /** Image source URL */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Image width in pixels */
  width?: number
  /** Image height in pixels */
  height?: number
  /** CSS class names */
  className?: string
  /** Whether to prioritize loading this image */
  priority?: boolean
  /** Image quality (1-100) */
  quality?: number
  /** Placeholder type while loading */
  placeholder?: 'blur' | 'empty'
  /** Custom blur data URL for placeholder */
  blurDataURL?: string
  /** Responsive image sizes */
  sizes?: string
  /** Whether to fill the container */
  fill?: boolean
  /** Inline styles */
  style?: React.CSSProperties
  /** Callback when image loads successfully */
  onLoad?: () => void
  /** Callback when image fails to load */
  onError?: () => void
}

/**
 * OptimizedImage Component
 * 
 * A high-performance image component that provides:
 * - Automatic optimization via Next.js Image
 * - Loading states and error handling
 * - Performance monitoring and logging
 * - Blur placeholders for better UX
 * - Responsive image sizing
 * 
 * @param props - Component props
 * @returns JSX element
 * 
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/images/product.jpg"
 *   alt="Beautiful flower bouquet"
 *   width={300}
 *   height={300}
 *   priority={true}
 *   quality={85}
 * />
 * ```
 */

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  style,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [loadTime, setLoadTime] = useState(0)

  const handleLoad = useCallback(() => {
    const endTime = performance.now()
    setLoadTime(endTime)
    setIsLoading(false)
    setHasError(false)
    
    logger.performanceMetric('image_load_time', endTime, 'ms')
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    
    logger.error('Image failed to load', 'OPTIMIZED_IMAGE', { src, alt })
    onError?.()
  }, [src, alt, onError])

  // Generate blur placeholder if not provided
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    canvas.width = w
    canvas.height = h

    // Create a simple gradient placeholder
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(1, '#e5e7eb')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    return canvas.toDataURL()
  }

  const defaultBlurDataURL = blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined)

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm">Image failed to load</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10"
          style={{ width, height }}
        >
          <div className="text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{
          objectFit: 'cover',
          ...style
        }}
      />
    </div>
  )
}

// Specialized image components for different use cases
export const ProductImage: React.FC<{
  src: string
  alt: string
  className?: string
  priority?: boolean
}> = ({ src, alt, className = '', priority = false }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={300}
    height={300}
    className={`rounded-lg ${className}`}
    priority={priority}
    quality={85}
    placeholder="blur"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
)

export const CategoryImage: React.FC<{
  src: string
  alt: string
  className?: string
}> = ({ src, alt, className = '' }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={200}
    height={200}
    className={`rounded-lg ${className}`}
    quality={80}
    placeholder="blur"
    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
  />
)

export const HeroImage: React.FC<{
  src: string
  alt: string
  className?: string
}> = ({ src, alt, className = '' }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    fill
    className={`object-cover ${className}`}
    priority
    quality={90}
    placeholder="blur"
    sizes="100vw"
  />
)

export const AvatarImage: React.FC<{
  src: string
  alt: string
  className?: string
  size?: number
}> = ({ src, alt, className = '', size = 40 }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    className={`rounded-full ${className}`}
    quality={80}
    placeholder="blur"
    sizes={`${size}px`}
  />
)

// Image gallery component
export const ImageGallery: React.FC<{
  images: string[]
  alt: string
  className?: string
}> = ({ images, alt, className = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main image */}
      <div className="relative">
        <OptimizedImage
          src={images[selectedIndex]}
          alt={`${alt} - Image ${selectedIndex + 1}`}
          width={600}
          height={400}
          className="rounded-lg"
          priority
          quality={90}
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
        />
      </div>

      {/* Thumbnail grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative overflow-hidden rounded-md transition-opacity ${
                selectedIndex === index ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <OptimizedImage
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="object-cover"
                quality={60}
                placeholder="blur"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default OptimizedImage
