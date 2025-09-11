/**
 * Image URL Utilities
 * 
 * This module provides utilities for handling image URLs throughout the application,
 * ensuring they go through the proper image serving API routes.
 */

/**
 * Converts image URLs to the correct API format for serving
 * 
 * @param url - The image URL to convert
 * @returns The converted URL that goes through our image serving API
 * 
 * @example
 * convertImageUrl('/uploads/image-123.jpg') // Returns '/api/uploads/image-123.jpg'
 * convertImageUrl('/api/uploads/image-123.jpg') // Returns '/api/uploads/image-123.jpg' (unchanged)
 * convertImageUrl('https://example.com/image.jpg') // Returns 'https://example.com/image.jpg' (unchanged)
 */
export function convertImageUrl(url: string): string {
  if (!url) return url
  
  // If it's already an API URL, return as is
  if (url.startsWith('/api/uploads/')) return url
  
  // If it's a backend upload URL, convert to API URL
  if (url.startsWith('/uploads/')) {
    return `/api${url}`
  }
  
  // If it's already a full URL or other format, return as is
  return url
}

/**
 * Converts an array of image URLs to the correct API format
 * 
 * @param urls - Array of image URLs to convert
 * @returns Array of converted URLs
 */
export function convertImageUrls(urls: string[]): string[] {
  return urls.map(convertImageUrl)
}

/**
 * Checks if a URL is a backend upload URL that needs conversion
 * 
 * @param url - The URL to check
 * @returns True if the URL needs conversion
 */
export function needsImageUrlConversion(url: string): boolean {
  return url && url.startsWith('/uploads/') && !url.startsWith('/api/uploads/')
}
