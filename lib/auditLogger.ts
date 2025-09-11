import { AuthUser } from './auth'

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userEmail: string
  userRole: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
}

export interface AuditLogFilter {
  userId?: string
  action?: string
  resource?: string
  startDate?: string
  endDate?: string
  success?: boolean
  page?: number
  limit?: number
}

class AuditLogger {
  private logs: AuditLogEntry[] = []
  private maxLogs = 10000 // Keep last 10,000 logs in memory

  // Log an action
  log(
    user: AuthUser,
    action: string,
    resource: string,
    details: Record<string, any> = {},
    options: {
      resourceId?: string
      ipAddress?: string
      userAgent?: string
      success?: boolean
      errorMessage?: string
    } = {}
  ): void {
    const logEntry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action,
      resource,
      resourceId: options.resourceId,
      details,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      success: options.success !== false, // Default to true
      errorMessage: options.errorMessage
    }

    this.logs.unshift(logEntry) // Add to beginning

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // In production, you would also save to database
    this.saveToDatabase(logEntry)
  }

  // Get logs with filtering
  getLogs(filter: AuditLogFilter = {}): {
    logs: AuditLogEntry[]
    total: number
    page: number
    limit: number
    pages: number
  } {
    let filteredLogs = [...this.logs]

    // Apply filters
    if (filter.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filter.userId)
    }

    if (filter.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filter.action)
    }

    if (filter.resource) {
      filteredLogs = filteredLogs.filter(log => log.resource === filter.resource)
    }

    if (filter.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.startDate!)
    }

    if (filter.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.endDate!)
    }

    if (filter.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === filter.success)
    }

    // Pagination
    const page = filter.page || 1
    const limit = filter.limit || 50
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

    return {
      logs: paginatedLogs,
      total: filteredLogs.length,
      page,
      limit,
      pages: Math.ceil(filteredLogs.length / limit)
    }
  }

  // Get logs for a specific user
  getUserLogs(userId: string, limit: number = 50): AuditLogEntry[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(0, limit)
  }

  // Get logs for a specific resource
  getResourceLogs(resource: string, resourceId?: string, limit: number = 50): AuditLogEntry[] {
    return this.logs
      .filter(log => {
        if (log.resource !== resource) return false
        if (resourceId && log.resourceId !== resourceId) return false
        return true
      })
      .slice(0, limit)
  }

  // Get recent activity
  getRecentActivity(limit: number = 20): AuditLogEntry[] {
    return this.logs.slice(0, limit)
  }

  // Get failed actions
  getFailedActions(limit: number = 50): AuditLogEntry[] {
    return this.logs
      .filter(log => !log.success)
      .slice(0, limit)
  }

  // Generate unique ID
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Save to database (placeholder - implement based on your database)
  private async saveToDatabase(logEntry: AuditLogEntry): Promise<void> {
    try {
      // In production, save to your database
      // For now, we'll just log to console
      console.log('📝 Audit Log:', {
        action: logEntry.action,
        resource: logEntry.resource,
        user: logEntry.userEmail,
        success: logEntry.success,
        timestamp: logEntry.timestamp
      })
    } catch (error) {
      console.error('Failed to save audit log to database:', error)
    }
  }

  // Clear old logs (keep only last 30 days)
  clearOldLogs(): void {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    this.logs = this.logs.filter(log => 
      new Date(log.timestamp) > thirtyDaysAgo
    )
  }

  // Get statistics
  getStats(): {
    totalLogs: number
    successfulActions: number
    failedActions: number
    topActions: Array<{ action: string; count: number }>
    topUsers: Array<{ userEmail: string; count: number }>
    topResources: Array<{ resource: string; count: number }>
  } {
    const totalLogs = this.logs.length
    const successfulActions = this.logs.filter(log => log.success).length
    const failedActions = totalLogs - successfulActions

    // Count actions
    const actionCounts: Record<string, number> = {}
    const userCounts: Record<string, number> = {}
    const resourceCounts: Record<string, number> = {}

    this.logs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1
      userCounts[log.userEmail] = (userCounts[log.userEmail] || 0) + 1
      resourceCounts[log.resource] = (resourceCounts[log.resource] || 0) + 1
    })

    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const topUsers = Object.entries(userCounts)
      .map(([userEmail, count]) => ({ userEmail, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const topResources = Object.entries(resourceCounts)
      .map(([resource, count]) => ({ resource, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalLogs,
      successfulActions,
      failedActions,
      topActions,
      topUsers,
      topResources
    }
  }
}

// Create singleton instance
export const auditLogger = new AuditLogger()

// Helper functions for common audit actions
export const auditActions = {
  // Product actions
  createProduct: (user: AuthUser, productId: string, productName: string) =>
    auditLogger.log(user, 'CREATE_PRODUCT', 'product', { productName }, { resourceId: productId }),

  updateProduct: (user: AuthUser, productId: string, productName: string, changes: Record<string, any>) =>
    auditLogger.log(user, 'UPDATE_PRODUCT', 'product', { productName, changes }, { resourceId: productId }),

  deleteProduct: (user: AuthUser, productId: string, productName: string) =>
    auditLogger.log(user, 'DELETE_PRODUCT', 'product', { productName }, { resourceId: productId }),

  // Order actions
  updateOrderStatus: (user: AuthUser, orderId: string, orderNumber: string, newStatus: string) =>
    auditLogger.log(user, 'UPDATE_ORDER_STATUS', 'order', { orderNumber, newStatus }, { resourceId: orderId }),

  deleteOrder: (user: AuthUser, orderId: string, orderNumber: string) =>
    auditLogger.log(user, 'DELETE_ORDER', 'order', { orderNumber }, { resourceId: orderId }),

  // Category actions
  createCategory: (user: AuthUser, categoryId: string, categoryName: string) =>
    auditLogger.log(user, 'CREATE_CATEGORY', 'category', { categoryName }, { resourceId: categoryId }),

  updateCategory: (user: AuthUser, categoryId: string, categoryName: string, changes: Record<string, any>) =>
    auditLogger.log(user, 'UPDATE_CATEGORY', 'category', { categoryName, changes }, { resourceId: categoryId }),

  deleteCategory: (user: AuthUser, categoryId: string, categoryName: string) =>
    auditLogger.log(user, 'DELETE_CATEGORY', 'category', { categoryName }, { resourceId: categoryId }),

  // Settings actions
  updateSettings: (user: AuthUser, changes: Record<string, any>) =>
    auditLogger.log(user, 'UPDATE_SETTINGS', 'settings', { changes }),

  // Authentication actions
  login: (user: AuthUser, ipAddress?: string, userAgent?: string) =>
    auditLogger.log(user, 'LOGIN', 'auth', {}, { ipAddress, userAgent }),

  logout: (user: AuthUser, ipAddress?: string, userAgent?: string) =>
    auditLogger.log(user, 'LOGOUT', 'auth', {}, { ipAddress, userAgent }),

  // Error actions
  error: (user: AuthUser, action: string, resource: string, errorMessage: string, details?: Record<string, any>) =>
    auditLogger.log(user, action, resource, details || {}, { success: false, errorMessage })
}
