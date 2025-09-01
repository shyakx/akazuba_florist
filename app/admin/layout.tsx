'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/RealAuthContext'
import { LogOut, Package, ShoppingCart, Settings, BarChart3, Users } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
    } else if (user?.role !== 'ADMIN') {
      router.push('/')
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, router])

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Package },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          min-height: 100vh;
          height: 100%;
        }
        #__next {
          margin: 0 !important;
          padding: 0 !important;
          min-height: 100vh;
          height: 100%;
        }
        .admin-layout {
          margin: 0 !important;
          padding: 0 !important;
          height: 100%;
        }
        .admin-layout > * {
          margin: 0 !important;
          padding: 0 !important;
        }
        .admin-layout > div {
          margin: 0 !important;
          padding: 0 !important;
        }
        .admin-layout aside {
          margin: 0 !important;
          padding: 0 !important;
        }
        .admin-layout header {
          margin: 0 !important;
          padding: 0 !important;
        }
        .admin-layout main {
          margin: 0 !important;
          padding: 0 !important;
        }
        /* Remove root layout padding for admin pages */
        .admin-padding {
          padding-top: 0 !important;
        }
        /* Ensure admin pages take full height without root layout interference */
        body:has(.admin-layout) .admin-padding {
          padding-top: 0 !important;
        }
        /* Alternative approach for browsers that don't support :has() */
        .admin-layout ~ .admin-padding,
        .admin-layout + .admin-padding {
          padding-top: 0 !important;
        }
        /* Direct override for admin pages */
        main.pt-32 {
          padding-top: 0 !important;
        }
        /* Force remove any top spacing */
        body > main {
          padding-top: 0 !important;
        }
        /* Admin specific overrides */
        .admin-layout ~ main,
        .admin-layout + main,
        main:has(.admin-layout) {
          padding-top: 0 !important;
        }
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.adminMode = true;
            // Remove root layout padding for admin pages
            (function() {
              // Find the main element with pt-32 class
              const mainElement = document.querySelector('main.pt-32');
              if (mainElement) {
                mainElement.style.paddingTop = '0';
                mainElement.style.marginTop = '0';
              }
              
              // Also remove any other top spacing
              const body = document.body;
              if (body) {
                body.style.marginTop = '0';
                body.style.paddingTop = '0';
              }
              
              // Remove header space
              const header = document.querySelector('header');
              if (header) {
                header.style.marginTop = '0';
                header.style.paddingTop = '0';
              }
            })();
          `
        }}
      />

      <div className="admin-layout flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex-shrink-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <h2 className="text-lg font-bold text-blue-600">
              Akazuba Admin
            </h2>
            <p className="text-xs text-gray-500 mt-1">Business Management</p>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <p className="text-xs text-gray-600">Admin Panel v1.0</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-lg border-b border-gray-200 flex-shrink-0">
            <div className="w-full px-6 sm:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg mr-3 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Welcome, {user?.firstName || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
