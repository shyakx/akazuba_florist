import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createSuccessResponse, ErrorResponses, handleBackendError } from '@/lib/errorHandler'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return ErrorResponses.unauthorized('Admin access required')
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    // Build query parameters for backend
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    params.append('page', page)
    params.append('limit', limit)

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/admin/customers?${params.toString()}`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/customers?${params.toString()}`

    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')

    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        },
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      return createSuccessResponse(data.data, 'Customers retrieved successfully', data.pagination)
    } catch (backendError) {
      console.warn('Backend not available for customers, using fallback data:', backendError)
      
      // Fallback customers data
      const fallbackCustomers = {
        success: true,
        data: [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+250784123456',
            totalOrders: 5,
            totalSpent: 375000,
            lastOrderDate: new Date(Date.now() - 86400000).toISOString(),
            status: 'active',
            createdAt: new Date(Date.now() - 2592000000).toISOString()
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '+250784654321',
            totalOrders: 3,
            totalSpent: 195000,
            lastOrderDate: new Date(Date.now() - 172800000).toISOString(),
            status: 'active',
            createdAt: new Date(Date.now() - 1728000000).toISOString()
          },
          {
            id: '3',
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice@example.com',
            phone: '+250784789012',
            totalOrders: 8,
            totalSpent: 520000,
            lastOrderDate: new Date(Date.now() - 432000000).toISOString(),
            status: 'active',
            createdAt: new Date(Date.now() - 3456000000).toISOString()
          }
        ],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 3,
          pages: 1
        }
      }
      
      return createSuccessResponse(fallbackCustomers.data, 'Customers retrieved (fallback mode)', fallbackCustomers.pagination)
    }
  } catch (error) {
    console.error('Error fetching customers:', error)
    return handleBackendError(error, 'Failed to fetch customers')
  }
}
