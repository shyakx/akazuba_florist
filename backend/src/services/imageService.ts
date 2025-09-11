/**
 * Centralized image management service
 */

import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface ImageUploadResult {
  success: boolean
  url?: string
  filename?: string
  originalName?: string
  size?: number
  error?: string
}

/**
 * Generate a unique filename for uploaded images
 */
export function generateImageFilename(originalName: string): string {
  const ext = path.extname(originalName)
  const timestamp = Date.now()
  const uuid = uuidv4().substring(0, 8)
  return `image-${timestamp}-${uuid}${ext}`
}

/**
 * Validate image file
 */
export function validateImageFile(file: any): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' }
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 10MB limit' }
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.mimetype)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' }
  }

  return { isValid: true }
}

/**
 * Save uploaded image to disk
 */
export async function saveImage(file: any, uploadDir: string): Promise<ImageUploadResult> {
  try {
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      }
    }

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const filename = generateImageFilename(file.originalname)
    const filepath = path.join(uploadDir, filename)

    // Save file
    await fs.writeFile(filepath, file.buffer)

    return {
      success: true,
      url: `/uploads/${filename}`,
      filename,
      originalName: file.originalname,
      size: file.size
    }

  } catch (error) {
    console.error('Error saving image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save image'
    }
  }
}

/**
 * Delete image file
 */
export async function deleteImage(imageUrl: string, uploadDir: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return { success: false, error: 'Invalid image URL' }
    }

    const filename = path.basename(imageUrl)
    const filepath = path.join(uploadDir, filename)

    // Check if file exists
    try {
      await fs.access(filepath)
    } catch {
      // File doesn't exist, consider it deleted
      return { success: true }
    }

    // Delete file
    await fs.unlink(filepath)

    return { success: true }

  } catch (error) {
    console.error('Error deleting image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image'
    }
  }
}

/**
 * Clean up unused images
 */
export async function cleanupUnusedImages(uploadDir: string, usedImageUrls: string[]): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  try {
    const files = await fs.readdir(uploadDir)
    let deletedCount = 0

    for (const file of files) {
      const fileUrl = `/uploads/${file}`
      if (!usedImageUrls.includes(fileUrl)) {
        try {
          await fs.unlink(path.join(uploadDir, file))
          deletedCount++
        } catch (error) {
          console.warn(`Failed to delete unused image: ${file}`, error)
        }
      }
    }

    return { success: true, deletedCount }

  } catch (error) {
    console.error('Error cleaning up images:', error)
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : 'Failed to cleanup images'
    }
  }
}
