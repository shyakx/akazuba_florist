export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  min?: number
  max?: number
  email?: boolean
  url?: boolean
  custom?: (value: any) => string | null
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// Validation functions
export const validators = {
  required: (value: any): string | null => {
    if (value === undefined || value === null || value === '') {
      return 'This field is required'
    }
    return null
  },

  minLength: (min: number) => (value: string): string | null => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters long`
    }
    return null
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters long`
    }
    return null
  },

  pattern: (regex: RegExp, message: string) => (value: string): string | null => {
    if (value && !regex.test(value)) {
      return message
    }
    return null
  },

  min: (min: number) => (value: number): string | null => {
    if (value !== undefined && value < min) {
      return `Must be at least ${min}`
    }
    return null
  },

  max: (max: number) => (value: number): string | null => {
    if (value !== undefined && value > max) {
      return `Must be no more than ${max}`
    }
    return null
  },

  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      return 'Must be a valid email address'
    }
    return null
  },

  url: (value: string): string | null => {
    try {
      if (value) {
        new URL(value)
      }
      return null
    } catch {
      return 'Must be a valid URL'
    }
  },

  phone: (value: string): string | null => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    if (value && !phoneRegex.test(value)) {
      return 'Must be a valid phone number'
    }
    return null
  },

  positiveNumber: (value: number): string | null => {
    if (value !== undefined && value <= 0) {
      return 'Must be a positive number'
    }
    return null
  },

  integer: (value: number): string | null => {
    if (value !== undefined && !Number.isInteger(value)) {
      return 'Must be a whole number'
    }
    return null
  }
}

// Validate a single field
export function validateField(value: any, rules: ValidationRule): string | null {
  if (rules.required) {
    const error = validators.required(value)
    if (error) return error
  }

  if (value === undefined || value === null || value === '') {
    return null // Skip other validations if field is empty and not required
  }

  if (rules.minLength !== undefined) {
    const error = validators.minLength(rules.minLength)(value)
    if (error) return error
  }

  if (rules.maxLength !== undefined) {
    const error = validators.maxLength(rules.maxLength)(value)
    if (error) return error
  }

  if (rules.pattern) {
    const error = validators.pattern(rules.pattern, 'Invalid format')(value)
    if (error) return error
  }

  if (rules.min !== undefined) {
    const error = validators.min(rules.min)(value)
    if (error) return error
  }

  if (rules.max !== undefined) {
    const error = validators.max(rules.max)(value)
    if (error) return error
  }

  if (rules.email) {
    const error = validators.email(value)
    if (error) return error
  }

  if (rules.url) {
    const error = validators.url(value)
    if (error) return error
  }

  if (rules.custom) {
    const error = rules.custom(value)
    if (error) return error
  }

  return null
}

// Validate an object against a schema
export function validate(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
  const errors: Record<string, string> = {}

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules)
    if (error) {
      errors[field] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Common validation schemas
export const schemas = {
  product: {
    name: { required: true, minLength: 2, maxLength: 100 },
    description: { required: true, minLength: 10, maxLength: 1000 },
    price: { required: true, min: 0, custom: validators.positiveNumber },
    stock: { required: true, min: 0, custom: validators.integer },
    category: { required: true, minLength: 2, maxLength: 50 }
  },

  user: {
    email: { required: true, email: true },
    firstName: { required: true, minLength: 2, maxLength: 50 },
    lastName: { required: true, minLength: 2, maxLength: 50 },
    phone: { required: true, custom: validators.phone }
  },

  order: {
    customerName: { required: true, minLength: 2, maxLength: 100 },
    customerEmail: { required: true, email: true },
    customerPhone: { required: true, custom: validators.phone },
    deliveryAddress: { required: true, minLength: 10, maxLength: 500 },
    paymentMethod: { required: true, pattern: /^(MoMo|Bank Transfer|Cash)$/, message: 'Must be MoMo, Bank Transfer, or Cash' }
  },

  category: {
    name: { required: true, minLength: 2, maxLength: 50 },
    description: { required: true, minLength: 10, maxLength: 200 },
    icon: { required: true, minLength: 1, maxLength: 10 }
  },

  settings: {
    businessName: { required: true, minLength: 2, maxLength: 100 },
    businessEmail: { required: true, email: true },
    businessPhone: { required: true, custom: validators.phone },
    currency: { required: true, pattern: /^[A-Z]{3}$/, message: 'Must be a 3-letter currency code' }
  }
}

// Sanitize input data
export function sanitizeInput(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Trim whitespace and remove potentially dangerous characters
      sanitized[key] = value.trim().replace(/[<>]/g, '')
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}