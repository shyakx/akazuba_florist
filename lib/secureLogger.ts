/**
 * Secure Logger Utility
 * 
 * Provides secure logging that only shows sensitive information in development mode.
 * In production, all sensitive logs are suppressed for security.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogOptions {
  sensitive?: boolean // If true, only logs in development
  level?: LogLevel
}

class SecureLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * Log information - only shows sensitive data in development
   */
  log(message: string, data?: any, options: LogOptions = {}): void {
    if (options.sensitive && !this.isDevelopment) {
      return // Don't log sensitive information in production
    }

    if (options.level === 'error') {
      console.error(message, data)
    } else if (options.level === 'warn') {
      console.warn(message, data)
    } else if (options.level === 'debug' && this.isDevelopment) {
      console.log(message, data)
    } else {
      console.log(message, data)
    }
  }

  /**
   * Log authentication-related information (sensitive)
   */
  auth(message: string, data?: any): void {
    this.log(`🔐 ${message}`, data, { sensitive: true })
  }

  /**
   * Log token-related information (sensitive)
   */
  token(message: string, data?: any): void {
    this.log(`🔑 ${message}`, data, { sensitive: true })
  }

  /**
   * Log user-related information (sensitive)
   */
  user(message: string, data?: any): void {
    this.log(`👤 ${message}`, data, { sensitive: true })
  }

  /**
   * Log cookie-related information (sensitive)
   */
  cookie(message: string, data?: any): void {
    this.log(`🍪 ${message}`, data, { sensitive: true })
  }

  /**
   * Log general system information (safe for production)
   */
  system(message: string, data?: any): void {
    this.log(`⚙️ ${message}`, data, { sensitive: false })
  }

  /**
   * Log error information (safe for production)
   */
  error(message: string, data?: any): void {
    this.log(`❌ ${message}`, data, { level: 'error' })
  }

  /**
   * Log warning information (safe for production)
   */
  warn(message: string, data?: any): void {
    this.log(`⚠️ ${message}`, data, { level: 'warn' })
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, data?: any): void {
    this.log(`🐛 ${message}`, data, { level: 'debug', sensitive: true })
  }
}

// Export singleton instance
export const secureLogger = new SecureLogger()

// Export individual methods for convenience
export const { auth, token, user, cookie, system, error, warn, debug } = secureLogger
