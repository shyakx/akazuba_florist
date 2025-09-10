// Admin notification utilities for cross-tab communication

export interface AdminNotificationData {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  autoHide?: boolean
}

// Show notification in all admin tabs
export const showAdminNotification = (notification: AdminNotificationData) => {
  // Store in localStorage to trigger cross-tab communication
  localStorage.setItem('admin-notification', JSON.stringify(notification))
  
  // Also call the global function if available
  if (typeof window !== 'undefined' && (window as any).showAdminNotification) {
    (window as any).showAdminNotification(notification)
  }
  
  // Clear the storage after a short delay to allow other tabs to pick it up
  setTimeout(() => {
    localStorage.removeItem('admin-notification')
  }, 100)
}

// Success notification
export const showSuccessNotification = (title: string, message: string) => {
  showAdminNotification({
    type: 'success',
    title,
    message
  })
}

// Error notification
export const showErrorNotification = (title: string, message: string) => {
  showAdminNotification({
    type: 'error',
    title,
    message
  })
}

// Warning notification
export const showWarningNotification = (title: string, message: string) => {
  showAdminNotification({
    type: 'warning',
    title,
    message
  })
}

// Info notification
export const showInfoNotification = (title: string, message: string) => {
  showAdminNotification({
    type: 'info',
    title,
    message
  })
}

// Product-specific notifications
export const showProductDeletedNotification = (productName: string) => {
  showSuccessNotification(
    'Product Deleted',
    `"${productName}" has been successfully deleted.`
  )
}

export const showProductUpdatedNotification = (productName: string) => {
  showSuccessNotification(
    'Product Updated',
    `"${productName}" has been successfully updated.`
  )
}

export const showProductCreatedNotification = (productName: string) => {
  showSuccessNotification(
    'Product Created',
    `"${productName}" has been successfully created.`
  )
}

// Order-specific notifications
export const showOrderUpdatedNotification = (orderNumber: string) => {
  showSuccessNotification(
    'Order Updated',
    `Order #${orderNumber} has been successfully updated.`
  )
}

// Customer-specific notifications
export const showCustomerUpdatedNotification = (customerName: string) => {
  showSuccessNotification(
    'Customer Updated',
    `Customer "${customerName}" has been successfully updated.`
  )
}

// Backend status notifications
export const showBackendOfflineNotification = () => {
  showWarningNotification(
    'Backend Offline',
    'The backend server is not available. Changes may not persist.'
  )
}

export const showBackendOnlineNotification = () => {
  showSuccessNotification(
    'Backend Online',
    'The backend server is now available. All operations will persist.'
  )
}
