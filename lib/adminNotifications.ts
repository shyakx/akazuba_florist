export interface AdminNotification {
  id: string
  type: 'new_rating' | 'new_order' | 'new_customer' | 'low_stock' | 'system_alert'
  title: string
  message: string
  details?: any
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  createdAt: string
  readAt?: string
}

class AdminNotificationManager {
  private notifications: AdminNotification[] = []
  private listeners: ((notifications: AdminNotification[]) => void)[] = []

  // Add a new notification
  addNotification(notification: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>): AdminNotification {
    const newNotification: AdminNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false
    }

    this.notifications.unshift(newNotification)
    
    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100)
    }

    this.notifyListeners()
    
    // Store in localStorage for persistence
    this.saveToStorage()
    
    return newNotification
  }

  // Get all notifications
  getNotifications(): AdminNotification[] {
    return this.notifications
  }

  // Get unread notifications
  getUnreadNotifications(): AdminNotification[] {
    return this.notifications.filter(n => !n.read)
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      notification.readAt = new Date().toISOString()
      this.notifyListeners()
      this.saveToStorage()
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      if (!notification.read) {
        notification.read = true
        notification.readAt = new Date().toISOString()
      }
    })
    this.notifyListeners()
    this.saveToStorage()
  }

  // Delete notification
  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId)
    this.notifyListeners()
    this.saveToStorage()
  }

  // Clear all notifications
  clearAllNotifications(): void {
    this.notifications = []
    this.notifyListeners()
    this.saveToStorage()
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: AdminNotification[]) => void): () => void {
    this.listeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }

  // Save to localStorage
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('admin-notifications', JSON.stringify(this.notifications))
      } catch (error) {
        console.error('Error saving notifications to localStorage:', error)
      }
    }
  }

  // Load from localStorage
  loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('admin-notifications')
        if (stored) {
          this.notifications = JSON.parse(stored)
          this.notifyListeners()
        }
      } catch (error) {
        console.error('Error loading notifications from localStorage:', error)
      }
    }
  }

  // Create notification for new rating
  createRatingNotification(data: {
    productName: string
    rating: number
    userName: string
    comment: string
  }): AdminNotification {
    const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating)
    
    return this.addNotification({
      type: 'new_rating',
      title: 'New Product Rating',
      message: `${data.userName} rated "${data.productName}" ${stars} (${data.rating}/5)`,
      details: {
        productName: data.productName,
        rating: data.rating,
        userName: data.userName,
        comment: data.comment,
        stars
      },
      priority: data.rating <= 2 ? 'high' : 'medium'
    })
  }

  // Create notification for new order
  createOrderNotification(data: {
    orderNumber: string
    customerName: string
    total: number
  }): AdminNotification {
    return this.addNotification({
      type: 'new_order',
      title: 'New Order Received',
      message: `Order #${data.orderNumber} from ${data.customerName} - RWF ${data.total.toLocaleString()}`,
      details: {
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        total: data.total
      },
      priority: 'high'
    })
  }

  // Create notification for low stock
  createLowStockNotification(data: {
    productName: string
    currentStock: number
    minStock: number
  }): AdminNotification {
    return this.addNotification({
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: `${data.productName} is running low (${data.currentStock} remaining)`,
      details: {
        productName: data.productName,
        currentStock: data.currentStock,
        minStock: data.minStock
      },
      priority: 'medium'
    })
  }
}

// Create singleton instance
export const adminNotifications = new AdminNotificationManager()

// Load from storage on initialization
if (typeof window !== 'undefined') {
  adminNotifications.loadFromStorage()
}

// Convenience functions for common notifications
export const showBackendOfflineNotification = () => {
  adminNotifications.addNotification({
    type: 'system_alert',
    title: 'Backend Offline',
    message: 'Backend service is currently unavailable. Running in demo mode.',
    priority: 'high'
  })
}

export const showBackendOnlineNotification = () => {
  adminNotifications.addNotification({
    type: 'system_alert',
    title: 'Backend Online',
    message: 'Backend service is now available. All features restored.',
    priority: 'medium'
  })
}

export const showErrorNotification = (message: string) => {
  adminNotifications.addNotification({
    type: 'system_alert',
    title: 'Error',
    message: message,
    priority: 'high'
  })
}

export const showProductDeletedNotification = (productName: string) => {
  adminNotifications.addNotification({
    type: 'system_alert',
    title: 'Product Deleted',
    message: `Product "${productName}" has been successfully deleted.`,
    priority: 'medium'
  })
}