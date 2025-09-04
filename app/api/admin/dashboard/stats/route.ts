import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Since this is an admin route, it's already protected by the admin layout
    // We can directly fetch from the backend without additional token validation
    
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/admin/dashboard/stats/public'
      : 'https://akazuba-backend-api.onrender.com/api/v1/admin/dashboard/stats/public'
    
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ success: false, message: data.message || 'Failed to fetch stats' }, { status: response.status })
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
