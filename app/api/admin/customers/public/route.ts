import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
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
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the data to match frontend expectations
    if (data.success && data.data) {
      const transformedData = {
        success: true,
        data: {
          customers: data.data.map((customer: any) => ({
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address || 'Address not available',
            totalOrders: customer.totalOrders || 0,
            totalSpent: customer.totalSpent || 0,
            status: customer.isActive ? 'active' : 'inactive',
            joinedDate: customer.joinedDate || new Date(customer.createdAt).toISOString().split('T')[0],
            createdAt: customer.createdAt
          }))
        }
      }
      return NextResponse.json(transformedData)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
