'use client'

import React from 'react'

/**
 * Base skeleton component with shimmer effect
 */
interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
  animate?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = false,
  animate = true
}) => {
  const baseClasses = [
    'bg-gray-200',
    rounded ? 'rounded-full' : 'rounded',
    animate ? 'animate-pulse' : ''
  ].filter(Boolean).join(' ')

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || '1rem'
  }

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

/**
 * Product card skeleton loader
 */
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
    {/* Image skeleton */}
    <Skeleton height={200} className="mb-4" />
    
    {/* Title skeleton */}
    <Skeleton height={20} width="80%" className="mb-2" />
    
    {/* Description skeleton */}
    <Skeleton height={16} width="100%" className="mb-1" />
    <Skeleton height={16} width="60%" className="mb-4" />
    
    {/* Price skeleton */}
    <div className="flex justify-between items-center">
      <Skeleton height={24} width="40%" />
      <Skeleton height={32} width={80} rounded />
    </div>
  </div>
)

/**
 * Category card skeleton loader
 */
export const CategoryCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center ${className}`}>
    {/* Image skeleton */}
    <Skeleton height={120} width={120} rounded className="mx-auto mb-4" />
    
    {/* Title skeleton */}
    <Skeleton height={20} width="70%" className="mx-auto mb-2" />
    
    {/* Description skeleton */}
    <Skeleton height={16} width="90%" className="mx-auto mb-4" />
    
    {/* Product count skeleton */}
    <Skeleton height={14} width="50%" className="mx-auto" />
  </div>
)

/**
 * Order card skeleton loader
 */
export const OrderCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    {/* Header */}
    <div className="flex justify-between items-start mb-4">
      <div>
        <Skeleton height={20} width="40%" className="mb-2" />
        <Skeleton height={16} width="60%" />
      </div>
      <Skeleton height={24} width={80} />
    </div>
    
    {/* Customer info */}
    <div className="space-y-2 mb-4">
      <Skeleton height={16} width="70%" />
      <Skeleton height={16} width="50%" />
    </div>
    
    {/* Items */}
    <div className="space-y-3 mb-4">
      <Skeleton height={16} width="100%" />
      <Skeleton height={16} width="80%" />
    </div>
    
    {/* Actions */}
    <div className="flex gap-2">
      <Skeleton height={32} width={100} />
      <Skeleton height={32} width={100} />
    </div>
  </div>
)

/**
 * Customer card skeleton loader
 */
export const CustomerCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Skeleton height={40} width={40} rounded />
        <div>
          <Skeleton height={18} width="60%" className="mb-1" />
          <Skeleton height={14} width="80%" />
        </div>
      </div>
      <Skeleton height={24} width={60} />
    </div>
    
    {/* Stats */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <Skeleton height={14} width="50%" className="mb-1" />
        <Skeleton height={20} width="70%" />
      </div>
      <div>
        <Skeleton height={14} width="50%" className="mb-1" />
        <Skeleton height={20} width="70%" />
      </div>
    </div>
    
    {/* Actions */}
    <div className="flex gap-2">
      <Skeleton height={32} width={80} />
      <Skeleton height={32} width={80} />
    </div>
  </div>
)

/**
 * Table skeleton loader
 */
export const TableSkeleton: React.FC<{
  rows?: number
  columns?: number
  className?: string
}> = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {/* Table header */}
    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} height={16} width="60%" />
        ))}
      </div>
    </div>
    
    {/* Table rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} height={16} width="80%" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

/**
 * Form skeleton loader
 */
export const FormSkeleton: React.FC<{ fields?: number; className?: string }> = ({ 
  fields = 5, 
  className = '' 
}) => (
  <div className={`space-y-6 ${className}`}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton height={16} width="30%" />
        <Skeleton height={40} width="100%" />
      </div>
    ))}
    
    {/* Submit button */}
    <div className="pt-4">
      <Skeleton height={44} width={120} />
    </div>
  </div>
)

/**
 * Dashboard stats skeleton loader
 */
export const DashboardStatsSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton height={16} width="60%" className="mb-2" />
            <Skeleton height={24} width="40%" />
          </div>
          <Skeleton height={48} width={48} rounded />
        </div>
      </div>
    ))}
  </div>
)

/**
 * Navigation skeleton loader
 */
export const NavigationSkeleton: React.FC<{ items?: number; className?: string }> = ({ 
  items = 6, 
  className = '' 
}) => (
  <nav className={`space-y-2 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-2">
        <Skeleton height={20} width={20} />
        <Skeleton height={16} width="70%" />
      </div>
    ))}
  </nav>
)

/**
 * List skeleton loader
 */
export const ListSkeleton: React.FC<{
  items?: number
  showAvatar?: boolean
  className?: string
}> = ({ items = 5, showAvatar = false, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
        {showAvatar && <Skeleton height={40} width={40} rounded />}
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="60%" />
          <Skeleton height={14} width="40%" />
        </div>
        <Skeleton height={32} width={80} />
      </div>
    ))}
  </div>
)

/**
 * Page skeleton loader
 */
export const PageSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Page header */}
    <div className="flex justify-between items-center">
      <div>
        <Skeleton height={32} width="40%" className="mb-2" />
        <Skeleton height={16} width="60%" />
      </div>
      <Skeleton height={40} width={120} />
    </div>
    
    {/* Stats cards */}
    <DashboardStatsSkeleton />
    
    {/* Content area */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Skeleton height={400} width="100%" />
      </div>
      <div>
        <Skeleton height={300} width="100%" />
      </div>
    </div>
  </div>
)

/**
 * Loading overlay component
 */
export const LoadingOverlay: React.FC<{
  isLoading: boolean
  children: React.ReactNode
  message?: string
  className?: string
}> = ({ isLoading, children, message = 'Loading...', className = '' }) => {
  if (!isLoading) return <>{children}</>

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default Skeleton
