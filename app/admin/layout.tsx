'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ExternalLink,
  Eye,
  FileText
} from 'lucide-react'
import { useAuth } from '@/contexts/RealAuthContext'
import './admin-styles.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, isAuthenticated, isLoading, logout, isInitialized } = useAuth()

  // Simple navigation - only essential features
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

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

  useEffect(() => {
    if (!isInitialized) return
    if (!isAuthenticated) {
      router.push('/unified-login')
    }
  }, [isAuthenticated, isInitialized, router])

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-pink-600 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="flex items-center justify-between p-6 border-b border-pink-700">
                <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-pink-600 font-bold text-sm">A</span>
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg">Akazuba</h1>
                <p className="text-pink-200 text-xs">Admin Panel</p>
                  </div>
                </div>
              <button
                onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-pink-200"
              >
                  <X className="w-6 h-6" />
              </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
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
                          ? 'bg-pink-700 text-white'
                          : 'text-pink-200 hover:bg-pink-700 hover:text-white'
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
          <div className="p-4 border-t border-pink-700">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-pink-700">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
              </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">Admin User</p>
                <p className="text-pink-200 text-xs truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
                  disabled={isLoggingOut}
                className="text-pink-200 hover:text-white transition-colors disabled:opacity-50"
                  title="Logout"
            >
                  <LogOut className="w-4 h-4" />
            </button>
              </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pt-0">
          {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
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
              <a
                href="/products"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                title="View all products as customer"
              >
                <Package className="w-4 h-4" />
                <span>View Products</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </header>

          {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
        )}
        </div>
  )
}