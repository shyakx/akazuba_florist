"use strict";
/**
 * Centralized error handling middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = createError;
exports.handleError = handleError;
exports.handleNotFound = handleNotFound;
exports.asyncHandler = asyncHandler;
/**
 * Create a custom error
 */
function createError(message, statusCode = 500) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
}
/**
 * Handle different types of errors
 */
function handleError(error, req, res, next) {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors = [];
    // Log error for debugging
    console.error('Error occurred:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    // Handle different error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        errors = Object.values(error.errors).map((err) => err.message);
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
        errors = ['The provided ID is not valid'];
    }
    else if (error.name === 'MongoError' && error.code === 11000) {
        statusCode = 409;
        message = 'Duplicate Entry';
        errors = ['A record with this information already exists'];
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid Token';
        errors = ['The provided token is invalid'];
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token Expired';
        errors = ['The provided token has expired'];
    }
    else if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message;
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
    });
}
/**
 * Handle 404 errors
 */
function handleNotFound(req, res, next) {
    const error = createError(`Route ${req.originalUrl} not found`, 404);
    next(error);
}
/**
 * Async error wrapper
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
