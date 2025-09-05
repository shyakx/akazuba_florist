'use client'

import { useEffect, useState } from 'react'
import { logger } from '@/lib/logger'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
  networkRequests: number
}

export const PerformanceMonitor: React.FC<{ componentName: string }> = ({ componentName }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    networkRequests: 0
  })

  useEffect(() => {
    const startTime = performance.now()
    
    // Monitor memory usage if available
    const memoryInfo = (performance as any).memory
    const initialMemory = memoryInfo ? memoryInfo.usedJSHeapSize : undefined

    // Monitor network requests
    let requestCount = 0
    const originalFetch = window.fetch
    window.fetch = (...args) => {
      requestCount++
      return originalFetch(...args)
    }

    const measurePerformance = () => {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      
      const finalMemory = memoryInfo ? memoryInfo.usedJSHeapSize : undefined
      const memoryUsage = initialMemory && finalMemory ? finalMemory - initialMemory : undefined

      const newMetrics: PerformanceMetrics = {
        loadTime,
        renderTime: endTime - startTime,
        memoryUsage,
        networkRequests: requestCount
      }

      setMetrics(newMetrics)

      // Log performance metrics
      logger.performanceMetric(`${componentName}_load_time`, loadTime, 'ms')
      if (memoryUsage) {
        logger.performanceMetric(`${componentName}_memory_usage`, memoryUsage, 'bytes')
      }
      logger.performanceMetric(`${componentName}_network_requests`, requestCount, 'count')

      // Restore original fetch
      window.fetch = originalFetch
    }

    // Measure after component is fully rendered
    const timeoutId = setTimeout(measurePerformance, 100)

    return () => {
      clearTimeout(timeoutId)
      window.fetch = originalFetch
    }
  }, [componentName])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs font-mono z-50">
      <div className="font-bold mb-1">{componentName}</div>
      <div>Load: {metrics.loadTime.toFixed(2)}ms</div>
      <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
      {metrics.memoryUsage && (
        <div>Memory: {(metrics.memoryUsage / 1024).toFixed(2)}KB</div>
      )}
      <div>Requests: {metrics.networkRequests}</div>
    </div>
  )
}

// Hook for measuring component performance
export const usePerformanceMonitor = (componentName: string) => {
  const [startTime] = useState(() => performance.now())

  useEffect(() => {
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    logger.performanceMetric(`${componentName}_render_time`, renderTime, 'ms')
  }, [componentName, startTime])
}

// Hook for measuring async operations
export const useAsyncPerformance = () => {
  const measureAsync = async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await operation()
      const endTime = performance.now()
      const duration = endTime - startTime
      
      logger.performanceMetric(`${operationName}_duration`, duration, 'ms')
      
      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      logger.performanceMetric(`${operationName}_error_duration`, duration, 'ms')
      logger.error(`Async operation failed: ${operationName}`, 'PERFORMANCE', { duration }, error instanceof Error ? error : undefined)
      
      throw error
    }
  }

  return { measureAsync }
}

// Component for lazy loading with performance tracking
export const LazyComponent: React.FC<{
  componentName: string
  children: React.ReactNode
}> = ({ componentName, children }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadTime, setLoadTime] = useState(0)

  useEffect(() => {
    const startTime = performance.now()
    
    // Simulate lazy loading delay
    const timer = setTimeout(() => {
      const endTime = performance.now()
      setLoadTime(endTime - startTime)
      setIsLoaded(true)
      
      logger.performanceMetric(`${componentName}_lazy_load_time`, endTime - startTime, 'ms')
    }, 100)

    return () => clearTimeout(timer)
  }, [componentName])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading {componentName}...</span>
      </div>
    )
  }

  return <>{children}</>
}

export default PerformanceMonitor
