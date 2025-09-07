'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { AdminErrorBoundary } from './ErrorBoundary'
import { PerformanceMonitor } from './PerformanceMonitor'

// Loading component for admin routes
const AdminLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Admin Panel</h2>
      <p className="text-gray-500">Please wait while we load the admin interface...</p>
    </div>
  </div>
)

// Error component for admin routes
const AdminError = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8 text-center">
      <div className="text-red-500 text-6xl">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-900">Admin Panel Error</h2>
      <p className="text-gray-600">
        There was an error loading the admin panel. This might be due to network issues or server problems.
      </p>
      <div className="space-y-4">
        <button
          onClick={retry}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/'
            }
          }}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  </div>
)

// Higher-order component for admin routes with code splitting
export const withAdminRoute = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const AdminComponent = (props: P) => (
    <AdminErrorBoundary>
      <Suspense fallback={<AdminLoading />}>
        <PerformanceMonitor componentName={componentName} />
        <Component {...props} />
      </Suspense>
    </AdminErrorBoundary>
  )

  AdminComponent.displayName = `withAdminRoute(${componentName})`
  
  return AdminComponent
}

// Dynamically imported admin components with code splitting
export const AdminCategoriesPage = dynamic(
  () => import('@/app/admin/categories/page'),
  {
    loading: () => <AdminLoading />,
    ssr: false
  }
)

export const AdminProductsPage = dynamic(
  () => import('@/app/admin/products/page'),
  {
    loading: () => <AdminLoading />,
    ssr: false
  }
)

export const AdminOrdersPage = dynamic(
  () => import('@/app/admin/orders/page'),
  {
    loading: () => <AdminLoading />,
    ssr: false
  }
)

export const AdminCustomersPage = dynamic(
  () => import('@/app/admin/customers/page'),
  {
    loading: () => <AdminLoading />,
    ssr: false
  }
)


// Admin form components
export const AdminNewCategoryPage = dynamic(
  () => import('@/app/admin/categories/new/page'),
  {
    loading: () => <AdminLoading />,
    ssr: false
  }
)

export const AdminNewProductPage = dynamic(
  () => import('@/app/admin/products/new/page'),
  {
    loading: () => <AdminLoading />,
    ssr: false
  }
)

// Utility function to preload admin routes
export const preloadAdminRoute = (route: string) => {
  const routeMap: Record<string, () => Promise<any>> = {
    categories: () => import('@/app/admin/categories/page'),
    products: () => import('@/app/admin/products/page'),
    orders: () => import('@/app/admin/orders/page'),
    customers: () => import('@/app/admin/customers/page'),
    'categories/new': () => import('@/app/admin/categories/new/page'),
    'products/new': () => import('@/app/admin/products/new/page')
  }

  const loader = routeMap[route]
  if (loader) {
    loader().catch(error => {
      console.error(`Failed to preload admin route: ${route}`, error)
    })
  }
}

// Hook for admin route management
export const useAdminRoute = () => {
  const preloadRoute = (route: string) => {
    // Preload on hover or focus
    preloadAdminRoute(route)
  }

  const preloadAllRoutes = () => {
    Object.keys({
      categories: true,
      products: true,
      orders: true,
      customers: true,
    }).forEach(route => {
      preloadAdminRoute(route)
    })
  }

  return {
    preloadRoute,
    preloadAllRoutes
  }
}

export default withAdminRoute
