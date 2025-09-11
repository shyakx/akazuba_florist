import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    // Build query parameters for backend
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (status) params.append('status', status)
    if (priority) params.append('priority', priority)
    params.append('page', page)
    params.append('limit', limit)

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/admin/support-tickets?${params.toString()}`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/support-tickets?${params.toString()}`

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
      return NextResponse.json(data)
    } catch (backendError) {
      console.warn('Backend not available for support tickets, using fallback data:', backendError)
      
      // Fallback support tickets data
      const fallbackTickets = {
        success: true,
        data: [
          {
            id: '1',
            ticketNumber: 'TKT-001',
            subject: 'Order delivery issue',
            description: 'My order was not delivered on time',
            status: 'open',
            priority: 'high',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            customerPhone: '+250784123456',
            assignedTo: null,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '2',
            ticketNumber: 'TKT-002',
            subject: 'Product quality concern',
            description: 'The flowers I received were not fresh',
            status: 'in_progress',
            priority: 'medium',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            customerPhone: '+250784654321',
            assignedTo: 'Admin',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 7200000).toISOString()
          }
        ],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 2,
          pages: 1
        }
      }
      
      return NextResponse.json(fallbackTickets)
    }
  } catch (error) {
    console.error('Error fetching support tickets:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch support tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/admin/support-tickets'
      : 'https://akazuba-backend-api.onrender.com/api/v1/admin/support-tickets'
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}
