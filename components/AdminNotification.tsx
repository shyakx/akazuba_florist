'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, X, RefreshCw } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  autoHide?: boolean
}

export default function AdminNotification() {
  const { hasUnsavedChanges, markChangesSaved } = useAdmin()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isVisible, setIsVisible] = useState(false)

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      autoHide: notification.autoHide !== false
    }
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]) // Keep only last 5
    setIsVisible(true)
    
    // Auto-hide after 5 seconds
    if (newNotification.autoHide) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 5000)
    }
  }

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (notifications.length === 1) {
      setIsVisible(false)
    }
  }

  // Show unsaved changes warning
  useEffect(() => {
    if (hasUnsavedChanges) {
      addNotification({
        type: 'warning',
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Make sure to save your work.',
        autoHide: false
      })
    }
  }, [hasUnsavedChanges])

  // Listen for storage events (cross-tab communication)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-notification') {
        try {
          const notification = JSON.parse(e.newValue || '{}')
          if (notification.type && notification.title) {
            addNotification(notification)
          }
        } catch (error) {
          console.error('Error parsing notification:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Global notification function
  useEffect(() => {
    // Make notification function available globally
    ;(window as any).showAdminNotification = addNotification
  }, [])

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'info':
        return <RefreshCw className="w-5 h-5 text-blue-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (!isVisible || notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBgColor(notification.type)} border rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {notification.type === 'warning' && notification.title === 'Unsaved Changes' && (
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => {
                  markChangesSaved()
                  removeNotification(notification.id)
                }}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
              >
                Mark as Saved
              </button>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
