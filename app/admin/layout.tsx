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
  Bell,
  HelpCircle,
  FileText,
  Edit3
} from 'lucide-react'
import { useAuth } from '@/contexts/RealAuthContext'
import { AdminProvider } from '@/contexts/AdminContext'
import AdminNotification from '@/components/AdminNotification'
import './admin-styles.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, isAuthenticated, isLoading, logout, isInitialized } = useAuth()

  // Admin layout applies to all admin pages

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Content Manager', href: '/admin/content', icon: Edit3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const quickActions = [
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Help & Support', href: '/admin/help', icon: HelpCircle },
    { name: 'Documentation', href: '/admin/docs', icon: FileText },
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    // Redirect is handled in the logout function in RealAuthContext
  }

  // Handle authentication
  useEffect(() => {
    const cookies = typeof document !== 'undefined' ? document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>) : {}
    
    
    if (isLoading || !isInitialized || isLoggingOut) {
      return
    }

    if (!isAuthenticated) {
      // Add a small delay to ensure cookies are processed
      setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/unified-login'
      }
      }, 100)
      return
    }
    
    if (user?.role !== 'ADMIN') {
      // Add a small delay to ensure cookies are processed
      setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
      }, 100)
      return
    }
  }, [isAuthenticated, user?.role, isLoading, isInitialized, isLoggingOut, router])

  // Show loading state
  if (isLoading || !isInitialized) {
    return (
      <div className="admin-panel">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  // Show redirecting state
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="admin-panel">
        <div className="loading">
          <div className="spinner"></div>
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
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-blue-700 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-1">Akazuba Florist</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              // More robust active detection - exact match or starts with for sub-routes
              const isActive = pathname === item.href || 
                              (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-item group ${isActive ? 'active' : ''} ${isActive ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}`}
                  title={isActive ? `Currently viewing ${item.name}` : `Go to ${item.name}`}
                  style={isActive ? {
                    backgroundColor: '#ffffff',
                    color: '#1e40af',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    borderLeft: '4px solid #3b82f6',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: '2px solid #3b82f6',
                    position: 'relative',
                    zIndex: 10
                  } : {}}
                >
                  <item.icon className="nav-icon" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <>
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg border-2 border-white"></div>
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-blue-400 rounded-r-full opacity-90"></div>
                      <div className="absolute inset-0 bg-blue-50 opacity-30 rounded-lg"></div>
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-blue-500"></div>
                    </>
                  )}
                </Link>
              )
            })}
          </nav>



          {/* User Profile */}
          <div className="sidebar-user">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Admin User</p>
                <p className="text-xs text-blue-200 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-1 text-xs text-blue-100 hover:bg-blue-700 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Mobile Header */}
        <header className="admin-header lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
        </header>

        {/* Desktop Header with Breadcrumbs */}
        <header className="admin-header hidden lg:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  <span className="flex items-center space-x-1">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin</span>
                  </span>
                  <span>/</span>
                  <span className="text-gray-700 font-medium flex items-center space-x-1">
                    {(() => {
                      const currentItem = navigation.find(item => item.href === pathname)
                      return currentItem ? (
                        <>
                          <currentItem.icon className="w-4 h-4" />
                          <span>{currentItem.name}</span>
                        </>
                      ) : (
                        <>
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </>
                      )
                    })()}
                  </span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  {(() => {
                    const currentItem = navigation.find(item => item.href === pathname)
                    return currentItem ? (
                      <>
                        <currentItem.icon className="w-5 h-5 text-blue-600" />
                        <span>{currentItem.name}</span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </>
                    ) : (
                      <>
                        <LayoutDashboard className="w-5 h-5 text-blue-600" />
                        <span>Dashboard</span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </>
                    )
                  })()}
                </h1>
                <p className="text-sm text-gray-600">
                  {pathname === '/admin' ? 'Welcome back! Here\'s your business overview.' : 
                   `Manage your ${navigation.find(item => item.href === pathname)?.name.toLowerCase() || 'content'}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <AdminNotification />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="admin-content-container">
          {children}
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-sm text-gray-600">
            © 2024 Akazuba Florist Admin Panel
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <span className="whitespace-nowrap">Developed by</span>
            <div className="flex items-center space-x-3">
              <img 
                src="/images/cloud-sync-logo.png" 
                alt="Cloud Sync Logo" 
                className="h-8 w-auto object-contain flex-shrink-0"
              />
              <div className="text-left min-w-0">
                <div className="text-gray-400 font-semibold whitespace-nowrap">Cloud Sync</div>
                <div className="text-gray-500 text-xs italic whitespace-nowrap">Crafting Digital Experiences That Sync</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

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