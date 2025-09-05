/**
 * Security utilities for the Akazuba Florist application
 * 
 * This module provides:
 * - Input sanitization
 * - XSS protection
 * - CSRF protection
 * - Rate limiting
 * - Content Security Policy
 * - Security headers
 * 
 * @fileoverview Security utilities and helpers
 * @author Akazuba Development Team
 * @version 1.0.0
 */

/**
 * Security configuration
 */
export const securityConfig = {
  maxRequestSize: 10 * 1024 * 1024, // 10MB
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  maxRequestsPerWindow: 100,
  allowedOrigins: [
    'https://akazuba.com',
    'https://www.akazuba.com',
    'http://localhost:3000'
  ],
  cspDirectives: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'https://www.google-analytics.com'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'connect-src': ["'self'", 'https://api.akazuba.com'],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  }
}

/**
 * XSS Protection utilities
 */
export const xssProtection = {
  /**
   * Sanitize HTML content
   */
  sanitizeHtml: (html: string): string => {
    const allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    const allowedAttributes = ['class', 'id']
    
    // Remove script tags and event handlers
    let sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '')
    
    // Remove disallowed tags
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^<>]*>/g
    sanitized = sanitized.replace(tagRegex, (match, tagName) => {
      if (allowedTags.includes(tagName.toLowerCase())) {
        return match
      }
      return ''
    })
    
    return sanitized
  },

  /**
   * Escape HTML entities
   */
  escapeHtml: (text: string): string => {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
    
    return text.replace(/[&<>"'/]/g, (char) => htmlEscapes[char])
  },

  /**
   * Validate and sanitize user input
   */
  sanitizeInput: (input: string, type: 'text' | 'email' | 'url' | 'number' = 'text'): string => {
    let sanitized = input.trim()
    
    switch (type) {
      case 'email':
        sanitized = sanitized.toLowerCase()
        // Remove any characters that aren't valid in email
        sanitized = sanitized.replace(/[^a-zA-Z0-9@._-]/g, '')
        break
      case 'url':
        // Basic URL validation
        if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
          sanitized = 'https://' + sanitized
        }
        break
      case 'number':
        // Remove non-numeric characters except decimal point
        sanitized = sanitized.replace(/[^0-9.]/g, '')
        break
      default:
        // For text, escape HTML and remove potential XSS
        sanitized = xssProtection.escapeHtml(sanitized)
    }
    
    return sanitized
  }
}

/**
 * CSRF Protection utilities
 */
export const csrfProtection = {
  /**
   * Generate CSRF token
   */
  generateToken: (): string => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  },

  /**
   * Validate CSRF token
   */
  validateToken: (token: string, sessionToken: string): boolean => {
    return token === sessionToken && token.length === 64
  },

  /**
   * Get CSRF token from request headers
   */
  getTokenFromHeaders: (headers: Headers): string | null => {
    return headers.get('x-csrf-token') || headers.get('csrf-token')
  }
}

/**
 * Rate limiting utilities
 */
export const rateLimit = {
  private requests: new Map<string, { count: number; resetTime: number }>(),

  /**
   * Check if request is within rate limit
   */
  isAllowed: (identifier: string): boolean => {
    const now = Date.now()
    const windowStart = now - securityConfig.rateLimitWindow
    const requestData = rateLimit.requests.get(identifier)

    if (!requestData || requestData.resetTime < now) {
      // Reset or create new entry
      rateLimit.requests.set(identifier, {
        count: 1,
        resetTime: now + securityConfig.rateLimitWindow
      })
      return true
    }

    if (requestData.count >= securityConfig.maxRequestsPerWindow) {
      return false
    }

    // Increment count
    requestData.count++
    return true
  },

  /**
   * Get remaining requests for identifier
   */
  getRemainingRequests: (identifier: string): number => {
    const requestData = rateLimit.requests.get(identifier)
    if (!requestData) {
      return securityConfig.maxRequestsPerWindow
    }
    return Math.max(0, securityConfig.maxRequestsPerWindow - requestData.count)
  },

  /**
   * Get reset time for identifier
   */
  getResetTime: (identifier: string): number => {
    const requestData = rateLimit.requests.get(identifier)
    return requestData?.resetTime || Date.now() + securityConfig.rateLimitWindow
  },

  /**
   * Clean up expired entries
   */
  cleanup: (): void => {
    const now = Date.now()
    for (const [key, value] of rateLimit.requests.entries()) {
      if (value.resetTime < now) {
        rateLimit.requests.delete(key)
      }
    }
  }
}

/**
 * Content Security Policy utilities
 */
export const csp = {
  /**
   * Generate CSP header value
   */
  generateHeader: (): string => {
    return Object.entries(securityConfig.cspDirectives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ')
  },

  /**
   * Validate CSP report
   */
  validateReport: (report: any): boolean => {
    // Basic validation of CSP violation report
    return report && 
           typeof report === 'object' && 
           report['csp-report'] && 
           typeof report['csp-report'] === 'object'
  }
}

/**
 * Security headers utilities
 */
export const securityHeaders = {
  /**
   * Get security headers for responses
   */
  getHeaders: (): Record<string, string> => {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': csp.generateHeader(),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin'
    }
  },

  /**
   * Validate origin for CORS
   */
  validateOrigin: (origin: string): boolean => {
    return securityConfig.allowedOrigins.includes(origin)
  }
}

/**
 * Input validation utilities
 */
export const inputValidation = {
  /**
   * Validate file upload
   */
  validateFile: (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > securityConfig.maxRequestSize) {
      return {
        valid: false,
        error: 'File size exceeds maximum allowed size'
      }
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed'
      }
    }

    // Check file name
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js']
    const fileName = file.name.toLowerCase()
    
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
      return {
        valid: false,
        error: 'File extension not allowed'
      }
    }

    return { valid: true }
  },

  /**
   * Validate JSON payload
   */
  validateJson: (json: any, maxDepth: number = 10): { valid: boolean; error?: string } => {
    try {
      const jsonString = JSON.stringify(json)
      
      // Check depth
      const depth = inputValidation.getJsonDepth(json)
      if (depth > maxDepth) {
        return {
          valid: false,
          error: 'JSON structure too deep'
        }
      }

      // Check size
      if (jsonString.length > securityConfig.maxRequestSize) {
        return {
          valid: false,
          error: 'JSON payload too large'
        }
      }

      return { valid: true }
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid JSON format'
      }
    }
  },

  /**
   * Get JSON depth
   */
  getJsonDepth: (obj: any, depth: number = 0): number => {
    if (typeof obj !== 'object' || obj === null) {
      return depth
    }

    let maxDepth = depth
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const currentDepth = inputValidation.getJsonDepth(obj[key], depth + 1)
        maxDepth = Math.max(maxDepth, currentDepth)
      }
    }

    return maxDepth
  }
}

/**
 * Security middleware for API routes
 */
export const securityMiddleware = {
  /**
   * Apply security headers
   */
  applyHeaders: (response: Response): Response => {
    const headers = securityHeaders.getHeaders()
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  },

  /**
   * Validate request
   */
  validateRequest: (request: Request): { valid: boolean; error?: string } => {
    // Check content length
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > securityConfig.maxRequestSize) {
      return {
        valid: false,
        error: 'Request too large'
      }
    }

    // Check origin
    const origin = request.headers.get('origin')
    if (origin && !securityHeaders.validateOrigin(origin)) {
      return {
        valid: false,
        error: 'Origin not allowed'
      }
    }

    return { valid: true }
  }
}

/**
 * Security utilities for client-side
 */
export const clientSecurity = {
  /**
   * Sanitize user input before sending to server
   */
  sanitizeBeforeSend: (data: any): any => {
    if (typeof data === 'string') {
      return xssProtection.sanitizeInput(data)
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = clientSecurity.sanitizeBeforeSend(value)
      }
      return sanitized
    }

    return data
  },

  /**
   * Validate form data
   */
  validateFormData: (formData: FormData): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        // Check for potential XSS
        if (value.includes('<script') || value.includes('javascript:')) {
          errors.push(`Invalid content in field: ${key}`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

export default {
  securityConfig,
  xssProtection,
  csrfProtection,
  rateLimit,
  csp,
  securityHeaders,
  inputValidation,
  securityMiddleware,
  clientSecurity
}
