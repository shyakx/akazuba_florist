/**
 * Centralized error handling middleware
 */

import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

/**
 * Create a custom error
 */
export function createError(message: string, statusCode: number = 500): AppError {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  error.isOperational = true
  return error
}

/**
 * Handle different types of errors
 */
export function handleError(error: any, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500
  let message = 'Internal Server Error'
  let errors: string[] = []

  // Log error for debugging
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  })

  // Handle different error types
  if (error.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation Error'
    errors = Object.values(error.errors).map((err: any) => err.message)
  } else if (error.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
    errors = ['The provided ID is not valid']
  } else if (error.name === 'MongoError' && error.code === 11000) {
    statusCode = 409
    message = 'Duplicate Entry'
    errors = ['A record with this information already exists']
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid Token'
    errors = ['The provided token is invalid']
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token Expired'
    errors = ['The provided token has expired']
  } else if (error.statusCode) {
    statusCode = error.statusCode
    message = error.message
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : [message],
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  })
}

/**
 * Handle 404 errors
 */
export function handleNotFound(req: Request, res: Response, next: NextFunction) {
  const error = createError(`Route ${req.originalUrl} not found`, 404)
  next(error)
}

/**
 * Async error wrapper
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}