// Image utility functions for robust image handling

export interface ImageValidationResult {
  isValid: boolean
  url: string
  error?: string
}

/**
 * Validates and normalizes image URLs
 */
export function validateImageUrl(url: string | null | undefined): ImageValidationResult {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      url: '/images/placeholder-product.jpg',
      error: 'Invalid or empty URL'
    }
  }

  const cleanUrl = url.trim()
  console.log('🔍 Validating image URL:', cleanUrl)
  
  // Fix common incorrect URL patterns
  let normalizedUrl = cleanUrl
  
  // Fix typo URLs (common misspellings)
  normalizedUrl = normalizedUrl.replace(/\/imagees\//g, '/images/')
  normalizedUrl = normalizedUrl.replace(/\/imaages\//g, '/images/')
  normalizedUrl = normalizedUrl.replace(/\/imagess\//g, '/images/')
  normalizedUrl = normalizedUrl.replace(/\/immages\//g, '/images/')
  normalizedUrl = normalizedUrl.replace(/\/imgaes\//g, '/images/')
  normalizedUrl = normalizedUrl.replace(/\/imags\//g, '/images/')
  
  // Fix double slashes
  normalizedUrl = normalizedUrl.replace(/\/\/+/g, '/')
  
  // Fix API uploads pattern
  if (normalizedUrl.startsWith('/api/uploads/')) {
    normalizedUrl = normalizedUrl.replace('/api/uploads/', '/uploads/')
  }

  // Validate URL format - check for full URLs first
  if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
    console.log('✅ Full URL detected, returning as-is:', normalizedUrl)
    return {
      isValid: true,
      url: normalizedUrl
    }
  }

  // Check if it's already a complete backend URL (prevent double-processing)
  if (normalizedUrl.includes('akazuba-backend-api.onrender.com') || normalizedUrl.includes('localhost:5000')) {
    console.log('✅ Backend URL detected, returning as-is:', normalizedUrl)
    return {
      isValid: true,
      url: normalizedUrl
    }
  }

  // Handle relative upload paths
  if (normalizedUrl.startsWith('/uploads/')) {
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000' 
      : 'https://akazuba-backend-api.onrender.com'
    return {
      isValid: true,
      url: `${backendUrl}${normalizedUrl}`
    }
  }

  if (normalizedUrl.startsWith('/images/')) {
    return {
      isValid: true,
      url: normalizedUrl
    }
  }

  // If it's just a filename, assume it's in uploads
  if (!normalizedUrl.startsWith('/')) {
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000' 
      : 'https://akazuba-backend-api.onrender.com'
    console.log('📁 Filename detected, constructing URL:', `${backendUrl}/uploads/${normalizedUrl}`)
    return {
      isValid: true,
      url: `${backendUrl}/uploads/${normalizedUrl}`
    }
  }

  return {
    isValid: false,
    url: '/images/placeholder-product.jpg',
    error: 'Unknown URL format'
  }
}

/**
 * Gets appropriate placeholder based on product type
 */
export function getPlaceholderForProductType(productType?: string): string {
  if (!productType) return '/images/placeholder-product.jpg'
  
  const type = productType.toLowerCase()
  if (type.includes('perfume')) {
    return '/images/placeholder-perfume.jpg'
  } else if (type.includes('flower')) {
    return '/images/placeholder-flower.jpg'
  } else {
    return '/images/placeholder-product.jpg'
  }
}

/**
 * Validates and processes an array of image URLs
 */
export function processImageArray(images: any[], productType?: string): string[] {
  if (!Array.isArray(images) || images.length === 0) {
    return [getPlaceholderForProductType(productType)]
  }

  const processedImages: string[] = []
  
  for (const img of images) {
    const result = validateImageUrl(img)
    if (result.isValid) {
      processedImages.push(result.url)
    }
  }

  // If no valid images found, use placeholder
  if (processedImages.length === 0) {
    return [getPlaceholderForProductType(productType)]
  }

  return processedImages
}

/**
 * Checks if an image URL is a placeholder
 */
export function isPlaceholderImage(url: string): boolean {
  return url.includes('placeholder-') || url.includes('placeholder.')
}

/**
 * Gets fallback image URL for error handling
 */
export function getFallbackImage(currentUrl: string, productType?: string): string {
  // If current URL is already a placeholder, try a different one
  if (isPlaceholderImage(currentUrl)) {
    if (currentUrl.includes('placeholder-flower.jpg')) {
      return '/images/placeholder-product.jpg'
    } else if (currentUrl.includes('placeholder-perfume.jpg')) {
      return '/images/placeholder-flower.jpg'
    } else {
      return getPlaceholderForProductType(productType)
    }
  }

  // If it's a backend URL that failed, try frontend placeholder
  if (currentUrl.includes('localhost:5000') || currentUrl.includes('akazuba-backend-api.onrender.com')) {
    return getPlaceholderForProductType(productType)
  }

  // Default fallback
  return '/images/placeholder-product.jpg'
}