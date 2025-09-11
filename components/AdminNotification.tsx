'use client'

import React, { useState, useEffect } from 'react'
import { Bell, Star, ShoppingCart, User, AlertTriangle, X, Check, Trash2 } from 'lucide-react'
import { adminNotifications, AdminNotification } from '@/lib/adminNotifications'

const AdminNotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load initial notifications
    setNotifications(adminNotifications.getNotifications())
    setUnreadCount(adminNotifications.getUnreadCount())

    // Subscribe to notification changes
    const unsubscribe = adminNotifications.subscribe((newNotifications) => {
      setNotifications(newNotifications)
      setUnreadCount(adminNotifications.getUnreadCount())
    })

    return unsubscribe
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_rating':
        return <Star className="w-5 h-5 text-yellow-500" />
      case 'new_order':
        return <ShoppingCart className="w-5 h-5 text-green-500" />
      case 'new_customer':
        return <User className="w-5 h-5 text-blue-500" />
      case 'low_stock':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500 bg-red-50'
      case 'high':
        return 'border-orange-500 bg-orange-50'
      case 'medium':
        return 'border-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-gray-300 bg-gray-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    adminNotifications.markAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    adminNotifications.markAllAsRead()
  }

  const handleDelete = (notificationId: string) => {
    adminNotifications.deleteNotification(notificationId)
  }

  const handleClearAll = () => {
    adminNotifications.clearAllNotifications()
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear all</span>
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
      {notifications.map((notification) => (
        <div
          key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
        >
          <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
            <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                {notification.title}
                            </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
                            {notification.details && notification.type === 'new_rating' && (
                              <div className="mt-2 text-xs text-gray-500">
                                <div className="flex items-center space-x-2">
                                  <span>{notification.details.stars}</span>
                                  <span>•</span>
                                  <span>{notification.details.userName}</span>
                                </div>
                                {notification.details.comment && (
                                  <p className="mt-1 italic">"{notification.details.comment}"</p>
                                )}
                              </div>
                            )}
            </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className="text-xs text-gray-400">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
            >
              <X className="w-4 h-4" />
            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminNotificationComponent