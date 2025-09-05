// Error handling utilities for the application

export interface AppError {
  message: string
  code?: string
  statusCode?: number
  details?: any
}

export class CustomError extends Error {
  public code: string
  public statusCode: number
  public details?: any

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode: number = 500, details?: any) {
    super(message)
    this.name = 'CustomError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

// API Error Handler
export const handleApiError = (error: unknown): AppError => {
  if (error instanceof CustomError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      statusCode: 500
    }
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500
  }
}

// Frontend Error Handler
export const handleFrontendError = (error: unknown): string => {
  if (error instanceof CustomError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred. Please try again.'
}

// Validation Error Handler
export const handleValidationError = (errors: Record<string, string[]>): string => {
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('; ')
  
  return `Validation failed: ${errorMessages}`
}

// Network Error Handler
export const handleNetworkError = (error: unknown): string => {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.'
  }

  return handleFrontendError(error)
}

// Database Error Handler
export const handleDatabaseError = (error: unknown): AppError => {
  if (error instanceof Error) {
    // Prisma errors
    if (error.message.includes('Unique constraint')) {
      return {
        message: 'This record already exists',
        code: 'DUPLICATE_ENTRY',
        statusCode: 409
      }
    }

    if (error.message.includes('Foreign key constraint')) {
      return {
        message: 'Referenced record not found',
        code: 'FOREIGN_KEY_CONSTRAINT',
        statusCode: 400
      }
    }

    if (error.message.includes('Record to update not found')) {
      return {
        message: 'Record not found',
        code: 'NOT_FOUND',
        statusCode: 404
      }
    }
  }

  return handleApiError(error)
}

// Logging utility
export const logError = (error: unknown, context?: string): void => {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo)
  } else {
    // In production, you would send this to a logging service
    console.error('Error logged:', errorInfo)
  }
}
