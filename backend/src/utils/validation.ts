/**
 * Data validation utilities for product management and authentication
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate email address
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email)
  return {
    isValid,
    message: isValid ? undefined : 'Please enter a valid email address'
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  const isValid = passwordRegex.test(password)
  return {
    isValid,
    message: isValid ? undefined : 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
  }
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): { isValid: boolean; message?: string } {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  const isValid = phoneRegex.test(phone)
  return {
    isValid,
    message: isValid ? undefined : 'Please enter a valid phone number'
  }
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
