import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
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
      ? `http://localhost:5000/api/v1/admin/support-tickets/public?${params.toString()}`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/support-tickets/public?${params.toString()}`
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching support tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
      { status: 500 }
    )
  }
}