/**
 * Data validation utilities for product management
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate product data before saving
 */
export function validateProductData(data: any): ValidationResult {
  const errors: string[] = []

  // Required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Product name is required and must be a non-empty string')
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('Product description is required and must be a non-empty string')
  }

  if (data.price === undefined || data.price === null || isNaN(Number(data.price)) || Number(data.price) < 0) {
    errors.push('Product price is required and must be a valid positive number')
  }

  if (data.stockQuantity === undefined || data.stockQuantity === null || isNaN(Number(data.stockQuantity)) || Number(data.stockQuantity) < 0) {
    errors.push('Stock quantity is required and must be a valid non-negative number')
  }

  if (!data.categoryId || typeof data.categoryId !== 'string' || data.categoryId.trim().length === 0) {
    errors.push('Category ID is required and must be a valid string')
  }

  // Optional field validations
  if (data.images && !Array.isArray(data.images)) {
    errors.push('Images must be an array')
  }

  if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
    errors.push('isActive must be a boolean value')
  }

  if (data.isFeatured !== undefined && typeof data.isFeatured !== 'boolean') {
    errors.push('isFeatured must be a boolean value')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize product data
 */
export function sanitizeProductData(data: any): any {
  return {
    name: data.name?.trim() || '',
    description: data.description?.trim() || '',
    price: Number(data.price) || 0,
    stockQuantity: Number(data.stockQuantity) || 0,
    categoryId: data.categoryId?.trim() || '',
    images: Array.isArray(data.images) ? data.images : [],
    isActive: Boolean(data.isActive),
    isFeatured: Boolean(data.isFeatured)
  }
}
