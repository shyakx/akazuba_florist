'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminErrorBoundary } from '@/components/ErrorBoundary'
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingCart, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ExternalLink,
  Eye,
  Edit3
} from 'lucide-react'
import { useAuth } from '@/contexts/RealAuthContext'
import { AdminProvider } from '@/contexts/AdminContext'
import AdminNotification from '@/components/AdminNotification'

/**
 * Admin Layout Component
 * 
 * Provides the main layout structure for the admin panel including:
 * - Sidebar navigation
 * - Authentication handling
 * - Error boundaries
 * - Admin context provider
 * - Responsive design
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, isAuthenticated, isLoading, logout, isInitialized } = useAuth()

  /**
   * Admin Navigation Configuration
   * 
   * Defines the main navigation items for the admin panel with their
   * respective icons and routes.
   */
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Content Manager', href: '/admin/content', icon: Edit3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  /**
   * Handle Admin Logout
   * 
   * Performs logout operation with loading state management
   * and proper error handling.
   */
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      console.log('✅ Admin logout successful')
    } catch (error) {
      console.error('❌ Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  /**
   * Handle Authentication State
   * 
   * Monitors authentication state and redirects unauthenticated users
   * to the login page. Only executes after authentication is initialized.
   */
  useEffect(() => {
    if (!isInitialized) return

    if (!isAuthenticated) {
      router.push('/unified-login')
    }
  }, [isAuthenticated, isInitialized, router])

  // Show loading state
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminErrorBoundary>
      <AdminProvider>
      <div className="admin-panel">
        {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="sidebar-brand">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg">Akazuba</h1>
                    <p className="text-blue-200 text-xs">Admin Panel</p>
                  </div>
                </div>
              <button
                onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-white hover:text-blue-200"
              >
                  <X className="w-6 h-6" />
              </button>
              </div>
          </div>

          {/* Navigation */}
            <nav className="flex-1 px-4 pb-4">
              <ul className="space-y-2">
            {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
              return (
                    <li key={item.name}>
                <Link
                  href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-700 text-white'
                            : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
                    </li>
                  )
                })}
              </ul>
          </nav>

            {/* User Section */}
            <div className="p-4 border-t border-blue-700">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-800">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
              </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">Admin User</p>
                  <p className="text-blue-200 text-xs truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-blue-200 hover:text-white transition-colors disabled:opacity-50"
                  title="Logout"
            >
                  <LogOut className="w-4 h-4" />
            </button>
              </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
          {/* Header */}
          <header className="admin-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
              </button>
              <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {navigation.find(item => item.href === pathname)?.name || 'Admin Panel'}
                </h1>
                  <p className="text-gray-600">
                  {pathname === '/admin' ? 'Welcome back! Here\'s your business overview.' : 
                   `Manage your ${navigation.find(item => item.href === pathname)?.name.toLowerCase() || 'content'}`}
                </p>
              </div>
            </div>
              <div className="flex items-center space-x-4">
                <AdminNotification />
                <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                title="View customer website in new tab"
              >
                <Eye className="w-4 h-4" />
                <span>Customer View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                  <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </header>

          {/* Content */}
        <div className="admin-content-container">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
        )}
        </div>
      </AdminProvider>
    </AdminErrorBoundary>
  )
}