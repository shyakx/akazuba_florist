import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse } from '@/lib/errorHandler'

export const dynamic = 'force-dynamic'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  services: {
    frontend: 'up' | 'down'
    backend: 'up' | 'down' | 'unknown'
    database: 'up' | 'down' | 'unknown'
    email: 'up' | 'down' | 'unknown'
  }
  uptime: number
  version: string
  environment: string
}

// Check backend health
async function checkBackendHealth(): Promise<'up' | 'down' | 'unknown'> {
  try {
    // Try local backend first, then fallback to production
    let backendUrl = 'http://localhost:5000/health'
    
    // If we're in production environment, use production backend
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_USE_LOCAL_BACKEND) {
      backendUrl = 'https://akazuba-backend-api.onrender.com/health'
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)

    if (response.ok) {
      return 'up'
    } else {
      return 'down'
    }
  } catch (error) {
    console.warn('Backend health check failed:', error)
    return 'unknown'
  }
}

// Check database health (simplified - in real app, this would check actual DB connection)
async function checkDatabaseHealth(): Promise<'up' | 'down' | 'unknown'> {
  try {
    // For now, we'll assume database is up if we can make basic API calls
    // In a real implementation, you'd check actual database connectivity
    return 'up'
  } catch (error) {
    console.warn('Database health check failed:', error)
    return 'unknown'
  }
}

// Check email service health
async function checkEmailHealth(): Promise<'up' | 'down' | 'unknown'> {
  try {
    // Check if email configuration is available
    const hasEmailConfig = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    )
    
    return hasEmailConfig ? 'up' : 'unknown'
  } catch (error) {
    console.warn('Email health check failed:', error)
    return 'unknown'
  }
}

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check all services in parallel
    const [backendStatus, databaseStatus, emailStatus] = await Promise.all([
      checkBackendHealth(),
      checkDatabaseHealth(),
      checkEmailHealth()
    ])

    const endTime = Date.now()
    const responseTime = endTime - startTime

    // Determine overall health status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    
    if (backendStatus === 'down' || databaseStatus === 'down') {
      overallStatus = 'unhealthy'
    } else if (backendStatus === 'unknown' || databaseStatus === 'unknown' || emailStatus === 'down') {
      overallStatus = 'degraded'
    }

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        frontend: 'up',
        backend: backendStatus,
        database: databaseStatus,
        email: emailStatus
      },
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }

    // Return appropriate status code based on health
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503

    const response = createSuccessResponse(healthStatus, 'Health check completed', undefined)
    
    // Override status code if needed
    if (statusCode !== 200) {
      return new NextResponse(response.body, {
        status: statusCode,
        headers: response.headers
      })
    }
    
    return response

  } catch (error) {
    console.error('Health check error:', error)
    return createErrorResponse('Health check failed', 500, 'Internal error')
  }
}
