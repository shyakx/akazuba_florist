/**
 * Validation utilities for the Akazuba Florist application
 * 
 * This module provides:
 * - Form validation rules
 * - Input sanitization
 * - Error message generation
 * - Type-safe validation
 * - Custom validation rules
 * 
 * @fileoverview Validation and error handling utilities
 * @author Akazuba Development Team
 * @version 1.0.0
 */

/**
 * Validation rule interface
 */
export interface ValidationRule<T = any> {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  email?: boolean
  phone?: boolean
  url?: boolean
  custom?: (value: T) => string | null
  message?: string
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  values: Record<string, any>
}

/**
 * Common validation patterns
 */
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+250|0)[0-9]{9}$/,
  url: /^https?:\/\/.+/,
  rwandanPhone: /^(\+250|0)[0-9]{9}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  name: /^[a-zA-Z\s'-]+$/,
  price: /^\d+(\.\d{1,2})?$/
}

/**
 * Default error messages
 */
export const errorMessages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters long`,
  maxLength: (field: string, max: number) => `${field} must be no more than ${max} characters long`,
  min: (field: string, min: number) => `${field} must be at least ${min}`,
  max: (field: string, max: number) => `${field} must be no more than ${max}`,
  pattern: (field: string) => `${field} format is invalid`,
  email: (field: string) => `${field} must be a valid email address`,
  phone: (field: string) => `${field} must be a valid phone number`,
  url: (field: string) => `${field} must be a valid URL`,
  unique: (field: string) => `${field} already exists`,
  match: (field: string, target: string) => `${field} must match ${target}`,
  custom: (field: string, message: string) => message
}

/**
 * Sanitize input values
 */
export const sanitize = {
  /**
   * Remove HTML tags and trim whitespace
   */
  text: (value: string): string => {
    return value
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .trim() // Remove leading/trailing whitespace
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
  },

  /**
   * Sanitize email address
   */
  email: (value: string): string => {
    return sanitize.text(value).toLowerCase()
  },

  /**
   * Sanitize phone number
   */
  phone: (value: string): string => {
    return value.replace(/[^\d+]/g, '') // Keep only digits and +
  },

  /**
   * Sanitize price/number
   */
  number: (value: string | number): number => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return isNaN(num) ? 0 : Math.max(0, num)
  },

  /**
   * Sanitize URL
   */
  url: (value: string): string => {
    return sanitize.text(value).toLowerCase()
  }
}

/**
 * Validate a single field
 */
export const validateField = <T>(
  value: T,
  rules: ValidationRule<T>,
  fieldName: string
): string | null => {
  // Required validation
  if (rules.required && (value === null || value === undefined || value === '')) {
    return errorMessages.required(fieldName)
  }

  // Skip other validations if value is empty and not required
  if (!rules.required && (value === null || value === undefined || value === '')) {
    return null
  }

  const stringValue = String(value)

  // Length validations
  if (rules.minLength && stringValue.length < rules.minLength) {
    return errorMessages.minLength(fieldName, rules.minLength)
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return errorMessages.maxLength(fieldName, rules.maxLength)
  }

  // Numeric validations
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = Number(value)
    
    if (rules.min !== undefined && numValue < rules.min) {
      return errorMessages.min(fieldName, rules.min)
    }

    if (rules.max !== undefined && numValue > rules.max) {
      return errorMessages.max(fieldName, rules.max)
    }
  }

  // Pattern validations
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return errorMessages.pattern(fieldName)
  }

  // Email validation
  if (rules.email && !patterns.email.test(stringValue)) {
    return errorMessages.email(fieldName)
  }

  // Phone validation
  if (rules.phone && !patterns.phone.test(stringValue)) {
    return errorMessages.phone(fieldName)
  }

  // URL validation
  if (rules.url && !patterns.url.test(stringValue)) {
    return errorMessages.url(fieldName)
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value)
    if (customError) {
      return errorMessages.custom(fieldName, customError)
    }
  }

  return null
}

/**
 * Validate multiple fields
 */
export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, ValidationRule>
): ValidationResult => {
  const errors: Record<string, string> = {}
  const values: Record<string, any> = {}

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const value = data[fieldName]
    const error = validateField(value, fieldRules, fieldName as string)
    
    if (error) {
      errors[fieldName] = error
    }
    
    values[fieldName] = value
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values
  }
}

/**
 * Predefined validation rules for common fields
 */
export const rules = {
  email: {
    required: true,
    email: true,
    maxLength: 255
  } as ValidationRule,

  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: patterns.strongPassword,
    message: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character'
  } as ValidationRule,

  confirmPassword: {
    required: true,
    minLength: 8
  } as ValidationRule,

  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: patterns.name
  } as ValidationRule,

  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: patterns.name
  } as ValidationRule,

  phone: {
    required: true,
    pattern: patterns.rwandanPhone
  } as ValidationRule,

  productName: {
    required: true,
    minLength: 3,
    maxLength: 100
  } as ValidationRule,

  productDescription: {
    required: true,
    minLength: 10,
    maxLength: 1000
  } as ValidationRule,

  productPrice: {
    required: true,
    min: 0.01,
    max: 1000000,
    pattern: patterns.price
  } as ValidationRule,

  productStock: {
    required: true,
    min: 0,
    max: 10000
  } as ValidationRule,

  categoryName: {
    required: true,
    minLength: 2,
    maxLength: 50
  } as ValidationRule,

  address: {
    required: true,
    minLength: 10,
    maxLength: 200
  } as ValidationRule,

  city: {
    required: true,
    minLength: 2,
    maxLength: 50
  } as ValidationRule,

  orderNotes: {
    required: false,
    maxLength: 500
  } as ValidationRule
}

/**
 * Custom validation functions
 */
export const customValidators = {
  /**
   * Validate password confirmation
   */
  passwordMatch: (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }
    return null
  },

  /**
   * Validate unique email
   */
  uniqueEmail: async (email: string): Promise<string | null> => {
    try {
      // This would typically make an API call to check if email exists
      // For now, return null (no error)
      return null
    } catch (error) {
      return 'Unable to verify email uniqueness'
    }
  },

  /**
   * Validate product SKU uniqueness
   */
  uniqueSku: async (sku: string): Promise<string | null> => {
    try {
      // This would typically make an API call to check if SKU exists
      // For now, return null (no error)
      return null
    } catch (error) {
      return 'Unable to verify SKU uniqueness'
    }
  },

  /**
   * Validate age (must be 18+)
   */
  adultAge: (birthDate: string): string | null => {
    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    
    if (age < 18) {
      return 'You must be at least 18 years old'
    }
    
    return null
  },

  /**
   * Validate future date
   */
  futureDate: (date: string): string | null => {
    const inputDate = new Date(date)
    const today = new Date()
    
    if (inputDate <= today) {
      return 'Date must be in the future'
    }
    
    return null
  }
}

/**
 * Form validation hook
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  validationRules: Record<keyof T, ValidationRule>
) => {
  const [data, setData] = React.useState<T>(initialData)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  const validate = React.useCallback(() => {
    const result = validateForm(data, validationRules)
    setErrors(result.errors)
    return result.isValid
  }, [data, validationRules])

  const validateField = React.useCallback((fieldName: keyof T) => {
    const fieldRules = validationRules[fieldName]
    if (!fieldRules) return

    const error = validateField(data[fieldName], fieldRules, fieldName as string)
    setErrors(prev => ({
      ...prev,
      [fieldName]: error || ''
    }))
  }, [data, validationRules])

  const setValue = React.useCallback((fieldName: keyof T, value: any) => {
    setData(prev => ({ ...prev, [fieldName]: value }))
    
    // Validate field if it has been touched
    if (touched[fieldName as string]) {
      validateField(fieldName)
    }
  }, [touched, validateField])

  const setTouched = React.useCallback((fieldName: keyof T) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    validateField(fieldName)
  }, [validateField])

  const reset = React.useCallback(() => {
    setData(initialData)
    setErrors({})
    setTouched({})
  }, [initialData])

  return {
    data,
    errors,
    touched,
    isValid: Object.keys(errors).length === 0,
    setValue,
    setTouched,
    validate,
    reset
  }
}

export default {
  patterns,
  errorMessages,
  sanitize,
  validateField,
  validateForm,
  rules,
  customValidators,
  useFormValidation
}
