/**
 * Professional logging system for the Akazuba Florist application
 * 
 * This module provides a comprehensive logging solution with:
 * - Structured logging with different levels
 * - Color-coded console output in development
 * - Performance metrics tracking
 * - Specialized logging methods for different contexts
 * - Production-ready logging format
 * 
 * @fileoverview Centralized logging system
 * @author Akazuba Development Team
 * @version 1.0.0
 */

/**
 * Log levels in order of severity
 * @enum {number}
 */
export enum LogLevel {
  /** Error level - Critical issues that need immediate attention */
  ERROR = 0,
  /** Warning level - Issues that should be addressed but don't break functionality */
  WARN = 1,
  /** Info level - General information about application flow */
  INFO = 2,
  /** Debug level - Detailed information for debugging */
  DEBUG = 3
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: string
  data?: any
  error?: Error
}

class Logger {
  private logLevel: LogLevel
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO
  }

  private formatMessage(entry: LogEntry): string {
    const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG']
    const timestamp = new Date(entry.timestamp).toISOString()
    const level = levelNames[entry.level]
    const context = entry.context ? `[${entry.context}]` : ''
    
    let message = `${timestamp} ${level} ${context} ${entry.message}`
    
    if (entry.data) {
      message += `\nData: ${JSON.stringify(entry.data, null, 2)}`
    }
    
    if (entry.error) {
      message += `\nError: ${entry.error.message}`
      if (this.isDevelopment && entry.error.stack) {
        message += `\nStack: ${entry.error.stack}`
      }
    }
    
    return message
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  private log(level: LogLevel, message: string, context?: string, data?: any, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      error
    }

    const formattedMessage = this.formatMessage(entry)

    // In development, use console with colors
    if (this.isDevelopment) {
      switch (level) {
        case LogLevel.ERROR:
          console.error('\x1b[31m%s\x1b[0m', formattedMessage) // Red
          break
        case LogLevel.WARN:
          console.warn('\x1b[33m%s\x1b[0m', formattedMessage) // Yellow
          break
        case LogLevel.INFO:
          console.info('\x1b[36m%s\x1b[0m', formattedMessage) // Cyan
          break
        case LogLevel.DEBUG:
          console.debug('\x1b[90m%s\x1b[0m', formattedMessage) // Gray
          break
      }
    } else {
      // In production, use structured logging
      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedMessage)
          break
        case LogLevel.WARN:
          console.warn(formattedMessage)
          break
        case LogLevel.INFO:
          console.info(formattedMessage)
          break
        case LogLevel.DEBUG:
          console.debug(formattedMessage)
          break
      }
    }

    // In production, you would send logs to a service like:
    // - Winston with file/cloud transport
    // - LogRocket
    // - Sentry
    // - CloudWatch
    // - Datadog
  }

  error(message: string, context?: string, data?: any, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, data, error)
  }

  warn(message: string, context?: string, data?: any): void {
    this.log(LogLevel.WARN, message, context, data)
  }

  info(message: string, context?: string, data?: any): void {
    this.log(LogLevel.INFO, message, context, data)
  }

  debug(message: string, context?: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, context, data)
  }

  // Specialized logging methods
  apiRequest(method: string, url: string, statusCode: number, duration: number): void {
    this.info(`API ${method} ${url}`, 'API', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`
    })
  }

  databaseQuery(query: string, duration: number, rowCount?: number): void {
    this.debug(`Database query executed`, 'DATABASE', {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration: `${duration}ms`,
      rowCount
    })
  }

  userAction(userId: string, action: string, data?: any): void {
    this.info(`User action: ${action}`, 'USER', {
      userId,
      action,
      data
    })
  }

  securityEvent(event: string, data?: any): void {
    this.warn(`Security event: ${event}`, 'SECURITY', data)
  }

  performanceMetric(metric: string, value: number, unit: string): void {
    this.info(`Performance metric: ${metric}`, 'PERFORMANCE', {
      metric,
      value,
      unit
    })
  }
}

// Create singleton instance
export const logger = new Logger()

// Convenience exports
export const logError = (message: string, context?: string, data?: any, error?: Error) => 
  logger.error(message, context, data, error)

export const logWarn = (message: string, context?: string, data?: any) => 
  logger.warn(message, context, data)

export const logInfo = (message: string, context?: string, data?: any) => 
  logger.info(message, context, data)

export const logDebug = (message: string, context?: string, data?: any) => 
  logger.debug(message, context, data)
