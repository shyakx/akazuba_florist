import { NextResponse } from 'next/server'

/**
 * API Error Response Interface
 * 
 * Defines the structure for error responses from API endpoints
 * with consistent error handling and detailed error information.
 */
export interface ApiError {
  success: false
  message: string
  error?: string
  code?: string
  details?: any
}

/**
 * API Success Response Interface
 * 
 * Defines the structure for successful responses from API endpoints
 * with optional data and pagination information.
 */
export interface ApiSuccess<T = any> {
  success: true
  message: string
  data?: T
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

/**
 * API Response Union Type
 * 
 * Represents either a successful or error response from API endpoints.
 */
export type ApiResponse<T = any> = ApiSuccess<T> | ApiError

// Standard error responses
export const createErrorResponse = (
  message: string,
  status: number = 500,
  error?: string,
  code?: string,
  details?: any
): NextResponse<ApiError> => {
  const errorResponse: ApiError = {
    success: false,
    message,
    ...(error && { error }),
    ...(code && { code }),
    ...(details && { details })
  }

  return NextResponse.json(errorResponse, { status })
}

// Standard success responses
export const createSuccessResponse = <T>(
  data: T,
  message: string = 'Success',
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
): NextResponse<ApiSuccess<T>> => {
  const successResponse: ApiSuccess<T> = {
    success: true,
    message,
    data,
    ...(pagination && { pagination })
  }

  return NextResponse.json(successResponse)
}

// Common error types
export const ErrorTypes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BACKEND_ERROR: 'BACKEND_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const

// Predefined error responses
export const ErrorResponses = {
  unauthorized: (message: string = 'Unauthorized access') =>
    createErrorResponse(message, 401, 'Authentication required', ErrorTypes.UNAUTHORIZED),
  
  forbidden: (message: string = 'Insufficient permissions') =>
    createErrorResponse(message, 403, 'Access denied', ErrorTypes.FORBIDDEN),
  
  notFound: (message: string = 'Resource not found') =>
    createErrorResponse(message, 404, 'Resource not found', ErrorTypes.NOT_FOUND),
  
  validationError: (message: string = 'Validation failed', details?: any) =>
    createErrorResponse(message, 400, 'Invalid input', ErrorTypes.VALIDATION_ERROR, details),
  
  internalError: (message: string = 'Internal server error') =>
    createErrorResponse(message, 500, 'Server error', ErrorTypes.INTERNAL_ERROR),
  
  backendError: (message: string = 'Backend service unavailable') =>
    createErrorResponse(message, 503, 'Service unavailable', ErrorTypes.BACKEND_ERROR),
  
  networkError: (message: string = 'Network error') =>
    createErrorResponse(message, 502, 'Network error', ErrorTypes.NETWORK_ERROR)
}

// Input validation helper
export function validateRequired(data: Record<string, any>, requiredFields: string[]): string[] {
  const missingFields: string[] = []
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(field)
    }
  }
  
  return missingFields
}

// Async error handler wrapper
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse<ApiResponse<R>>>
) {
  return async (...args: T): Promise<NextResponse<ApiResponse<R>>> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('Unhandled error:', error)
      
      if (error instanceof Error) {
        return ErrorResponses.internalError(error.message)
      }
      
      return ErrorResponses.internalError('An unexpected error occurred')
    }
  }
}

// Backend API error handler
export function handleBackendError(error: any, fallbackMessage: string = 'Backend service unavailable') {
  console.error('Backend error:', error)
  
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return ErrorResponses.backendError('Backend service is not available')
  }
  
  if (error.status === 401) {
    return ErrorResponses.unauthorized('Backend authentication failed')
  }
  
  if (error.status === 403) {
    return ErrorResponses.forbidden('Backend access denied')
  }
  
  if (error.status === 404) {
    return ErrorResponses.notFound('Backend resource not found')
  }
  
  if (error.status >= 500) {
    return ErrorResponses.backendError('Backend server error')
  }
  
  return ErrorResponses.backendError(fallbackMessage)
}